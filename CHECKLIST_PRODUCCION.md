# ✅ CHECKLIST PRE-PRODUCCIÓN

**Objetivo:** Verificar que la app está lista para Vercel

**Tiempo estimado:** 2-3 horas para completar todo

---

## 🔧 FASE 1: SETUP LOCAL (30 min)

- [ ] Instalar dependencias: `npm install`
- [ ] Crear `next.config.js` (CSP headers)
- [ ] Crear `src/lib/validators.ts`
- [ ] Crear `.env.example`
- [ ] Verificar `tsconfig.json` (usar "bundler")

**Comando verificar:**
```bash
npm run build
# ✅ Debe compilar sin errores
```

---

## 🧪 FASE 2: TESTS (1 hora)

- [ ] Tests de correlación (utils.test.ts)
- [ ] Tests de validación (validators.test.ts)
- [ ] Tests de componentes (FileUploader, etc)
- [ ] Cobertura mínima 30%

**Comando:**
```bash
npm test -- --coverage
# Output esperado:
# Statements   : 30-40%
# Branches     : 20-30%
# Functions    : 30-40%
# Lines        : 30-40%
```

**Si falla:** Revisar `PLAN_ACCION_INMEDIATO_V2.md` ACCIÓN 3

---

## ⚡ FASE 3: PERFORMANCE (45 min)

- [ ] Lazy loading de componentes (dynamic imports)
- [ ] Image optimization (Next.js Image component)
- [ ] Bundle analysis completo
- [ ] TypeScript strict mode habilitado

**Comando:**
```bash
npm run build
# Revisar output de tamaño de bundle

npm start
# Abrir: http://localhost:3000
# DevTools → Lighthouse → Analyze page load
# ✅ Objetivo: Score 80+
```

**Checklist Lighthouse:**
- [ ] Performance: 80+
- [ ] Accessibility: 90+
- [ ] Best Practices: 85+
- [ ] SEO: 90+

**Si falla:** Revisar `PLAN_ACCION_INMEDIATO_V2.md` ACCIÓN 4

---

## 🔒 FASE 4: SEGURIDAD (45 min)

### Headers de Seguridad
- [ ] CSP implementado en `next.config.js`
- [ ] X-Frame-Options: SAMEORIGIN (para web principal)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Referrer-Policy configurado

**Verificar en DevTools → Network → Response Headers:**
```
Content-Security-Policy: default-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Validación de Entrada
- [ ] validateFile() implementado
- [ ] validateNumericData() implementado
- [ ] Manejo de errores robusto
- [ ] Sin console.log en producción

**Revisar archivos:**
```bash
grep -r "console\.log\|console\.warn\|console\.error" src/
# ✅ Debe estar VACÍO o solo en desarrollo
```

### HTTPS
- [ ] Vercel HTTPS automático (configurado)
- [ ] No hardcoded http:// URLs
- [ ] Todos los recursos https://

**Comando:**
```bash
npm run build 2>&1 | grep -i "https\|http"
# ✅ Debe estar limpio
```

**Si falla:** Revisar `PLAN_ACCION_INMEDIATO_V2.md` ACCIÓN 1 y 2

---

## 📝 FASE 5: DOCUMENTACIÓN (30 min)

- [ ] README.md completo
  - [ ] Descripción del proyecto
  - [ ] Requisitos (Node.js 18+)
  - [ ] Instalación (npm install)
  - [ ] Desarrollo (npm run dev)
  - [ ] Producción (npm run build && npm start)
  - [ ] Testing (npm test)
  - [ ] Features (Pearson, Spearman, Kendall)
  - [ ] Formato de entrada
  - [ ] Seguridad
  - [ ] Estado del proyecto

- [ ] .env.example creado
  - [ ] NODE_ENV
  - [ ] NEXT_PUBLIC_API_URL (si aplica)

- [ ] Comentarios en código complejo
  - [ ] Web Workers
  - [ ] Funciones de correlación
  - [ ] Validadores

**Si falla:** Revisar `PLAN_ACCION_INMEDIATO_V2.md` parte de documentación

---

## 🎨 FASE 6: SEO (30 min)

- [ ] Meta tags en `layout.tsx`
  - [ ] title
  - [ ] description
  - [ ] keywords
  - [ ] openGraph
  - [ ] twitter

- [ ] Archivos estáticos
  - [ ] `public/robots.txt`
  - [ ] `public/sitemap.xml`
  - [ ] `public/favicon.ico`

- [ ] Accessibility
  - [ ] alt tags en imágenes
  - [ ] aria-labels donde sea necesario
  - [ ] Heading hierarchy correcta (h1, h2, h3)
  - [ ] Links con texto descriptivo

**Verificar:**
```bash
# Robots.txt existe
test -f public/robots.txt && echo "✅" || echo "❌"

