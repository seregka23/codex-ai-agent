# AGENTS.md — Frontend (Angular + Angular Material)

Этот файл дополняет корневой AGENTS.md правилами специфичными для frontend.

## Правила для frontend/

- Используй `$angular` скилл для работы с `src/`
- Всегда используй Angular CLI для генерации компонентов и сервисов
- После `ng add @angular/material` не трогай `angular.json` вручную
- Запускай тесты: `npm run test` после изменений
- Запускай линтер: `npm run lint` перед коммитом

## Переменные окружения

Все URL только через `environment`:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

## Команды разработки
```bash
ng serve                          # запуск dev сервера
ng build --configuration=production  # production сборка
npm run test                      # unit тесты
npm run lint                      # линтер
ng generate component <path>      # новый компонент
ng generate service <path>        # новый сервис
```
