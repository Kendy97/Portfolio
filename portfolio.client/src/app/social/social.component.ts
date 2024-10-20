import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social.component.html',
  styleUrl: './social.component.css'
})
export class SocialComponent {

  openGmail() {
    const email = 'mateusz.kedzierski1997@gmail.com'; 
    const gmailLink = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=${email}`;
    window.open(gmailLink, '_blank');
  }
}
