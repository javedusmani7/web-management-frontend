import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ValidatorService } from '../services/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});IsSubmit:boolean = false;
  isLoading: boolean = true;

constructor(private userservice: UserService){}

  ngOnInit(): void {
    this.isLoading = false;
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required,ValidatorService.alphanumeric]),
      password: new FormControl("", Validators.required)
 });
  }


  onlogin()
  {
    this.IsSubmit = true;
    if(this.loginForm.invalid) return;
    let data = {
      // userId:"affuser",
      // passWord:"Abcd1234",
      // host:"localhost:4200",
      // ipad:"localhost:4200"
      userId: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.userservice.login(data).subscribe({
      next:(res:any)=>{
        this.isLoading = false;
        this.userservice.saveAuthData(res);
      },error:(e)=>{
          this.msgFailure(e.error.message)
      }
    })
  }

  msgFailure(message:string) {
    Swal.fire({
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }
}
