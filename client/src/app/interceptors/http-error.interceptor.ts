import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorEventService } from '../services/error-event.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorEventService: ErrorEventService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    //Modifying requests

    let modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string = error.error.message;
        if (error.status === 401) {
        } else if (error.status === 403 || error.status === 404) {
          console.log(errorMessage);
        } else {
          this.errorEventService.triggerError(errorMessage);
        }
        return throwError(errorMessage);
      }),
    );
  }
}
