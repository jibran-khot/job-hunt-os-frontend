import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        SidebarComponent,
        TopbarComponent,
    ],
    templateUrl: './dashboard-layout.component.html',
    styleUrl: './dashboard-layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
    public isSidebarCollapsed = false;

    public isMobileSidebarOpen = false;

    public readonly mobileBreakpoint = 992;

    public toggleSidebar(): void {
        if (window.innerWidth <= this.mobileBreakpoint) {
            this.isMobileSidebarOpen =
                !this.isMobileSidebarOpen;

            return;
        }

        this.isSidebarCollapsed =
            !this.isSidebarCollapsed;
    }

    public closeMobileSidebar(): void {
        this.isMobileSidebarOpen = false;
    }

    @HostListener('window:resize')
    public onResize(): void {
        if (window.innerWidth > this.mobileBreakpoint) {
            this.isMobileSidebarOpen = false;
        }
    }
}