import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClaimItem } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-claims-review-table',
  standalone: true,
  imports: [CommonModule],
  template: `
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
          <tr *ngFor="let claim of claims">
            <td>{{ claim.text }}</td>
            <td>{{ claim.type }}</td>
            <td><span class="badge" [class]="'badge--' + claim.status">{{ claim.status }}</span></td>
            <td>{{ claim.source }}</td>
            <td>{{ claim.nextReviewAt }}</td>
          </tr>
        </tbody>
      </table>
    </article>
  `,
})
export class ClaimsReviewTableComponent {
  @Input({ required: true }) public claims: ClaimItem[] = [];
}
