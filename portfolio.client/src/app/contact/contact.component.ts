import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NgIf, HttpClientModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  constructor(private http: HttpClient) { }

  onSubmit(formData: any) {
    if (formData.name && formData.email && formData.message) {
      const data = {
        name: formData.name,
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
