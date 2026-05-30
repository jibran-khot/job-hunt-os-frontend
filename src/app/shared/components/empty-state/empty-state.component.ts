import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
    @Input() public title = 'No Data Available';

    @Input() public message =
        'There is currently no data available to display.';

    @Input() public icon = '📭';

    @Input() public actionLabel = 'Retry';

    @Input() public showAction = false;

    @Input() public centered = true;

    @Output() public readonly actionTriggered =
        new EventEmitter<void>();

    public retry(): void {
        this.actionTriggered.emit();
    }
}