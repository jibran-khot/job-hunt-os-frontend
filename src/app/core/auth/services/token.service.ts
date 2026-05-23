import { Injectable, inject } from '@angular/core';

import { StorageService } from '../../services/storage.service';

export interface JwtPayload {
    sub?: string;
    email?: string;
    role?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private static readonly ACCESS_TOKEN_KEY = 'access-token';

    private readonly storageService = inject(StorageService);

    public setToken(token: string): void {
        this.storageService.setItem<string>(
            TokenService.ACCESS_TOKEN_KEY,
            token,
        );
    }

    public getToken(): string | null {
        return this.storageService.getItem<string>(
            TokenService.ACCESS_TOKEN_KEY,
        );
    }

    public removeToken(): void {
        this.storageService.removeItem(
            TokenService.ACCESS_TOKEN_KEY,
        );
    }

    public isTokenExpired(token: string): boolean {
        try {
            const decodedToken = this.decodeToken(token);

            if (!decodedToken?.exp) {
                return true;
            }

            const currentUnixTimestamp = Math.floor(Date.now() / 1000);

            return decodedToken.exp <= currentUnixTimestamp;
        } catch {
            return true;
        }
    }

    public decodeToken(token: string): JwtPayload | null {
        try {
            const tokenParts = token.split('.');

            if (tokenParts.length !== 3) {
                return null;
            }

            const payload = tokenParts[1];

            const decodedPayload = atob(
                payload.replace(/-/g, '+').replace(/_/g, '/'),
            );

            return JSON.parse(decodedPayload) as JwtPayload;
        } catch {
            return null;
        }
    }
}