# Sistema CRM Custom - Mallku Excursiones
## Plan de Implementación Completo

---

## 📋 Resumen Ejecutivo

**Objetivo:** Sistema CRM completo para capturar, gestionar y automatizar la relación con clientes.

**Timeline:** 8-12 semanas trabajando full-time
**Costo:** $0 inicialmente, ~$55/mes al escalar
**Desarrollo:** Con asistencia de Claude paso a paso

### Objetivos Principales
- ✅ Capturar leads del sitio web (formularios, interacciones)
- ✅ Gestionar clientes y reservas (bookings)
- ✅ Tracking de comportamiento y analytics
- ✅ Automatización de emails y seguimiento
- ✅ Dashboard administrativo profesional

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Hono (ultraligero, serverless-ready)
- **Hosting:** Cloudflare Workers / Vercel Functions
- **Costo:** $0 inicialmente

### Base de Datos
- **PostgreSQL:** Supabase (tier gratuito: 500MB DB)
- **Cache:** Redis en Upstash (tier gratuito)
- **ORM:** Drizzle ORM (TypeScript nativo)

### Frontend
- **Sitio público:** Astro SSG (mantener actual)
- **Dashboard admin:** React 18 + Vite + shadcn/ui
- **Interactividad:** Alpine.js

### Servicios Externos
- **Email:** Resend (100 emails/día gratis)
- **Analytics:** Posthog (1M eventos/mes gratis)
- **Pagos (Fase 6):** Mercado Pago

---

## 📊 Arquitectura del Sistema

```
SITIO PÚBLICO (Astro)          DASHBOARD ADMIN (React)
• Formulario contacto           • Login
• Booking form                  • Gestión leads
• Calendario fechas             • Gestión bookings
         ↓                      • Analytics
         ↓                               ↓
    ═══════════════════════════════════════════
              API BACKEND (Hono)
    ═══════════════════════════════════════════
         ↓              ↓              ↓
    PostgreSQL      Redis        Servicios
    (Supabase)     (Upstash)    (Resend/Posthog)
```

---

## 🗄️ Modelos de Datos

### 1. Tabla `leads`
```
- id (UUID)
- nombre, email, telefono
- excursion_interes
- mensaje
- status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
- assigned_to (admin)
- source, utm_params
- tags[]
- created_at, updated_at
```

### 2. Tabla `bookings`
```
- id (UUID)
- booking_number (MLK-2024-001)
- date_id (FK)
- nombre_completo, email, telefono
- cantidad_personas
- precio_total, seña_pagada
- status: 'pending' | 'confirmed' | 'paid' | 'completed'
- payment_status
- notas_cliente, notas_internas
```

### 3. Tabla `excursions`
```
- id (UUID), slug
- titulo, descripcion
- duracion, precio_base, grupo_max
- itinerario (JSONB)
- incluye, no_incluye (JSONB)
- is_active
```

### 4. Tabla `dates`
```
- id (UUID)
- excursion_id (FK)
- fecha, hora_salida
- cupos_totales, cupos_reservados
- cupos_disponibles (computed)
- estado: 'disponible' | 'pocos-cupos' | 'completo'
```

### 5. Tabla `events`
```
- id (UUID)
- session_id, lead_id
- event_type, event_name
- properties (JSONB)
- page_url, referrer
- created_at
```

### 6. Tabla `users`
```
- id (UUID)
- email, password_hash
- full_name, role
- is_active
```

---

## 🎯 FASE 1: Backend Core + Captura de Leads
**Duración:** Semana 1-2
**Objetivo:** API funcional para capturar leads

### Setup Inicial (Día 1)
1. ✅ Crear cuenta Supabase → https://supabase.com
2. ✅ Crear cuenta Resend → https://resend.com
3. ✅ Crear cuenta Posthog → https://posthog.com
4. ✅ Setup repositorio para API backend

### Backend (Días 2-5)
1. ✅ Proyecto Hono con TypeScript
2. ✅ Setup Drizzle ORM + esquema
3. ✅ Crear tablas: `leads`, `users`, `events`
4. ✅ Endpoint: `POST /api/v1/leads`
   - Validación con Zod
   - Guardar en PostgreSQL
   - Enviar email (Resend)
   - Trackear en Posthog
5. ✅ Endpoint: `POST /api/v1/analytics/track`

