import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ValidatorService } from '../services/validator.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {

  showModal: boolean = false;CustomerFormModel: FormGroup = new FormGroup({});
  IsSubmit: boolean = false;customers:any = [];editMode = false;
  editIndex: number | null = null;
  canAddCust: boolean = false;
  canEditCust: boolean = false;
  canDeleteCust: boolean = false;

  constructor(private mainService: MainService, private userservice: UserService){}

  ngOnInit(): void {
    this.canAddCust = this.userservice.hasPermission('ADD_CUST');
    this.canEditCust = this.userservice.hasPermission('EDIT_CUST');
    this.canDeleteCust = this.userservice.hasPermission('DELETE_CUST');
    this.getCustomer();
      
    this.CustomerFormModel = new FormGroup({
        name: new FormControl("", {
          validators:[Validators.required, Validators.maxLength(20), ValidatorService.alphanumeric],
          asyncValidators: [this.validateName()],
          updateOn:'blur'
        })
    })
  }

  getCustomer()
  {
    this.mainService.getCustomer().subscribe({
      next:(res:any)=>{
        this.customers = res;
      }, error:(e) => {
          console.log(e)
      }
    })
  }


  checkname(name: string, currentName: string): Observable<boolean>{
    if (this.editMode && name === currentName) {
      return of(false);
    }
    return this.mainService.CheckCustName(name).pipe(map(response => response.isTaken))
  }

  validateName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const currentName = this.editMode && this.editIndex !== null ? this.customers[this.editIndex].name : '';
        return this.checkname(control.value, currentName).pipe(map(isTaken => (isTaken ? { NameTaken: true } : null)),
        catchError(() => of(null))
      )
    }
  }

  AddCustModal()
  {
    this.editMode = false;
    this.CustomerFormModel.reset();
    this.showModal = true
  }

  closeModal()
  {
    this.CustomerFormModel.reset();
    this.showModal = false;
    this.IsSubmit = false;
  }

  EditCustomer(item: any)
  {
    this.editMode = true;
    this.editIndex = this.customers.findIndex((c:any) => c._id === item._id);

    if(this.editIndex !== -1 && this.editIndex !== null)
    {
      const CustomerData = this.customers[this.editIndex];
      this.CustomerFormModel.patchValue({
          name: CustomerData.name
      });
      this.showModal = true;
    }
  }


  deleteCustomer(item: any)
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
        this.mainService.deleteCustomer({id: item._id}).subscribe({
          next:(res:any)=>{
            this.msgSuccess(res.message);
            this.getCustomer();
          },
          error:(e)=>{
            this.msgFailure();
          }
        })
      }
    })
  }

  onSubmit()
  {
    this.IsSubmit = true;
    if(this.CustomerFormModel.valid)
      {
        let data = this.CustomerFormModel.value
        if(this.editMode)
        {
          this.mainService.UpdateCustomer({_id:this.customers[this.editIndex!]._id, data}).subscribe({
            next: (res: any) => {
              this.showModal = false;
              this.IsSubmit = false;
              this.getCustomer();
              this.msgSuccess(res.message);
            },
            error: (e) => {
              this.IsSubmit = false;
              this.msgFailure();
            }
          });
        }
        else
        {
          this.mainService.addCustomer(data).subscribe({
            next:(res:any)=>{
              this.showModal = false;
              this.IsSubmit = false;
              this.msgSuccess(res.message);
              this.getCustomer();
            }, error:(e)=>{
              this.IsSubmit = false;
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
