import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

import { MainService } from '../services/main.service';
import { PatternRestrictDirective } from '../services/pattern-restrict.directive';
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
    const otp = Number(this.otpForm.value.otp.join(''));
    const payload = {
      otp: otp,
      userId: this.loginData.userId
    }
    // this.api.verifyOtp(payload).subscribe({
    //   next: (res: any) => {
    //     const response = this.api.decryptData(res.data);
    //     this.alert.success(response?.message);
    //     if (this.loginData.steps.google2FAVerification) {
    //       this.router.navigateByUrl("/auth/google-verification", { state: { data: { steps: this.loginData?.steps, userId: this.loginData?.userId } } });
    //       return;
    //     }
    //     else {
    //       this.api.generateToken({ _id: this.loginData?.userId || "" }).subscribe({
    //         next: (res: any) => {
    //           const response = this.api.decryptData(res.data);
    //           this.api.setEncryptedData('token', response.token)
    //           this.api.setEncryptedData('role', response.role)
    //           this.api.setEncryptedData('_id', response._id)
    //           this.api.setEncryptedData('userId', response.userId)
    //           if (response?.admin) this.api.setEncryptedData('admin', response?.admin)
    //           this.router.navigateByUrl("/")
    //         }
    //       })
    //     }
    //   }
    // })
  }

  resendOTP() {
    const payload = { userId: this.loginData?.userId };
    // this.api.resendOTP(payload).subscribe({
    //   next: (res: any) => {
    //     const response = this.api.decryptData(res.data);
    //     this.alert.success(response?.message);
    //   }
    // })
  }

}
