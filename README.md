# FinTrack

FinTrack es una aplicación de finanzas personales para gestionar ingresos, gastos y flujo de caja mediante un dashboard interactivo. Desarrollada con Next.js, TypeScript y Tailwind CSS en el frontend, y Django Ninja y PostgreSQL en el backend.

![Stack](https://img.shields.io/badge/Next.js-16-000?logo=next.js) ![Stack](https://img.shields.io/badge/Django-6.1-092E20?logo=django) ![Stack](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

## Funcionalidades

- **Dashboard con filtro por período**: navegación por mes y año (vía `?month=&year=`), con comparación contra el mes anterior y gráfico de flujo de dinero de 12 meses.
- **Gráficos**: flujo de ingresos vs. gastos (Recharts) y distribución de gastos por categoría.
- **Transacciones**: alta, edición y eliminación con filtros por rango de fechas, tipo y categoría.
- **Categorías**: separadas en ingresos (Sueldo, Freelance) y gastos (Vivienda, Alimentación, Transporte, Servicios).
- **Datos de demostración**: comando de management para poblar cualquier mes con transacciones ficticias.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | Next.js 16 (App Router, Cache Components), React 19, TypeScript 5, Tailwind CSS 4, Recharts, lucide-react |
| Backend | Django 6.1, Django Ninja, django-cors-headers, psycopg 3 |
| Base de datos | PostgreSQL 16 |
| Tooling | pnpm, pytest + pytest-django, ESLint (flat config) |

## Estructura

```
fintrack/
├── backend/
│   ├── config/              # settings, urls, asgi/wsgi
│   ├── finance/             # app: models, schemas, api, admin
│   │   ├── management/commands/seed_transactions.py
│   │   └── tests/
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── app/(app)/           # rutas: /, /transactions, /categories, /settings
│   ├── components/          # dashboard, transactions, ui
│   ├── lib/api/             # cliente HTTP + endpoints
│   ├── lib/utils/           # formato CLP, helpers de período
│   └── types/
├── docs/                    # overview, requirements, arquitectura, data model, roadmap
└── README.md
```

## Requisitos

- Python 3.13+
- Node.js 20+ y pnpm
- PostgreSQL 16

## Puesta en marcha

### 1. Base de datos

```bash
createdb fintrack
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env   # completa DJANGO_SECRET_KEY, DB_* y CORS_ALLOWED_ORIGINS
python manage.py migrate
python manage.py runserver
```

La API queda en `http://localhost:8000/api/` y el admin de Django en `http://localhost:8000/admin/`.

### 3. Frontend

```bash
cd frontend
pnpm install

echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
pnpm dev
```

La app queda en `http://localhost:3000`.

## Datos de demostración

El comando `seed_transactions` genera transacciones ficticias coherentes con las categorías del proyecto (montos redondeados, distribución realista y sin fechas futuras):

```bash
cd backend
source .venv/bin/activate

python manage.py seed_transactions                      # mes actual
python manage.py seed_transactions --month 2026-10      # mes específico
python manage.py seed_transactions --month 2026-10 --reset --seed 7
```

| Flag | Descripción |
| --- | --- |
| `--month YYYY-MM` | Mes a poblar (por defecto, el mes actual). |
| `--seed N` | Semilla aleatoria: el mismo número siempre genera los mismos datos. |
| `--reset` | Elimina las transacciones del mes antes de insertar las nuevas. |

## Comandos

```bash
# Backend
cd backend
source .venv/bin/activate
pytest -q                       # tests
python manage.py migrate        # migraciones

# Frontend
cd frontend
pnpm dev                        # desarrollo
pnpm lint                       # ESLint
pnpm exec tsc --noEmit          # tipos
pnpm build                      # build de producción
```

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del servicio |
| `GET` | `/api/categories` | Lista de categorías |
| `GET` | `/api/transactions` | Transacciones (filtros: `start_date`, `end_date`, `type`, `category_id`) |
| `POST` | `/api/transactions` | Crear transacción |
| `GET/PUT/DELETE` | `/api/transactions/{id}` | Obtener, actualizar y eliminar |
| `GET` | `/api/dashboard/summary` | Totales del período (`start_date`, `end_date`) |
| `GET` | `/api/dashboard/expenses-by-category` | Gastos agrupados por categoría |
| `GET` | `/api/dashboard/monthly-trends` | Ingresos y gastos por mes |

## Documentación

- [Visión general del proyecto](docs/01-project-overview.md)
- [Requerimientos](docs/02-requeriments.md)
- [Arquitectura](docs/03-arquitecture.md)
- [Modelo de datos](docs/04-data-model.md)
- [Roadmap de desarrollo](docs/05-development-roadmap.md)

## Nota de seguridad

La API **no tiene autenticación** y está pensada para uso personal en `localhost`. Si la expones a internet, agrega autenticación y restringe `CORS_ALLOWED_ORIGINS` y `DJANGO_ALLOWED_HOSTS`.
