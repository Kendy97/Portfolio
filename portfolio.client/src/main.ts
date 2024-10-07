import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from '../src/app/app.routes';
import { AppComponent } from '../src/app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes)],
});
