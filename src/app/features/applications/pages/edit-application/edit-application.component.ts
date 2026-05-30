import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, throwError } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApplicationsService } from '../../services/applications.service';
import { Application } from '../../models/application.model';
import { UpdateApplicationDto } from '../../dto/update-application.dto';

import { ApplicationFormComponent } from '../../components/application-form/application-form.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

import { LoaderService } from '../../../../core/services/loader.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-edit-application',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ApplicationFormComponent,
    ErrorStateComponent
  ],
  templateUrl: './edit-application.component.html',
  styleUrl: './edit-application.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditApplicationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly loaderService = inject(LoaderService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageTitle = 'Edit Application';
  protected readonly pageSubtitle =
    'Update application details and tracking information.';

  protected application: Application | null = null;

  protected applicationId = 0;
  protected isLoading = false;
  protected isSubmitting = false;

  protected errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadApplication();
  }

  loadApplication(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id || Number.isNaN(id)) {
      this.errorMessage = 'Invalid application identifier.';
      return;
    }

    this.applicationId = id;
    this.isLoading = true;
    this.errorMessage = null;

    this.loaderService.show();

    this.applicationsService
      .getApplicationById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
          this.loaderService.hide();
        })
      )
      .subscribe({
        next: (application) => {
          this.application = application;
        },
        error: (error: unknown) => {
          this.errorMessage =
            this.extractErrorMessage(error);
        }
      });
  }

  updateApplication(
    payload: UpdateApplicationDto
  ): void {
    if (
      this.isSubmitting ||
      !this.applicationId
    ) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.loaderService.show();

    this.applicationsService
      .updateApplication(
        this.applicationId,
        payload
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting = false;
          this.loaderService.hide();
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Application updated successfully.'
          );

          void this.router.navigate([
            '/app/applications',
            this.applicationId
          ]);
        },
        error: (error: unknown) => {
          this.errorMessage =
            this.extractErrorMessage(error);

          this.notificationService.error(
            this.errorMessage
          );
        }
      });
  }

  retry(): void {
    this.loadApplication();
  }

  private extractErrorMessage(
    error: unknown
  ): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error
    ) {
      const apiError = (
        error as {
          error?: {
            message?: string;
          };
        }
      ).error;

      if (apiError?.message) {
        return apiError.message;
      }
    }

    return 'An unexpected error occurred. Please try again.';
  }
}