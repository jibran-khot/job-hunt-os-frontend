import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
    BehaviorSubject,
    Observable,
    catchError,
    finalize,
    map,
    of,
    tap,
    throwError,
} from 'rxjs';


import { TokenService } from './token.service';
import { StorageService } from '../../services/storage.service';
import { LoaderService } from '../../services/loader.service';

import { LoginDto } from '../../../features/auth/dto/login.dto';

import { UserModel } from '../../../features/auth/models/user.model';
import { AuthResponse } from '../../../features/auth/interfaces/auth-response.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly authApiService = inject(AuthApiService);
    private readonly tokenService = inject(TokenService);
    private readonly storageService = inject(StorageService);
    private readonly loaderService = inject(LoaderService);
    private readonly router = inject(Router);

    private readonly authStateSubject =
        new BehaviorSubject<boolean>(false);

    private readonly currentUserSubject =
        new BehaviorSubject<UserModel | null>(null);

    public readonly authState$ =
        this.authStateSubject.asObservable();

    public readonly currentUser$ =
        this.currentUserSubject.asObservable();

    public login(payload: LoginDto): Observable<UserModel> {
        this.loaderService.show();

        return this.authApiService.login(payload).pipe(
            tap((response: AuthResponse) => {
                this.setAuthState(response);
            }),
            map((response: AuthResponse) => response.user),
            catchError((error: unknown) => {
                this.clearSession();

                return throwError(() => error);
            }),
            finalize(() => {
                this.loaderService.hide();
            }),
        );
    }

    public logout(redirectToLogin: boolean = true): void {
        this.clearSession();

        if (redirectToLogin) {
            void this.router.navigate(['/login']);
        }
    }

    public refreshUser(): Observable<UserModel | null> {
        const token: string | null = this.tokenService.getToken();

        if (!token || this.tokenService.isTokenExpired(token)) {
            this.clearSession();

            return of(null);
        }

        return this.authApiService.refreshToken().pipe(
            tap((response: AuthResponse) => {
                this.setAuthState(response);
            }),
            map((response: AuthResponse) => response.user),
            catchError(() => {
                this.clearSession();

                return of(null);
            }),
        );
    }

    public isAuthenticated(): Observable<boolean> {
        return this.authState$.pipe(
            map((isAuthenticated: boolean) => {
                const token: string | null =
                    this.tokenService.getToken();

                return !!token &&
                    !this.tokenService.isTokenExpired(token) &&
                    isAuthenticated;
            }),
        );
    }

    public getCurrentUser(): Observable<UserModel | null> {
        return this.currentUser$;
    }

    public setAuthState(response: AuthResponse): void {
        this.tokenService.setToken(response.accessToken);

        this.storageService.setItem<UserModel>(
            'current-user',
            response.user,
        );

        this.currentUserSubject.next(response.user);
        this.authStateSubject.next(true);
    }

    public restoreSession(): Observable<boolean> {
        const token: string | null = this.tokenService.getToken();

        if (!token || this.tokenService.isTokenExpired(token)) {
            this.clearSession();

            return of(false);
        }

        const storedUser =
            this.storageService.getItem<UserModel>('current-user');

        if (!storedUser) {
            return this.refreshUser().pipe(
                map((user: UserModel | null) => !!user),
            );
        }

        this.currentUserSubject.next(storedUser);
        this.authStateSubject.next(true);

        return of(true);
    }

    private clearSession(): void {
        this.tokenService.removeToken();

        this.storageService.removeItem('current-user');

        this.currentUserSubject.next(null);
        this.authStateSubject.next(false);
    }
}