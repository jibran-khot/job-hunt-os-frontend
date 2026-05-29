import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiClientService {
    constructor(
        private readonly httpClient: HttpClient
    ) { }

    get<T>(
        url: string,
        queryParams?: Record<
            string,
            string | number | boolean | null | undefined
        >
    ): Observable<T> {
        return this.httpClient.get<T>(
            url,
            {
                params: this.buildHttpParams(
                    queryParams
                )
            }
        );
    }

    post<T>(
        url: string,
        body: unknown,
        headers?: Record<string, string>
    ): Observable<T> {
        return this.httpClient.post<T>(
            url,
            body,
            {
                headers:
                    this.buildHttpHeaders(
                        headers
                    )
            }
        );
    }

    put<T>(
        url: string,
        body: unknown,
        headers?: Record<string, string>
    ): Observable<T> {
        return this.httpClient.put<T>(
            url,
            body,
            {
                headers:
                    this.buildHttpHeaders(
                        headers
                    )
            }
        );
    }

    patch<T>(
        url: string,
        body: unknown,
        headers?: Record<string, string>
    ): Observable<T> {
        return this.httpClient.patch<T>(
            url,
            body,
            {
                headers:
                    this.buildHttpHeaders(
                        headers
                    )
            }
        );
    }

    delete<T>(
        url: string,
        queryParams?: Record<
            string,
            string | number | boolean | null | undefined
        >
    ): Observable<T> {
        return this.httpClient.delete<T>(
            url,
            {
                params: this.buildHttpParams(
                    queryParams
                )
            }
        );
    }

    upload<T>(
        url: string,
        formData: FormData
    ): Observable<T> {
        return this.httpClient.post<T>(
            url,
            formData
        );
    }

    download(
        url: string,
        queryParams?: Record<
            string,
            string | number | boolean | null | undefined
        >
    ): Observable<Blob> {
        return this.httpClient.get(
            url,
            {
                params: this.buildHttpParams(
                    queryParams
                ),
                responseType: 'blob'
            }
        );
    }

    private buildHttpParams(
        params?: Record<
            string,
            string | number | boolean | null | undefined
        >
    ): HttpParams {
        let httpParams =
            new HttpParams();

        if (!params) {
            return httpParams;
        }

        Object.entries(params)
            .filter(
                ([, value]) =>
                    value !== null &&
                    value !== undefined
            )
            .forEach(
                ([key, value]) => {
                    httpParams =
                        httpParams.set(
                            key,
                            String(value)
                        );
                }
            );

        return httpParams;
    }

    private buildHttpHeaders(
        headers?: Record<string, string>
    ): HttpHeaders {
        let httpHeaders =
            new HttpHeaders();

        if (!headers) {
            return httpHeaders;
        }

        Object.entries(headers)
            .forEach(
                ([key, value]) => {
                    httpHeaders =
                        httpHeaders.set(
                            key,
                            value
                        );
                }
            );

        return httpHeaders;
    }
}