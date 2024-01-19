import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, mergeMap, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.getUser().pipe(
    mergeMap((user) => {
      if (user?.loggedIn) {
        if (user.role == 'admin') {
          return of(true);
        } else {
          return of(router.createUrlTree(['/']));
        }
      } else {
        return authService.getUserData().pipe(
          mergeMap((res) => {
            authService.setUser({ ...res.user, loggedIn: true });
            if (res.user.role == 'admin') {
              return of(true);
            } else {
              return of(router.createUrlTree(['/']));
            }
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
