import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly email = signal(this.route.snapshot.queryParamMap.get('email') ?? '');
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly form = this.fb.nonNullable.group({
    email: [this.email(), [Validators.required, Validators.email]],
    otp_code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    new_password_confirmation: ['', Validators.required],
  });
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.submitting.set(true);
    const { email, otp_code, new_password, new_password_confirmation } = this.form.getRawValue();
    this.email.set(email);

    this.auth
      .resetPassword({ email, otp_code, new_password, new_password_confirmation })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (e) => {
          this.error.set(this.getErrorMessage(e));
          this.submitting.set(false);
        },
      });
  }

  private getErrorMessage(error: {
    error?: { detail?: string | Array<{ msg?: string }> };
  }): string {
    const detail = error.error?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((item) => item.msg)
        .filter(Boolean)
        .join(' ');
    }
    return 'Le code est invalide ou expiré.';
  }
}
