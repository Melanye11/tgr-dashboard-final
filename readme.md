Dashboard centralizado de APIs públicas del Estado de Chile.  
Permite navegar entre distintas fuentes de datos desde un menú lateral y ver dashboards con KPIs, gráficos y tablas.

**Estado actual:**
- **TGR** — Remates judiciales (operativo)
- **Mercado Público — Compra Ágil** — Listado, filtros, paginación y modal de detalle (operativo)
- **Mercado Público — Licitaciones / Órdenes de Compra** — Pendiente

| Tecnología | Uso |
|------------|-----|
| Next.js 14 | Framework (App Router) |
| React 18 | UI |
| JavaScript |
| Tailwind CSS 3 | Estilos |
| Recharts | Gráficos |
| Lucide React | Iconos |

--- 

## Inicio rápido

npm install
npm run dev

## Variables de entorno
Crea `.env.local` en la raíz del proyecto:
```env
# Obligatorio para Mercado Público (Compra Ágil v2)
MERCADO_PUBLICO_TICKET=Ticket solicitado con Clave Unica

---

## Estructura del proyecto
config/
  apis.js                         → Registro APIs en el sidebar (TGR, Mercado Público)
  mercado-publico.js              → Submódulos MP (pestañas + cache tags)

lib/
  formatters.js, filters.js       → Utilidades compartidas
  mercado-publico/                → Normalización JSON → UI

services/
  tgr/                            → API externa remates TGR
  mercado-publico/
    shared/                         → Ticket, fetch api2, errores
    compra-agil/                    → listarComprasAgiles, detalle

components/
  layout/                           → Sidebar y shell global
  shared/                           → ErrorView, etc.
  apis/tgr/                         → TgrDashboard
  apis/mercado-publico/             → MpSubnav, CompraAgilDashboard, modal

app/dashboard/
  tgr/                              → Página TGR (servidor)
  mercado-publico/                  → Layout, redirect, compra-agil/page.js
  
app/api/
  tgr/remates/                      → GET /api/tgr/remates
  mercado-publico/compra-agil/      → GET /api/mercado-publico/compra-agil
  cron/sincronizar/                 → Invalidación caché (?api=tgr)



