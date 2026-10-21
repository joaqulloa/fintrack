# FinTrack — Frontend

Interfaz de [FinTrack](../README.md): dashboard de finanzas personales en CLP.

## Stack

Next.js 16 (App Router + Cache Components), React 19, TypeScript 5, Tailwind CSS 4, Recharts.

## Desarrollo

```bash
pnpm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
pnpm dev
```

La app corre en `http://localhost:3000` y consume la API Django en `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:8000`).

## Estructura

| Ruta | Contenido |
| --- | --- |
| `app/(app)/` | Rutas de la aplicación: `/`, `/transactions`, `/categories`, `/settings` |
| `components/dashboard/` | Tarjetas de resumen, gráficos y selector de período |
| `components/transactions/` | Listado, filtros y formulario de transacciones |
| `components/ui/` | Componentes reutilizables (select, skeletons, estados vacíos) |
| `lib/api/` | Cliente HTTP y funciones por endpoint |
| `lib/utils/` | Formato de moneda/fecha en CLP y helpers de período |

## Comandos

```bash
pnpm dev                # servidor de desarrollo
pnpm lint               # ESLint
pnpm exec tsc --noEmit  # verificación de tipos
pnpm build              # build de producción
```

Las páginas que consumen datos en vivo usan `connection()` + `<Suspense>` (patrón de Cache Components de Next.js), por lo que el build no necesita el backend levantado.
