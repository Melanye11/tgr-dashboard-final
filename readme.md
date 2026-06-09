Dashboard centralizado de APIs públicas del Estado de Chile.  
Permite navegar entre distintas fuentes de datos desde un menú lateral y ver dashboards con KPIs, gráficos y tablas.

**Estado actual:** TGR operativa · Mercado Público en construcción

| Tecnología | Uso |
|------------|-----|
| Next.js 14 | Framework (App Router) |
| React 18 | UI |
| JavaScript |
| Tailwind CSS 3 | Estilos |
| Recharts | Gráficos |
| Lucide React | Iconos |

## Inicio rápido

npm install
npm run dev


## Estructura actual:
config/apis.js              → Registro de APIs (menú, rutas, caché)
lib/                        → Utilidades (formatters, filters)
services/                   → Conexión con APIs externas
components/layout/          → Sidebar y shell global
components/shared/          → Componentes UI reutilizables
components/apis/tgr/        → Dashboard UI de TGR
app/dashboard/              → Páginas del hub
app/api/                    → Endpoints REST y cron




tgr-dashboard-final-main/
│
├── config/
│   └── apis.js                    ← Registro de todas las APIs
│
├── lib/
│   ├── formatters.js              ← Moneda, fechas
│   └── filters.js                 ← Filtros genéricos + TGR
│
├── services/
│   ├── shared/
│   │   └── http.js                ← fetch genérico con caché
│   └── tgr/
│       ├── index.js               ← Punto de entrada del módulo
│       └── tgrService.js          ← Lógica TGR (URL, deduplicación)
│
├── components/
│   ├── layout/
│   │   ├── AppSidebar.js          ← Menú lateral de APIs
│   │   └── DashboardShell.js      ← Shell: sidebar + contenido
│   ├── shared/
│   │   └── ErrorView.js           ← Pantalla de error reutilizable
│   └── apis/
│       └── tgr/
│           └── TgrDashboard.js    ← Dashboard completo de TGR
│
├── app/
│   ├── layout.js                  ← Layout raíz (HTML, metadata)
│   ├── page.js                      ← Redirige a /dashboard/tgr
│   ├── globals.css                  ← Estilos Tailwind globales
│   │
│   ├── dashboard/                   ← Grupo de rutas del hub
│   │   ├── layout.js              ← Aplica DashboardShell
│   │   ├── tgr/
│   │   │   └── page.js            ← Página TGR (fetch servidor)
│   │   └── mercado-publico/
│   │       └── page.js            ← Placeholder “en construcción”
│   │
│   └── api/                         ← APIs REST internas
│       ├── tgr/
│       │   └── remates/
│       │       └── route.js         ← GET /api/tgr/remates
│       └── cron/
│           └── sincronizar/
│               └── route.js         ← Cron genérico por ?api=
│
├── jsconfig.json                    ← Alias @/* → raíz del proyecto
├── tailwind.config.js
├── vercel.json                      ← Cron diario TGR
└── package.json