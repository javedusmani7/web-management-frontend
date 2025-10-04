import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';

import { MainService } from '../services/main.service';
import { PatternRestrictDirective } from '../services/pattern-restrict.directive';
import { UserService } from '../services/user.service';
import { VALIDATION_PATTERNS } from '../services/constant/constant';

@Component({
  selector: 'app-google-verification',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    PatternRestrictDirective,
  ],
  templateUrl: './google-verification.component.html',
  styleUrl: './google-verification.component.css'
})
export class GoogleVerificationComponent {
  showGoogleModal : boolean = false;
  pattern = VALIDATION_PATTERNS;
  otpForm!: FormGroup;
  loginData: any;
  issuer!: string;
  email!: string;
  qrCode!: string;
  hasSetup!: boolean;
  secret!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public api: MainService,
    private userService: UserService
  ) {
    const nav = router.getCurrentNavigation();
    this.loginData = nav?.extras.state?.['data'];
    if (!this.loginData) router.navigateByUrl("/login")
    this.otpForm = this.fb.group({
      otp: this.fb.array(
        Array(6).fill('').map(() => this.fb.control('', Validators.required))
      )
    });
  }

  ngOnInit(): void {
    if (this.loginData?.userId) { 
      this.hasGooleSetup();
    }

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

  submit() {
    const payload: any = {
      id: this.loginData.userId,
      otp: this.otpForm.value.otp.join('')
    }
    if (this.secret) {
      payload.secret = this.secret;
    }
    this.api.verifyGoogleOtp(payload).subscribe({
      next: (res: any) => {
        this.userService.saveAuthData(res);       
      }
    })
  }

  generateCode() {
    const payload = {
      id: this.loginData.userId
    }
    this.api.generategoogleAuthQR(payload).subscribe({
      next: (response: any) => {
        this.secret = response?.data?.secret;
        this.issuer = response?.data?.issuer;
        this.email = response?.data?.email;
        this.qrCode = response?.data?.qrCode;        
      }
    })
  }

  hasGooleSetup() {    
    const payload = {
      id: this.loginData.userId,
    }
    this.api.hasGoogleSetup(payload).subscribe({
      next: (res: any) => {        
        this.hasSetup = res.setup;
        if (!this.hasSetup) {
          this.generateCode();
        }
      }
    })
  }

  openGoogleSetup() {
    this.showGoogleModal = true;
  }

}
