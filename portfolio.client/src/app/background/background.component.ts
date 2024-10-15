import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background.component.html',
  styleUrl: './background.component.css'
})
export class BackgroundComponent implements AfterViewInit {
  @ViewChild('backgroundCanvas', { static: false }) canvasRef!: ElementRef;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let colorValue = 130;
    let increment = 0.1;  

    const draw = () => {
      colorValue += increment;
      if (colorValue >= 130 || colorValue <= 80) {
        increment = -increment;
      }
      const color = `rgb(${colorValue}, ${colorValue + 5}, ${colorValue + 20})`;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }


}
