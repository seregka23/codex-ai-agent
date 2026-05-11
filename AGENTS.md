# AGENTS.md — Project Instructions

## Stack
- Backend: NestJS + TypeScript strict + Prisma ORM + PostgreSQL
- Frontend: Angular 17+ standalone components + Angular Material
- Infrastructure: Docker + docker-compose + nginx
- Tests: Jest for backend; project-standard Angular tests for frontend

## How Codex should read this setup

This repository uses two different mechanisms:

1. **Project instructions**: `AGENTS.md` files.
   - Root `AGENTS.md` contains global project rules.
   - `backend/AGENTS.md` adds backend-specific rules.
   - `frontend/AGENTS.md` adds frontend-specific rules.

2. **Reusable skills**: `.agents/skills/*/SKILL.md`.
   - Mention them as `$prisma`, `$nestjs`, `$angular`, `$docker`, `$reviewer`, `$orchestrator`.
   - Skills are workflows/instructions, not separate subagent identities.

3. **Custom subagents**: `.codex/agents/*.toml`.
   - Use these names when asking Codex to spawn subagents:
     - `prisma_agent`
     - `nestjs_agent`
     - `angular_agent`
     - `docker_agent`
     - `code_reviewer`

Do not confuse skill names with custom agent names:
- `$nestjs` = skill/workflow
- `nestjs_agent` = custom subagent role

## Project structure

```text
project/
├── backend/
│   ├── src/
│   │   ├── modules/        # one module = one business feature
│   │   ├── common/         # guards, pipes, interceptors, decorators
│   │   └── config/         # ConfigModule, env validation
│   └── prisma/
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.ts
├── frontend/
│   └── src/app/
│       ├── core/           # singleton services, guards, interceptors
│       ├── shared/         # reusable components and pipes
│       └── features/       # lazy-loaded features
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
├── .agents/skills/         # Codex skills
└── .codex/agents/          # Codex custom subagents
```

## General rules

### TypeScript
- Use strict TypeScript.
- Avoid `any`; if unavoidable, explain why.
- Use explicit return types for public methods.
- Use `interface` for object shapes and `type` for union/intersection types.

### Naming
- Files: `kebab-case`, for example `users.service.ts`, `create-user.dto.ts`.
- Classes/interfaces: `PascalCase`, for example `UsersService`, `CreateUserDto`.
- Variables/functions: `camelCase`, for example `findAllUsers()`.
- Constants: `UPPER_SNAKE_CASE`, for example `MAX_RETRY_COUNT`.

### Security
- Do not commit secrets; use environment variables.
- Validate all external input.
- HTTP endpoints require authorization by default unless explicitly marked public.
- Passwords must be hashed and never returned in responses.

### Code quality
- Use NestJS `Logger`, not `console.log`, in production code.
- No empty `catch` blocks.
- No commented-out code in final changes.
- Prefer small, focused changes.

## Domain boundaries

| Role | Writes | Reads |
|---|---|---|
| `prisma_agent` / `$prisma` | `backend/prisma/**` | `backend/src/modules/**` |
| `nestjs_agent` / `$nestjs` | `backend/src/**` | `backend/prisma/schema.prisma` |
| `angular_agent` / `$angular` | `frontend/src/**` | frontend config and API contracts |
| `docker_agent` / `$docker` | `docker/**`, Dockerfiles, compose/env examples | backend/frontend package and build files |
| `code_reviewer` / `$reviewer` | nothing | everything |

## Feature workflow

For a feature touching multiple domains:

1. Ask `prisma_agent` to inspect or update schema/migrations when DB changes are needed.
2. Ask `nestjs_agent` to implement API and backend logic.
3. Ask `angular_agent` to implement UI; it can run in parallel with backend only when the API contract is already clear.
4. Ask `docker_agent` only when infrastructure/startup changes are needed.
5. Ask `code_reviewer` to review the final diff.

Example prompt:

```text
Implement the Products feature. Spawn custom subagents:
- prisma_agent: design/update Product schema and migration.
- nestjs_agent: implement ProductsModule CRUD API after Prisma is ready.
- angular_agent: implement Products UI after the API contract is clear.
- code_reviewer: review the final diff.
Wait for all agents and summarize the result.
```


## Subagent policy

For any non-trivial implementation task, Codex must use subagents when the task touches more than one area of the project.

Use these custom subagents:

- `prisma_agent` for database schema, migrations, relations, indexes, seeds, and query risks.
- `nestjs_agent` for backend modules, controllers, services, DTOs, validation, and business logic.
- `angular_agent` for Angular components, Angular Material UI, forms, routing, services, and accessibility.
- `docker_agent` for Dockerfile, docker-compose, devcontainer, environment variables, volumes, ports, and local setup.
- `code_reviewer` for final review of correctness, security, regression risks, and missing tests.

When the task is complex, Codex should:
1. First create a short implementation plan.
2. Spawn the relevant subagents.
3. Wait for all subagents to finish.
4. Merge their findings into one final implementation.
5. Ask `code_reviewer` to review the final diff before the final response.

Do not use subagents for very small single-file changes, typo fixes, simple renames, or trivial documentation edits.