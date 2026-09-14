import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-verify-otp',
  styleUrl: './verify-otp.css',
  templateUrl: './verify-otp.html',
})
export class VerifyOtp {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isSubmitting = signal(false);
  isResending = signal(false);

  email = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    otp_code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  constructor() {
    const email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.email.set(email);
    this.form.controls.email.setValue(email);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);
    const { email, otp_code } = this.form.getRawValue();
    this.email.set(email);

    this.authService.verifyOtp({ email, otp_code }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail ?? "Une erreur s'est produite.");
        this.isSubmitting.set(false);
      },
    });
  }

  onResend(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    if (this.form.controls.email.invalid) {
      this.form.controls.email.markAsTouched();
      return;
    }

    this.isResending.set(true);
    this.email.set(this.form.controls.email.value);

    this.authService.resendOtp(this.email()).subscribe({
      next: () => {
        this.successMessage.set('Un nouveau code a été envoyé.');
        this.isResending.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail ?? "Une erreur s'est produite.");
        this.isResending.set(false);
      },
    });
  }
}
