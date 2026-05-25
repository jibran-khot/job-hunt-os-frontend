import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PageHeaderAction {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export interface BreadcrumbItem {
    label: string;
    route?: string;
    active?: boolean;
}

@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
    @Input() public title = '';

    @Input() public subtitle = '';

    @Input() public breadcrumbs: BreadcrumbItem[] = [];

    @Input() public actions: PageHeaderAction[] = [];

    @Input() public showDivider = true;

    @Input() public centered = false;

    @Output() public actionTriggered =
        new EventEmitter<PageHeaderAction>();

    public emitAction(action: PageHeaderAction): void {
        if (action.disabled) {
            return;
        }

        this.actionTriggered.emit(action);
    }

    public trackByAction(
        index: number,
        action: PageHeaderAction
    ): string {
        return action.id;
    }

    public trackByBreadcrumb(
        index: number,
        breadcrumb: BreadcrumbItem
    ): string {
        return `${breadcrumb.label}-${index}`;
    }
}