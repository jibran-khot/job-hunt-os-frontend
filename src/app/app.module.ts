import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { StatusLabelPipe } from './shared/pipes/status-label.pipe';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';

@NgModule({
  declarations: [
    AppComponent,
    DateFormatPipe,
    StatusLabelPipe,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
