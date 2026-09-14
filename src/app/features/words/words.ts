import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WordListResponse } from '../../core/models/word.model';
import { LearningService } from '../../core/services/learning.service';

@Component({
  selector: 'app-words',
  imports: [FormsModule],
  templateUrl: './words.html',
  styleUrl: './words.css',
})
export class Words {
  private readonly learning = inject(LearningService);
  readonly data = signal<WordListResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  readonly statuses = [
    { value: 'all', label: 'Tous les mots' },
    { value: 'not_started', label: 'À découvrir' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'mastered', label: 'Maîtrisés' },
  ];
  level = 'A1';
  status = 'all';
  constructor() {
    this.load();
  }
  load(): void {
    this.loading.set(true);
    this.learning.getWords(this.level, this.status, this.page()).subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.detail ?? 'La bibliothèque est momentanément indisponible.');
        this.loading.set(false);
      },
    });
  }
  filter(): void {
    this.page.set(1);
    this.load();
  }
  changePage(delta: number): void {
    const totalPages = Math.ceil((this.data()?.total ?? 0) / (this.data()?.page_size ?? 20));
    const next = this.page() + delta;
    if (next >= 1 && next <= totalPages) {
      this.page.set(next);
      this.load();
    }
  }
  totalPages(): number {
    return Math.max(1, Math.ceil((this.data()?.total ?? 0) / (this.data()?.page_size ?? 20)));
  }
  progressWidth(streak: number): number {
    return Math.min(streak * 33.33, 100);
  }
}
