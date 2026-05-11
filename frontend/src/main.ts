import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

interface DashboardMetric {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
}

interface ClaimItem {
  readonly text: string;
  readonly type: string;
  readonly status: 'watching' | 'confirmed' | 'refuted' | 'partially_confirmed';
  readonly source: string;
  readonly nextReviewAt: string;
}

interface SourceRow {
  readonly name: string;
  readonly category: string;
  readonly overallScore: number;
  readonly technicalIllegalityScore: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="layout">
      <header class="hero">
        <h1>F1 Intelligence Platform</h1>
        <p>
          MVP UI: claims tracking, source reliability, deferred verification, and dataset prep.
        </p>
      </header>

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

      <section class="panel grid-2">
        <article>
          <h2>Claims due for review</h2>
          <table>
            <thead>
              <tr>
                <th>Claim</th>
                <th>Type</th>
                <th>Status</th>
                <th>Source</th>
                <th>Next review</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of dueClaims">
                <td>{{ claim.text }}</td>
                <td>{{ claim.type }}</td>
                <td><span class="badge" [class]="'badge--' + claim.status">{{ claim.status }}</span></td>
                <td>{{ claim.source }}</td>
                <td>{{ claim.nextReviewAt }}</td>
              </tr>
            </tbody>
          </table>
        </article>

        <article>
          <h2>Top sources</h2>
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Type</th>
                <th>Overall</th>
                <th>Tech illegality</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let source of topSources">
                <td>{{ source.name }}</td>
                <td>{{ source.category }}</td>
                <td>{{ source.overallScore }}%</td>
                <td>{{ source.technicalIllegalityScore }}%</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>

      <section class="panel grid-2">
        <article>
          <h2>Create claim (MVP form preview)</h2>
          <form class="stack" (submit)="$event.preventDefault()">
            <label>
              Claim text
              <input type="text" placeholder="Team A uses an illegal flexible rear wing" />
            </label>
            <label>
              Claim type
              <select>
                <option>technical_illegality</option>
                <option>driver_market</option>
                <option>technical_update</option>
                <option>regulation_change</option>
              </select>
            </label>
            <label>
              Status
              <select>
                <option>watching</option>
                <option>confirmed</option>
                <option>refuted</option>
                <option>partially_confirmed</option>
              </select>
            </label>
            <button type="submit">Save claim</button>
          </form>
        </article>

        <article>
          <h2>Dataset builder (preview)</h2>
          <form class="stack" (submit)="$event.preventDefault()">
            <label>
              Dataset name
              <input type="text" placeholder="f1-claims-rag-eval-2026" />
            </label>
            <label>
              Dataset type
              <select>
                <option>rag_eval</option>
                <option>classification</option>
                <option>extraction</option>
                <option>chat_finetuning</option>
              </select>
            </label>
            <label>
              Export format
              <select>
                <option>OpenAI JSONL</option>
                <option>Generic JSON</option>
                <option>CSV</option>
              </select>
            </label>
            <button type="submit">Prepare export</button>
          </form>
        </article>
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
      .layout {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }
      .hero {
        margin-bottom: 20px;
      }
      .hero h1 {
        margin: 0 0 8px;
      }
      .hero p {
        color: #b9c1cd;
      }
      .panel {
        background: #111c34;
        border: 1px solid #24314f;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
      }
      .metrics {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
      .metric {
        background: #0b1428;
        border: 1px solid #1f2d4a;
        border-radius: 10px;
        padding: 12px;
      }
      .metric__label {
        color: #9cadc8;
        font-size: 12px;
      }
      .metric__value {
        font-size: 24px;
        font-weight: 700;
        margin: 8px 0;
      }
      .metric__hint {
        color: #9cadc8;
        font-size: 12px;
      }
      .grid-2 {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        border-bottom: 1px solid #223150;
        padding: 8px;
        text-align: left;
        font-size: 13px;
      }
      .badge {
        text-transform: uppercase;
        font-size: 11px;
        border-radius: 999px;
        padding: 2px 8px;
      }
      .badge--watching {
        background: #374151;
      }
      .badge--confirmed {
        background: #166534;
      }
      .badge--refuted {
        background: #991b1b;
      }
      .badge--partially_confirmed {
        background: #92400e;
      }
      .stack {
        display: grid;
        gap: 10px;
      }
      input,
      select,
      button {
        width: 100%;
        border-radius: 8px;
        border: 1px solid #29406b;
        background: #0b1428;
        color: #e6eaf0;
        padding: 10px;
      }
      button {
        cursor: pointer;
        background: #1d4ed8;
        border-color: #1d4ed8;
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 13px;
      }
    `,
  ],
})
class AppComponent {
  protected readonly metrics: DashboardMetric[] = [
    { label: 'Total claims', value: '148', hint: 'all imported + manual' },
    { label: 'Unresolved claims', value: '61', hint: 'watching / unconfirmed' },
    { label: 'Due for review', value: '12', hint: 'next 7 days' },
    { label: 'Confirmed this month', value: '9', hint: 'resolved by evidence' },
    { label: 'Refuted this month', value: '5', hint: 'contradicted by official sources' },
  ];

  protected readonly dueClaims: ClaimItem[] = [
    {
      text: 'Team A uses an illegal flexible rear wing',
      type: 'technical_illegality',
      status: 'watching',
      source: 'Insider X',
      nextReviewAt: '2026-05-21',
    },
    {
      text: 'Driver X to Mercedes in 2027',
      type: 'driver_market',
      status: 'partially_confirmed',
      source: 'Journalist Y',
      nextReviewAt: '2026-06-01',
    },
  ];

  protected readonly topSources: SourceRow[] = [
    { name: 'Formula1.com', category: 'official_f1', overallScore: 93, technicalIllegalityScore: 88 },
    { name: 'Insider X', category: 'insider', overallScore: 68, technicalIllegalityScore: 44 },
    { name: 'Journalist Y', category: 'journalist', overallScore: 74, technicalIllegalityScore: 62 },
  ];
}

void bootstrapApplication(AppComponent);
