import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    forwardRef,
    inject,
    input,
    signal
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ValidationMessageComponent } from '../validation-message/validation-message.component';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidationMessageComponent
    ],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
    private readonly destroyRef = inject(DestroyRef);

    readonly label = input<string>('');
    readonly placeholder = input<string>('');
    readonly type = input<string>('text');
    readonly inputId = input<string>('');
    readonly helperText = input<string>('');
    readonly autocomplete = input<string>('off');

    readonly control = input<AbstractControl | null>(null);

    readonly readonly = input<boolean>(false);
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);

    readonly maxLength = input<number | null>(null);
    readonly minLength = input<number | null>(null);

    protected readonly value = signal<string>('');
    protected readonly isFocused = signal<boolean>(false);
    protected readonly isDisabled = signal<boolean>(false);
    protected readonly isPasswordVisible = signal<boolean>(false);
    protected readonly hasError = signal<boolean>(false);

    private onChange: (value: string) => void = () => { };
    private onTouched: () => void = () => { };

    constructor() {
        this.initializeControlState();
    }

    writeValue(value: string | null): void {
        this.value.set(value ?? '');
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
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;

        this.value.set(value);
        this.onChange(value);
    }

    protected onBlur(): void {
        this.isFocused.set(false);
        this.onTouched();

        this.updateErrorState();
    }

    protected onFocus(): void {
        this.isFocused.set(true);
    }

    protected togglePasswordVisibility(): void {
        if (this.type() !== 'password') {
            return;
        }

        this.isPasswordVisible.update((value) => !value);
    }

    protected getInputType(): string {
        if (this.type() !== 'password') {
            return this.type();
        }

        return this.isPasswordVisible()
            ? 'text'
            : 'password';
    }

    protected shouldShowPasswordToggle(): boolean {
        return this.type() === 'password';
    }

    protected shouldShowError(): boolean {
        const control = this.control();

        if (!control) {
            return false;
        }

        return control.invalid && (control.dirty || control.touched);
    }

    protected getCharacterCount(): number {
        return this.value().length;
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
                this.value.set((value as string) ?? '');
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