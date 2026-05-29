import {
    ChangeDetectionStrategy,
    Component,
    Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';


@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {

    @Input() fullscreen = true;
    @Input() overlay = true;
    @Input() message = 'Loading...';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    readonly isLoading$: Observable<boolean>;

    constructor(
        private readonly loaderService: LoaderService
    ) {
        this.isLoading$ = this.loaderService.isLoading();
    }

    trackByMessage(_: number, message: string): string {
        return message;
    }

    get loaderClasses(): Record<string, boolean> {
        return {
            'loader--fullscreen': this.fullscreen,
            'loader--overlay': this.overlay,
            'loader--small': this.size === 'sm',
            'loader--medium': this.size === 'md',
            'loader--large': this.size === 'lg'
        };
    }
}