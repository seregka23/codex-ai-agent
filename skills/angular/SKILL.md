---
name: angular
description: Специалист по Angular 17+ и Angular Material. Используй для создания компонентов, сервисов, форм, таблиц, диалогов и роутинга. Триггеры: "создай компонент", "добавь страницу", "Angular форма", "mat-table", "frontend UI", "lazy route".
---

# Angular Specialist

Отвечаю только за `frontend/src/`.

## Инициализация нового проекта

Если `frontend/` не существует:

```bash
npm install -g @angular/cli

ng new frontend \
  --routing=true \
  --style=scss \
  --ssr=false \
  --skip-git \
  --package-manager=npm

cd frontend
ng add @angular/material
# Выбрать: тему, типографика: Yes, анимации: Yes
```

### Настройка после инициализации

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ],
};
```

## Генерация через CLI (всегда)
```bash
ng g c features/users/users-list
ng g c features/users/user-form
ng g s features/users/services/users
ng g guard core/guards/auth
ng g interceptor core/interceptors/auth
```

## Читаю перед работой
- `frontend/src/app/core/` — существующие сервисы, interceptors
- `frontend/src/app/shared/` — переиспользуемые компоненты
- `frontend/src/app/app.routes.ts` — текущий роутинг
- `frontend/src/environments/` — переменные окружения

## Структура фичи
```
frontend/src/app/features/<feature>/
├── <feature>.routes.ts
├── <feature>-list/
│   ├── <feature>-list.component.ts
│   └── <feature>-list.component.html
├── <feature>-form/
│   ├── <feature>-form.component.ts
│   └── <feature>-form.component.html
└── services/
    └── <feature>.service.ts
```

## Никогда не трогаю
- `backend/`
- `frontend/src/app/core/auth/` — без явного запроса

## Паттерны

### Standalone компонент
```typescript
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  private destroyRef = inject(DestroyRef);
  private usersService = inject(UsersService);

  users = signal<User[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.isLoading.set(true);
    this.usersService.getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe(users => this.users.set(users));
  }
}
```

### HTTP сервис
```typescript
@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, dto);
  }
  updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, dto);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Lazy route
```typescript
// app.routes.ts
{
  path: 'users',
  loadChildren: () =>
    import('./features/users/users.routes').then(m => m.USERS_ROUTES),
}
```

## Правила
- `OnPush` — для всех компонентов
- `takeUntilDestroyed(this.destroyRef)` — для всех подписок
- `signal()` вместо `BehaviorSubject`
- Angular Material вместо кастомного CSS
- `standalone: true` — без NgModule
- Нет прямых мутаций: `users.update(list => [...list, newUser])`

## После завершения
- UI: http://localhost:4200
