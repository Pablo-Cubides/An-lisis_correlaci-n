# 🔧 PLAN DE ACCIÓN INMEDIATO - REVISADO V2

## Para implementar ESTA SEMANA - 1-2 SEMANAS (Máximo 10 días)

Estas son las **6 acciones concretas** para llevar la app de **78/100 a 90/100** y estar lista para Vercel.

**Contexto:** Sub-app dentro de web principal autenticada (sin backend API necesario)

---

## ✅ ACCIÓN 1: Configurar CSP Headers Seguros (30 min)

### Problema:
Sin Content Security Policy headers, la app es vulnerable a XSS

### Solución:

**Crear: `next.config.js`**

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
# Debe compilar sin errores ✅
```

**Impacto:** +15 puntos en seguridad

---

## ✅ ACCIÓN 2: Validación Mejorada de Entrada (1 hora)

### Problema:
Archivos CSV/Excel pueden tener datos corruptos o formatos inválidos

### Solución:

**Crear: `src/lib/validators.ts`**

```typescript
export const validateFile = (file: File): { valid: boolean; error?: string } => {
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

  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `Archivo demasiado grande (máx. 20MB)` 
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
      error: 'Se necesitan al menos 2 columnas numéricas' 
    };
  }

  return { valid: true, numericColumns };
};
```

**Usar en FileUploader:**
```tsx
import { validateFile } from '@/lib/validators';

const handleFile = (file: File) => {
  const validation = validateFile(file);
  if (!validation.valid) {
    setError(validation.error || 'Error al validar');
    return;
  }
  onUpload(file);
}
```

**Impacto:** +10 puntos en seguridad

---

## ✅ ACCIÓN 3: Tests Unitarios Básicos (2-3 horas)

### Problema:
Sin tests (30% cobertura), cambios pueden introducir bugs

### Solución:

**Actualizar: `src/app/utils.test.ts`**

```typescript
import { 
  calculatePearsonCorrelation, 
  calculateSpearmanCorrelation,
  calculateKendallTau 
} from './utils';

describe('Correlation Calculations', () => {
  
  // Pearson tests
  test('Pearson - perfect positive correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10];
    const result = calculatePearsonCorrelation(x, y);
    expect(result).toBeCloseTo(1, 2);
  });

  test('Pearson - perfect negative correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [5, 4, 3, 2, 1];
    const result = calculatePearsonCorrelation(x, y);
    expect(result).toBeCloseTo(-1, 2);
  });

  test('Pearson - no correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 1, 1, 1, 1];
    const result = calculatePearsonCorrelation(x, y);
    expect(result).toEqual(0);
  });

  test('Pearson - empty arrays', () => {
    const result = calculatePearsonCorrelation([], []);
    expect(result).toEqual(0);
  });

  // Spearman tests
  test('Spearman - monotonic relationship', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 2, 3, 4, 5];
    const result = calculateSpearmanCorrelation(x, y);
    expect(result).toBeCloseTo(1, 1);
  });

  // Kendall tests
  test('Kendall - basic calculation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 2, 3, 4, 5];
    const result = calculateKendallTau(x, y);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });
});
```

**Ejecutar:**
```bash
npm test -- --coverage
# Objetivo: 30-40% cobertura con 20-30 tests
```

**Impacto:** +20 puntos en testing

---

## ✅ ACCIÓN 4: Optimización de Performance (1 hora)

### Problema:
Lighthouse <70, carga lenta

### Solución:

**1. Actualizar `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "moduleResolution": "bundler",
    "incremental": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**2. Optimizar imágenes en `src/app/layout.tsx`:**
```tsx
import Image from 'next/image';

// ✅ Cambiar de <img> a <Image>
<Image 
  src="/logo.svg" 
  alt="Logo" 
  width={40} 
  height={40}
  priority={false}
/>
```

**3. Code splitting - Lazy load componentes:**
```tsx
import dynamic from 'next/dynamic';

const CorrelationHeatmap = dynamic(
  () => import('@/components/CorrelationHeatmap'),
  { loading: () => <div>Cargando gráfico...</div> }
);
```

**4. Verificar performance:**
```bash
npm run build
npm start
# Abrir DevTools → Lighthouse
# Ejecutar análisis, esperar Lighthouse 80+
```

**Impacto:** +10 puntos en performance

---

## ✅ ACCIÓN 5: SEO Meta Tags (30 min)

### Problema:
Sin SEO, la app no aparece en resultados de búsqueda

### Solución:

**Actualizar: `src/app/layout.tsx`**

