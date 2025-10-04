import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ValidatorService } from '../services/validator.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-mother-panel',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './mother-panel.component.html',
  styleUrl: './mother-panel.component.css'
})
export class MotherPanelComponent implements OnInit {

  showModal: boolean = false;IsSubmit: boolean = false; PanelFormModel: FormGroup = new FormGroup({});
  panels:any = [];editMode = false;editIndex: number | null = null;
  canAddPanel: boolean = false;
  canEditPanel: boolean = false;
  canDeletePanel: boolean = false;

  constructor(private mainService: MainService, private userservice: UserService){}

  ngOnInit(): void {
      this.canAddPanel = this.userservice.hasPermission('ADD_PANEL');
      this.canEditPanel = this.userservice.hasPermission('EDIT_PANEL');
      this.canDeletePanel = this.userservice.hasPermission('DELETE_PANEL');
      this.getPanel();

      this.PanelFormModel = new FormGroup({
        name: new FormControl("", {
          validators:[Validators.required,ValidatorService.alphanumeric],
          asyncValidators: [this.validateName()],
          updateOn:'blur'
        })
      })
  }


  getPanel()
  {
    this.mainService.getPanel().subscribe({
      next:(res:any)=>{
        this.panels = res;
      }, error:(e) => {
          console.log(e)
      }
    })
  }

  AddPanelModal()
  {
    this.editMode = false;
    this.PanelFormModel.reset();
    this.showModal = true
  }

  closeModal()
  {
    this.PanelFormModel.reset();
    this.showModal = false;
    this.IsSubmit = false;
  }

  EditPanel(item: any)
  {
    this.editMode = true;
    this.editIndex = this.panels.findIndex((c:any) => c._id === item._id);

    if(this.editIndex !== -1 && this.editIndex !== null)
    {
      const PanelData = this.panels[this.editIndex];
      this.PanelFormModel.patchValue({
          name: PanelData.name
      });
      this.showModal = true;
    }
  }


  deletePanel(item: any)
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
        this.mainService.deletePanel({id: item._id}).subscribe({
          next:(res:any)=>{
            this.msgSuccess(res.message);
            this.getPanel();
          },
          error:(e)=>{
            this.msgFailure();
          }
        })
      }
    })
  }

  checkname(name: string, currentName:string): Observable<boolean>{
    if (this.editMode && name === currentName) {
      return of(false);
    }
    return this.mainService.CheckPanelName(name).pipe(map(response => response.isTaken))
  }

  validateName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const currentName = this.editMode && this.editIndex !== null ? this.panels[this.editIndex].name : '';
     
        return this.checkname(control.value, currentName).pipe(map(isTaken => (isTaken ? { NameTaken: true } : null)),
        catchError(() => of(null))
      )
    }
  }

  onSubmit()
  {
    this.IsSubmit = true;
    if(this.PanelFormModel.valid)
      {
        let data = this.PanelFormModel.value;

        if(this.editMode)
        {
          this.mainService.UpdatePanel({_id:this.panels[this.editIndex!]._id, data}).subscribe({
            next:(res:any)=>{
              this.showModal = false;
              this.IsSubmit = false;
              this.msgSuccess(res.message);
              this.getPanel();
            }, error:(e)=>{
              this.IsSubmit = false;
              this.msgFailure();
            }
          })
        }
        else
        {
          this.mainService.addPanel(data).subscribe({
            next:(res:any)=>{
              this.showModal = false;
              this.IsSubmit = false;
              this.msgSuccess(res.message);
              this.getPanel();
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
