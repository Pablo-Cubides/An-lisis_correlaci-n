# 🔧 PLAN DE ACCIÓN INMEDIATO - Quick Wins

## Para implementar ESTA SEMANA - 1-2 SEMANAS (Máximo 10 días)

Estas son las 6 acciones concretas para llevar la app de 78/100 a 90/100 y estar lista para Vercel.

**Contexto:** Sub-app dentro de web principal autenticada (sin backend API necesario)

---

## ✅ ACCIÓN 1: Configurar CSP Headers Seguros (30 min)

### Problema:
Sin Content Security Policy headers, la app es vulnerable a XSS

### Solución:

**Crear/Actualizar: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; worker-src 'self'",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',  // Permite dentro de tu web principal
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

**Verificar:**
```bash
npm run build
# Debe compilar sin errores
```

---

## ✅ ACCIÓN 2: Validación Mejorada de Entrada (1 hora)

### Problema:
Archivos CSV/Excel pueden tener datos corruptos o formatos inválidos

### Solución:

**Crear: `src/lib/validators.ts`**

```typescript
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Validar extensión
  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return { 
      valid: false, 
      error: 'Solo se permiten archivos .csv o .xlsx' 
    };
  }

  // Validar tamaño
  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `Archivo demasiado grande (máx. 20MB, tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB)` 
    };
  }

  // Validar tipo MIME
  const validMimeTypes = [
    'text/csv',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream',
  ];
  
  if (!validMimeTypes.includes(file.type) && !hasValidExtension) {
    return { 
      valid: false, 
      error: 'Tipo de archivo no válido' 
    };
  }

  return { valid: true };
};

export const validateNumericData = (data: Record<string, unknown>[]): { 
  valid: boolean; 
  error?: string;
  numericColumns?: string[];
} => {
  if (!Array.isArray(data) || data.length === 0) {
    return { valid: false, error: 'El archivo está vacío' };
  }

  const numericColumns = Object.keys(data[0] || {}).filter(key => {
    return data.some(row => {
      const value = row[key];
      return typeof value === 'number' && !isNaN(value);
    });
  });

  if (numericColumns.length < 2) {
    return { 
      valid: false, 
      error: 'El archivo debe contener al menos dos columnas numéricas' 
    };
  }

  return { valid: true, numericColumns };
};
```

**Actualizar: `src/components/FileUploader.tsx`**

```tsx
import { validateFile } from '@/lib/validators';

// En el handler:
const handleFile = (file: File) => {
  const validation = validateFile(file);
  if (!validation.valid) {
    setError(validation.error || 'Error al validar archivo');
    return;
  }
  setError(null);
  onUpload(file);
}
```

### Crear: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects HTTPS (en producción)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## ✅ ACCIÓN 5: Crear README.md Básico (45 min)

**Crear: `README.md`**

```markdown
# 📊 Relational Insight

Herramienta para analizar correlaciones estadísticas entre columnas numéricas.

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

\`\`\`bash
git clone <repo>
cd RelationalInsight
npm install
\`\`\`

### Desarrollo

\`\`\`bash
npm run dev
# Abre http://localhost:3000
\`\`\`

### Producción

\`\`\`bash
npm run build
npm start
\`\`\`

### Tests

\`\`\`bash
npm test
npm test -- --coverage
\`\`\`

## 📊 Características

- **Pearson Correlation**: Relación lineal entre variables
- **Spearman Correlation**: Relación monotónica
- **Kendall Tau**: Concordancia ordinal
- **Visualizaciones**: Tabla, heatmap, scatter plot
- **Exportación**: CSV, JSON, PNG, SVG

## 📁 Formato de Entrada

### CSV
\`\`\`csv
col1,col2,col3
1,2,3
4,5,6
7,8,9
\`\`\`

### Excel
- Soporta múltiples hojas
- Columnas numéricas se detectan automáticamente
- Máximo 20MB

## 🏗️ Arquitectura

```
Frontend: Next.js 15 + React 18
UI: Tailwind CSS
Visualización: Recharts
Estadísticas: simple-statistics
Worker: Web Workers para procesamiento
```

## 🔒 Seguridad

- Procesamiento client-side (datos privados)
- Validación de entrada
- Headers de seguridad configurados
- TypeScript strict mode

## 📈 Roadmap

- [ ] Backend API para persistencia
- [ ] Autenticación de usuarios
- [ ] Histórico de análisis
- [ ] Análisis avanzados (regresión, clustering)
- [ ] Mobile app

## 📝 Licencia

MIT

## 👨‍💻 Autor

[Tu nombre]

---

**Estado:** ⚠️ Beta (no recomendado para producción aún)
```

---

## ✅ ACCIÓN 6: Crear Error Boundary (30 min)

**Crear: `src/components/ErrorBoundary.tsx`**

