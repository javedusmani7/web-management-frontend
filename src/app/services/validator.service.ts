import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})


export class ValidatorService {

  static emailFormat(control: AbstractControl): { [key: string]: any } | null {
    const valid = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(control.value);
    return valid ? null : { 'invalidEmail': true };
  }

  static alphanumeric(control: AbstractControl): { [key: string]: any } | null {
    const valid = /^[a-zA-Z0-9\s]+$/.test(control.value);
    return valid ? null : { 'alphanumeric': true };
  }

  static passwordMatchValidator(newPasswordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const newPassword = formGroup.get(newPasswordKey)?.value;
      const confirmPassword = formGroup.get(confirmPasswordKey)?.value;
  
      return newPassword && confirmPassword && newPassword !== confirmPassword
        ? { 'passwordMismatch': true }
        : null;
    };
  }
  

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value: string = control.value || '';
        if (!value) {
            return null;  // Don't validate empty value to allow optional controls
        }

        // Check if it contains at least one letter and one number
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);

        // Validate based on criteria
        const isValid = hasLetter && hasNumber && value.length >= 8;

        return isValid ? null : { 'passwordStrength': true };
    };
  }

  static  ipAddressValidator(): ValidatorFn {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = ipv4Regex.test(control.value);
      return valid ? null : { 'invalidIpAddress': { value: control.value } };
    };
  }

  static gmailValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) {
      return null; // Don't validate empty values here
    }
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const valid = gmailPattern.test(control.value);
    return valid ? null : { 'gmailDomain': true };
  }
}
