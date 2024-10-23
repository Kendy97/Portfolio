import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WorkExperienceComponent } from '../work-experience/work-experience.component';
import { EducationComponent } from '../education/education.component';
import { TechskillsComponent } from '../techskills/techskills.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, WorkExperienceComponent, EducationComponent,TechskillsComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {

}
