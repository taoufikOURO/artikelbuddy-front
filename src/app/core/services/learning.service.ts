import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LevelProgress } from '../models/progress.model';
import { AttemptCreate, AttemptResult, RushSummary, RushWords } from '../models/rush.model';
import { WordListResponse } from '../models/word.model';

@Injectable({ providedIn: 'root' })
export class LearningService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getDashboard() {
    return this.http.get<LevelProgress>(`${this.apiUrl}/users/me/dashboard`, {
      withCredentials: true,
    });
  }

  advanceLevel() {
    return this.http.post(`${this.apiUrl}/users/me/advance-level`, {}, { withCredentials: true });
  }

  startRush() {
    return this.http.post<RushWords>(`${this.apiUrl}/rush/start`, {}, { withCredentials: true });
  }

  answerRush(data: AttemptCreate) {
    return this.http.post<AttemptResult>(`${this.apiUrl}/rush/answer`, data, {
      withCredentials: true,
    });
  }

  finishRush(rushId: string) {
    return this.http.post<RushSummary>(
      `${this.apiUrl}/rush/${rushId}/finish`,
      {},
      { withCredentials: true },
    );
  }

  getWords(level: string, status: string, page: number, pageSize = 20) {
    const params = new HttpParams()
      .set('level', level)
      .set('status', status)
      .set('page', page)
      .set('page_size', pageSize);
    return this.http.get<WordListResponse>(`${this.apiUrl}/words`, {
      params,
      withCredentials: true,
    });
  }
}
