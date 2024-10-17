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

    const draw = () => {
      ctx.fillStyle = '#171c28';
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
