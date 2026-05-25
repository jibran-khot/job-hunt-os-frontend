import {
    ChangeDetectionStrategy,
    Component,
    Input
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusChipVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral';

@Component({
    selector: 'app-status-chip',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './status-chip.component.html',
    styleUrls: ['./status-chip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusChipComponent {
    @Input() public label = '';

    @Input() public status = '';

    @Input() public icon?: string;

    @Input() public compact = false;

    @Input() public outlined = false;

    public getStatusClass(): string {
        const normalizedStatus =
            this.status.trim().toLowerCase();

        switch (normalizedStatus) {
            case 'success':
            case 'completed':
            case 'active':
            case 'approved':
            case 'accepted':
            case 'hired':
                return 'status-chip--success';

            case 'warning':
            case 'pending':
            case 'scheduled':
            case 'follow-up':
            case 'in review':
                return 'status-chip--warning';

            case 'danger':
            case 'rejected':
            case 'failed':
            case 'cancelled':
            case 'inactive':
                return 'status-chip--danger';

            case 'info':
            case 'interview':
            case 'processing':
                return 'status-chip--info';

            case 'neutral':
            case 'draft':
            case 'archived':
                return 'status-chip--neutral';

            default:
                return 'status-chip--default';
        }
    }

    public get displayLabel(): string {
        return this.label || this.status;
    }
}