import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { finalize } from 'rxjs';
import { MainService } from '../services/main.service';
import { AlertService } from '../../shared/alert.service';
import { UserService } from '../services/user.service';

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
  canAddAccount: boolean = false;
  canEditAccount: boolean = false;

  constructor(
    private mainService: MainService,
    private userservice: UserService,
    private fb: FormBuilder,
    private alert: AlertService
  ) {
    this.getTelegram();
  }

  ngOnInit(): void {
    this.canAddAccount = this.userservice.hasPermission('ADD_TELEGRAM');
    this.canEditAccount = this.userservice.hasPermission('EDIT_TELEGRAM');

    this.ModalForm = this.fb.group({
      type: ['', [Validators.required]],
      name: ['', Validators.required, Validators.minLength(3)],
      link: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/)]],
      admin_name: ['', [Validators.required]],
      admin_number: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
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

  openAddModule() {
    this.showModal = true;
    this.editData = false;
    this.ModalForm.reset();
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
        this.alert.success(res.message);
        this.getTelegram();
      }
    })
  }

  addTelegram() {
    if (this.ModalForm.invalid || this.isLoading) return;
    
    this.isSubmit = true;
    this.isLoading = true;

    const payload = this.ModalForm.value;
    payload.admin_number = String(payload.admin_number);

    this.mainService.addtelegram(payload).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe({
      next: (res: any) => {
        this.alert.success(res.message);
        this.showModal = false;
        this.getTelegram();
      },
      error: (err: any) => {
        const errorMessage = err.error?.message || "something wrong, try again later."
        this.alert.error(errorMessage);
      }
    })
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.ModalForm.invalid) {
      this.ModalForm.markAllAsTouched();
      return;
    }

    this.editData ? this.updateTelegram() : this.addTelegram();
  }

}
