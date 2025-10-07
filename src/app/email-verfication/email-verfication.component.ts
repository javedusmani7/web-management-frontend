import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

import { MainService } from '../services/main.service';
import { PatternRestrictDirective } from '../services/pattern-restrict.directive';
import { UserService } from '../services/user.service';
import { VALIDATION_PATTERNS } from '../services/constant/constant';

@Component({
  selector: 'app-email-verfication',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    PatternRestrictDirective
  ],
  templateUrl: './email-verfication.component.html',
  styleUrl: './email-verfication.component.css'
})
export class EmailVerficationComponent {
  pattern = VALIDATION_PATTERNS;
  otpForm!: FormGroup;
  loginData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: MainService,
    private userService: UserService
  ) {
    const nav = router.getCurrentNavigation();
    this.loginData = nav?.extras.state?.['data'];
    this.otpForm = this.fb.group({
      otp: this.fb.array(
        Array(4).fill('').map(() => this.fb.control('', Validators.required))
      )
    });
  }

  ngOnInit(): void {
    this.sendOTP();
  }

  get otpArray() {
    return this.otpForm.get('otp') as FormArray;
  }

  moveNext(event: any, index: number) {
    if (event.target.value && index < 3) {
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

  submit() {
    const otp = this.otpForm.value.otp.join('');
    const payload = {
      otp: otp,
      userId: this.loginData.userId
    }
    this.api.verifyEmailOtp(payload).subscribe({
      next: (res: any) => {
        const steps = res?.steps;
        if (steps?.google2FAVerification) {
          this.router.navigateByUrl("/google-verification", { state: { data: res } });
          return;
        }
        this.userService.saveAuthData(res);
      }
    })
  }

  resendOTP() {
    this.otpForm.reset();
    const payload = { userId: this.loginData?.userId };
    this.api.resendOTP(payload).subscribe({
      next: (res: any) => {
      }
    })
  }

  sendOTP() {
    const payload = { userId: this.loginData?.userId };
    this.api.sendEmailOtp(payload).subscribe({
      next: (res: any) => {
      }
    })
  }
}
