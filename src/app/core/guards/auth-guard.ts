import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Bloque l'accès aux routes réservées aux utilisateurs connectés.
 * Vérifie la session auprès de l'API (via /users/me) plutôt que de se
 * fier uniquement au signal currentUser, qui peut être vide après un
 * rechargement de page tant qu'on n'a pas encore revalidé la session.
 */

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.fetchCurrentUser().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    }),
  );
};
