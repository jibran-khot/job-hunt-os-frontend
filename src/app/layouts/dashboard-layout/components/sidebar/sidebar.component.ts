import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
} from '@angular/core';

import {
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { AuthService } from '../../../../core/auth/services/auth.service';

interface SidebarNavigationItem {
    label: string;
    icon: string;
    route: string;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    @Input({ required: true })
    public isCollapsed = false;

    @Input({ required: true })
    public isMobileOpen = false;

    @Output()
    public readonly sidebarToggle =
        new EventEmitter<void>();

    @Output()
    public readonly mobileClose =
        new EventEmitter<void>();

    private readonly router = inject(Router);

    private readonly authService =
        inject(AuthService);

    public readonly navigationItems: SidebarNavigationItem[] =
        [
            {
                label: 'Dashboard',
                icon: 'dashboard',
                route: '/app',
            },
            {
                label: 'Applications',
                icon: 'work',
                route: '/app/applications',
            },
            {
                label: 'Activities',
                icon: 'timeline',
                route: '/app/activities',
            },
            {
                label: 'Followups',
                icon: 'notifications',
                route: '/app/followups',
            },
            {
                label: 'Interviews',
                icon: 'event',
                route: '/app/interviews',
            },
            {
                label: 'Recruiters',
                icon: 'groups',
                route: '/app/recruiters',
            },
            {
                label: 'Resumes',
                icon: 'description',
                route: '/app/resumes',
            },
            {
                label: 'Settings',
                icon: 'settings',
                route: '/app/settings',
            },
        ];

    public toggleSidebar(): void {
        this.sidebarToggle.emit();
    }

    public navigate(route: string): void {
        void this.router.navigate([route]);

        if (window.innerWidth <= 992) {
            this.mobileClose.emit();
        }
    }

    public isActiveRoute(route: string): boolean {
        return this.router.url.startsWith(route);
    }

    public logout(): void {
        this.authService.logout();
    }
}