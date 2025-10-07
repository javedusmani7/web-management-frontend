import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';

import { finalize } from 'rxjs';

import { MainService } from '../services/main.service';
import { PatternRestrictDirective } from '../services/pattern-restrict.directive';
import { UserService } from '../services/user.service';
import { AlertService } from '../../shared/alert.service';
import { VALIDATION_PATTERNS } from '../services/constant/constant';
declare var bootstrap: any;

@Component({
  selector: 'app-show-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatternRestrictDirective
  ],
  templateUrl: './show-password.component.html',
  styleUrl: './show-password.component.css'
})
export class ShowPasswordComponent {
  @Input() showModal: boolean = false;
  @Input() data: any;
  @Output() close = new EventEmitter<void>();
  otpForm!: FormGroup;
  pattern = VALIDATION_PATTERNS;
  verify: boolean = false;
  password: string = "";

  constructor(
    private fb: FormBuilder,
    private api: MainService,
    private alert: AlertService
  ) {
    this.otpForm = this.fb.group({
      otp: this.fb.array(
        Array(6).fill('').map(() => this.fb.control('', Validators.required))
      )
    });
  }

  closeModal() {
    this.showModal = false;
    this.verify = false;
    this.close.emit();
  }

  get otpArray() {
    return this.otpForm.get('otp') as FormArray;
  }

  moveNext(event: any, index: number) {
    if (event.target.value && index < 5) {
      const next = document.querySelectorAll<HTMLInputElement>('.otp-inputs input')[index + 1];
      next?.focus();
    }
  }

  movePrev(event: any, index: number) {
    if (!event.target.value && index > 0) {
      const prev = document.querySelectorAll<HTMLInputElement>('.otp-inputs input')[index - 1];
      prev?.focus();
    }
  }

  verifyOtp() {
    if(this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    const otp = this.otpForm.value.otp.join('');
    const payload = {
      id: this.data?._id,
      googleOtp: otp
    }
    this.api.showPassword(payload).pipe(finalize(() => this.otpForm.reset())).subscribe({
      next: (res: any) => {
        this.verify = true;
        this.password = res.data.account_password;
      },
      error:(err: any) => {
        this.alert.error(err?.error?.message);
      }
    })
  }

  copyPassword() {
    if (!this.password) return;

    navigator.clipboard.writeText(this.password);
  }
}