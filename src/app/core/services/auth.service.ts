import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ForgotPasswordRequest,
  OTPValidate,
  ResetPasswordRequest,
  UserCreate,
  UserLogin,
  UserOut,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<UserOut | null>(null);

  register(data: UserCreate): Observable<UserOut> {
    return this.http.post<UserOut>(`${this.baseUrl}/register`, data, {
      withCredentials: true,
    });
  }

  verifyOtp(data: OTPValidate): Observable<UserOut> {
    return this.http.post<UserOut>(`${this.baseUrl}/verify-otp`, data, {
      withCredentials: true,
    });
  }

  resendOtp(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/resend-otp`,
      { email },
      { withCredentials: true },
    );
  }

  login(data: UserLogin): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/login`, data, {
        withCredentials: true,
      })
      .pipe(tap(() => this.fetchCurrentUser().subscribe()));
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.currentUser.set(null)));
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, data, {
      withCredentials: true,
    });
  }

  resetPassword(data: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/reset-password`, data, {
      withCredentials: true,
    });
  }

  fetchCurrentUser(): Observable<UserOut> {
    return this.http
      .get<UserOut>(`${environment.apiUrl}/users/me`, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }
}
