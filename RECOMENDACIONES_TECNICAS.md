# 🛠️ RECOMENDACIONES TÉCNICAS - Stack para Producción

## 1. 🔐 BACKEND API

### Opción A: FastAPI (Python) ✅ RECOMENDADO
**Para:** Análisis estadísticos avanzados

```python
# main.py
from fastapi import FastAPI, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
from fastapi_cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from scipy.stats import pearsonr, spearmanr, kendalltau

app = FastAPI(title="Relational Insight API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze_file(
    file: UploadFile,
    current_user: str = Depends(verify_token)
):
    """
    Analizar archivo CSV/XLSX
    
    Rate Limit: 100 req/min por usuario
    Auth: JWT token
    """
    try:
        # Validar archivo
        if not file.filename.endswith(('.csv', '.xlsx')):
            raise HTTPException(400, "Solo CSV/XLSX")
        
        if file.size > 20_000_000:
            raise HTTPException(400, "Archivo > 20MB")
        
        # Procesar
        df = pd.read_csv(file.file) if file.filename.endswith('.csv') else pd.read_excel(file.file)
        
        # Validar datos
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        if len(numeric_cols) < 2:
            raise HTTPException(400, "Mínimo 2 columnas numéricas")
        
        # Calcular correlaciones
        results = calculate_correlations(df[numeric_cols])
        
        # Guardar en base de datos
        save_analysis(current_user, file.filename, results)
        
        return {
            "success": True,
            "correlation_results": results,
            "numeric_columns": numeric_cols
        }
    
    except Exception as e:
        logger.error(f"Analysis failed: {e}", extra={"user": current_user})
        raise HTTPException(500, "Error during analysis")

def calculate_correlations(df):
    results = []
    cols = df.columns.tolist()
    
    for i, col1 in enumerate(cols):
        for col2 in cols[i+1:]:
            x, y = df[col1].dropna(), df[col2].dropna()
            
            results.append({
                "column_a": col1,
                "column_b": col2,
                "pearson": float(pearsonr(x, y)[0]),
                "spearman": float(spearmanr(x, y)[0]),
                "kendall": float(kendalltau(x, y)[0]),
            })
    
    return results
```

**Ventajas:**
- ✅ Excelente para análisis científicos
- ✅ Fácil integración con pandas/scipy/numpy
- ✅ Performance superior en cálculos numéricos
- ✅ Gran comunidad

**Stack Completo:**
```
FastAPI + Uvicorn (app)
PostgreSQL + SQLAlchemy (DB)
Redis (cache + rate limiting)
JWT (autenticación)
Pydantic (validación)
```

**Deploy:**
```bash
# Local
uvicorn main:app --reload

# Docker
docker build -t relational-insight-api .
docker run -p 8000:8000 relational-insight-api

# Producción
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

---

### Opción B: Express.js (Node.js)
**Para:** Si prefieres stack 100% JavaScript

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const multer = require('multer');
const ExcelJS = require('exceljs');
const Papa = require('papaparse');

const app = express();

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  message: 'Too many requests'
});

app.use('/api/', limiter);

// File Upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

// Análisis
app.post('/api/analyze', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    
    // Validar
    if (!file) throw new Error('No file provided');
    if (!['.csv', '.xlsx'].some(ext => file.originalname.endsWith(ext))) {
      throw new Error('Invalid file type');
    }
    
    // Parse
    let rows = [];
    if (file.originalname.endsWith('.csv')) {
      const text = file.buffer.toString('utf-8');
      rows = Papa.parse(text, { header: true }).data;
    } else {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.getWorksheet(1);
      rows = worksheet.getSheetValues().slice(1);
    }
    
    // Procesar
    const results = analyzeCorrelations(rows);
    
    res.json({ success: true, ...results });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
```

**Ventajas:**
- ✅ Stack unificado JavaScript
- ✅ Buen performance
- ✅ Fácil de escalar

**Desventajas:**
- ❌ No tan optimizado para operaciones numéricas

---

## 2. 🗄️ BASE DE DATOS

### PostgreSQL ✅ RECOMENDADO

```sql
-- Usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Análisis guardados
CREATE TABLE analyses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  filename VARCHAR(255),
  file_path VARCHAR(512),
  correlation_results JSONB,
  numeric_columns TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Logs de auditoría
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50),
  resource_type VARCHAR(50),
  resource_id INTEGER,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rate limiting
CREATE TABLE rate_limits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  endpoint VARCHAR(255),
  count INTEGER DEFAULT 1,
  reset_at TIMESTAMP,
  UNIQUE(user_id, endpoint)
);

-- Índices para performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**ORM Recomendado:** SQLAlchemy (Python) o TypeORM (Node.js)

---

## 3. 🔐 AUTENTICACIÓN

### JWT + Refresh Tokens

```typescript
// auth/jwt.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export function generateTokens(userId: number, email: string) {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
}
```

**Endpoints:**

```
POST   /auth/register       - Crear cuenta
POST   /auth/login          - Login
POST   /auth/refresh        - Refresh token
POST   /auth/logout         - Logout
POST   /auth/forgot-password - Reset password
```

### OAuth2 (Alternativa)

```typescript
// Para Google OAuth
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
);

