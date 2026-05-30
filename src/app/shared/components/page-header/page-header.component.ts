import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
    @Input({ required: true })
    public title = '';

    @Input()
    public subtitle = '';

    @Input()
    public breadcrumbs: readonly BreadcrumbItem[] = [];

    @Input()
    public actions: readonly PageHeaderAction[] = [];

    @Input()
    public showDivider = true;

    @Input()
    public centered = false;

    @Output()
    public readonly actionTriggered =
        new EventEmitter<PageHeaderAction>();

    public emitAction(action: PageHeaderAction): void {
        if (action.disabled) {
            return;
        }

        this.actionTriggered.emit(action);
    }

    public trackByAction(
        _index: number,
        action: PageHeaderAction
    ): string {
        return action.id;
    }

    public trackByBreadcrumb(
        _index: number,
        breadcrumb: BreadcrumbItem
    ): string {
        return breadcrumb.route ?? breadcrumb.label;
    }
}