import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ApplicationStatus,
  ApplicationStatusHistory
} from '../../models/application.model';

export interface TimelineItem {
  id: string;
  title: string;
  status: ApplicationStatus;
  description?: string;
  changedAt: string;
  changedBy?: string;
}

@Component({
  selector: 'app-application-status-timeline',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl:
    './application-status-timeline.component.html',
  styleUrl:
    './application-status-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationStatusTimelineComponent {
  @Input()
  currentStatus!: ApplicationStatus;

  @Input()
  history: ApplicationStatusHistory[] = [];

  trackByHistory(
    index: number,
    item: ApplicationStatusHistory
  ): string {
    return item.id;
  }

  getStatusLabel(
    status: ApplicationStatus
  ): string {
    const labels: Record<
      ApplicationStatus,
      string
    > = {
      APPLIED: 'Applied',
      SCREENING: 'Screening',
      INTERVIEW_SCHEDULED:
        'Interview Scheduled',
      INTERVIEWED: 'Interviewed',
      OFFER_RECEIVED:
        'Offer Received',
      OFFER_ACCEPTED:
        'Offer Accepted',
      REJECTED: 'Rejected',
      WITHDRAWN: 'Withdrawn'
    };

    return labels[status];
  }

  isCurrentStatus(
    status: ApplicationStatus
  ): boolean {
    return this.currentStatus === status;
  }

  readonly timelineOrder: ApplicationStatus[] =
    [
      'APPLIED',
      'SCREENING',
      'INTERVIEW_SCHEDULED',
      'INTERVIEWED',
      'OFFER_RECEIVED',
      'OFFER_ACCEPTED'
    ];
}