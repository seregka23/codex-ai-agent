import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SourceRow } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-top-sources-table',
  standalone: true,
  imports: [CommonModule],
  template: `
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
          <tr *ngFor="let source of sources">
            <td>{{ source.name }}</td>
            <td>{{ source.category }}</td>
            <td>{{ source.overallScore }}%</td>
            <td>{{ source.technicalIllegalityScore }}%</td>
          </tr>
        </tbody>
      </table>
    </article>
  `,
})
export class TopSourcesTableComponent {
  @Input({ required: true }) public sources: SourceRow[] = [];
}
