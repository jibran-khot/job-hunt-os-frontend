import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Application } from '../../models/application.model';

import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

export type ApplicationSortDirection =
  | 'asc'
  | 'desc';

export interface ApplicationTableSortEvent {
  column: string;
  direction: ApplicationSortDirection;
}

@Component({
  selector: 'app-application-table',
  standalone: true,
  imports: [
    CommonModule,
    StatusChipComponent,
    EmptyStateComponent
  ],
  templateUrl: './application-table.component.html',
  styleUrl: './application-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationTableComponent {
  @Input({ required: true })
  applications: readonly Application[] = [];

  @Input()
  loading = false;

  @Input()
  sortColumn = '';

  @Input()
  sortDirection: ApplicationSortDirection = 'asc';

  @Output()
  readonly sort = new EventEmitter<ApplicationTableSortEvent>();

  @Output()
  readonly view = new EventEmitter<number>();

  @Output()
  readonly edit = new EventEmitter<number>();

  @Output()
  readonly delete = new EventEmitter<number>();

  sortTable(column: string): void {
    const direction: ApplicationSortDirection =
      this.sortColumn === column &&
        this.sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    this.sort.emit({
      column,
      direction
    });
  }

  viewApplication(applicationId: number): void {
    this.view.emit(applicationId);
  }

  editApplication(applicationId: number): void {
    this.edit.emit(applicationId);
  }

  deleteApplication(applicationId: number): void {
    this.delete.emit(applicationId);
  }

  trackByApplication(
    index: number,
    application: Application
  ): number {
    return application.id;
  }

  getSortIndicator(
    column: string
  ): string {
    if (this.sortColumn !== column) {
      return '';
    }

    return this.sortDirection === 'asc'
      ? '↑'
      : '↓';
  }
}