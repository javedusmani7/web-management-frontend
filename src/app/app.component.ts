import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  isLogin = false;
  userId = '';
  private authListenerSubs: Subscription;
  private permissionsSubscription: Subscription;
  permissions: any = [];
  constructor(private userService: UserService)
  {
    this.authListenerSubs = new Subscription();
    this.permissionsSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.userService.autoAuthUser();
    this.isLogin = this.userService.getIsAuth();
    this.authListenerSubs = this.userService.getAuthStatusListner().subscribe((IsAuthenticated) => {
        this.isLogin = IsAuthenticated;
        if (IsAuthenticated) {
          // Fetch permissions if authenticated
          this.fetchPermissions();
        }
    }); 

    if (this.isLogin) {
      this.fetchPermissions();
    }   
 
  }

  private fetchPermissions() {
    
      this.permissionsSubscription.add(
        this.userService.GetPermissions().subscribe({
          next: (permissions) => {
            this.permissions = permissions;
          },
          error: (error) => {
            console.error('Error fetching permissions:', error);
          }
        })
      );
    

    // this.userService.getPermissionListner().subscribe({
    //   next: permissions => {
    //     this.permissions = permissions;
    //   },
    //   error: error => {
    //     console.error('Error receiving permission updates:', error);
    //   }
    // });
  }


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();  
    this.permissionsSubscription.unsubscribe();
  }


}
