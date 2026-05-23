import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = (
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated().pipe(
        take(1),
        map((isAuthenticated: boolean) => {
            if (isAuthenticated) {
                return true;
            }

            return router.createUrlTree(
                ['/login'],
                {
                    queryParams: {
                        returnUrl: state.url,
                    },
                },
            );
        }),
    );
};