// src/shared/alert.service.ts
import { Injectable } from '@angular/core';

import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  /**
   * Show a custom styled alert
   * @param message The message to display
   * @param icon The alert icon (success, error, warning, info, question)
   * @param timer How long to show the alert (ms) — default is 1000
   */
  showAlert(message: string, icon: SweetAlertIcon = 'success', timer: number = 1000): void {
    const swalWithStyle = Swal.mixin({
      customClass: {
        popup: 'my-custom-popup',
      },
    });

    swalWithStyle.fire({
      width: 400,
      color: '#000',
      icon,
      title: message,
      timer,
      showConfirmButton: false,
    });
  }

  success(message: string, timer = 3000): void {
    this.showToast(message, 'success', timer);
  }

  error(message: string, timer = 3000): void {
    this.showToast(message, 'error', timer);
  }

  warning(message: string, timer = 3000): void {
    this.showToast(message, 'warning', timer);
  }

  info(message: string, timer = 300): void {
    this.showToast(message, 'info', timer);
  }

  showToast(message: string, icon: SweetAlertIcon = 'success', timer: number = 3000): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
    });
  }
}
