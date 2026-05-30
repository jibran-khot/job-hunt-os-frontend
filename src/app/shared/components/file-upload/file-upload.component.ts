import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    forwardRef,
    input,
    output,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';

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
export class FileUploadComponent
    implements ControlValueAccessor, OnDestroy {

    readonly label = input<string>('Upload File');
    readonly helperText = input<string>('');
    readonly accept = input<string>('.pdf,.doc,.docx');
    readonly multiple = input<boolean>(false);
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly maxFileSizeInMb = input<number>(5);
    readonly maxFiles = input<number>(5);

    readonly filesChange = output<File[]>();
    readonly validationError = output<string>();

    protected readonly uploadedFiles = signal<UploadedFile[]>([]);
    protected readonly isDragOver = signal<boolean>(false);
    protected readonly errorMessage = signal<string>('');
    protected readonly isDisabled = signal<boolean>(false);

    private onChange: (value: File[] | File | null) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: File[] | File | null): void {
        this.revokePreviewUrls();

        if (!value) {
            this.uploadedFiles.set([]);
            return;
        }

        const files = Array.isArray(value)
            ? value
            : [value];

        this.uploadedFiles.set(
            files.map((file) => ({
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl: this.createPreviewUrl(file)
            }))
        );
    }

    registerOnChange(
        fn: (value: File[] | File | null) => void
    ): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    protected onFileSelect(event: Event): void {
        const inputElement = event.target as HTMLInputElement;

        if (!inputElement.files?.length) {
            return;
        }

        this.processFiles(
            Array.from(inputElement.files)
        );

        inputElement.value = '';
    }

    protected onDragOver(event: DragEvent): void {
        event.preventDefault();

        if (this.isDisabled() || this.disabled()) {
            return;
        }

        this.isDragOver.set(true);
    }

    protected onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver.set(false);
    }

    protected onDrop(event: DragEvent): void {
        event.preventDefault();

        this.isDragOver.set(false);

        if (
            this.isDisabled() ||
            this.disabled() ||
            !event.dataTransfer?.files?.length
        ) {
            return;
        }

        this.processFiles(
            Array.from(event.dataTransfer.files)
        );
    }

    protected removeFile(index: number): void {
        const files = [...this.uploadedFiles()];
        const removedFile = files[index];

        if (removedFile?.previewUrl) {
            URL.revokeObjectURL(
                removedFile.previewUrl
            );
        }

        files.splice(index, 1);

        this.uploadedFiles.set(files);

        this.emitFiles();
    }

    protected trackByFileName(
        _: number,
        file: UploadedFile
    ): string {
        return `${file.name}-${file.size}`;
    }

    protected hasFiles(): boolean {
        return this.uploadedFiles().length > 0;
    }

    ngOnDestroy(): void {
        this.revokePreviewUrls();
    }

    private processFiles(files: File[]): void {
        this.clearError();

        const validatedFiles = files.filter(
            (file) => this.validateFile(file)
        );

        if (!validatedFiles.length) {
            return;
        }

        if (!this.multiple()) {
            this.clearFiles();
            validatedFiles.splice(1);
        }

        const totalFiles =
            this.uploadedFiles().length +
            validatedFiles.length;

        if (totalFiles > this.maxFiles()) {
            this.setError(
                `Maximum ${this.maxFiles()} files allowed`
            );

            return;
        }

        const mappedFiles: UploadedFile[] =
            validatedFiles.map((file) => ({
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl: this.createPreviewUrl(file)
            }));

        this.uploadedFiles.set([
            ...this.uploadedFiles(),
            ...mappedFiles
        ]);

        this.emitFiles();
    }

    private validateFile(file: File): boolean {
        const allowedExtensions = this.accept()
            .split(',')
            .map((type) =>
                type.trim().toLowerCase()
            );

        const fileExtension =
            `.${file.name.split('.').pop()?.toLowerCase()}`;

        if (
            !allowedExtensions.includes(fileExtension)
        ) {
            this.setError(
                `Invalid file type. Allowed types: ${this.accept()}`
            );

            return false;
        }

        const maxFileSizeInBytes =
            this.maxFileSizeInMb() *
            1024 *
            1024;

        if (file.size > maxFileSizeInBytes) {
            this.setError(
                `File size cannot exceed ${this.maxFileSizeInMb()} MB`
            );

            return false;
        }

        return true;
    }

    private emitFiles(): void {
        const files = this.uploadedFiles().map(
            (item) => item.file
        );

        const emittedValue = this.multiple()
            ? files
            : files[0] ?? null;

        this.onChange(emittedValue);
        this.onTouched();

        this.filesChange.emit(files);
    }

    private createPreviewUrl(
        file: File
    ): string | null {
        if (!file.type.startsWith('image/')) {
            return null;
        }

        return URL.createObjectURL(file);
    }

    private clearFiles(): void {
        this.revokePreviewUrls();
        this.uploadedFiles.set([]);
    }

    private revokePreviewUrls(): void {
        this.uploadedFiles().forEach((file) => {
            if (file.previewUrl) {
                URL.revokeObjectURL(
                    file.previewUrl
                );
            }
        });
    }

    private setError(message: string): void {
        this.errorMessage.set(message);
        this.validationError.emit(message);
    }

    private clearError(): void {
        this.errorMessage.set('');
    }
}