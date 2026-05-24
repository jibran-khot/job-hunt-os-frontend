import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    Output
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormsModule,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    ValidationErrors,
    Validator
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements ControlValueAccessor, Validator {

    @Input() label = '';
    @Input() placeholder = '';
    @Input() helperText = '';
    @Input() errorMessage = '';
    @Input() minDate?: string | null;
    @Input() maxDate?: string | null;
    @Input() disabledDates: string[] = [];
    @Input() required = false;
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() appearance: 'default' | 'compact' = 'default';
    @Input() id = `date-picker-${Math.random().toString(36).slice(2, 11)}`;

    @Output() dateChange = new EventEmitter<string | null>();

    value: string | null = null;

    protected onChange: (value: string | null) => void = () => { };
    protected onTouched: () => void = () => { };

    writeValue(value: string | Date | null): void {
        if (!value) {
            this.value = null;
            return;
        }

        if (value instanceof Date) {
            this.value = this.formatDate(value);
            return;
        }

        this.value = value;
    }

    registerOnChange(fn: (value: string | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    validate(_: AbstractControl): ValidationErrors | null {
        if (this.required && !this.value) {
            return {
                required: true
            };
        }

        if (this.value && this.minDate && this.value < this.minDate) {
            return {
                minDate: true
            };
        }

        if (this.value && this.maxDate && this.value > this.maxDate) {
            return {
                maxDate: true
            };
        }

        if (
            this.value &&
            this.disabledDates.length > 0 &&
            this.disabledDates.includes(this.value)
        ) {
            return {
                disabledDate: true
            };
        }

        return null;
    }

    selectDate(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const selectedDate = inputElement.value || null;

        if (
            selectedDate &&
            this.disabledDates.includes(selectedDate)
        ) {
            inputElement.value = '';

            this.value = null;

            this.onChange(null);
            this.onTouched();

            this.dateChange.emit(null);

            return;
        }

        this.value = selectedDate;

        this.onChange(this.value);
        this.onTouched();

        this.dateChange.emit(this.value);
    }

    clearDate(): void {
        if (this.disabled || this.readonly) {
            return;
        }

        this.value = null;

        this.onChange(this.value);
        this.onTouched();

        this.dateChange.emit(this.value);
    }

    trackByDisabledDate(_: number, date: string): string {
        return date;
    }

    get hasValue(): boolean {
        return !!this.value;
    }

    get min(): string | null {
        return this.minDate ?? null;
    }

    get max(): string | null {
        return this.maxDate ?? null;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}