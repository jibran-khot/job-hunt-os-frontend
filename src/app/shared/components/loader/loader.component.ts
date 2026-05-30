import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input
} from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';

import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [
        AsyncPipe,
        NgClass
    ],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {

    private readonly loaderService =
        inject(LoaderService);

    readonly fullscreen =
        input<boolean>(true);

    readonly overlay =
        input<boolean>(true);

    readonly message =
        input<string>('Loading...');

    readonly size =
        input<'sm' | 'md' | 'lg'>('md');

    protected readonly isLoading$: Observable<boolean> =
        this.loaderService.isLoading();

    protected readonly loaderClasses = computed<
        Record<string, boolean>
    >(() => ({
        'loader--fullscreen': this.fullscreen(),
        'loader--overlay': this.overlay(),
        'loader--small': this.size() === 'sm',
        'loader--medium': this.size() === 'md',
        'loader--large': this.size() === 'lg'
    }));

    protected trackByMessage(
        _: number,
        message: string
    ): string {
        return message;
    }
}