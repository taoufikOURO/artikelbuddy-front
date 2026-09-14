import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Level } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly levels: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  form = this.fb.nonNullable.group({
    pseudo: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
    level: ['A1' as Level, Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/verify-otp'], {
          queryParams: { email: this.form.value.email },
        });
      },
      error: (err) => {
        this.errorMessage.set(err.error?.detail ?? "Une erreur s'est produite.");
        this.isSubmitting.set(false);
      },
    });
  }
}
