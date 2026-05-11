# AGENTS.md — Project Instructions

## Стек проекта
- **Backend:** NestJS (TypeScript strict) + Prisma ORM + PostgreSQL
- **Frontend:** Angular 17+ (standalone components) + Angular Material
- **Infrastructure:** Docker + docker-compose + nginx
- **Tests:** Jest (backend), Jasmine/Jest (frontend)

---

## Структура проекта
```
project/
├── backend/
│   ├── src/
│   │   ├── modules/        # Один модуль = одна бизнес-фича
│   │   ├── common/         # Guards, Pipes, Interceptors, Decorators
│   │   └── config/         # ConfigModule, env validation
│   └── prisma/
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.ts
├── frontend/
│   └── src/app/
│       ├── core/           # Singleton сервисы, guards, interceptors
│       ├── shared/         # Переиспользуемые компоненты и pipes
│       └── features/       # Фичи с lazy loading
└── docker/
    ├── docker-compose.yml
    ├── docker-compose.prod.yml
    └── nginx/
```

---

## Общие правила

### TypeScript
- Всегда `strict` mode — никаких `any`
- Явные типы возвращаемых значений у публичных методов
- `interface` для объектов, `type` для union/intersection

### Именование файлов
- Файлы: `kebab-case` → `users.service.ts`, `create-user.dto.ts`
- Классы/интерфейсы: `PascalCase` → `UsersService`, `CreateUserDto`
- Переменные/функции: `camelCase` → `findAllUsers()`
- Константы: `UPPER_SNAKE_CASE` → `MAX_RETRY_COUNT`

### Безопасность
- Никаких секретов в коде — только через переменные окружения
- Все входящие данные валидировать обязательно
- Все HTTP эндпоинты требуют авторизации по умолчанию
- Пароли только через bcrypt, никогда не возвращать в ответе

### Качество кода
- Нет `console.log` в production — только `Logger` (NestJS)
- Нет пустых `catch` блоков
- Нет закомментированного кода в коммитах
- Запускай `npm run lint` перед коммитом

### Git коммиты
Формат: `тип(scope): описание`
Типы: `feat` `fix` `refactor` `test` `docs` `chore` `style`
Пример: `feat(users): добавить эндпоинт создания пользователя`

---

## Границы доменов

| Агент (skill) | Пишет | Только читает |
|---|---|---|
| **$prisma** | `backend/prisma/**` | `backend/src/modules/` |
| **$nestjs** | `backend/src/**` | `backend/prisma/schema.prisma` |
| **$angular** | `frontend/src/**` | `frontend/src/environments/` |
| **$docker** | `docker/**`, `Dockerfile`, `docker-compose*` | `backend/src/`, `frontend/src/` |
| **$reviewer** | ничего не пишет | всё |

---

## Порядок работы при новой фиче

```
1. $prisma   → схема + миграция      (если нужна БД)
2. $nestjs   → API + бизнес-логика
3. $angular  → UI компоненты         (можно параллельно с $nestjs)
4. $docker   → инфраструктура        (если нужны изменения)
5. $reviewer → финальная проверка
```

> **$prisma всегда первый** — остальные зависят от схемы.

---

## Subagents

Для параллельного выполнения используй subagents:
```
Используй subagents для параллельного запуска $nestjs и $angular
если их задачи не зависят друг от друга.
```

Для code review:
```
/review — запустить code review через отдельный агент
```