# Sitemap existe
test -f public/sitemap.xml && echo "✅" || echo "❌"
```

**Si falla:** Revisar `PLAN_ACCION_INMEDIATO_V2.md` ACCIÓN 5

---

## 🚀 FASE 7: DEPLOYMENT (45 min)

### Pre-deployment
- [ ] Git repo limpio
  - [ ] `git status` devuelve "working tree clean"
  - [ ] Todos los cambios committed
  - [ ] No hay merge conflicts

- [ ] Build final verificado
```bash
npm run build
# ✅ Build successful
# ✅ No warnings o errores
```

- [ ] Tests pasando
```bash
npm test -- --passWithNoTests
# ✅ PASS
```

### Deployment a Vercel
- [ ] Cuenta Vercel creada (vercel.com)
- [ ] GitHub repo conectado a Vercel
- [ ] Environment variables configuradas
  - [ ] NODE_ENV: production
  - [ ] Otros según sea necesario

- [ ] Deployment inicial
  - [ ] Staging deployment exitoso
  - [ ] Verificar HTTPS funciona
  - [ ] Probar funcionalidad básica

- [ ] Production deployment
  - [ ] Domain configurado (si aplica)
  - [ ] DNS pointing correctamente
  - [ ] HTTPS válido

**Checklist post-deployment:**
- [ ] App accesible desde URL pública
- [ ] HTTPS funciona (no warnings)
- [ ] Todos los recursos cargan (no 404s)
- [ ] Funcionalidad principal funciona:
  - [ ] Cargar CSV
  - [ ] Cargar Excel
  - [ ] Ver correlaciones
  - [ ] Exportar CSV
  - [ ] Exportar PNG/SVG

---

## 🔍 FASE 8: QA FINAL (45 min)

### Funcionalidad Core
- [ ] File upload funciona
  - [ ] CSV válido
  - [ ] Excel válido
  - [ ] Validación rechaza inválidos
  - [ ] Error messages claros

- [ ] Análisis funciona
  - [ ] Pearson correlación calculada
  - [ ] Spearman correlación calculada
  - [ ] Kendall tau calculada
  - [ ] Resultados son números válidos

- [ ] Exportación funciona
  - [ ] CSV exporta correctamente
  - [ ] JSON exporta correctamente
  - [ ] PNG exporta correctamente
  - [ ] SVG exporta correctamente

### Cross-browser
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (si disponible)
- [ ] Mobile (iOS/Android)

### Performance
- [ ] Carga rápida (<3s)
- [ ] Sin lag en interacciones
- [ ] Exportación rápida
- [ ] Memory leaks: none detectados

### Error Handling
- [ ] Archivo corrupto → error claro
- [ ] Archivos muy grandes → error claro
- [ ] Sin datos numéricos → error claro
- [ ] Network error → manejo graceful

### Accesibilidad
- [ ] Keyboard navigation funciona
- [ ] Screen reader compatible
- [ ] Contrast ratio adecuado
- [ ] Focus states visibles

---

## 📊 PUNTUACIÓN FINAL

### Antes
```
78/100 - Funciona bien pero necesita optimización
```

### Después de checklist completo
```
90/100 ✅ LISTA PARA PRODUCCIÓN
```

### Desglose esperado:
- Seguridad: 70/100
- Testing: 35/100
- Performance: 80/100
- Documentación: 75/100
- Código: 75/100
- SEO: 80/100
- Escalabilidad: 85/100
- Funcionalidad: 95/100
- **GENERAL: 90/100** ✅

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Si build falla:
```bash
npm run build 2>&1 | head -50
# Ver error específico y revisar el archivo indicado
```

### Si tests fallan:
```bash
npm test -- --verbose
# Ver cuáles tests fallan y por qué
```

### Si Lighthouse score bajo:
```bash
npm run build && npm start
# Revisar DevTools Lighthouse suggestions
# Implementar sugerencias priority
```

### Si falla deployment a Vercel:
```bash
# Revisar logs en Vercel dashboard
# Verificar environment variables
# Verificar build command: npm run build
# Verificar start command: npm start
```

---

## ✅ FIRMA

Una vez completado TODO el checklist:

```
┌─────────────────────────────────────┐
│                                     │
│  ✅ VERIFICADO: 100% Completo      │
│                                     │
│  Fecha: ___________________         │
│  Responsable: ________________      │
│  Build ID: ________________         │
│  Vercel URL: ________________       │
│                                     │
│  🚀 LISTO PARA PRODUCCIÓN          │
│                                     │
└─────────────────────────────────────┘
```

---

## 📞 SIGUIENTE PASO

1. ✅ Completar este checklist
2. ✅ Escanear QR o compartir URL de Vercel
3. ✅ Comunicar a stakeholders
4. ✅ Monitor en producción (primeros días)
5. ✅ Recolectar feedback de usuarios

---

**Duración total:** 2-3 horas  
**Complejidad:** Media  
**Prerequisito:** Completar `PLAN_ACCION_INMEDIATO_V2.md`

