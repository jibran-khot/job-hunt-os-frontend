import { Routes } from '@angular/router';

export const applicationsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import(
                '../pages/applications-list/applications-list.component'
            ).then(
                (component) =>
                    component.ApplicationsListComponent
            )
    },
    {
        path: 'create',
        loadComponent: () =>
            import(
                '../pages/create-application/create-application.component'
            ).then(
                (component) =>
                    component.CreateApplicationComponent
            )
    },
    {
        path: ':id/edit',
        loadComponent: () =>
            import(
                '../pages/edit-application/edit-application.component'
            ).then(
                (component) =>
                    component.EditApplicationComponent
            )
    },
    {
        path: ':id',
        loadComponent: () =>
            import(
                '../pages/application-details/application-details.component'
            ).then(
                (component) =>
                    component.ApplicationDetailsComponent
            )
    }
];