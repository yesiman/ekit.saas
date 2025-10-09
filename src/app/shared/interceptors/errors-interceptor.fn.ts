import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { JwtAuthService } from '../services/auth/jwt-auth.service';

export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
    const jwtAuth = inject(JwtAuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403 || error.status === 401) {
        // Ici tu peux rediriger vers la page de login
        // ou déclencher un refresh token
        jwtAuth.signout();
        console.error('Token invalide ou expiré');
      }
      return throwError(() => error);
    })
  );
};