### Frontend - Astro (Días 6-7)
1. ✅ Actualizar `ContactForm.astro`
   - Conectar a API propia
   - Manejo de errores
   - Loading states
2. ✅ Agregar script Posthog
3. ✅ Trackear eventos

### Entregables Fase 1
- ✅ Formulario conectado a backend
- ✅ Leads guardándose en DB
- ✅ Email automático funcionando
- ✅ Analytics tracking activo

### Deploy Fase 1
- API: Cloudflare Workers / Vercel
- Astro: Sin cambios (mantener hosting actual)

---

## 🖥️ FASE 2: Dashboard Admin MVP
**Duración:** Semana 3-4
**Objetivo:** Dashboard para gestionar leads

### Backend (Días 1-4)
1. ✅ Sistema autenticación JWT
2. ✅ Endpoints:
   - `POST /api/v1/auth/login`
   - `GET /api/v1/admin/leads` (lista + filtros)
   - `GET /api/v1/admin/leads/:id`
   - `PATCH /api/v1/admin/leads/:id`
   - `GET /api/v1/admin/analytics/overview`

### Dashboard React (Días 5-10)
1. ✅ Setup: React 18 + Vite + shadcn/ui
2. ✅ Pantalla de login
3. ✅ Layout con sidebar
4. ✅ Dashboard overview:
   - KPIs: Leads totales, nuevos hoy, conversiones
   - Lista últimos leads
5. ✅ Página de leads:
   - Tabla con filtros
   - Búsqueda
6. ✅ Detalle de lead:
   - Ver info completa
   - Cambiar status
   - Agregar notas
   - Timeline

### Entregables Fase 2
- ✅ Login funcional
- ✅ Dashboard con KPIs
- ✅ Gestión leads (view + update)
- ✅ Filtros y búsqueda

### Deploy Fase 2
- Dashboard: Vercel/Netlify
- Subdominio: `admin.mallku.com.ar`

---

## 📅 FASE 3: Sistema de Reservas
**Duración:** Semana 5-6
**Objetivo:** Bookings completo

### Backend (Días 1-5)
1. ✅ Migrar datos a DB:
   - `excursiones.ts` → `excursions`
   - `fechas.ts` → `dates`
2. ✅ Tabla `bookings` con triggers
3. ✅ Endpoints:
   - `POST /api/v1/bookings/initiate`
   - `GET /api/v1/bookings/:id/status`
   - Admin CRUD completo
4. ✅ Sistema booking_number
5. ✅ Email confirmación

### Frontend Astro (Días 6-8)
1. ✅ Páginas excursiones: leer de API
2. ✅ Calendario interactivo (Alpine.js)
3. ✅ Formulario de reserva
4. ✅ Página confirmación

### Dashboard (Días 9-10)
1. ✅ Sección Bookings
2. ✅ Vista calendario
3. ✅ Gestión fechas
4. ✅ Detalle booking

### Entregables Fase 3
- ✅ Sistema reservas end-to-end
- ✅ Calendario dinámico
- ✅ Actualización cupos automática
- ✅ Emails confirmación

### Deploy Fase 3
- Astro: Cambiar a SSR (adapter Node/Vercel)

---

## 📈 FASE 4: Analytics Avanzado + CRM Pipeline
**Duración:** Semana 7-8
**Objetivo:** Analytics completo y pipeline visual

### Backend
1. ✅ Endpoints analytics:
   - Conversion funnel
   - Revenue reports
   - Top excursions
2. ✅ Endpoint interactions (timeline)

### Dashboard
1. ✅ Analytics completo:
   - Gráficos conversión
   - Funnel visualization
   - Revenue charts
2. ✅ Pipeline Kanban
3. ✅ Timeline interacciones
4. ✅ Registro interacciones manual

### Posthog
1. ✅ Setup funnels
2. ✅ Session replay
3. ✅ Dashboards

---

## ✉️ FASE 5: Automatizaciones + Newsletter
**Duración:** Semana 9
**Objetivo:** Emails automáticos

### Backend
1. ✅ Email templates (React Email)
2. ✅ Cron jobs:
   - Recordatorio 48hs antes
   - Seguimiento post-excursión
   - Lead nurturing
3. ✅ Endpoints newsletter

