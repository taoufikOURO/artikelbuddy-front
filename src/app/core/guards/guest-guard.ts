import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Bloque l'accès aux routes réservées aux utilisateurs déconnectés
 * (login, register). Si /users/me réussit, l'utilisateur a déjà une
 * session valide et est redirigé vers le dashboard.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.fetchCurrentUser().pipe(
    map(() => {
      router.navigate(['/dashboard']);
      return false;
    }),
    catchError(() => of(true)),
  );
};