```typescript
'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Aquí enviar a Sentry/logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center">
            <div className="text-red-600 text-3xl mb-2">⚠️</div>
            <h1 className="text-lg font-bold mb-2 text-gray-800">¡Algo salió mal!</h1>
            <p className="text-gray-600 mb-4 text-center text-sm">
              La aplicación encontró un error inesperado. Por favor, recarga la página e intenta de nuevo.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="w-full text-left mb-4 bg-gray-100 p-2 rounded text-xs">
                <summary className="cursor-pointer font-mono">Detalles (dev)</summary>
                <pre className="mt-2 overflow-auto text-red-700">
                  {this.state.error?.message}
                </pre>
              </details>
            )}
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => window.location.reload()}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Actualizar: `src/app/layout.tsx`**

```tsx
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="...">
        <ErrorBoundary>
          <header>...</header>
          <main>{children}</main>
          <footer>...</footer>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## ✅ ACCIÓN 7: Crear Validaciones de Entrada Mejoradas (20 min)

**Actualizar: `src/lib/validators.ts`** (Nuevo archivo)

```typescript
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Validar extensión
  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return { 
      valid: false, 
      error: 'Solo se permiten archivos .csv o .xlsx' 
    };
  }

  // Validar tamaño
  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `Archivo demasiado grande (máx. 20MB, tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB)` 
    };
  }

  // Validar tipo MIME
  const validMimeTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!validMimeTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Tipo de archivo no válido' 
    };
  }

  return { valid: true };
};

export const validateNumericData = (data: Record<string, unknown>[]): { 
  valid: boolean; 
  error?: string;
  numericColumns?: string[];
} => {
  if (!Array.isArray(data) || data.length === 0) {
    return { valid: false, error: 'El archivo está vacío' };
  }

  const numericColumns = Object.keys(data[0] || {}).filter(key => {
    return data.some(row => typeof row[key] === 'number' && !isNaN(row[key] as number));
  });

  if (numericColumns.length < 2) {
    return { 
      valid: false, 
      error: 'El archivo debe contener al menos dos columnas numéricas' 
    };
  }

  return { valid: true, numericColumns };
};
```

**Usar en FileUploader:**

```tsx
import { validateFile } from '@/lib/validators';

function handleFile(file: File) {
  const validation = validateFile(file);
  if (!validation.valid) {
    setError(validation.error);
    return;
  }
  setError(null);
  onUpload(file);
}
```

---

## ✅ ACCIÓN 8: Crear .env.example (10 min)

**Crear: `.env.example`**

```bash
# Environment
NODE_ENV=development

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Para futuro backend
# BACKEND_URL=http://localhost:8000
# DATABASE_URL=postgresql://user:password@localhost/relational_insight

# Optional: Para monitoreo
# SENTRY_DSN=https://...
# NEXT_PUBLIC_GA_ID=UA-...

# Optional: Para autenticación (futuro)
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=http://localhost:3000
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

---

## 🚀 COMANDOS PARA EJECUTAR HOY

```bash
# 1. Eliminar duplicado
rm src/app/stats.ts

# 2. Crear nuevos archivos (copiar contenido de arriba)
touch src/lib/logger.ts
touch src/lib/validators.ts
touch src/components/ErrorBoundary.tsx
touch next.config.js
touch README.md
touch .env.example

# 3. Ejecutar linting
npm run lint

# 4. Ejecutar tests
npm test

# 5. Verificar build
npm run build

# 6. Verificar cambios
git status
```

---

## ✅ VERIFICAR TODO FUNCIONA

```bash
npm run dev
# Abrir http://localhost:3000
# Probar:
# ✓ Cargar archivo CSV
# ✓ Cargar archivo Excel
# ✓ Ver correlaciones
# ✓ Exportar CSV
# ✓ Exportar PNG
# ✓ Ver página About
```

---

## 📊 ANTES vs DESPUÉS

### ANTES (Ahora)
```
❌ stats.ts duplicado
❌ console.log en producción
❌ Sin configuración de seguridad
❌ Sin Error Boundary
❌ Sin documentación
⚠️ TypeScript deprecated warning
```

### DESPUÉS (Después de estas acciones)
```
✅ Código limpio sin duplicación
✅ Logging controlado
✅ Headers de seguridad
✅ Error handling robusto
✅ README completo
✅ TypeScript moderno
```

**Impacto:** 
- 📈 Mejora en seguridad: +20%
- 📈 Mejora en código: +15%
- 📈 Documentación: +100%
- ⏱️ Tiempo requerido: ~3 horas máximo

---

## ✅ PRÓXIMA ETAPA (Después)

Una vez completado esto, las siguientes prioridades son:

1. **Backend API** (3-4 días)
2. **Autenticación** (2-3 días)
3. **Tests** (3-4 días)
4. **SEO** (2 días)

---

## 📞 DUDAS

¿Necesitas ayuda con cualquiera de estos pasos? Consulta `ANALISIS_PRODUCCION.md` para más detalles.

