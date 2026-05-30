import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApplicationsService } from '../../services/applications.service';
import { ApplicationsState } from '../../state/applications.state';

import { ApplicationHeaderComponent } from '../../components/application-header/application-header.component';
import { ApplicationNotesComponent } from '../../components/application-notes/application-notes.component';
import { ActivityHistoryComponent } from '../../components/activity-history/activity-history.component';
import { FollowupListComponent } from '../../components/followup-list/followup-list.component';
import { InterviewListComponent } from '../../components/interview-list/interview-list.component';

import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ErrorStateComponent,
    ApplicationHeaderComponent,
    ApplicationNotesComponent,
    ActivityHistoryComponent,
    FollowupListComponent,
    InterviewListComponent
  ],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly applicationsService =
    inject(ApplicationsService);

  private readonly applicationsState =
    inject(ApplicationsState);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly application$ =
    this.applicationsState.selectedApplication$;

  readonly loading$ =
    this.applicationsState.loading$;

  readonly error$ =
    this.applicationsState.error$;

  ngOnInit(): void {
    this.loadApplication();
  }

  public loadApplication(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter(
          (
            applicationId
          ): applicationId is string =>
            !!applicationId
        ),
        distinctUntilChanged(),
        switchMap((applicationId) =>
          this.applicationsService.getApplicationById(
            applicationId
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.applicationsState.clearError();
        },
        error: (error: unknown) => {
          this.applicationsState.setError(
            error instanceof Error
              ? error.message
              : 'Failed to load application details.'
          );
        }
      });
  }

  public refreshApplication(): void {
    const applicationId =
      this.route.snapshot.paramMap.get('id');

    if (!applicationId) {
      return;
    }

    this.applicationsService
      .getApplicationById(applicationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.applicationsState.clearError();
        },
        error: (error: unknown) => {
          this.applicationsState.setError(
            error instanceof Error
              ? error.message
              : 'Failed to refresh application details.'
          );
        }
      });
  }
}