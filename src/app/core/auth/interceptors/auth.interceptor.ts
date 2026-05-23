import { inject } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
    const tokenService = inject(TokenService);
    const authService = inject(AuthService);

    const token = tokenService.getToken();

    const authenticatedRequest = token
        ? request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        })
        : request;

    return next(authenticatedRequest).pipe(
        catchError((error: unknown) => {
            if (
                error instanceof HttpErrorResponse &&
                error.status === 401
            ) {
                handleUnauthorized(authService);
            }

            return throwError(() => error);
        }),
    );
};

function handleUnauthorized(
    authService: AuthService,
): void {
    authService.logout();
}