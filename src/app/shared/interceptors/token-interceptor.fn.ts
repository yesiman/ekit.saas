import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { JwtAuthService } from '../services/auth/jwt-auth.service';


// INTERCEPTOR ANGULAR 19 - ON PASSE DANS LE HEADER LE TOKEN POUR VALIDATION COTE APIS
export const tokenInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const jwtAuth = inject(JwtAuthService);
  const token = jwtAuth.token || jwtAuth.getJwtToken();

  const changedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(changedReq); // ici next est une fonction HttpHandlerFn
};