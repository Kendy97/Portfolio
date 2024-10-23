import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SocialComponent } from '../social/social.component';
import { AlertService } from '../service/sweet-alert.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NgIf, HttpClientModule, FormsModule,SocialComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  constructor(private http: HttpClient, private alertService: AlertService) { }

  onSubmit(formData: any, contactForm: NgForm) {
    if (formData.subject && formData.email && formData.message) {
      const data = {
        subject: formData.subject,
        email: formData.email,
        message: formData.message
      };

      this.http.post('api/Mail/send-email', data)
        .subscribe(
          response => {
            this.alertService.showSuccess('Success', 'Wiadomość została wysłana!');
            contactForm.reset();
          },
          error => {
            console.error(error);
            this.alertService.showError('Error', 'Wystąpił błąd przy wysyłaniu wiadomości. Spróbuj ponownie później!');
         }
        );

    }
  }
}
