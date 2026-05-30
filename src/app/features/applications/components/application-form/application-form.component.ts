import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Application } from '../../models/application.model';
import { CreateApplicationDto } from '../../dto/create-application.dto';
import { UpdateApplicationDto } from '../../dto/update-application.dto';

import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    DatePickerComponent,
    FileUploadComponent
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationFormComponent
  implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);

  @Input()
  application: Application | null = null;

  @Input()
  isSubmitting = false;

  @Output()
  readonly formSubmit = new EventEmitter<
    CreateApplicationDto | UpdateApplicationDto
  >();

  @Output()
  readonly formReset = new EventEmitter<void>();

  protected applicationForm!: FormGroup;

  protected readonly statusOptions: SelectOption[] = [
    {
      label: 'Applied',
      value: 'APPLIED'
    },
    {
      label: 'Screening',
      value: 'SCREENING'
    },
    {
      label: 'Interview Scheduled',
      value: 'INTERVIEW_SCHEDULED'
    },
    {
      label: 'Interviewed',
      value: 'INTERVIEWED'
    },
    {
      label: 'Offer Received',
      value: 'OFFER_RECEIVED'
    },
    {
      label: 'Offer Accepted',
      value: 'OFFER_ACCEPTED'
    },
    {
      label: 'Rejected',
      value: 'REJECTED'
    },
    {
      label: 'Withdrawn',
      value: 'WITHDRAWN'
    }
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(
    changes: SimpleChanges
  ): void {
    if (
      changes['application']?.currentValue &&
      this.applicationForm
    ) {
      this.patchForm(
        changes['application'].currentValue
      );
    }
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      companyName: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],
      jobTitle: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],
      status: [
        'APPLIED',
        Validators.required
      ],
      location: [
        '',
        Validators.maxLength(200)
      ],
      salary: [
        null
      ],
      appliedDate: [
        null,
        Validators.required
      ],
      recruiterName: [
        '',
        Validators.maxLength(150)
      ],
      recruiterEmail: [
        '',
        Validators.email
      ],
      jobUrl: [
        ''
      ],
      notes: [
        '',
        Validators.maxLength(2000)
      ],
      resumeFile: [
        null
      ]
    });

    if (this.application) {
      this.patchForm(this.application);
    }
  }

  patchForm(
    application: Application
  ): void {
    this.applicationForm.patchValue({
      companyName:
        application.companyName ?? '',
      jobTitle:
        application.jobTitle ?? '',
      status:
        application.status ?? 'APPLIED',
      location:
        application.location ?? '',
      salary:
        application.salary ?? null,
      appliedDate:
        application.appliedDate ?? null,
      recruiterName:
        application.recruiterName ?? '',
      recruiterEmail:
        application.recruiterEmail ?? '',
      jobUrl:
        application.jobUrl ?? '',
      notes:
        application.notes ?? ''
    });
  }

  submitForm(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.applicationForm.getRawValue()
    };

    this.formSubmit.emit(payload);
  }

  resetForm(): void {
    this.applicationForm.reset({
      status: 'APPLIED'
    });

    this.formReset.emit();
  }

  onResumeSelected(files: File[]): void {
    const file = files[0] ?? null;

    this.applicationForm.patchValue({
      resumeFile: file
    });

    this.applicationForm.markAsDirty();
  }
  get companyNameControl() {
    return this.applicationForm.get(
      'companyName'
    );
  }

  get jobTitleControl() {
    return this.applicationForm.get(
      'jobTitle'
    );
  }

  get statusControl() {
    return this.applicationForm.get(
      'status'
    );
  }

  get appliedDateControl() {
    return this.applicationForm.get(
      'appliedDate'
    );
  }
}