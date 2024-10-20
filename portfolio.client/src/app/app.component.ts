import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { provideRouter } from '@angular/router';
import { RouterOutlet, } from '@angular/router';
import { SkillsComponent } from './skills/skills.component';
import { HomeComponent } from './home/home.component';
import { WorkComponent } from './work/work.component';
import { AboutComponent } from './about/about.component';
import { BackgroundComponent } from './background/background.component';
import { ContactComponent } from './contact/contact.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialComponent } from './social/social.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, RouterOutlet, SkillsComponent, HomeComponent, WorkComponent, AboutComponent, BackgroundComponent, ContactComponent,SocialComponent],
  standalone: true,
  animations: [
    trigger('routeAnimations', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(50px)', filter: 'blur(5px)' }),
        animate('600ms cubic-bezier(0.25, 1, 0.5, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)', filter: 'blur(0)' }))
      ])
    ])

  ]
})
export class AppComponent {
  constructor() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
