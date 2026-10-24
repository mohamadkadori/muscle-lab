# muscleLab

muscleLab is an interactive anatomy and exercise guide for understanding which muscles you train and building your own routines.
https://muscle-lab.replit.app
## What’s included

- **Anatomy explorer:** clickable front/back 2D muscle maps, with an optional external 3D anatomy view.
- **Muscle and exercise pages:** muscle functions, training regions, matching exercises, and individual exercise details.
- **Beginner guide:** the “New to gym?” page introduces training basics.
- **Workout builder:** named routines with exercises, sets, rep targets, and routine/exercise notes.
- **AI coach:** general training questions and draft workout plans that you review before explicitly saving.

**Content limits:** exercise entries are demo content, not a verified exercise library. muscleLab is educational, not medical advice. Consult a qualified professional about injuries or medical concerns; AI responses can be wrong and are not a substitute for professional guidance.

## Stack

pnpm workspace using Node.js 24 and TypeScript 5.9. The frontend uses React 19, Vite 7, Tailwind CSS 4, Wouter, and TanStack Query. The API uses Express 5, PostgreSQL with Drizzle ORM, Zod validation, Clerk authentication, and Replit-managed OpenAI access. Orval generates the shared API client and validation schemas from OpenAPI.

## Getting started on Replit

Run commands below from the **repository root**.

### 1. Prerequisites and installation

- Node.js **24** (configured in `.replit`).
- pnpm **10** (the workspace was checked with 10.26.1); npm and Yarn installation are rejected by the root preinstall script.
- A PostgreSQL database and the configured Clerk authentication service. The AI coach additionally requires Replit AI Integrations for OpenAI.
- The existing Replit artifact workflows and path router for running the frontend and API together.

Install the locked dependencies:

```sh
pnpm install --frozen-lockfile
```

The workspace includes Linux x64-specific dependency overrides. It is configured for Replit’s Linux environment, not as a cross-platform local setup.

### 2. Configuration

Use the project’s Replit environment/Secrets configuration for server credentials. Never commit real values. Replit-managed services supply their own configuration; check that it is available to the relevant environment rather than replacing it with arbitrary credentials.

| Variable | Used when | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | API runtime; database schema commands | Required PostgreSQL connection string. Supplied by the Replit database when provisioned; format: `postgresql://<user>:<password>@<host>:<port>/<database>`. |
| `CLERK_SECRET_KEY` | API runtime | Server-only Clerk credential for authentication and the production Clerk proxy. Managed by Replit for this app; placeholder: `<clerk-secret-key>`. |
| `CLERK_PUBLISHABLE_KEY` | API runtime | Clerk publishable key fallback when it cannot be derived from the request host; placeholder: `<clerk-publishable-key>`. |
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend dev/build | Browser-safe Clerk publishable key fallback when it cannot be derived from the browser host. Use the key for the same Clerk environment as the API. |
| `VITE_CLERK_PROXY_URL` | Frontend dev/build, when using the proxy | Optional Clerk proxy URL. The API implements `/api/__clerk` in production; use the managed environment’s configuration. |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Coach request runtime | Required for the coach: Replit-managed OpenAI endpoint; placeholder: `<managed-openai-base-url>`. |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Coach request runtime | Required for the coach: server-only Replit-managed integration credential; placeholder: `<managed-openai-credential>`. This is not a request for a personal OpenAI API key. |
| `PORT` | API runtime; Vite dev/build/preview config | Supplied per service by artifact workflows. Vite configuration and the API entry point reject missing or invalid ports. |
| `BASE_PATH` | Vite dev/build/preview config | Workflow-provided frontend base path, currently `/`. Required even for Vite builds; Vite exposes it to browser code as `import.meta.env.BASE_URL`. |
| `NODE_ENV` | API dev/build/runtime | The API `dev` script sets `development`; its production artifact configuration sets `production`. Controls logging and production Clerk proxy behavior. |
| `LOG_LEVEL` | API runtime | Optional logger setting; defaults to `info`. |

`VITE_*` values are exposed to the browser and embedded at build time: changing them requires restarting Vite or rebuilding the frontend. Never put server secrets in `VITE_*` variables.

The API and Drizzle configuration read `process.env` directly; the workspace does **not** configure an automatic dotenv loader for them. A root `.env` file alone will not configure those commands. Vite has its own environment-file handling, but `PORT` and `BASE_PATH` are read while evaluating its configuration, so supply them through the workflow or shell environment.

The OpenAI client initializes only when a coach request needs it. If either integration variable is missing, the coach returns an unavailable response; normal workout routes can still start. Managed OpenAI access uses Replit AI Integrations, requires no personal OpenAI key, and usage is billed to Replit credits. Coach availability also depends on that external service.

### 3. Database setup

With `DATABASE_URL` available to the shell, initialize or update the **development** database:

```sh
pnpm --filter @workspace/db run push
```

