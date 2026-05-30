import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    output,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    ValidationErrors,
    Validator
} from '@angular/forms';

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [
        CommonModule,
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
export class DatePickerComponent
    implements ControlValueAccessor, Validator {

    readonly label = input<string>('');
    readonly placeholder = input<string>('');
    readonly helperText = input<string>('');
    readonly minDate = input<string | null>(null);
    readonly maxDate = input<string | null>(null);
    readonly disabledDates = input<string[]>([]);
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly readonly = input<boolean>(false);
    readonly appearance = input<'default' | 'compact'>('default');
    readonly id = input<string>('date-picker');

    readonly dateChange = output<string | null>();

    protected readonly value = signal<string | null>(null);
    protected readonly isDisabled = signal<boolean>(false);

    private onChange: (value: string | null) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: string | Date | null): void {
        if (!value) {
            this.value.set(null);
            return;
        }

        if (value instanceof Date) {
            this.value.set(this.formatDate(value));
            return;
        }

        this.value.set(value);
    }

    registerOnChange(fn: (value: string | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    validate(_: AbstractControl): ValidationErrors | null {
        const currentValue = this.value();

        if (this.required() && !currentValue) {
            return {
                required: true
            };
        }

        if (
            currentValue &&
            this.minDate() &&
            currentValue < this.minDate()!
        ) {
            return {
                minDate: true
            };
        }

        if (
            currentValue &&
            this.maxDate() &&
            currentValue > this.maxDate()!
        ) {
            return {
                maxDate: true
            };
        }

        if (
            currentValue &&
            this.disabledDates().includes(currentValue)
        ) {
            return {
                disabledDate: true
            };
        }

        return null;
    }

    protected selectDate(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const selectedDate = inputElement.value || null;

        if (
            selectedDate &&
            this.disabledDates().includes(selectedDate)
        ) {
            inputElement.value = '';

            this.value.set(null);

            this.onChange(null);
            this.onTouched();

            this.dateChange.emit(null);

            return;
        }

        this.value.set(selectedDate);

        this.onChange(selectedDate);
        this.onTouched();

        this.dateChange.emit(selectedDate);
    }

    protected clearDate(): void {
        if (this.disabled() || this.readonly() || this.isDisabled()) {
            return;
        }

        this.value.set(null);

        this.onChange(null);
        this.onTouched();

        this.dateChange.emit(null);
    }

    protected trackByDisabledDate(
        _: number,
        date: string
    ): string {
        return date;
    }

    protected hasValue(): boolean {
        return this.value() !== null;
    }

    protected getMinDate(): string | null {
        return this.minDate();
    }

    protected getMaxDate(): string | null {
        return this.maxDate();
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
    protected handleBlur(): void {
        this.onTouched();
    }
}