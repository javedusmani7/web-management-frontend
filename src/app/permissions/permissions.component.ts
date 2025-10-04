import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, KeyValue } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent implements OnInit {
  permissions = {
    'User': ['ADD_USER', 'EDIT_USER', 'VIEW_USER', 'DELETE_USER'],
    'Accounts': ['ADD_ACCOUNT', 'EDIT_ACCOUNT', 'VIEW_ACCOUNT', 'DELETE_ACCOUNT'],
    'Customers': ['ADD_CUST', 'EDIT_CUST', 'VIEW_CUST', 'DELETE_CUST'],
    'MotherPanel': ['ADD_PANEL', 'EDIT_PANEL', 'VIEW_PANEL', 'DELETE_PANEL'],
    'Websites': ['ADD_WEBSITE', 'EDIT_WEBSITE', 'VIEW_WEBSITE', ''],
    'Important Information': ['', 'EDIT_INFO', 'VIEW_INFO', ''],
    'Statements': ['','','VIEW_STATEMENT','']
  };
  userPermissions: string[] = [];
  userId: string = '';
  userName: string = '';

  constructor(private userservice: UserService, private route: ActivatedRoute){}

  ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id')!;
        this.userservice.getUserById(this.userId).subscribe((res:any) => {
          this.userName = res.name;
          this.userPermissions = res.permissions;
        })
  }

  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0;
  }

  togglePermission(permission: string): void {
    const index = this.userPermissions.indexOf(permission);
    if (index > -1) {
      this.userPermissions.splice(index, 1);
    } else {
      this.userPermissions.push(permission);
    }
  }

  savePermissions(): void {
    this.userservice.updatePermissions(this.userId, this.userPermissions).subscribe((res:any) => {
      this.msgSuccess()
    });
  }

  isChecked(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }

  msgSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Permission Updated',
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
