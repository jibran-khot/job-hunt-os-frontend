import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApplicationsService } from '../../services/applications.service';

import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoaderService } from '../../../../core/services/loader.service';
import { NotificationService } from '../../../../core/services/notification.service';

export interface ApplicationNote {
  id: number;
  applicationId: number;
  content: string;
  createdAt: string;
  createdBy?: string;
}

@Component({
  selector: 'app-application-notes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextareaComponent,
    EmptyStateComponent
  ],
  templateUrl: './application-notes.component.html',
  styleUrl: './application-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationNotesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly loaderService = inject(LoaderService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true })
  applicationId!: number;

  protected readonly noteForm = this.fb.nonNullable.group({
    content: [
      '',
      [
        Validators.required,
        Validators.maxLength(2000)
      ]
    ]
  });

  protected notes: ApplicationNote[] = [];
  protected isLoading = false;
  protected isSubmitting = false;

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    if (!this.applicationId) {
      return;
    }

    this.isLoading = true;

    this.applicationsService
      .getApplicationById(this.applicationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (application) => {
          this.notes = (
            application as {
              notes?: ApplicationNote[];
            }
          ).notes ?? [];
        },
        error: () => {
          this.notificationService.error(
            'Failed to load notes.'
          );
        }
      });
  }

  addNote(): void {
    if (
      this.noteForm.invalid ||
      this.isSubmitting
    ) {
      this.noteForm.markAllAsTouched();
      return;
    }

    const content =
      this.noteForm.controls.content.value;

    this.isSubmitting = true;
    this.loaderService.show();

    const note: ApplicationNote = {
      id: Date.now(),
      applicationId: this.applicationId,
      content,
      createdAt: new Date().toISOString()
    };

    this.notes = [note, ...this.notes];

    this.noteForm.reset();

    this.loaderService.hide();
    this.isSubmitting = false;

    this.notificationService.success(
      'Note added successfully.'
    );
  }

  deleteNote(noteId: number): void {
    this.notes = this.notes.filter(
      (note) => note.id !== noteId
    );

    this.notificationService.success(
      'Note deleted successfully.'
    );
  }

  trackByNote(
    index: number,
    note: ApplicationNote
  ): number {
    return note.id;
  }
}