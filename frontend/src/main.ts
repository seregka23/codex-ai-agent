import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<h1>Frontend initialized</h1>'
})
class AppComponent {}

void bootstrapApplication(AppComponent);
