import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    Output
} from '@angular/core';
import {
    ControlValueAccessor,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    type: string;
    previewUrl: string | null;
}

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploadComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements ControlValueAccessor {

    @Input() label = 'Upload File';
    @Input() helperText = '';
    @Input() accept = '.pdf,.doc,.docx';
    @Input() multiple = false;
    @Input() required = false;
    @Input() disabled = false;
    @Input() maxFileSizeInMb = 5;
    @Input() maxFiles = 5;

    @Output() filesChange = new EventEmitter<File[]>();
    @Output() validationError = new EventEmitter<string>();

    uploadedFiles: UploadedFile[] = [];

    isDragOver = false;
    errorMessage = '';

    protected onChange: (value: File[] | File | null) => void = () => { };
    protected onTouched: () => void = () => { };

    writeValue(value: File[] | File | null): void {
        if (!value) {
            this.clearFiles();
            return;
        }

        const files = Array.isArray(value)
            ? value
            : [value];

        this.uploadedFiles = files.map((file) => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            previewUrl: this.createPreviewUrl(file)
        }));
    }

    registerOnChange(fn: (value: File[] | File | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onFileSelect(event: Event): void {
        const inputElement = event.target as HTMLInputElement;

        if (!inputElement.files?.length) {
            return;
        }

        this.processFiles(Array.from(inputElement.files));

        inputElement.value = '';
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();

        if (this.disabled) {
            return;
        }

        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();

        this.isDragOver = false;

        if (this.disabled || !event.dataTransfer?.files?.length) {
            return;
        }

        this.processFiles(Array.from(event.dataTransfer.files));
    }

    removeFile(index: number): void {
        const removedFile = this.uploadedFiles[index];

        if (removedFile?.previewUrl) {
            URL.revokeObjectURL(removedFile.previewUrl);
        }

        this.uploadedFiles.splice(index, 1);

        this.emitFiles();
    }

    validateFile(file: File): boolean {
        const allowedExtensions = this.accept
            .split(',')
            .map((type) => type.trim().toLowerCase());

        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

        const isValidExtension = allowedExtensions.includes(fileExtension);

        if (!isValidExtension) {
            this.setError(
                `Invalid file type. Allowed types: ${this.accept}`
            );

            return false;
        }

        const maxFileSizeInBytes = this.maxFileSizeInMb * 1024 * 1024;

        if (file.size > maxFileSizeInBytes) {
            this.setError(
                `File size cannot exceed ${this.maxFileSizeInMb} MB`
            );

            return false;
        }

        return true;
    }

    trackByFileName(_: number, file: UploadedFile): string {
        return `${file.name}-${file.size}`;
    }

    get hasFiles(): boolean {
        return this.uploadedFiles.length > 0;
    }

    private processFiles(files: File[]): void {
        this.clearError();

        const validatedFiles = files.filter((file) =>
            this.validateFile(file)
        );

        if (!validatedFiles.length) {
            return;
        }

        if (!this.multiple) {
            this.clearFiles();
            validatedFiles.splice(1);
        }

        const totalFiles = this.uploadedFiles.length + validatedFiles.length;

        if (totalFiles > this.maxFiles) {
            this.setError(
                `Maximum ${this.maxFiles} files allowed`
            );

            return;
        }

        const mappedFiles: UploadedFile[] = validatedFiles.map((file) => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            previewUrl: this.createPreviewUrl(file)
        }));

        this.uploadedFiles = [
            ...this.uploadedFiles,
            ...mappedFiles
        ];

        this.emitFiles();
    }

    private emitFiles(): void {
        const files = this.uploadedFiles.map((item) => item.file);

        const emittedValue = this.multiple
            ? files
            : files[0] ?? null;

        this.onChange(emittedValue);
        this.onTouched();

        this.filesChange.emit(files);
    }

    private createPreviewUrl(file: File): string | null {
        if (!file.type.startsWith('image/')) {
            return null;
        }

        return URL.createObjectURL(file);
    }

    private clearFiles(): void {
        this.uploadedFiles.forEach((file) => {
            if (file.previewUrl) {
                URL.revokeObjectURL(file.previewUrl);
            }
        });

        this.uploadedFiles = [];
    }

    private setError(message: string): void {
        this.errorMessage = message;
        this.validationError.emit(message);
    }

    private clearError(): void {
        this.errorMessage = '';
    }
}