```tsx
export const metadata = {
  title: 'Relational Insight - Análisis de Correlaciones',
  description: 'Herramienta gratuita para calcular correlaciones Pearson, Spearman y Kendall entre tus datos. Análisis estadístico seguro y privado en el navegador.',
  keywords: ['correlación', 'estadística', 'análisis', 'pearson', 'spearman', 'CSV', 'XLSX'],
  authors: [{ name: 'Relational Insight' }],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Relational Insight',
    description: 'Análisis de correlaciones estadísticas',
    type: 'website',
    siteName: 'Relational Insight',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Relational Insight',
    description: 'Análisis de correlaciones',
  },
};
```

**Crear: `public/robots.txt`**
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://tu-dominio.com/sitemap.xml
```

**Crear: `public/sitemap.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tu-dominio.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tu-dominio.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Impacto:** +15 puntos en SEO

---

## ✅ ACCIÓN 6: Deploy a Vercel (1-2 horas)

### Problema:
App no está en producción

### Solución:

**1. Conectar repo a GitHub (si no está):**
```bash
git init
git add .
git commit -m "Production ready - v2.0"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

**2. Deploy a Vercel:**
- Ir a [https://vercel.com/new](https://vercel.com/new)
- Conectar tu repositorio GitHub
- Vercel detecta automático que es Next.js
- Click "Deploy"
- Esperar ~3 minutos

**3. Configurar dominio (opcional):**
- En Vercel dashboard → Settings → Domains
- Agregar tu dominio o usar dominio Vercel gratuito

**4. Variables de entorno (si necesita):**
```bash
# En Vercel dashboard → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://tu-web-principal.com
```

**5. Verificar deployment:**
```bash
# Vercel da automáticamente:
✅ HTTPS (automático)
✅ CDN global
✅ Auto-deploy en push
✅ Certificado SSL
✅ Performance optimizada
```

**Impacto:** App en producción 🚀

---

## 📊 RESUMEN - Antes vs Después

### ANTES
```
Puntuación: 78/100
├─ Sin CSP headers
├─ Tests 30%
├─ Performance: 65/100
├─ Sin meta tags SEO
├─ Localhost únicamente
└─ No lista para producción
```

### DESPUÉS (1-2 semanas)
```
Puntuación: 90/100 ✅
├─ CSP headers implementados
├─ Tests 35-40%
├─ Performance: 80/100
├─ SEO optimizado
├─ En Vercel con HTTPS
└─ ✅ LISTA PARA PRODUCCIÓN
```

---

## 🚀 COMANDOS RÁPIDOS

```bash
# 1. Crear archivos necesarios
mkdir -p src/lib
touch next.config.js src/lib/validators.ts

# 2. Tests
npm test -- --coverage

# 3. Build
npm run build

# 4. Local
npm run dev
# http://localhost:3000

# 5. Deploy
git push origin main
# Vercel deploy automático
```

---

## ✅ CHECKLIST FINAL

### Semana 1 (3-4 días):
- [ ] CSP Headers (next.config.js) ← 30 min
- [ ] Validación mejorada (validators.ts) ← 1 hora
- [ ] Tests básicos ← 2-3 horas
- [ ] Performance optimization ← 1 hora
- [ ] SEO meta tags ← 30 min
- [ ] README.md actualizado ← 30 min
- [ ] Build local verificado ← 30 min

### Semana 2 (1-2 días):
- [ ] QA final ← 2 horas
- [ ] Deploy a staging Vercel ← 30 min
- [ ] Verificación HTTPS ← 15 min
- [ ] Production deployment ← 30 min
- [ ] Post-launch monitoring ← 1 hora

### RESULTADO:
```
78/100 → 90/100 ✅
1-2 SEMANAS
$3,500 USD
LISTA PARA PRODUCCIÓN 🚀
```

---

## 💡 TIPS IMPORTANTES

1. **No necesitas NextAuth.js** - Auth heredada de web principal
2. **No necesitas backend** - Procesamiento client-side es óptimo
3. **Vercel es gratis** - Free tier es suficiente
4. **HTTPS automático** - Vercel lo configura automáticamente
5. **CDN global** - Vercel distribuye automáticamente

---

## 📞 SOPORTE

Si necesitas ayuda:
1. Revisa `RECOMENDACIONES_TECNICAS.md` para más detalles técnicos
2. Revisa `ANALISIS_PRODUCCION.md` para análisis profundo
3. Revisa `QUICK_REFERENCE.md` para resumen ejecutivo

---

**Estado:** ✅ LISTO PARA IMPLEMENTAR

**Timeline:** 1-2 SEMANAS

**Siguiente paso:** Comenzar ACCIÓN 1

