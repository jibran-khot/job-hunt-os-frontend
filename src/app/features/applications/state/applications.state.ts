import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Application } from '../models/application.model';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsState {
    private readonly applicationsSubject =
        new BehaviorSubject<Application[]>([]);

    private readonly selectedApplicationSubject =
        new BehaviorSubject<Application | null>(null);

    private readonly loadingSubject =
        new BehaviorSubject<boolean>(false);

    private readonly errorSubject =
        new BehaviorSubject<string | null>(null);

    private readonly totalRecordsSubject =
        new BehaviorSubject<number>(0);

    readonly applications$: Observable<Application[]> =
        this.applicationsSubject.asObservable();

    readonly selectedApplication$: Observable<Application | null> =
        this.selectedApplicationSubject.asObservable();

    readonly loading$: Observable<boolean> =
        this.loadingSubject.asObservable();

    readonly error$: Observable<string | null> =
        this.errorSubject.asObservable();

    readonly totalRecords$: Observable<number> =
        this.totalRecordsSubject.asObservable();

    get applications(): Application[] {
        return this.applicationsSubject.value;
    }

    get selectedApplication(): Application | null {
        return this.selectedApplicationSubject.value;
    }

    get isLoading(): boolean {
        return this.loadingSubject.value;
    }

    get error(): string | null {
        return this.errorSubject.value;
    }

    get totalRecords(): number {
        return this.totalRecordsSubject.value;
    }

    setApplications(applications: Application[]): void {
        this.applicationsSubject.next(applications);
        this.totalRecordsSubject.next(applications.length);
    }

    addApplication(application: Application): void {
        const applications = [
            application,
            ...this.applicationsSubject.value
        ];

        this.applicationsSubject.next(applications);
        this.totalRecordsSubject.next(applications.length);
    }

    updateApplication(updatedApplication: Application): void {
        const applications =
            this.applicationsSubject.value.map(
                (application) =>
                    application.id === updatedApplication.id
                        ? updatedApplication
                        : application
            );

        this.applicationsSubject.next(applications);

        if (
            this.selectedApplicationSubject.value?.id ===
            updatedApplication.id
        ) {
            this.selectedApplicationSubject.next(
                updatedApplication
            );
        }
    }

    removeApplication(applicationId: number): void {
        const applications =
            this.applicationsSubject.value.filter(
                (application) =>
                    application.id !== applicationId
            );

        this.applicationsSubject.next(applications);
        this.totalRecordsSubject.next(applications.length);

        if (
            this.selectedApplicationSubject.value?.id ===
            applicationId
        ) {
            this.selectedApplicationSubject.next(null);
        }
    }
    setSelectedApplication(
        application: Application | null
    ): void {
        this.selectedApplicationSubject.next(
            application
        );
    }

    clearSelectedApplication(): void {
        this.selectedApplicationSubject.next(null);
    }

    setLoading(isLoading: boolean): void {
        this.loadingSubject.next(isLoading);
    }

    setError(error: string | null): void {
        this.errorSubject.next(error);
    }

    clearError(): void {
        this.errorSubject.next(null);
    }

    reset(): void {
        this.applicationsSubject.next([]);
        this.selectedApplicationSubject.next(null);
        this.loadingSubject.next(false);
        this.errorSubject.next(null);
        this.totalRecordsSubject.next(0);
    }
}