import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
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

export interface SelectOption<T = string> {
    label: string;
    value: T;
    disabled?: boolean;
}

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidationMessageComponent
    ],
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T = string>
    implements ControlValueAccessor {
    private readonly destroyRef = inject(DestroyRef);

    readonly label = input<string>('');
    readonly placeholder = input<string>('Select an option');
    readonly selectId = input<string>('');
    readonly helperText = input<string>('');
    readonly control = input<AbstractControl | null>(null);

    readonly options = input<SelectOption<T>[]>([]);

    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);

    protected readonly value = signal<T | null>(null);
    protected readonly isFocused = signal<boolean>(false);
    protected readonly isDisabled = signal<boolean>(false);
    protected readonly hasError = signal<boolean>(false);

    private onChange: (value: T | null) => void = () => { };
    private onTouched: () => void = () => { };

    constructor() {
        this.initializeControlState();
    }

    writeValue(value: T | null): void {
        this.value.set(value);
    }

    registerOnChange(fn: (value: T | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    protected onSelectChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;

        const selectedValue = selectElement.value as T;

        const normalizedValue = selectedValue === ''
            ? null
            : selectedValue;

        this.value.set(normalizedValue);
        this.onChange(normalizedValue);
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
        const control = this.control();

        if (!control) {
            return false;
        }

        return control.invalid && (control.dirty || control.touched);
    }

    protected isSelectedOption(option: SelectOption<T>): boolean {
        return option.value === this.value();
    }

    protected trackByOptionValue(
        index: number,
        option: SelectOption<T>
    ): string {
        return String(option.value);
    }

    private initializeControlState(): void {
        const control = this.control();

        if (!control) {
            return;
        }

        control.statusChanges
            ?.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.updateErrorState();
            });

        control.valueChanges
            ?.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value: unknown) => {
                this.value.set((value as T) ?? null);
            });

        this.updateErrorState();
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
}