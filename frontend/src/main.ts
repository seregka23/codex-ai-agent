import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppShellComponent } from './app/shared/components/app-shell.component';

void bootstrapApplication(AppShellComponent, {
  providers: [provideHttpClient()],
});
