import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    public setItem<T>(
        key: string,
        value: T,
        useSessionStorage: boolean = false,
    ): void {
        try {
            const serializedValue = JSON.stringify(value);

            this.getStorage(useSessionStorage).setItem(
                key,
                serializedValue,
            );
        } catch (error: unknown) {
            console.error(
                `Failed to persist storage item for key: ${key}`,
                error,
            );
        }
    }

    public getItem<T>(
        key: string,
        useSessionStorage: boolean = false,
    ): T | null {
        try {
            const storedValue =
                this.getStorage(useSessionStorage).getItem(key);

            if (!storedValue) {
                return null;
            }

            return JSON.parse(storedValue) as T;
        } catch (error: unknown) {
            console.error(
                `Failed to retrieve storage item for key: ${key}`,
                error,
            );

            return null;
        }
    }

    public removeItem(
        key: string,
        useSessionStorage: boolean = false,
    ): void {
        try {
            this.getStorage(useSessionStorage).removeItem(key);
        } catch (error: unknown) {
            console.error(
                `Failed to remove storage item for key: ${key}`,
                error,
            );
        }
    }

    public clear(
        useSessionStorage: boolean = false,
    ): void {
        try {
            this.getStorage(useSessionStorage).clear();
        } catch (error: unknown) {
            console.error(
                'Failed to clear storage',
                error,
            );
        }
    }

    private getStorage(
        useSessionStorage: boolean,
    ): Storage {
        return useSessionStorage
            ? sessionStorage
            : localStorage;
    }
}