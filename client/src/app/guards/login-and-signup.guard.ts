import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, mergeMap, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const loginAndSignupGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.getUser().pipe(
    mergeMap((user) => {
      if (user?.loggedIn) {
        if (user.role == 'admin') {
          return of(router.createUrlTree(['/admin']));
        } else {
          return of(router.createUrlTree(['/']));
        }
      } else {
        return authService.getUserData().pipe(
          mergeMap((res) => {
            authService.setUser({ ...res.user, loggedIn: true });
            if (res.user.role == 'admin') {
              return of(router.createUrlTree(['/admin']));
            } else {
              return of(router.createUrlTree(['/']));
            }
          }),
          catchError((errMessage) => {
            return of(true);
          }),
        );
      }
    }),
    catchError((error) => {
      // errors from getUser()
      return of(router.createUrlTree(['/login']));
    }),
  );
};
