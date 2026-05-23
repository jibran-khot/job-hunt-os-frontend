import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LoaderComponent } from './shared/ui/loader/loader.component';

import { AuthService } from './core/auth/services/auth.service';
import { NotificationService } from './core/services/notification.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        LoaderComponent,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    public ngOnInit(): void {
        this.initializeApp();
    }

    private initializeApp(): void {
        this.initializeAuthentication();
        this.initializeGlobalListeners();
    }

    private initializeAuthentication(): void {
        this.authService
            .refreshUser()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                error: (error: unknown) => {
                    console.error('Application initialization failed:', error);

                    this.notificationService.error(
                        'Unable to restore your session. Please login again.',
                    );

                    this.authService.logout();
                },
            });
    }

    private initializeGlobalListeners(): void {
        window.addEventListener('online', this.handleOnlineStatus);
        window.addEventListener('offline', this.handleOfflineStatus);
    }

    private readonly handleOnlineStatus = (): void => {
        this.notificationService.success('Connection restored.');
    };

    private readonly handleOfflineStatus = (): void => {
        this.notificationService.warning(
            'You are currently offline.',
        );
    };
}