// En backend
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({ idToken: token });
  const { email, picture } = ticket.getPayload();
  
  // Buscar o crear usuario
  const user = await findOrCreateUser({ email, picture });
  
  const { accessToken, refreshToken } = generateTokens(user.id, user.email);
  res.json({ accessToken, refreshToken, user });
});
```

---

## 4. ⚡ CACHING & RATE LIMITING

### Redis

```bash
# Installation
docker run -d -p 6379:6379 redis:latest

# O en código
npm install redis
```

```typescript
// services/cache.ts
import { createClient } from 'redis';

const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
});

export async function cacheAnalysis(
  userId: number,
  fileHash: string,
  results: any,
  ttl: number = 3600
) {
  const key = `analysis:${userId}:${fileHash}`;
  await redisClient.setEx(key, ttl, JSON.stringify(results));
}

export async function getCachedAnalysis(userId: number, fileHash: string) {
  const key = `analysis:${userId}:${fileHash}`;
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
}

// Rate limiting
export async function checkRateLimit(userId: number, endpoint: string) {
  const key = `ratelimit:${userId}:${endpoint}`;
  const count = await redisClient.incr(key);
  
  if (count === 1) {
    await redisClient.expire(key, 60); // 1 minuto
  }
  
  return count <= 100; // 100 requests per minute
}
```

---

## 5. 📊 MONITORING & LOGGING

### Sentry (Error Tracking)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Winston (Logging)

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### DataDog (APM)

```typescript
import tracer from 'dd-trace';

tracer.init();
tracer.use('express', {
  service: 'relational-insight-api'
});
tracer.use('postgres', {
  service: 'relational-insight-db'
});
```

---

## 6. 🚀 DEPLOYMENT

### Docker & Docker Compose

**Dockerfile (Frontend):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Dockerfile (Backend FastAPI):**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://api:8000
    depends_on:
      - api

  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/relational_insight
      REDIS_URL: redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: relational_insight
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine

volumes:
  postgres_data:
```

---

## 7. 🔧 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: Security scan
        run: npm audit --production
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Deploy script aquí
          echo "Deploying to production..."
```

---

## 8. 📈 PERFORMANCE OPTIMIZATION

### Frontend

```typescript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  
  // Script optimization
  scripts: {
    strategy: 'lazyOnload',
  },
});
```

### Backend

```python
# FastAPI caching
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend
from fastapi_cache2.decorators import cache

@app.get("/api/correlations/{analysis_id}")
@cache(expire=3600)
async def get_analysis(analysis_id: int):
    return await db.get_analysis(analysis_id)
```

---

## 9. 📋 TECH STACK SUMMARY

```
FRONTEND:
├─ Next.js 15
├─ React 18
├─ TypeScript 5
├─ Tailwind CSS
├─ Recharts (visualización)
└─ SWR (data fetching)

BACKEND (OPCIÓN A):
├─ FastAPI
├─ PostgreSQL
├─ Redis
├─ SQLAlchemy
├─ Pydantic
└─ JWT

BACKEND (OPCIÓN B):
├─ Express.js
├─ PostgreSQL
├─ Redis
├─ TypeORM
└─ JWT

DEVOPS:
├─ Docker
├─ Docker Compose
├─ GitHub Actions
└─ Nginx (reverse proxy)

MONITORING:
├─ Sentry (errors)
├─ Winston (logs)
├─ DataDog (APM)
└─ Prometheus (metrics)

TESTING:
├─ Jest
├─ React Testing Library
├─ Pytest/Unittest
├─ Cypress (E2E)
└─ K6 (load testing)
```

---

## 📅 TIMELINE DE IMPLEMENTACIÓN

```
SEMANA 1: Backend Setup
├─ Database schema
├─ API endpoints básicos
├─ Autenticación JWT
└─ Rate limiting

SEMANA 2: Integración
├─ Frontend → Backend
├─ Persistencia de análisis
├─ Histórico de usuario
└─ Refactoring

SEMANA 3: Seguridad & Tests
├─ Security audit
├─ Tests backend
├─ Tests integración
└─ Performance tuning

SEMANA 4: Deployment
├─ Docker setup
├─ CI/CD pipeline
├─ Staging environment
└─ Go live
```

---

## ✅ CHECKLIST

```
BACKEND:
☐ API endpoints definidos
☐ Autenticación implementada
☐ Database schema creado
☐ Rate limiting activo
☐ Validaciones en servidor
☐ Tests backend (80%+ cobertura)
☐ Error handling robusto
☐ Logging centralizado

OPERACIONAL:
☐ Docker images buildean
☐ Docker Compose funciona
☐ Environment variables .env
☐ Database migrations working
☐ Backups automatizados

CI/CD:
☐ GitHub Actions workflows
☐ Tests run on push
☐ Build automatizado
☐ Deployment workflow

MONITORING:
☐ Sentry configured
☐ Winston logger working
☐ APM tracking
☐ Alertas setup

SECURITY:
☐ HTTPS configurado
☐ CORS correcto
☐ Headers de seguridad
☐ Rate limiting activo
☐ Input validation
☐ SQL injection protection
```

---

**Con esta arquitectura tendrás una aplicación lista para producción, escalable y segura.** 🚀

