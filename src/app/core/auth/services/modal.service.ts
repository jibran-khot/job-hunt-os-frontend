import { Injectable } from '@angular/core';

import {
    Observable,
    Subject,
    filter,
    map,
    take,
} from 'rxjs';

export type ModalSize =
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'full';

export interface ModalConfig<TData = unknown> {
    id: string;
    title?: string;
    component?: unknown;
    data?: TData;
    closable?: boolean;
    closeOnBackdrop?: boolean;
    size?: ModalSize;
}

export interface ConfirmationModalConfig {
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDestructive?: boolean;
    closeOnBackdropClick?: boolean;
}

interface ModalState {
    type: 'open' | 'close';
    config?: ModalConfig;
}

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private readonly modalStateSubject =
        new Subject<ModalState>();

    private readonly confirmationSubject =
        new Subject<boolean>();

    public readonly modalState$ =
        this.modalStateSubject.asObservable();

    public open<TData = unknown>(
        config: ModalConfig<TData>,
    ): void {
        this.modalStateSubject.next({
            type: 'open',
            config,
        });
    }

    public close(modalId?: string): void {
        this.modalStateSubject.next({
            type: 'close',
            config: modalId
                ? {
                    id: modalId,
                }
                : undefined,
        });
    }

    public confirm(
        config: ConfirmationModalConfig,
    ): Observable<boolean> {
        this.open({
            id: 'confirmation-modal',
            title: config.title,
            data: config,
            size: 'sm',
            closable: false,
            closeOnBackdrop: false,
        });

        return this.confirmationSubject.pipe(
            take(1),
        );
    }

    public resolveConfirmation(
        confirmed: boolean,
    ): void {
        this.confirmationSubject.next(confirmed);

        this.close('confirmation-modal');
    }

    public onOpen(): Observable<ModalConfig> {
        return this.modalState$.pipe(
            filter(
                (state: ModalState) =>
                    state.type === 'open' &&
                    !!state.config,
            ),
            map(
                (state: ModalState) =>
                    state.config as ModalConfig,
            ),
        );
    }

    public onClose(): Observable<string | undefined> {
        return this.modalState$.pipe(
            filter(
                (state: ModalState) =>
                    state.type === 'close',
            ),
            map(
                (state: ModalState) =>
                    state.config?.id,
            ),
        );
    }
}