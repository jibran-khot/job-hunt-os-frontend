import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApplicationsState } from '../state/applications.state';

import { Application } from '../models/application.model';

import { CreateApplicationDto } from '../dto/create-application.dto';

import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { ApiClientService } from 'src/app/core/http/clients/api-client.service';
import { UpdateApplicationDto } from '../dto/update-application.dto';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {
    private readonly endpoint = '/applications';

    constructor(
        private readonly apiClientService: ApiClientService,
        private readonly applicationsState: ApplicationsState
    ) { }

    getApplications(): Observable<ApiResponse<Application[]>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .get<ApiResponse<Application[]>>(this.endpoint)
            .pipe(
                tap({
                    next: (response) => {
                        this.applicationsState.setApplications(
                            response.data ?? []
                        );
                        this.applicationsState.setError(null);
                        this.applicationsState.setLoading(false);
                    },
                    error: (error) => {
                        this.applicationsState.setError(
                            error?.message ??
                            'Failed to load applications.'
                        );
                        this.applicationsState.setLoading(false);
                    }
                })
            );
    }

    getApplicationById(
        applicationId: string
    ): Observable<ApiResponse<Application>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .get<ApiResponse<Application>>(
                `${this.endpoint}/${applicationId}`
            )
            .pipe(
                tap({
                    next: (response) => {
                        this.applicationsState.setSelectedApplication(
                            response.data
                        );
                        this.applicationsState.setError(null);
                        this.applicationsState.setLoading(false);
                    },
                    error: (error) => {
                        this.applicationsState.setError(
                            error?.message ??
                            'Failed to load application.'
                        );
                        this.applicationsState.setLoading(false);
                    }
                })
            );
    }

    createApplication(
        payload: CreateApplicationDto
    ): Observable<ApiResponse<Application>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .post<ApiResponse<Application>>(
                this.endpoint,
                payload
            )
            .pipe(
                tap({
                    next: (response) => {
                        const application = response.data;

                        if (application) {
                            this.applicationsState.addApplication(
                                application
                            );
                        }

                        this.applicationsState.setError(null);
                        this.applicationsState.setLoading(false);
                    },
                    error: (error) => {
                        this.applicationsState.setError(
                            error?.message ??
                            'Failed to create application.'
                        );
                        this.applicationsState.setLoading(false);
                    }
                })
            );
    }

    updateApplication(
        applicationId: string,
        payload: UpdateApplicationDto
    ): Observable<ApiResponse<Application>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .put<ApiResponse<Application>>(
                `${this.endpoint}/${applicationId}`,
                payload
            )
            .pipe(
                tap({
                    next: (response) => {
                        const application = response.data;

                        if (application) {
                            this.applicationsState.updateApplication(
                                application
                            );
                            this.applicationsState.setSelectedApplication(
                                application
                            );
                        }

                        this.applicationsState.setError(null);
                        this.applicationsState.setLoading(false);
                    },
                    error: (error) => {
                        this.applicationsState.setError(
                            error?.message ??
                            'Failed to update application.'
                        );
                        this.applicationsState.setLoading(false);
                    }
                })
            );
    }

    deleteApplication(
        applicationId: string
    ): Observable<ApiResponse<void>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .delete<ApiResponse<void>>(
                `${this.endpoint}/${applicationId}`
            )
            .pipe(
                tap({
                    next: () => {
                        this.applicationsState.removeApplication(
                            applicationId
                        );
                        this.applicationsState.setError(null);
                        this.applicationsState.setLoading(false);
                    },
                    error: (error) => {
                        this.applicationsState.setError(
                            error?.message ??
                            'Failed to delete application.'
                        );
                        this.applicationsState.setLoading(false);
                    }
                })
            );
    }

    updateStatus(
        applicationId: string,
        status: string
    ): Observable<ApiResponse<Application>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .patch<ApiResponse<Application>>(
                `${this.endpoint}/${applicationId}/status`,
                { status }
            )
            .pipe(
                tap({
                    next: (response) => {
                        const application = response.data;

                        if (application) {
                            this.applicationsState.updateApplication(
                                application
                            );
                            this.applicationsState.setSelectedApplication(
                                application
                            );
                        }

                        this.applicationsState.setError(null);
                        this.applicationsState.setLoading(false);
                    },
                    error: (error) => {
                        this.applicationsState.setError(
                            error?.message ??
                            'Failed to update application status.'
                        );
                        this.applicationsState.setLoading(false);
                    }
                })
            );
    }

    searchApplications(
        searchTerm: string
    ): Observable<ApiResponse<Application[]>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .get<ApiResponse<Application[]>>(
                `${this.endpoint}/search`,
                {
                    q: searchTerm
                }
            )
            .pipe(
                tap({
                    next: (response) => {
                        this.applicationsState.setApplications(
                            response.data ?? []
                        );
                        this.applicationsState.setError(null);
                        this.applicationsState.setLoading(false);
                    },
                    error: (error) => {
                        this.applicationsState.setError(
                            error?.message ??
                            'Failed to search applications.'
                        );
                        this.applicationsState.setLoading(false);
                    }
                })
            );
    }
}