### Frontend Astro
1. ✅ Formulario newsletter
2. ✅ Footer signup

### Dashboard
1. ✅ Sección Newsletter
2. ✅ Lista suscriptores
3. ✅ Envío campañas (opcional)

---

## 🔗 FASE 6: Integraciones
**Duración:** Semana 10
**Objetivo:** WhatsApp + Mercado Pago

### Backend
1. ✅ WhatsApp Business API
2. ✅ Mercado Pago:
   - Payment links
   - Webhook pagos
3. ✅ Actualización payment_status

### Frontend Astro
1. ✅ Botón "Pagar reserva"
2. ✅ Página post-pago

### Dashboard
1. ✅ Generar payment link
2. ✅ Estado pago real-time

---

## ✅ FASE 7: Testing + Documentación
**Duración:** Semana 11-12
**Objetivo:** Pulir y documentar

### Tareas
1. ✅ Testing exhaustivo
2. ✅ Fix bugs
3. ✅ Optimización performance
4. ✅ Documentación API (Swagger)
5. ✅ Guías usuario dashboard
6. ✅ Video tutorial

### Testing Completo
- [ ] Lead creation flow
- [ ] Booking flow
- [ ] Admin workflows
- [ ] Email delivery
- [ ] Analytics tracking
- [ ] Edge cases

---

## 💰 Costos Estimados

### Fase 1-3 (Primeros 3 meses)
- Supabase: $0
- Resend: $0
- Posthog: $0
- Upstash: $0
- **Total: $0/mes**

### Al Escalar (>500 leads/mes)
- Supabase Pro: $25/mes
- Resend: $20/mes
- Upstash: $10/mes
- **Total: ~$55/mes**

### Con Integraciones (Fase 6)
- WhatsApp API: $50-100/mes
- Mercado Pago: 3-5% por transacción
- **Total: ~$105-155/mes**

---

## 📂 Estructura de Archivos

### Proyecto API Backend (nuevo repo)
```
mallku-api/
├── src/
│   ├── db/
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── routes/
│   │   ├── leads.ts
│   │   ├── bookings.ts
│   │   └── admin.ts
│   ├── lib/
│   │   ├── email.ts
│   │   ├── analytics.ts
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── ratelimit.ts
│   └── index.ts
├── drizzle.config.ts
└── package.json
```

### Dashboard Admin (nuevo repo)
```
mallku-dashboard/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Leads/
│   │   ├── Bookings/
│   │   └── Calendar/
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   │   └── api.ts
│   └── App.tsx
└── package.json
```

### Modificaciones Sitio Astro
```
mallku-site/
├── src/
│   ├── components/
│   │   ├── ContactForm.astro (MODIFICAR)
│   │   ├── BookingForm.astro (NUEVO)
│   │   └── Calendar.astro (NUEVO)
│   └── lib/
│       └── api.ts (NUEVO)
├── astro.config.mjs (MODIFICAR)
└── .env (NUEVO)
```

---

## 🔍 Verificación End-to-End

### Fase 1
1. ✅ Completar formulario → lead en Supabase
2. ✅ Email confirmación recibido
3. ✅ Evento en Posthog

### Fase 2
1. ✅ Login en admin.mallku.com.ar
2. ✅ Ver leads capturados
3. ✅ Actualizar status
4. ✅ Ver KPIs

### Fase 3
1. ✅ Ver calendario fechas
2. ✅ Hacer reserva
3. ✅ Cupos actualizados
4. ✅ Email confirmación booking
5. ✅ Ver booking en dashboard
6. ✅ Estado fecha cambia automáticamente

---

## 🎓 Conocimientos Requeridos

Durante el proyecto vas a aprender:
- ✅ TypeScript básico (explicado mientras)
- ✅ Conceptos API REST (explicado)
- ✅ Git básico (commit, push, branch)
- ✅ Terminal/línea de comandos

---

## 📝 Notas Importantes

- Cada fase entrega valor incremental
- Sistema puede lanzarse después de Fase 2
- Fases 4-6 agregan automatización
- Arquitectura permite escalar sin refactoring mayor
- Metodología: paso a paso guiado
- Testing continuo antes de seguir

---

**Última actualización:** 4 de Febrero, 2026
**Estado:** En preparación para inicio de Fase 1
**Branch:** CRM
