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

@Component({
  selector: 'app-application-header',
  standalone: true,
  imports: [
    CommonModule,
    StatusChipComponent
  ],
  templateUrl: './application-header.component.html',
  styleUrl: './application-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationHeaderComponent {
  @Input({ required: true })
  application!: Application;

  @Output()
  readonly statusChange = new EventEmitter<string>();

  @Output()
  readonly actionsClick = new EventEmitter<void>();

  updateStatus(status: string): void {
    this.statusChange.emit(status);
  }

  openActions(): void {
    this.actionsClick.emit();
  }

  get companyName(): string {
    return this.application?.companyName ?? '-';
  }

  get jobTitle(): string {
    return this.application?.jobTitle ?? '-';
  }

  get status(): string {
    return this.application?.status ?? '';
  }

  get recruiterName(): string {
    return this.application?.recruiterName ?? '-';
  }

  get appliedDate(): string {
    return this.application?.appliedDate ?? '-';
  }

  get location(): string {
    return this.application?.location ?? '-';
  }

  get availableStatuses(): readonly string[] {
    return [
      'APPLIED',
      'SCREENING',
      'INTERVIEW_SCHEDULED',
      'INTERVIEW_COMPLETED',
      'OFFER_RECEIVED',
      'REJECTED',
      'JOINED'
    ];
  }
}