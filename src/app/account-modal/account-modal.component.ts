import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import Swal from 'sweetalert2';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.css'
})
export class AccountModalComponent implements OnInit  {
  showModal: boolean = false;
  isSubmit: boolean = false;
  @Input()ModalForm!: FormGroup;
  @Input() title: string = '';
  @Input() Type: string = '';
  @Input() CompanyValue : string = '';
  @Input() showCompanyName: boolean = true;
  @Input() showServerSelect: boolean = true;
  @Input() editData: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  constructor(private fb: FormBuilder,private mainService: MainService){ }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
  
    if('editData' in changes && changes['editData'].currentValue)
    {
     
      this.patchForm();
    }
    
  }

  initializeForm(): void {
    this.ModalForm = this.fb.group({
      accountName: ['', [Validators.required, ValidatorService.alphanumeric]],
      personname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      google_authenticator_email: ['', [Validators.email, ValidatorService.gmailValidator]],
      number: ['', Validators.required],
      hiddenTitle: [this.Type]
    });

    if (this.showCompanyName) {
      if(this.CompanyValue == '')
      {
        this.ModalForm.addControl('companyName', this.fb.control('', [Validators.required,ValidatorService.alphanumeric]));
      }
      else
      {
        this.ModalForm.addControl('companyName', this.fb.control({value:this.CompanyValue,disabled:true}, [Validators.required,ValidatorService.alphanumeric]));
      }
      
    }

    if (this.showServerSelect) {
      this.ModalForm.addControl('serverCompany', this.fb.control('', Validators.required));
    }
  }

  patchForm(): void {
   
      const formValues: any = {
        accountName: this.editData.account_name,
        personname: this.editData.person_name,
        password: this.editData.account_password,
        email: this.editData.account_email,
        google_authenticator_email: this.editData.google_authenticator_email || '',
        number: this.editData.number,
        hiddenTitle: this.Type,
      };
  
      if (this.showCompanyName) {
        formValues.companyName = this.editData.company_name;
      }
    
      if (this.showServerSelect) {
        formValues.serverCompany = this.editData.company_name;
      }
  
      this.ModalForm.patchValue(formValues);
    

  }

  openModal(): void {
    
    this.showModal = true;
  }

  closeModal()
  {
    this.ModalForm.reset();
    this.showModal = false;
    this.close.emit();
  }

  onSubmit()
  {
 
    this.isSubmit = true;
    if (this.ModalForm.valid) {
           // Emit submit event to parent component
           let data = this.ModalForm.getRawValue();
          
      if(this.editData)
      {
        this.mainService.UpdateAccount({_id: this.editData._id,data}).subscribe({
          next:(res:any)=> {
            this.isSubmit = false;
            this.showModal = false;
            this.msgSuccess(res.message);
            this.refreshAccounts();
          }, error:(e)=>{
            this.isSubmit = false;
            this.msgFailure();
          }
        })
      }
      else
      {
        this.mainService.addAccount(data).subscribe({
          next:(res:any)=>{
              this.isSubmit = false;
              this.showModal = false;
              this.msgSuccess(res.message);
              this.refreshAccounts();
          }, error:(e) =>{
            this.isSubmit = false;
            this.msgFailure();
          }
         })
      }
  
       
    }
  }

  refreshAccounts(): void {
    this.refresh.emit(); // Emit event to parent component to refresh accounts
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
