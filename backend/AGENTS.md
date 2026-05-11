# AGENTS.md — Backend (NestJS + Prisma)

Этот файл дополняет корневой AGENTS.md правилами специфичными для backend.

## Правила для backend/

- Используй `$nestjs` скилл для работы с `src/`
- Используй `$prisma` скилл для работы с `prisma/`
- После изменения schema.prisma — всегда `npx prisma generate`
- Запускай тесты: `npm run test` после изменений в `src/`
- Запускай линтер: `npm run lint` перед коммитом

## Переменные окружения

Все конфиги через `@nestjs/config`. Пример `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp
JWT_SECRET=your-secret
PORT=3000
```

## Команды разработки
```bash
npm run start:dev     # запуск в dev режиме
npm run test          # unit тесты
npm run test:e2e      # e2e тесты
npm run lint          # линтер
npx prisma studio     # просмотр БД
```
