import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  adminLevel = false; isLogin = false; level = ''; userName = '';
  passModal: boolean = false; PassFormModel: FormGroup = new FormGroup({});
  passButtonClicked:boolean = false;
  private authListenerSubs: Subscription;
  private PermissionListenerSubs: Subscription;
  permissions: any = [];
  constructor(private userService: UserService) {
    this.authListenerSubs = new Subscription();
    this.PermissionListenerSubs = new Subscription();
  }

  ngOnInit(): void {
      this.isLogin = this.userService.getIsAuth();
      this.level = this.userService.getUserlevel();
      this.userName = this.userService.getUserName();

      if (this.level == '1') {
        this.adminLevel = true;
      }
      else {
        this.adminLevel = false;
      }
      this.authListenerSubs = this.userService.getAuthStatusListner().subscribe((IsAuthenticated) => {
        this.isLogin = IsAuthenticated;
        this.level = this.userService.getUserlevel();
        this.userName = this.userService.getUserName();
        this.adminLevel = (this.level == '1') ? true : false;
      });

      this.PermissionListenerSubs = this.userService.getPermissionListner().subscribe(permissions => {
        this.permissions = permissions;
      });

      this.PassFormModel = new FormGroup({
        password: new FormControl("", [Validators.required]),
        newpassword: new FormControl("",[Validators.required, ValidatorService.passwordStrength()]),
        confirm_password: new FormControl("",[Validators.required, ValidatorService.passwordStrength()])
      },{
        validators: ValidatorService.passwordMatchValidator('newpassword', 'confirm_password')
      }
    );
  }

  hasPermission(permission: string): boolean {
    return this.userService.hasPermission(permission);
  }

  closePassModal()
  {
    this.PassFormModel.reset();
    this.passModal = false;
    this.passButtonClicked = false;
  }

  CPassword()
  {
    this.passModal = true
  }

  onUpdate()
  {

  }

  onLogout()
  {
    this.userService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();  
  }

}
