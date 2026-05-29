import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LoaderComponent } from './shared/components/loader/loader.component';

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
    styleUrl: './app.component.scss',
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
    }

    private initializeAuthentication(): void {
        this.authService
            .refreshUser()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                error: () => {
                    this.authService.logout();
                },
            });
    }
}