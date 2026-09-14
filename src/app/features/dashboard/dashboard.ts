import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LevelProgress } from '../../core/models/progress.model';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly auth = inject(AuthService);
  private readonly learning = inject(LearningService);
  readonly progress = signal<LevelProgress | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly advancing = signal(false);
  constructor() {
    this.load();
  }
  load(): void {
    this.learning.getDashboard().subscribe({
      next: (data) => {
        this.progress.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Le tableau de bord est momentanément indisponible.');
        this.loading.set(false);
      },
    });
  }
  advance(): void {
    this.advancing.set(true);
    this.learning.advanceLevel().subscribe({
      next: (user) => {
        this.auth.currentUser.set(user as any);
        this.advancing.set(false);
        this.load();
      },
      error: (e) => {
        this.error.set(e.error?.detail ?? 'Le niveau ne peut pas encore être validé.');
        this.advancing.set(false);
      },
    });
  }
  percent(value: number): number {
    return Math.round(value * 100);
  }
  formatDate(value: string | null): string {
    return value
      ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(value))
      : '—';
  }
}
