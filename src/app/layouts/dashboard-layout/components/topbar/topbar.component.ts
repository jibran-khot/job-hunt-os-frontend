import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
    Input,
    Output,
    inject,
} from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
    @Input({ required: true })
    public isSidebarCollapsed = false;

    @Output()
    public readonly menuToggle =
        new EventEmitter<void>();

    private readonly authService =
        inject(AuthService);

    private readonly router =
        inject(Router);

    public isProfileMenuOpen = false;

    public toggleMenu(): void {
        this.menuToggle.emit();
    }

    public toggleProfileMenu(
        event: MouseEvent,
    ): void {
        event.stopPropagation();

        this.isProfileMenuOpen =
            !this.isProfileMenuOpen;
    }

    public navigateToSettings(): void {
        this.closeProfileMenu();

        void this.router.navigate([
            '/app/settings',
        ]);
    }

    public logout(): void {
        this.closeProfileMenu();

        this.authService.logout();
    }

    @HostListener('document:click')
    public onDocumentClick(): void {
        this.closeProfileMenu();
    }

    public stopPropagation(
        event: MouseEvent,
    ): void {
        event.stopPropagation();
    }

    private closeProfileMenu(): void {
        this.isProfileMenuOpen = false;
    }
}