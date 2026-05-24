import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    HostListener,
    inject,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface AuthenticatedUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
    role?: string;
}

interface TopbarAction {
    id: string;
    label: string;
    icon: string;
    route?: string;
}

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly isProfileMenuOpen = signal<boolean>(false);
    protected readonly isNotificationPanelOpen = signal<boolean>(false);
    protected readonly unreadNotificationCount = signal<number>(3);

    protected readonly quickActions: TopbarAction[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'dashboard'
        },
        {
            id: 'applications',
            label: 'Applications',
            icon: 'work'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'settings'
        }
    ];

    protected readonly currentUser = signal<AuthenticatedUser | null>(null);

    constructor() {
        this.initializeUserState();
    }

    protected logout(): void {
        this.closeAllMenus();

        this.authService.logout();

        this.notificationService.success(
            'You have been logged out successfully.'
        );

        void this.router.navigate(['/auth/login']);
    }

    protected openNotifications(): void {
        const currentState = this.isNotificationPanelOpen();

        this.isNotificationPanelOpen.set(!currentState);

        if (!currentState) {
            this.isProfileMenuOpen.set(false);
        }
    }

    protected openProfileMenu(): void {
        const currentState = this.isProfileMenuOpen();

        this.isProfileMenuOpen.set(!currentState);

        if (!currentState) {
            this.isNotificationPanelOpen.set(false);
        }
    }

    protected navigateToProfile(): void {
        this.closeAllMenus();

        void this.router.navigate(['/settings/profile']);
    }

    protected navigateToSettings(): void {
        this.closeAllMenus();

        void this.router.navigate(['/settings']);
    }

    protected trackByActionId(
        index: number,
        action: TopbarAction
    ): string {
        return action.id;
    }

    protected getUserInitials(): string {
        const user = this.currentUser();

        if (!user) {
            return 'U';
        }

        const firstInitial = user.firstName?.charAt(0) ?? '';
        const lastInitial = user.lastName?.charAt(0) ?? '';

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    @HostListener('document:click')
    protected onDocumentClick(): void {
        this.closeAllMenus();
    }

    protected stopPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }

    private initializeUserState(): void {
        const currentUser = this.authService.getCurrentUser?.();

        if (currentUser) {
            this.currentUser.set({
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                avatarUrl: currentUser.avatarUrl ?? null,
                role: currentUser.role
            });
        }

        const authState$ = this.authService.authState$;

        if (!authState$) {
            return;
        }

        authState$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((authState) => {
                if (!authState?.user) {
                    this.currentUser.set(null);
                    return;
                }

                this.currentUser.set({
                    id: authState.user.id,
                    firstName: authState.user.firstName,
                    lastName: authState.user.lastName,
                    email: authState.user.email,
                    avatarUrl: authState.user.avatarUrl ?? null,
                    role: authState.user.role
                });
            });
    }

    private closeAllMenus(): void {
        this.isProfileMenuOpen.set(false);
        this.isNotificationPanelOpen.set(false);
    }
}