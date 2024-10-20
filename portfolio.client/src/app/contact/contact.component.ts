import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocialComponent } from '../social/social.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NgIf, HttpClientModule, FormsModule,SocialComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  constructor(private http: HttpClient) { }

  onSubmit(formData: any) {
    if (formData.subject && formData.email && formData.message) {
      const data = {
        subject: formData.subject,
        email: formData.email,
        message: formData.message
      };

      this.http.post('/api/contact/send-email', data)
        .subscribe(
          response => {
        
            alert('Wiadomość została wysłana!');
          },
          error => {
       
            alert('Wystąpił błąd przy wysyłaniu wiadomości. Spróbuj ponownie później.');
          }
        );
    }
  }
}
