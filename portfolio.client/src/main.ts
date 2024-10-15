import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from '../src/app/app.routes';
import { AppComponent } from '../src/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers:
    [
      provideRouter(appRoutes),
      importProvidersFrom(BrowserAnimationsModule)
  ],
 
});
