import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../services/main.service';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-other-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './other-accounts.component.html',
  styleUrl: './other-accounts.component.css'
})
export class OtherAccountsComponent implements OnInit {

  showModal: boolean = false;
  MasterList: boolean = true;
  showAgentList:boolean = false;
  showAgentModal:boolean = false;
  isAgnetSubmit: boolean = false;
  isSubmit: boolean = false;editMode = false;
  editIndex: number | null = null;
  ModalForm!: FormGroup;
  AgentForm !: FormGroup;
  selectedcompany: string = '';
  websiteData: any = [];
  accounts:any = [];
  masterList:any = [];
  websList:any = [];
  agents: any = [];
  canAddAccount: boolean = false;
  canEditAccount: boolean = false;
  CanDeleteAccount: boolean = false;

  constructor(private mainService: MainService, private userservice: UserService){}

  ngOnInit(): void {
    this.canAddAccount = this.userservice.hasPermission('ADD_ACCOUNT');
    this.canEditAccount = this.userservice.hasPermission('EDIT_ACCOUNT');
    this.CanDeleteAccount = this.userservice.hasPermission('DELETE_ACCOUNT');
    this.GetAccounts();
    this.ModalForm = new FormGroup({
      master_account_name: new FormControl('',[Validators.required, ValidatorService.alphanumeric]),
      account_url: new FormControl('', Validators.required),
      account_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      google_authenticator_email: new FormControl('', [Validators.required, Validators.email, ValidatorService.gmailValidator]),
      user_id: new FormControl('', Validators.required),
      company_name: new FormControl('', Validators.required)
    })

    this.AgentForm = new FormGroup({
      master_account_name: new FormControl('',[Validators.required, ValidatorService.alphanumeric]),
      website_name: new FormControl('', Validators.required),
      backoffice_url: new FormControl('', Validators.required),
      account_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      agent_name: new FormControl('', [Validators.required]),
      user_id: new FormControl('', Validators.required),
      company_name: new FormControl('', Validators.required)
    })
  }

  GetAccounts()
  {
    this.mainService.MasterAccountList().subscribe({
      next:(res:any)=>{
        this.accounts = res;
      }, error:(e)=>{
        console.log(e)
      }
    })
  }

  AgentList()
  {
    
    this.mainService.AgentAccountList().subscribe({
      next:(res:any)=>{
        this.agents = res;
        this.showAgentList = true;
        this.MasterList = false;
      }, error:(e)=>{
        console.log(e)
      }
    })
  }

  MastersList()
  {
    this.showAgentList = false;
        this.MasterList = true;
  }

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
        this.mainService.DeleteMasterAccount({id: item._id}).subscribe({
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

  Edit(item: any)
  {
    this.editMode = true;
    this.editIndex = this.accounts.findIndex((c:any) => c._id === item._id);

    if(this.editIndex !== -1 && this.editIndex !== null)
    {
      const CustomerData = this.accounts[this.editIndex];
      this.ModalForm.patchValue({
        master_account_name: CustomerData.master_account_name,
        account_url:CustomerData.account_url,
        account_password: CustomerData.account_password,
        email: CustomerData.email,
        user_id: CustomerData.user_id,
        company_name: CustomerData.company_name
      });
      this.showModal = true;
    }
    
  }

  openModal(): void {
    this.ModalForm.reset();
    this.showModal = true; 
  }

  AgentModal(): void{
    this.AgentForm.reset();
    this.showAgentModal = true;
  }

  closeAgentModal(): void{
    this.AgentForm.reset();
    this.showAgentModal = false;
  }

  closeModal(): void {
    this.ModalForm.reset();
    this.showModal = false; 
  }

  AgentCompany(event:any)
  {
    this.selectedcompany = event.target.value;

    this.masterList = this.accounts.filter((d:any) => d.company_name === this.selectedcompany);

  }

  MasterWeb(event: any)
  {
    const master_id = event.target.value;

    this.mainService.GetWebsite().subscribe({
      next:(res:any)=>{
        this.websiteData = res;
          if(this.selectedcompany === 'awc')
          {
this.websList = this.websiteData.filter((d: any) => d.web_awc._id === master_id && d.platform !== "database").map((w:any) => w.website_name);
          }
          if(this.selectedcompany === 'saba')
            {
  this.websList = this.websiteData.filter((d: any) => d.web_saba._id === master_id && d.platform !== "database").map((w:any) => w.website_name);
            }
            if(this.selectedcompany === 'int')
              {
    this.websList = this.websiteData.filter((d: any) => d.web_int._id === master_id && d.platform !== "database").map((w:any) => w.website_name);
              }      
              
      },error:(e)=>{

      }
    })
  }

  AgentSubmit()
  {
    //  // Set the static value for website_name before checking validity
    // this.AgentForm.patchValue({
    //   website_name: "test website" 
    // });
    
    // console.log("AgentSubmit", this.AgentForm.valid);
    this.isAgnetSubmit = true;
    if (this.AgentForm.valid) {
        let data = this.AgentForm.value;
        this.mainService.AddAgentAccount(data).subscribe({
          next:(res:any)=>{
            this.isAgnetSubmit = false;
            this.showAgentModal = false;
            this.msgSuccess(res.message);
            this.GetAccounts();
          },
          error:(e)=>{
            this.isAgnetSubmit = false;
            this.msgFailure();
          }
        })

    }
  }
  
  onSubmit()
  {
    this.isSubmit = true;
    if (this.ModalForm.valid) {
        let data = this.ModalForm.value;
        if(this.editMode)
          {
            this.mainService.UpdateMasterAccount({_id:this.accounts[this.editIndex!]._id, data}).subscribe({
              next: (res: any) => {
                this.isSubmit = false;
                this.showModal = false;
                this.msgSuccess(res.message);
                this.GetAccounts();
              },
              error: (e) => {
                this.isSubmit = false;
                this.msgFailure();
              }
            });
          }
          else
          {
            this.mainService.AddMasterAccount(data).subscribe({
              next:(res:any)=>{
                this.isSubmit = false;
                this.showModal = false;
                this.msgSuccess(res.message);
                this.GetAccounts();
              },
              error:(e)=>{
                this.isSubmit = false;
                this.msgFailure();
              }
            })
          }
        
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

  msgFailure() {
    Swal.fire({
      icon: 'error',
      title: 'Something Went Wrong!',
      showConfirmButton: false,
      timer: 1500
    })
  }


}
