import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClaimFormComponent } from '../../features/claims/claim-form.component';
import { ClaimsReviewTableComponent } from '../../features/claims/claims-review-table.component';
import { DashboardMetricsComponent } from '../../features/dashboard/dashboard-metrics.component';
import { DatasetFormComponent } from '../../features/datasets/dataset-form.component';
import { TopSourcesTableComponent } from '../../features/sources/top-sources-table.component';
import { ClaimItem, DashboardMetric, SourceRow } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    DashboardMetricsComponent,
    ClaimsReviewTableComponent,
    TopSourcesTableComponent,
    ClaimFormComponent,
    DatasetFormComponent,
  ],
  template: `
    <main class="layout">
      <header class="hero">
        <h1>F1 Intelligence Platform</h1>
        <p>MVP UI: claims tracking, source reliability, deferred verification, and dataset prep.</p>
      </header>

      <app-dashboard-metrics [metrics]="metrics" />

      <section class="panel grid-2">
        <app-claims-review-table [claims]="dueClaims" />
        <app-top-sources-table [sources]="topSources" />
      </section>

      <section class="panel grid-2">
        <app-claim-form />
        <app-dataset-form />
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        color: #e6eaf0;
        background: #0f172a;
        min-height: 100dvh;
        display: block;
      }
      .layout { max-width: 1200px; margin: 0 auto; padding: 24px; }
      .hero { margin-bottom: 20px; }
      .hero h1 { margin: 0 0 8px; }
      .hero p { color: #b9c1cd; }
      .panel { background: #111c34; border: 1px solid #24314f; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
      .grid-2 { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }

      table { width: 100%; border-collapse: collapse; }
      th, td { border-bottom: 1px solid #223150; padding: 8px; text-align: left; font-size: 13px; }
      .badge { text-transform: uppercase; font-size: 11px; border-radius: 999px; padding: 2px 8px; }
      .badge--watching { background: #374151; }
      .badge--confirmed { background: #166534; }
      .badge--refuted { background: #991b1b; }
      .badge--partially_confirmed { background: #92400e; }

      .metrics { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
      .metric { background: #0b1428; border: 1px solid #1f2d4a; border-radius: 10px; padding: 12px; }
      .metric__label { color: #9cadc8; font-size: 12px; }
      .metric__value { font-size: 24px; font-weight: 700; margin: 8px 0; }
      .metric__hint { color: #9cadc8; font-size: 12px; }

      .stack { display: grid; gap: 10px; }
      input, select, button { width: 100%; border-radius: 8px; border: 1px solid #29406b; background: #0b1428; color: #e6eaf0; padding: 10px; }
      button { cursor: pointer; background: #1d4ed8; border-color: #1d4ed8; }
      label { display: grid; gap: 6px; font-size: 13px; }
    `,
  ],
})
export class AppShellComponent {
  protected readonly metrics: DashboardMetric[] = [
    { label: 'Total claims', value: '148', hint: 'all imported + manual' },
    { label: 'Unresolved claims', value: '61', hint: 'watching / unconfirmed' },
    { label: 'Due for review', value: '12', hint: 'next 7 days' },
    { label: 'Confirmed this month', value: '9', hint: 'resolved by evidence' },
    { label: 'Refuted this month', value: '5', hint: 'contradicted by official sources' },
  ];

  protected readonly dueClaims: ClaimItem[] = [
    { text: 'Team A uses an illegal flexible rear wing', type: 'technical_illegality', status: 'watching', source: 'Insider X', nextReviewAt: '2026-05-21' },
    { text: 'Driver X to Mercedes in 2027', type: 'driver_market', status: 'partially_confirmed', source: 'Journalist Y', nextReviewAt: '2026-06-01' },
  ];

  protected readonly topSources: SourceRow[] = [
    { name: 'Formula1.com', category: 'official_f1', overallScore: 93, technicalIllegalityScore: 88 },
    { name: 'Insider X', category: 'insider', overallScore: 68, technicalIllegalityScore: 44 },
    { name: 'Journalist Y', category: 'journalist', overallScore: 74, technicalIllegalityScore: 62 },
  ];
}