This runs Drizzle Kit against the schema exported by `lib/db/src/schema/index.ts`. Review its proposed changes before accepting them: it changes the connected database’s schema. Check that the connection targets development, not production. Do not run it merely to check documentation or force a schema push on a database containing important data.

The anatomy and demo exercise library live in frontend source files, so no content seed command is needed. Account routines are stored in PostgreSQL; Clerk supplies the account identity.

### 4. Start the application

Use the Replit **Run** button (`Project`) and the existing managed workflows:

| Workflow | Command | Routing |
| --- | --- | --- |
| `artifacts/muscle-lab: web` | `pnpm --filter @workspace/muscle-lab run dev` | Frontend at `/`; configured local port `24151` |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` | API at `/api`; configured local port `8080` |
| `artifacts/mockup-sandbox: Component Preview Server` | `pnpm --filter @workspace/mockup-sandbox run dev` | Separate design canvas at `/__mockup` |

Open the muscleLab preview, not the API or design canvas, to use the app. The artifact workflows supply service-specific ports/base paths and the shared router directs `/api` requests to Express. **There is no root `dev` script.** Running the package commands alone in a shell does not recreate workflow routing or environment injection; the frontend Vite config does not define a standalone API proxy.

The API `dev` command builds the server and starts the bundle; it is not a source watcher. Restart its workflow after API edits. Vite handles frontend development updates.

## Workouts, privacy, and AI data

- **Guest:** routines and notes use browser `localStorage`. They stay in that browser/profile and can be lost when browser data is cleared. They are not account data or automatically synced.
- **Signed in:** saved routines and notes are private account data stored in PostgreSQL and scoped to the authenticated Clerk user. Sign in to the same account on another device to retrieve saved routines. Save edits before switching devices; this is not collaborative live editing.
- **Copying guest routines:** signing in does not automatically import anything. In “My workouts,” choose **Copy browser routines to my account** and confirm. Browser originals remain intact, and existing account routines are skipped rather than overwritten. Copy only into the intended account, especially on shared devices.
- **Saving and deleting:** edits require an explicit save. Deleting removes a routine from the active storage scope, including other devices for account routines; there is no in-app undo.
- **AI coach:** submitted conversation messages go through the API to the managed AI service. Avoid sharing sensitive or medical details. Chat is held in page memory, not a saved chat history. Generated routines are drafts until explicitly saved, then use the same guest/account storage rules.

Workout backup/export and restore/import from files are **not currently available**. Copying guest routines into an account is not a backup/restore feature.

## Repository map

```text
artifacts/
  muscle-lab/                    React/Vite application
    src/pages/                   Explorer, muscles, exercises, guide, workouts, coach, about
    src/components/              Shared UI, anatomy diagrams, workout editor, coach cards
    src/data/                    Anatomy and demo exercise content
    src/hooks/                   Workout repository and other frontend hooks
    src/lib/                     Browser workout storage and UI helpers
  api-server/                    Express API; esbuild outputs dist/index.mjs
    src/routes/                  Health, account workouts, and AI coach endpoints
    src/middlewares/             Clerk proxy
  mockup-sandbox/                Separate design preview, not the product frontend
lib/
  db/                            PostgreSQL/Drizzle connection and schema
  api-spec/                      openapi.yaml and Orval configuration
  api-client-react/              Generated React Query client/types and custom fetch
  api-zod/                       Generated API validation schemas/types
  integrations-openai-ai-server/ Server-only managed OpenAI client
scripts/                         Workspace utilities and post-merge setup
```

Each artifact’s `.replit-artifact/artifact.toml` describes its services, paths, and build/run configuration. `.replit` selects the runtime and Run workflow. `replit.md` contains existing project guidance.

## Common development commands

All commands run from the repository root:

| Command | Purpose |
| --- | --- |
| `pnpm run typecheck` | Build/check referenced libraries, then typecheck artifacts and scripts. |
| `pnpm run typecheck:libs` | Run `tsc --build` for the root library references. |
| `pnpm --filter @workspace/muscle-lab run typecheck` | Check the frontend only; build shared library references first if needed. |
| `pnpm --filter @workspace/api-server run typecheck` | Check the API only; build shared library references first if needed. |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate the API client and Zod schemas, then typecheck shared libraries. |
| `pnpm --filter @workspace/api-server run build` | Bundle the API with esbuild; does not independently typecheck. |
| `PORT=24151 BASE_PATH=/ pnpm --filter @workspace/muscle-lab run build` | Build the frontend into `artifacts/muscle-lab/dist/public`; requires frontend Clerk configuration. |
| `PORT=24151 BASE_PATH=/ pnpm run build` | Full typecheck plus all package builds, including the design sandbox. Inline values satisfy Vite configuration for this build only; they are not multi-service runtime settings. |

For API changes, edit `lib/api-spec/openapi.yaml`, run code generation, and inspect the generated changes before committing. Keep handwritten code outside generated directories. Run the full typecheck after changes across packages.

There is no root `test` or `lint` script; the command table does not imply either exists. Database schema pushes are deliberate setup/maintenance operations, not validation steps.
