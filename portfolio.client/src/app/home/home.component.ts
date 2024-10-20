import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SocialComponent } from '../social/social.component';
import Typed from 'typed.js';
import lottie from 'lottie-web';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,SocialComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('lottieContainer') lottieContainer!: ElementRef;

  ngAfterViewInit() {

    const options = {
      strings: ['Mateusz Kędzierski'],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      startDelay: 600,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    };
    const typed = new Typed('.typed-name', options);

    lottie.loadAnimation({
      container: this.lottieContainer.nativeElement, 
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animation_1729424211354.json'
    });
  }
}
