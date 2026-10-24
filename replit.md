# muscleLab

An interactive anatomy and exercise guide for exploring muscles and learning how to train them.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

muscleLab combines a clickable anatomy map, sample exercise library, beginner guidance, and a personal workout builder with training notes. Signed-in workouts are privately saved to an account for use across devices. Guest routines remain browser-local.

## User preferences

- Use #90A955 as the main green background and #ECF39E as the secondary color, with off-white and gray; anatomy diagrams should be white and gray.
- The anatomy diagrams must look precisely like the supplied front/back reference pictures, not simplified body drawings. Preserve their proportions and detail when changing interactions.
- Hovering a muscle shows only its name and “Go to muscle page”; clicking opens the muscle information and exercises on a separate page.
- On muscle pages, highlight the whole muscle initially; hovering its diagram highlights a submuscle, and clicking it reveals deeper information and matching exercises. Keep region buttons in sync.
- Exercises are dummy content for now. The user will supply the exercise content to replace them.
- Keep muscleLab at the left of the top navigation, with All exercises, New to gym?, My workouts, and About us at the right.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
