import { Routes } from '@angular/router';

import { authGuard } from './core/auth/guards/auth.guard';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        loadChildren: () =>
            import('./features/auth/routes/auth.routes').then(
                (module) => module.authRoutes,
            ),
    },

    {
        path: 'app',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./features/dashboard/routes/dashboard.routes').then(
                        (module) => module.dashboardRoutes,
                    ),
            },
            {
                path: 'applications',
                loadChildren: () =>
                    import(
                        './features/applications/routes/applications.routes'
                    ).then((module) => module.applicationRoutes),
            },
            {
                path: 'activities',
                loadChildren: () =>
                    import('./features/activities/routes/activities.routes').then(
                        (module) => module.activitiesRoutes,
                    ),
            },
            {
                path: 'followups',
                loadChildren: () =>
                    import('./features/followups/routes/followups.routes').then(
                        (module) => module.followupRoutes,
                    ),
            },
            {
                path: 'interviews',
                loadChildren: () =>
                    import('./features/interviews/routes/interviews.routes').then(
                        (module) => module.interviewRoutes,
                    ),
            },
            {
                path: 'recruiters',
                loadChildren: () =>
                    import('./features/recruiters/routes/recruiters.routes').then(
                        (module) => module.recruiterRoutes,
                    ),
            },
            {
                path: 'resumes',
                loadChildren: () =>
                    import('./features/resumes/routes/resumes.routes').then(
                        (module) => module.resumeRoutes,
                    ),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./features/settings/routes/settings.routes').then(
                        (module) => module.settingsRoutes,
                    ),
            },
        ],
    },

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },

    {
        path: '**',
        redirectTo: '/login',
    },
]; ``