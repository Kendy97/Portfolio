import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { SkillsComponent } from './skills/skills.component';
import { HomeComponent } from './home/home.component';
import { WorkComponent } from './work/work.component';
import { AboutComponent } from './about/about.component';
import { BackgroundComponent } from './background/background.component';
import { ContactComponent } from './contact/contact.component';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, RouterOutlet, SkillsComponent, HomeComponent, WorkComponent, AboutComponent, BackgroundComponent, ContactComponent],
  standalone: true,
})
export class AppComponent {
  constructor() {}


}
