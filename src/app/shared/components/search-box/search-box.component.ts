import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
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
    map,
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
    styleUrl: './search-box.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent
    implements OnInit, OnChanges, OnDestroy {

    @Input()
    public placeholder = 'Search...';

    @Input()
    public debounce = 400;

    @Input()
    public initialValue = '';

    @Input()
    public disabled = false;

    @Input()
    public loading = false;

    @Input()
    public showClearButton = true;

    @Output()
    public readonly search =
        new EventEmitter<string>();

    @Output()
    public readonly cleared =
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

    public ngOnChanges(
        changes: SimpleChanges
    ): void {
        if (
            changes['initialValue'] &&
            !changes['initialValue'].firstChange
        ) {
            this.searchControl.setValue(
                this.initialValue,
                {
                    emitEvent: false
                }
            );
        }

        if (
            changes['disabled'] &&
            !changes['disabled'].firstChange
        ) {
            if (this.disabled) {
                this.searchControl.disable({
                    emitEvent: false
                });
            } else {
                this.searchControl.enable({
                    emitEvent: false
                });
            }
        }
    }

    public onSearch(): void {
        const value =
            this.searchControl
                .getRawValue()
                .trim();

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
            this.initialValue,
            {
                emitEvent: false
            }
        );

        if (this.disabled) {
            this.searchControl.disable({
                emitEvent: false
            });
        }
    }

    private initializeSearchStream(): void {
        this.searchControl.valueChanges
            .pipe(
                map((value) => value.trim()),
                debounceTime(this.debounce),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe((value) => {
                this.search.emit(value);
            });
    }
}