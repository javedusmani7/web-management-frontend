import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { MainService } from '../services/main.service';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cloudflare-account',
  standalone: true,
  imports: [CommonModule,AccountModalComponent],
  templateUrl: './cloudflare-account.component.html',
  styleUrl: './cloudflare-account.component.css'
})
export class CloudflareAccountComponent implements OnInit {

  @ViewChild(AccountModalComponent) modal!: AccountModalComponent;
  Type: string = 'cloud';accounts: any = [];
  EditData: any = null;
  canAddAccount: boolean = false;
  canEditAccount: boolean = false;
  CanDeleteAccount: boolean = false;
  CompanyValue: string = 'Cloudflare';
  // showModal: boolean = false;

  constructor(private mainService: MainService, private userservice: UserService){}

  ngOnInit(): void {
    this.canAddAccount = this.userservice.hasPermission('ADD_ACCOUNT');
    this.canEditAccount = this.userservice.hasPermission('EDIT_ACCOUNT');
    this.CanDeleteAccount = this.userservice.hasPermission('DELETE_ACCOUNT');
      this.GetAccounts();
  }
  GetAccounts()
  {
    this.mainService.AccountList(this.Type).subscribe({
      next:(res:any)=>{
          this.accounts = res;
      }, error:(e)=>{
        console.log(e)
      }
    })
  }

  Edit(item: any)
  {
    this.EditData = { ...item };
    this.modal.openModal();
  }

  openModal(): void {
    this.modal.openModal();
  }

  // closeModal(): void {
  //   // Manage modal state and any other related logic
  //   this.showModal = false; // Example: Manage showModal state if it exists in your component
  // }
  
  // // Example of handling close event from AccountModalComponent
  // handleCloseModal(): void {
  //   this.closeModal(); // Manage modal state within this component
  // }

  refreshAccounts() {
    this.GetAccounts(); // Call to refresh accounts
  }

  // onSubmitParent() {

  //   if(this.modal.ModalForm.valid)
  //     {
  //       console.log('Parent Form is valid. Submitting:');
  //     }
   
    
  // }

    Delete(item: any)
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
        this.mainService.DeleteAccount({id: item._id}).subscribe({
          next:(res:any)=>{
            this.msgSuccess(res.message);
            this.GetAccounts();
          },
          error:(e)=>{
            this.msgFailure();
          }
        })
      }
    })
  }


  msgSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }

  msgFailure() {
    Swal.fire({
      icon: 'error',
      title: 'Something Went Wrong!',
      showConfirmButton: false,
      timer: 1500
    })
  }
}
