import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject
} from '@angular/core';
import { Router } from '@angular/router';

import { finalize } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApplicationsService } from '../../services/applications.service';
import { CreateApplicationDto } from '../../dto/create-application.dto';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApplicationFormComponent } from '../../components/application-form/application-form.component';

import { NotificationService } from '../../../../core/services/notification.service';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-create-application',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ApplicationFormComponent
  ],
  templateUrl: './create-application.component.html',
  styleUrl: './create-application.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateApplicationComponent {
  private readonly applicationsService = inject(ApplicationsService);
  private readonly notificationService = inject(NotificationService);
  private readonly loaderService = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageTitle = 'Create Application';
  protected readonly pageSubtitle =
    'Add a new job application and track its progress.';

  protected isSubmitting = false;
  protected submissionError: string | null = null;

  createApplication(payload: CreateApplicationDto): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submissionError = null;

    this.loaderService.show();

    this.applicationsService
      .createApplication(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isSubmitting = false;
          this.loaderService.hide();
        })
      )
      .subscribe({
        next: (application) => {
          this.notificationService.success(
            'Application created successfully.'
          );

          const applicationId =
            application?.id ??
            application?.applicationId;

          if (applicationId) {
            void this.router.navigate([
              '/app/applications',
              applicationId
            ]);

            return;
          }

          void this.router.navigate([
            '/app/applications'
          ]);
        },
        error: (error: unknown) => {
          this.submissionError =
            this.extractErrorMessage(error);

          this.notificationService.error(
            this.submissionError
          );
        }
      });
  }

  resetForm(): void {
    this.submissionError = null;
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

    return 'Unable to create application. Please try again.';
  }
}