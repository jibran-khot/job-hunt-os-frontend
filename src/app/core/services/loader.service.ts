import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private readonly loadingSubject =
        new BehaviorSubject<boolean>(false);

    private activeRequests = 0;

    public readonly loading$ =
        this.loadingSubject.asObservable();

    public show(): void {
        this.activeRequests += 1;

        if (!this.loadingSubject.value) {
            this.loadingSubject.next(true);
        }
    }

    public hide(): void {
        if (this.activeRequests > 0) {
            this.activeRequests -= 1;
        }

        if (this.activeRequests === 0) {
            this.loadingSubject.next(false);
        }
    }

    public isLoading(): Observable<boolean> {
        return this.loading$;
    }

    public reset(): void {
        this.activeRequests = 0;
        this.loadingSubject.next(false);
    }
}