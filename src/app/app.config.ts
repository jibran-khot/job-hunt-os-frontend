import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),

        provideZoneChangeDetection({
            eventCoalescing: true,
            runCoalescing: true,
        }),

        provideRouter(
            routes,
            withComponentInputBinding(),
            withEnabledBlockingInitialNavigation(),
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'top',
            }),
        ),

        provideHttpClient(
            withInterceptors([
                authInterceptor,
            ]),
        ),

        provideAnimations(),
    ],
};