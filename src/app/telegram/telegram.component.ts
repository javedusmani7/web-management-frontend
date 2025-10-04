import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { finalize } from 'rxjs';

import { MainService } from '../services/main.service';

@Component({
  selector: 'app-telegram',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './telegram.component.html',
  styleUrl: './telegram.component.css'
})
export class TelegramComponent {
  showModal: boolean = false;
  editData: boolean = false;
  isLoading = false;
  accounts: any = [];
  ModalForm!: FormGroup;
  isSubmit: boolean = false;
  id: string = '';

  constructor(
    private mainService: MainService,
    private fb: FormBuilder
  ) {
    this.getTelegram();
  }

  ngOnInit(): void {
    this.ModalForm = this.fb.group({
      type: ['', [Validators.required]],
      name: ['', Validators.required],
      link: ['', [Validators.required]],
      admin_name: ['', [Validators.required]],
      admin_number: ['', [Validators.required]],
      admin_email: ['', [Validators.required, Validators.email]],
      purpose: ['', Validators.required]
    });
  }

  getTelegram() {
    this.mainService.getTelegram().subscribe({
      next: (res: any) => {
        this.accounts = res.data
      }
    })
  }

  Delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.mainService.DeleteAccount({ id: item._id }).subscribe({
          next: (res: any) => {
            this.msgSuccess(res.message);
          },
          error: (e: any) => {
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

  openAddModule() {
    this.showModal = true;
    this.editData = false;
  }

  openEdit(data: any) {
    this.id = data?._id;
    this.showModal = true;
    this.editData = true;
    this.ModalForm.patchValue({
      type: data?.type,
      name: data?.name,
      link: data?.link,
      admin_name: data?.admin_name,
      admin_number: data?.admin_number,
      admin_email: data?.admin_email,
      purpose: data?.purpose
    })
  }

  updateTelegram() {
    if (this.ModalForm.invalid || this.isLoading) return;
    this.isLoading = true;

    const payload = { id: this.id, ...this.ModalForm.value }
    payload.admin_number = String(payload.admin_number);

    this.mainService.updateTelegram(payload).pipe(finalize(() => {
      this.isSubmit = false;
      this.isLoading = false;
      this.showModal = false;
    })).subscribe({
      next: (res: any) => {
        this.msgSuccess(res.message);
      }
    })
  }

  addTelegram() {
    if (this.ModalForm.invalid || this.isLoading) return;
    this.isLoading = true;

    const payload = this.ModalForm.value;
    payload.admin_number = String(payload.admin_number);

    this.mainService.addtelegram(payload).pipe(finalize(() => {
      this.isSubmit = false;
      this.isLoading = false;
      this.showModal = false;
    })).subscribe({
      next: (res: any) => {
        this.msgSuccess(res.message);
      }
    })
  }

  onSubmit() {
    if (this.editData) this.updateTelegram();
    else this.addTelegram();
  }
}
