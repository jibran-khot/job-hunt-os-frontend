import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';


interface SidebarNavigationItem {
    label: string;
    icon: string;
    route: string;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
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
                route: '/applications',
            },
            {
                label: 'Activities',
                icon: 'timeline',
                route: '/activities',
            },
            {
                label: 'Followups',
                icon: 'notifications',
                route: '/followups',
            },
            {
                label: 'Interviews',
                icon: 'event',
                route: '/interviews',
            },
            {
                label: 'Recruiters',
                icon: 'groups',
                route: '/recruiters',
            },
            {
                label: 'Resumes',
                icon: 'description',
                route: '/resumes',
            },
            {
                label: 'Settings',
                icon: 'settings',
                route: '/settings',
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