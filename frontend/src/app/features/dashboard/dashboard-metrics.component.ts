import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardMetric } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-dashboard-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel">
      <h2>Dashboard</h2>
      <div class="metrics">
        <article class="metric" *ngFor="let metric of metrics">
          <div class="metric__label">{{ metric.label }}</div>
          <div class="metric__value">{{ metric.value }}</div>
          <div class="metric__hint">{{ metric.hint }}</div>
        </article>
      </div>
    </section>
  `,
})
export class DashboardMetricsComponent {
  @Input({ required: true }) public metrics: DashboardMetric[] = [];
}
