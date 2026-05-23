import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        loadChildren: () =>
            import('./features/auth/auth.routes').then(
                (module) => module.authRoutes,
            ),
    },

    {
        path: 'app',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/dashboard/dashboard.routes').then(
                (module) => module.dashboardRoutes,
            ),
    },

    {
        path: 'applications',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/applications/applications.routes').then(
                (module) => module.applicationRoutes,
            ),
    },

    {
        path: 'activities',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/activities/activities.routes').then(
                (module) => module.activitiesRoutes,
            ),
    },

    {
        path: 'followups',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/followups/followups.routes').then(
                (module) => module.followupRoutes,
            ),
    },

    {
        path: 'interviews',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/interviews/interviews.routes').then(
                (module) => module.interviewRoutes,
            ),
    },

    {
        path: 'recruiters',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/recruiters/recruiters.routes').then(
                (module) => module.recruiterRoutes,
            ),
    },

    {
        path: 'resumes',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/resumes/resumes.routes').then(
                (module) => module.resumeRoutes,
            ),
    },

    {
        path: 'settings',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/settings/settings.routes').then(
                (module) => module.settingsRoutes,
            ),
    },

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },

    {
        path: '**',
        redirectTo: 'login',
    },
];