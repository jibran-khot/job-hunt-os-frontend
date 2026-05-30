import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    ValidationErrors
} from '@angular/forms';

@Component({
    selector: 'app-validation-message',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './validation-message.component.html',
    styleUrls: ['./validation-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationMessageComponent {

    readonly control = input<AbstractControl | null>(null);

    readonly customMessages = input<Record<string, string>>({});

    readonly showIcon = input<boolean>(true);

    readonly submitted = input<boolean>(false);

    protected readonly shouldShowError = computed(() => {
        const control = this.control();

        if (!control) {
            return false;
        }

        return (
            control.invalid &&
            (
                control.touched ||
                control.dirty ||
                this.submitted()
            )
        );
    });

    protected readonly errorMessage = computed(() => {
        const control = this.control();

        if (!control?.errors) {
            return '';
        }

        return this.getErrorMessage(control.errors);
    });

    protected getErrorMessage(
        errors: ValidationErrors
    ): string {
        const firstErrorKey = Object.keys(errors)[0];

        if (!firstErrorKey) {
            return '';
        }

        const customMessage =
            this.customMessages()[firstErrorKey];

        if (customMessage) {
            return customMessage;
        }

        switch (firstErrorKey) {
            case 'required':
                return 'This field is required';

            case 'email':
                return 'Please enter a valid email address';

            case 'minlength':
                return `Minimum ${errors['minlength'].requiredLength} characters required`;

            case 'maxlength':
                return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;

            case 'min':
                return `Minimum value is ${errors['min'].min}`;

            case 'max':
                return `Maximum value is ${errors['max'].max}`;

            case 'pattern':
                return 'Invalid format';

            case 'requiredTrue':
                return 'This field must be checked';

            case 'minDate':
                return 'Selected date is below minimum allowed date';

            case 'maxDate':
                return 'Selected date exceeds maximum allowed date';

            case 'disabledDate':
                return 'Selected date is unavailable';

            default:
                return 'Invalid field value';
        }
    }
}