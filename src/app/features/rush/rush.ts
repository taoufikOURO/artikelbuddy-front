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
  private audioContext: AudioContext | null = null;
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
          this.playAnswerSound(result.is_correct);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.detail ?? 'Réponse impossible.');
          this.loading.set(false);
        },
      });
  }
  private playAnswerSound(isCorrect: boolean): void {
    const audioContext = (this.audioContext ??= new AudioContext());
    const notes = isCorrect ? [523.25, 659.25, 783.99] : [220, 174.61];
    const noteLength = isCorrect ? 0.13 : 0.18;
    const gap = isCorrect ? 0.075 : 0.03;
    const volume = isCorrect ? 0.11 : 0.09;
    const start = audioContext.currentTime;

    void audioContext.resume();
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const noteStart = start + index * (noteLength + gap);
      const noteEnd = noteStart + noteLength;

      oscillator.type = isCorrect ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(volume, noteStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.01);
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
