# codex-ai-agent

## F1 Intelligence implementation progress (step-by-step)

This repository now contains an MVP scaffold aligned with `f1_intelligence_tech_spec.md`:

1. **Core data model (started)**
   - Added Prisma schema for `Source`, `Article`, `Claim`, `Evidence` and core enums.
2. **API foundation (started)**
   - Added initial NestJS CRUD endpoints for `/sources` and `/claims`.
   - Added claim validation for required `claimText` and automatic `legalSensitivity=high` for `technical_illegality`.
3. **Frontend foundation (started)**
   - Replaced placeholder Angular app with F1 Intelligence MVP route map scaffold.
4. **Next steps (pending)**
   - Add Prisma client integration and Postgres persistence.
   - Implement full modules from the spec (articles, evidences, reviews, scores, datasets, rag).
   - Add DTO validation, auth/guards, and timeline/review workflows.
   - Add tests, lint configuration, and Docker production composition.
