import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SkillsComponent } from './skills/skills.component';
import { WorkComponent } from './work/work.component';
import { ContactComponent } from './contact/contact.component';

export const appRoutes: Routes = [

  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'HomePage' }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'skills',
    component: SkillsComponent
    ,
    data: { animation: 'SkillsPage' }
  },
  {
    path: 'work',
    component: WorkComponent,
    data: { animation: 'WorkPage' }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { animation: 'contactPage' }
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
