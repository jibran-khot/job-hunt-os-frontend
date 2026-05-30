import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';

export interface ConfirmationDialogConfig {
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDestructive?: boolean;
    closeOnBackdropClick?: boolean;
}

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
    @Input() public isOpen = false;

    @Input() public config: ConfirmationDialogConfig = {
        title: 'Confirm Action',
        message: 'Are you sure you want to continue?',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        isDestructive: false,
        closeOnBackdropClick: true
    };

    @Output() public readonly confirmed = new EventEmitter<void>();
    @Output() public readonly cancelled = new EventEmitter<void>();

    private readonly modalService = inject(ModalService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly destroy$ = new Subject<void>();

    public ngOnInit(): void {
        this.listenToModalState();
    }

    public confirm(): void {
        this.confirmed.emit();
        this.closeDialog();
    }

    public cancel(): void {
        this.cancelled.emit();
        this.closeDialog();
    }

    public onBackdropClick(): void {
        if (this.config.closeOnBackdropClick === false) {
            return;
        }

        this.cancel();
    }

    public onDialogClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private listenToModalState(): void {
        this.modalService.modalState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.isOpen = state.type === 'open';

                if (state.type === 'open' && state.config?.data) {
                    const modalData =
                        state.config.data as ConfirmationDialogConfig;

                    this.config = {
                        title: modalData.title,
                        message: modalData.message,
                        confirmButtonText:
                            modalData.confirmButtonText ?? 'Confirm',
                        cancelButtonText:
                            modalData.cancelButtonText ?? 'Cancel',
                        isDestructive:
                            modalData.isDestructive ?? false,
                        closeOnBackdropClick:
                            modalData.closeOnBackdropClick ?? true
                    };
                }

                this.cdr.markForCheck();
            });
    }

    private closeDialog(): void {
        this.modalService.close();
    }
}