import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

export type NotificationType =
    | 'success'
    | 'error'
    | 'warning'
    | 'info';

export interface NotificationMessage {
    id: string;
    type: NotificationType;
    message: string;
    title?: string;
    duration?: number;
    dismissible?: boolean;
    createdAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly notificationSubject =
        new Subject<NotificationMessage>();

    public readonly notifications$ =
        this.notificationSubject.asObservable();

    public success(
        message: string,
        title?: string,
        duration: number = 4000,
    ): void {
        this.pushNotification({
            type: 'success',
            message,
            title,
            duration,
        });
    }

    public error(
        message: string,
        title?: string,
        duration: number = 5000,
    ): void {
        this.pushNotification({
            type: 'error',
            message,
            title,
            duration,
        });
    }

    public warning(
        message: string,
        title?: string,
        duration: number = 4500,
    ): void {
        this.pushNotification({
            type: 'warning',
            message,
            title,
            duration,
        });
    }

    public info(
        message: string,
        title?: string,
        duration: number = 4000,
    ): void {
        this.pushNotification({
            type: 'info',
            message,
            title,
            duration,
        });
    }

    public stream(): Observable<NotificationMessage> {
        return this.notifications$;
    }

    private pushNotification(
        notification: Omit<
            NotificationMessage,
            'id' | 'createdAt' | 'dismissible'
        >,
    ): void {
        this.notificationSubject.next({
            id: crypto.randomUUID(),
            dismissible: true,
            createdAt: Date.now(),
            ...notification,
        });
    }
}