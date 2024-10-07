import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background.component.html',
  styleUrl: './background.component.css'
})
export class BackgroundComponent  {



  constructor() { }

  bubbles = Array.from({ length: 250 }, () => ({
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 10 + 100}px`,
      height: `${Math.random() * 10 + 100}px`,
      animationDelay: `${Math.random() * 10}s`,
    }
  }));
 
}
