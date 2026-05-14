import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface RagAskRequest {
  question: string;
  filters?: {
    claimTypes?: string[];
    teams?: string[];
    drivers?: string[];
    season?: number;
  };
}

interface RagAskResponse {
  answer: string;
  confidence: 'low' | 'medium' | 'high';
}

@Injectable({ providedIn: 'root' })
export class RagApiService {
  private readonly baseUrl = `${environment.apiUrl}/rag`;

  public constructor(private readonly http: HttpClient) {}

  public ask(request: RagAskRequest): Observable<RagAskResponse> {
    return this.http.post<RagAskResponse>(`${this.baseUrl}/ask`, request);
  }
}
