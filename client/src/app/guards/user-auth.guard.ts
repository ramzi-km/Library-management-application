import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.getUser().pipe(
    mergeMap((user) => {
      if (user?.loggedIn) {
        if ((user.role == 'user')) {
          return of(true);
        } else {
          return of(router.createUrlTree(['/admin']));
        }
      } else {
        return authService.getUserData().pipe(
          mergeMap((res) => {
            authService.setUser({ ...res.user, loggedIn: true });
            if ((res.user.role == 'user')) {
              return of(true);
            } else {
              return of(router.createUrlTree(['/admin']));
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
