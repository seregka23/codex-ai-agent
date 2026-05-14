import { Component } from '@angular/core';

@Component({
  selector: 'app-dataset-form',
  standalone: true,
  template: `
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
  `,
})
export class DatasetFormComponent {}
