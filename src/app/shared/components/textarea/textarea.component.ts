import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  effect,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ValidationMessageComponent } from '../validation-message/validation-message.component';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationMessageComponent
  ],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent
  implements ControlValueAccessor, AfterViewInit {

  @ViewChild('textareaElement')
  private textareaElement?: ElementRef<HTMLTextAreaElement>;

  private readonly destroyRef = inject(DestroyRef);

  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly textareaId = input<string>('');
  readonly helperText = input<string>('');

  readonly control = input<AbstractControl | null>(null);

  readonly rows = input<number>(5);
  readonly minRows = input<number>(4);
  readonly maxRows = input<number>(12);

  readonly required = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly autoResize = input<boolean>(true);

  readonly maxLength = input<number | null>(null);
  readonly minLength = input<number | null>(null);

  protected readonly value = signal<string>('');
  protected readonly isFocused = signal<boolean>(false);
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly hasError = signal<boolean>(false);

  private currentControl: AbstractControl | null = null;

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    effect(() => {
      this.isDisabled.set(
        this.disabled() || this.currentControl?.disabled === true
      );
    });

    effect(() => {
      const control = this.control();

      if (!control || control === this.currentControl) {
        return;
      }

      this.currentControl = control;
      this.bindControl(control);
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.adjustTextareaHeight();
    });
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');

    queueMicrotask(() => {
      this.adjustTextareaHeight();
    });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    this.value.set(value);
    this.onChange(value);

    this.adjustTextareaHeight();
  }

  protected onFocus(): void {
    this.isFocused.set(true);
  }

  protected onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.updateErrorState();
  }

  protected shouldShowError(): boolean {
    return this.hasError();
  }

  protected getCharacterCount(): number {
    return this.value().length;
  }

  private bindControl(control: AbstractControl): void {
    control.statusChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateErrorState();

        this.isDisabled.set(
          this.disabled() || control.disabled
        );
      });

    control.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: unknown) => {
        this.value.set(
          typeof value === 'string'
            ? value
            : value == null
              ? ''
              : String(value)
        );

        queueMicrotask(() => {
          this.adjustTextareaHeight();
        });
      });

    this.value.set(
      typeof control.value === 'string'
        ? control.value
        : control.value == null
          ? ''
          : String(control.value)
    );

    this.isDisabled.set(
      this.disabled() || control.disabled
    );

    this.updateErrorState();

    queueMicrotask(() => {
      this.adjustTextareaHeight();
    });
  }

  private updateErrorState(): void {
    const control = this.control();

    if (!control) {
      this.hasError.set(false);
      return;
    }

    this.hasError.set(
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  private adjustTextareaHeight(): void {
    if (!this.autoResize()) {
      return;
    }

    const textarea = this.textareaElement?.nativeElement;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';

    const computedStyle = window.getComputedStyle(textarea);

    const lineHeight = Number.parseInt(
      computedStyle.lineHeight,
      10
    );

    const verticalPadding =
      Number.parseInt(computedStyle.paddingTop, 10) +
      Number.parseInt(computedStyle.paddingBottom, 10);

    const borderWidth =
      Number.parseInt(computedStyle.borderTopWidth, 10) +
      Number.parseInt(computedStyle.borderBottomWidth, 10);

    const minHeight =
      (this.minRows() * lineHeight) +
      verticalPadding +
      borderWidth;

    const maxHeight =
      (this.maxRows() * lineHeight) +
      verticalPadding +
      borderWidth;

    const scrollHeight = textarea.scrollHeight;

    const calculatedHeight = Math.min(
      Math.max(scrollHeight, minHeight),
      maxHeight
    );

    textarea.style.height = `${calculatedHeight}px`;

    textarea.style.overflowY =
      scrollHeight > maxHeight
        ? 'auto'
        : 'hidden';
  }
}