import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { routes } from '../app.routes';
import { UserService } from '../services/user.service';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({}); IsSubmit: boolean = false;
  isLoading: boolean = true;

  constructor(
    private userservice: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required, ValidatorService.alphanumeric]),
      password: new FormControl("", Validators.required)
    });
  }


  onlogin() {
    this.IsSubmit = true;
    if (this.loginForm.invalid) return;
    let data = {
      userId: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.userservice.login(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const steps = res?.steps;
        if (steps?.emailVerification) {
          this.router.navigateByUrl("/email-verification", { state: { data: res } });
          return;
        } else if (steps?.google2FAVerification) {
          this.router.navigateByUrl("/google-verification", { state: { data: res } });
          return;
        }
        this.userservice.saveAuthData(res);
      }, error: (e) => {
        this.msgFailure(e.error.message)
      }
    })
  }

  msgFailure(message: string) {
    Swal.fire({
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }
}
