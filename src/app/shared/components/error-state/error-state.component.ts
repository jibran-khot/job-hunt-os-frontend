import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error-state',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './error-state.component.html',
    styleUrl: './error-state.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
    @Input() public title = 'Something Went Wrong';

    @Input() public message =
        'An unexpected error occurred while processing your request. Please try again.';

    @Input() public actionLabel = 'Retry';

    @Input() public icon = '⚠️';

    @Input() public showRetryAction = true;

    @Input() public centered = true;

    @Output() public readonly retryTriggered =
        new EventEmitter<void>();

    public retry(): void {
        this.retryTriggered.emit();
    }
}