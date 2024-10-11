import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule,HomeComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
