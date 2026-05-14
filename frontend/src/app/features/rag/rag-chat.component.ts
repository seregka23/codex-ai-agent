import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RagApiService } from '../../core/api/rag-api.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-rag-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel">
      <h2>RAG Assistant (MVP)</h2>
      <p class="hint">Отделяй факты от слухов: статус claim и evidence обязательны в ответе.</p>

      <div class="chat-window">
        <article *ngFor="let message of messages" class="bubble" [class.bubble--assistant]="message.role === 'assistant'">
          <strong>{{ message.role === 'user' ? 'You' : 'Assistant' }}</strong>
          <p>{{ message.text }}</p>
        </article>
      </div>

      <form class="chat-form" (submit)="ask()">
        <input
          type="text"
          name="question"
          [(ngModel)]="question"
          [disabled]="loading"
          placeholder="Например: Можно ли верить слуху про гибкое крыло Team A?"
        />
        <button type="submit" [disabled]="loading">{{ loading ? 'Asking…' : 'Ask' }}</button>
      </form>
    </section>
  `,
})
export class RagChatComponent {
  protected question = '';
  protected loading = false;
  protected messages: ChatMessage[] = [
    {
      role: 'assistant',
      text: 'Готов помочь. Я отмечаю статус claim и не выдаю неподтверждённые слухи за факты.',
    },
  ];

  public constructor(private readonly ragApiService: RagApiService) {}

  protected async ask(): Promise<void> {
    const value = this.question.trim();
    if (!value || this.loading) return;

    this.messages.push({ role: 'user', text: value });
    this.question = '';
    this.loading = true;

    try {
      const response = await firstValueFrom(
        this.ragApiService.ask({
          question: value,
          filters: { claimTypes: ['technical_illegality', 'driver_market'] },
        }),
      );

      this.messages.push({
        role: 'assistant',
        text: `${response.answer} (confidence: ${response.confidence})`,
      });
    } catch {
      this.messages.push({
        role: 'assistant',
        text: 'Ошибка запроса к RAG API. Проверьте backend (`POST /rag/ask`) и CORS настройки.',
      });
    } finally {
      this.loading = false;
    }
  }
}
