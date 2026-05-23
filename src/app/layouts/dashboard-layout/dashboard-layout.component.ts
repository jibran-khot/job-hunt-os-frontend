import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../shared/layout/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/layout/topbar/topbar.component';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        TopbarComponent,
    ],
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent
    implements OnInit {
    public isSidebarCollapsed = false;

    public isMobileSidebarOpen = false;

    public readonly mobileBreakpoint = 992;

    public ngOnInit(): void {
        this.initializeLayout();
    }

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

    private initializeLayout(): void {
        this.onResize();
    }
}