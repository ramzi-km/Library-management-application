import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, mergeMap, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const profileGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.getUser().pipe(
    mergeMap((user) => {
      if (user?.loggedIn) {
        return of(true);
      } else {
        return authService.getUserData().pipe(
          mergeMap((res) => {
            authService.setUser({ ...res.user, loggedIn: true });

            return of(true);
          }),
          catchError((errMessage) => {
            console.error('Error in userAuthGuard:', errMessage);
            return of(router.createUrlTree(['/login']));
          }),
        );
      }
    }),
    catchError((error) => {
      // errors from getUser()
      console.error('Error in userAuthGuard:', error);
      return of(router.createUrlTree(['/login']));
    }),
  );
};
