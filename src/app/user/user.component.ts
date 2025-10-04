import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faPencilAlt, faTrashAlt, faBan, faCheckCircle, faKey } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

import { UserService } from '../services/user.service';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink, FontAwesomeModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
   faLock = faLock;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faBan = faBan;
  faCheckCircle = faCheckCircle;
  faKey = faKey;
  showModal: boolean = false;UserFormModel: FormGroup = new FormGroup({});
  submitButtonClicked: boolean = false;user:any=[];
  passButtonClicked:boolean = false;
  editMode = false;
  editIndex: number | null = null;
  passIndex:number | null = null;
  currentEmail: string | null = null;
  currentUserId: string | null = null;
  currentNumber: string | null = null;
  canAddUser: boolean = false;
  canEditUser: boolean = false;
  canDeleteUser: boolean = false;
  userLevel:any = '';
  passModal: boolean = false; PassFormModel: FormGroup = new FormGroup({});


  constructor(private userService: UserService){}

  ngOnInit(): void {
    // this.userService.GetPermissions();
    // this.userService.getPermissionListner();
    this.userLevel = this.userService.getUserlevel();
    this.canAddUser = this.userService.hasPermission('ADD_USER');
      this.canEditUser = this.userService.hasPermission('EDIT_USER');
      this.canDeleteUser = this.userService.hasPermission('DELETE_USER');

    this.UserFormModel = new FormGroup({
      user_name: new FormControl("", [Validators.required,Validators.minLength(6), Validators.maxLength(20), ValidatorService.alphanumeric]),
      user_email: new FormControl("", {
        validators: [Validators.required, Validators.email],
        asyncValidators: [],
        updateOn: 'blur'
      }),
      userId: new FormControl("", {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20), ValidatorService.alphanumeric],
        asyncValidators: [],
        updateOn: 'blur'
      }),
      password: new FormControl("", []),
      number: new FormControl("", {
        validators:[Validators.required, Validators.minLength(10), Validators.maxLength(15)],
        asyncValidators: [],
        updateOn:'blur'
      }),
      googleAuthVerification: new FormControl(false),
      emailVerification: new FormControl(false),
    });

    this.PassFormModel = new FormGroup({
      password: new FormControl("", [Validators.required]),
      newpassword: new FormControl("",[Validators.required, ValidatorService.passwordStrength()]),
      confirm_password: new FormControl("",[Validators.required, ValidatorService.passwordStrength()])
    },{
      validators: ValidatorService.passwordMatchValidator('newpassword', 'confirm_password')
    }
  );

    if (this.editMode) {
      // If editing, password field should not be shown and should not be validated
      this.UserFormModel.get('password')?.clearValidators();
      this.UserFormModel.get('password')?.updateValueAndValidity();
    } else {
      // If creating, password field should be required
      this.UserFormModel.get('password')?.setValidators([Validators.required, ValidatorService.passwordStrength()]);
      this.UserFormModel.get('password')?.updateValueAndValidity();
    }

    this.getUsers();
      
  }

  getUsers()
  {
    this.userService.getUsers().subscribe({
      next:(res:any)=>{
        this.user = res;
      }, error:(e) => {
          console.log(e)
      }
    })
  }

  AddUserModal()
  {
    this.editMode = false;
    this.UserFormModel.reset();
    this.updateAsyncValidators();
    this.showModal = true;    
  }

  Password(item:any)
  {
    this.PassFormModel.reset();
    this.passIndex = this.user.findIndex((u: any) => u._id === item._id);
    this.passModal = true
  }

  closeModal()
  {
    this.UserFormModel.reset();
    this.clearAsyncValidators();
    this.showModal = false;
    this.submitButtonClicked = false;
    this.currentEmail = null;
    this.currentUserId = null;
    this.currentNumber = null;
  }

  closePassModal()
  {
    this.PassFormModel.reset();
    this.passModal = false;
    this.passButtonClicked = false;
  }

  EditUser(item: any)
  {    
    this.editMode = true;
    this.editIndex = this.user.findIndex((u: any) => u._id === item._id);

    if (this.editIndex !== -1 && this.editIndex !== null) {
      const userData = this.user[this.editIndex];
      this.currentEmail = userData.email;
      this.currentUserId = userData.userId;
      this.currentNumber = userData.number;
      // Clear previous async validators
    this.clearAsyncValidators();

      this.UserFormModel.patchValue({
        user_name: userData.name,
        user_email: userData.email,
        userId: userData.userId,
        number: userData.number,
        emailVerification: userData.loginPermission.emailVerification,
        googleAuthVerification: userData.loginPermission.googleAuthVerification
      });
      this.UserFormModel.get('password')?.clearValidators();
      this.UserFormModel.get('password')?.updateValueAndValidity();
      this.updateAsyncValidators();
      
      this.showModal = true;
    }

  }

  updateAsyncValidators() {
    
    this.UserFormModel.get('userId')?.clearAsyncValidators();
    this.UserFormModel.get('user_email')?.setAsyncValidators(this.userService.validateUniqueEmail(this.currentEmail));
    this.UserFormModel.get('userId')?.clearAsyncValidators();
    this.UserFormModel.get('userId')?.setAsyncValidators(this.userService.validateUserId(this.currentUserId));
    this.UserFormModel.get('number')?.clearAsyncValidators();
    this.UserFormModel.get('number')?.setAsyncValidators(this.userService.validateUniqueNumber(this.currentNumber));
    this.UserFormModel.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  clearAsyncValidators(): void {
    this.UserFormModel.get('user_email')?.clearAsyncValidators();
    this.UserFormModel.get('userId')?.clearAsyncValidators();
    this.UserFormModel.get('number')?.clearAsyncValidators();
    this.UserFormModel.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  Inactive(item:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.UserStatus({id: item._id}).subscribe({
          next:(res:any)=>{
            this.msgSuccess(res.message);
            this.getUsers();
          },
          error:(e)=>{
            this.msgFailure(e.error.message);
          }
        })
      }
    })
  }

  Activate(item:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.ActiveUser({id: item._id}).subscribe({
          next:(res:any)=>{
            this.msgSuccess(res.message);
            this.getUsers();
          },
          error:(e)=>{
            this.msgFailure(e.error.message);
          }
        })
      }
    })
  }

  onSubmit()
  {    
    this.submitButtonClicked = true;
    if(this.UserFormModel.valid)
      {
        let data = this.UserFormModel.value;

        if(this.editMode)
        {
          delete data.password;          
          this.userService.UpdateUser({_id:this.user[this.editIndex!]._id, data}).subscribe({
            next: (res: any) => {
              this.showModal = false;
              this.submitButtonClicked = false;
              this.getUsers();
              this.msgSuccess(res.message);
            },
            error: (e) => {
              this.submitButtonClicked = false;
              this.msgFailure(e.error.message);
            }
          });
        }
        else
        {
          this.userService.addUser(data).subscribe({
            next:(res:any)=>{
              this.showModal = false;
              this.submitButtonClicked = false;
              this.msgSuccess(res.message);
              this.getUsers();
            }, error:(e)=>{
              this.submitButtonClicked = false;
              this.msgFailure(e.error.message);
            }
          });
        }
          
      }
    
  }

  deleteUser(item: any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser({id: item._id}).subscribe({
          next:(res:any)=>{
            this.msgSuccess(res.message);
            this.getUsers();
          },
          error:(e)=>{
            this.msgFailure(e.error.message);
          }
        })
      }
    })
  }

  onUpdate()
  {
    this.passButtonClicked = true;

    if(this.PassFormModel.valid)
    {
      let data = this.PassFormModel.value;
      console.log()

      this.userService.UpdatePassword({_id: this.user[this.passIndex!]._id,data}).subscribe({
        next:(res:any)=>{
          this.passModal = false;
          this.passButtonClicked = false;
          this.msgSuccess(res.message);
          this.getUsers();
        },
        error:(e)=>{
          this.passButtonClicked = false;
          this.msgFailure(e.error.message);
        }
      })
    }

  }



  msgSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
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
