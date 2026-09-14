import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly form = this.fb.nonNullable.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.submitting.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => {
        const detail = error.error?.detail ?? 'Impossible de vous connecter.';
        this.submitting.set(false);

        if (detail === 'Veuillez valider votre adresse email avant de vous connecter.') {
          const identifier = this.form.controls.identifier.value.trim();
          const queryParams = identifier.includes('@') ? { email: identifier } : undefined;
          this.router.navigate(['/verify-otp'], { queryParams });
          return;
        }

        this.error.set(detail);
      },
    });
  }
}
