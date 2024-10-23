import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }


  showAlert(title: string, text: string, icon: SweetAlertIcon = 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  }
  showSuccess(title: string, text: string): void {
    this.showAlert(title, text, 'success');
  }
  showError(title: string, text: string): void {
    this.showAlert(title, text, 'error');
  }
}
