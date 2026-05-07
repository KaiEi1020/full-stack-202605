# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This repository contains two Node/TypeScript apps managed by a root pnpm workspace:

- `frontend/`: Vite + React 19 single-page app
- `backend/`: NestJS 11 HTTP API

Install dependencies from the repository root with `pnpm install`. Run app-specific commands from the root with `pnpm --filter <package> <script>`.

## Commands

### Root workspace

| Task | Command |
| --- | --- |
| Install all dependencies | `pnpm install` |
| Start frontend dev server | `pnpm --filter frontend dev` |
| Start backend dev server | `pnpm --filter backend start:dev` |
| Build all apps | `pnpm -r build` |
| Lint all apps | `pnpm -r lint` |
| Run backend tests | `pnpm --filter backend test` |

### Frontend (`frontend/`)

| Task | Command |
| --- | --- |
| Start dev server | `pnpm --filter frontend dev` |
| Build production bundle | `pnpm --filter frontend build` |
| Lint | `pnpm --filter frontend lint` |
| Preview production build | `pnpm --filter frontend preview` |

### Backend (`backend/`)

| Task | Command |
| --- | --- |
| Start dev server with watch | `pnpm --filter backend start:dev` |
| Start once | `pnpm --filter backend start` |
| Build | `pnpm --filter backend build` |
| Lint | `pnpm --filter backend lint` |
| Format | `pnpm --filter backend format` |
| Run all unit tests | `pnpm --filter backend test` |
| Run tests in watch mode | `pnpm --filter backend test:watch` |
| Run coverage | `pnpm --filter backend test:cov` |
| Run e2e tests | `pnpm --filter backend test:e2e` |
| Debug tests | `pnpm --filter backend test:debug` |
| Run a single Jest spec | `pnpm --filter backend test -- app.controller.spec.ts` |
| Run a single e2e spec | `pnpm --filter backend test:e2e -- app.e2e-spec.ts` |

## Architecture

### Frontend

The frontend is a small Vite application with a single React root:

- `frontend/src/main.tsx` mounts `App` in `StrictMode`
- `frontend/src/App.tsx` holds the entire current UI
- `frontend/src/App.css` and `frontend/src/index.css` contain all styling
- `frontend/public/` contains static assets served directly by Vite
- `frontend/src/assets/` contains assets imported through the bundler

Notable implementation details:

- Vite is configured with both `@vitejs/plugin-react` and the Babel React Compiler preset in `frontend/vite.config.ts`
- TypeScript uses bundler-style resolution and `noEmit`; production output comes from Vite, not `tsc` artifacts
- There is no routing, shared state layer, API client, or test setup yet; changes to UI behavior will likely start in `App.tsx`

### Backend

The backend follows the standard NestJS bootstrap pattern:

- `backend/src/main.ts` creates the Nest app from `AppModule` and listens on `process.env.PORT ?? 3000`
- `backend/src/app.module.ts` is the root module and currently wires a single controller/service pair
- `backend/src/app.controller.ts` exposes `GET /`
- `backend/src/app.service.ts` provides the response used by the controller

Testing is split by scope:

- `backend/src/*.spec.ts` for unit tests using the app source as Jest `rootDir`
- `backend/test/*.e2e-spec.ts` for end-to-end tests booting a real Nest application with Supertest

Important constraints from current config:

- The Nest CLI uses `src` as `sourceRoot` and clears `dist/` on build
- The backend TypeScript config uses decorators/metadata and NodeNext module resolution
- Backend linting currently runs ESLint with `--fix`, so it may modify files

## Working assumptions for future changes

- Treat `frontend/` and `backend/` as separate runnable apps inside the same pnpm workspace
- If a task mentions “the app” without clarification, verify whether it refers to the React frontend or the Nest backend
- For frontend changes, validate behavior in a browser with the Vite dev server; for backend changes, prefer unit or e2e coverage depending on whether HTTP behavior changed
