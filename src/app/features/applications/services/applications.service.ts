import { Injectable, inject } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';

import { ApplicationsState } from '../state/applications.state';
import { Application } from '../models/application.model';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';

import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { ApiClientService } from 'src/app/core/http/clients/api-client.service';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {
    private readonly endpoint = '/applications';

    private readonly apiClientService =
        inject(ApiClientService);

    private readonly applicationsState =
        inject(ApplicationsState);

    public getApplications(): Observable<ApiResponse<Application[]>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .get<ApiResponse<Application[]>>(this.endpoint)
            .pipe(
                tap((response) => {
                    this.applicationsState.setApplications(
                        response.data ?? []
                    );
                    this.applicationsState.setError(null);
                }),
                finalize(() => {
                    this.applicationsState.setLoading(false);
                })
            );
    }

    public getApplicationById(
        applicationId: string
    ): Observable<ApiResponse<Application>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .get<ApiResponse<Application>>(
                `${this.endpoint}/${applicationId}`
            )
            .pipe(
                tap((response) => {
                    this.applicationsState.setSelectedApplication(
                        response.data
                    );
                    this.applicationsState.setError(null);
                }),
                finalize(() => {
                    this.applicationsState.setLoading(false);
                })
            );
    }

    public createApplication(
        payload: CreateApplicationDto
    ): Observable<ApiResponse<Application>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .post<ApiResponse<Application>>(
                this.endpoint,
                payload
            )
            .pipe(
                tap((response) => {
                    const application =
                        response.data;

                    if (application) {
                        this.applicationsState.addApplication(
                            application
                        );
                    }

                    this.applicationsState.setError(null);
                }),
                finalize(() => {
                    this.applicationsState.setLoading(false);
                })
            );
    }

    public updateApplication(
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
                tap((response) => {
                    const application =
                        response.data;

                    if (application) {
                        this.applicationsState.updateApplication(
                            application
                        );

                        this.applicationsState.setSelectedApplication(
                            application
                        );
                    }

                    this.applicationsState.setError(null);
                }),
                finalize(() => {
                    this.applicationsState.setLoading(false);
                })
            );
    }

    public deleteApplication(
        applicationId: string
    ): Observable<ApiResponse<void>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .delete<ApiResponse<void>>(
                `${this.endpoint}/${applicationId}`
            )
            .pipe(
                tap(() => {
                    this.applicationsState.removeApplication(
                        applicationId
                    );

                    this.applicationsState.setSelectedApplication(
                        null
                    );

                    this.applicationsState.setError(null);
                }),
                finalize(() => {
                    this.applicationsState.setLoading(false);
                })
            );
    }

    public updateStatus(
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
                tap((response) => {
                    const application =
                        response.data;

                    if (application) {
                        this.applicationsState.updateApplication(
                            application
                        );

                        this.applicationsState.setSelectedApplication(
                            application
                        );
                    }

                    this.applicationsState.setError(null);
                }),
                finalize(() => {
                    this.applicationsState.setLoading(false);
                })
            );
    }

    public searchApplications(
        searchTerm: string
    ): Observable<ApiResponse<Application[]>> {
        this.applicationsState.setLoading(true);

        return this.apiClientService
            .get<ApiResponse<Application[]>>(
                `${this.endpoint}/search`,
                {
                    q: searchTerm.trim()
                }
            )
            .pipe(
                tap((response) => {
                    this.applicationsState.setApplications(
                        response.data ?? []
                    );

                    this.applicationsState.setError(null);
                }),
                finalize(() => {
                    this.applicationsState.setLoading(false);
                })
            );
    }
}