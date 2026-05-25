import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    ReactiveFormsModule
} from '@angular/forms';
import {
    Subject,
    debounceTime,
    distinctUntilChanged,
    takeUntil
} from 'rxjs';

@Component({
    selector: 'app-search-box',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent
    implements OnInit, OnDestroy {

    @Input() public placeholder =
        'Search...';

    @Input() public debounce = 400;

    @Input() public initialValue = '';

    @Input() public disabled = false;

    @Input() public loading = false;

    @Input() public showClearButton = true;

    @Output() public search =
        new EventEmitter<string>();

    @Output() public cleared =
        new EventEmitter<void>();

    public readonly searchControl =
        new FormControl<string>('', {
            nonNullable: true
        });

    private readonly destroy$ =
        new Subject<void>();

    public ngOnInit(): void {
        this.initializeControl();
        this.initializeSearchStream();
    }

    public onSearch(): void {
        const value =
            this.searchControl.getRawValue().trim();

        this.search.emit(value);
    }

    public clearSearch(): void {
        this.searchControl.setValue('');

        this.cleared.emit();
        this.search.emit('');
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeControl(): void {
        this.searchControl.setValue(
            this.initialValue
        );

        if (this.disabled) {
            this.searchControl.disable({
                emitEvent: false
            });

            return;
        }

        this.searchControl.enable({
            emitEvent: false
        });
    }

    private initializeSearchStream(): void {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(this.debounce),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe((value: string) => {
                this.search.emit(
                    value.trim()
                );
            });
    }
}