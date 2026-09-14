import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { VerifyOtp } from './features/auth/verify-otp/verify-otp';
import { Dashboard } from './features/dashboard/dashboard';
import { Landing } from './features/landing/landing';
import { Rush } from './features/rush/rush';
import { Words } from './features/words/words';
import { AppShell } from './shared/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    pathMatch: 'full',
  },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: 'verify-otp',
    component: VerifyOtp,
  },
  { path: 'forgot-password', component: ForgotPassword, canActivate: [guestGuard] },
  { path: 'reset-password', component: ResetPassword, canActivate: [guestGuard] },
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'rush', component: Rush },
      { path: 'words', component: Words },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
