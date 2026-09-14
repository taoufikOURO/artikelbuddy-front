import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AttemptResult, RushSummary, RushWords } from '../../core/models/rush.model';
import { LearningService } from '../../core/services/learning.service';

@Component({
  selector: 'app-rush',
  imports: [RouterLink],
  templateUrl: './rush.html',
  styleUrl: './rush.css',
})
export class Rush {
  private readonly learning = inject(LearningService);
  readonly game = signal<RushWords | null>(null);
  readonly summary = signal<RushSummary | null>(null);
  readonly currentIndex = signal(0);
  readonly selected = signal<string | null>(null);
  readonly result = signal<AttemptResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly articles = ['der', 'die', 'das'];
  start(): void {
    this.loading.set(true);
    this.error.set(null);
    this.summary.set(null);
    this.learning.startRush().subscribe({
      next: (game) => {
        this.game.set(game);
        this.currentIndex.set(0);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.detail ?? 'Impossible de démarrer un rush.');
        this.loading.set(false);
      },
    });
  }
  answer(article: string): void {
    const game = this.game();
    const word = game?.words[this.currentIndex()];
    if (!game || !word || this.result()) return;
    this.selected.set(article);
    this.loading.set(true);
    this.learning
      .answerRush({ rush_id: game.rush_id, word_id: word.id, proposed_article: article })
      .subscribe({
        next: (result) => {
          this.result.set(result);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.detail ?? 'Réponse impossible.');
          this.loading.set(false);
        },
      });
  }
  next(): void {
    const game = this.game();
    if (!game) return;
    if (this.currentIndex() >= game.words.length - 1) {
      this.loading.set(true);
      this.learning.finishRush(game.rush_id).subscribe({
        next: (summary) => {
          this.summary.set(summary);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.detail ?? 'Impossible de terminer le rush.');
          this.loading.set(false);
        },
      });
      return;
    }
    this.currentIndex.update((i) => i + 1);
    this.selected.set(null);
    this.result.set(null);
  }
  get currentWord() {
    return this.game()?.words[this.currentIndex()];
  }
}
