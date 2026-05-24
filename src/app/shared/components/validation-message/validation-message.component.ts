import {
    ChangeDetectionStrategy,
    Component,
    Input
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

    @Input({ required: true })
    control: AbstractControl | null = null;

    @Input()
    customMessages: Record<string, string> = {};

    @Input()
    showIcon = true;

    @Input()
    submitted = false;

    get shouldShowError(): boolean {
        if (!this.control) {
            return false;
        }

        return this.control.invalid &&
            (this.control.touched || this.control.dirty || this.submitted);
    }

    get errorMessage(): string {
        if (!this.control?.errors) {
            return '';
        }

        return this.getErrorMessage(this.control.errors);
    }

    getErrorMessage(errors: ValidationErrors): string {
        const firstErrorKey = Object.keys(errors)[0];

        if (!firstErrorKey) {
            return '';
        }

        if (this.customMessages[firstErrorKey]) {
            return this.customMessages[firstErrorKey];
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