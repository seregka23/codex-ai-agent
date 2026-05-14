import { Component } from '@angular/core';

@Component({
  selector: 'app-claim-form',
  standalone: true,
  template: `
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
  `,
})
export class ClaimFormComponent {}
