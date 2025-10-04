import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user.service';
import { catchError, map, Observable, of } from 'rxjs';

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> => {
    let user_service = inject(UserService);
    const router = inject(Router);
    const requiredPermission = route.data['permission'];
 
    return user_service.GetPermissions().pipe(
      map(permissions => {
        const userType = user_service.getUserlevel();
        if (userType === '1' || permissions.includes(requiredPermission)) {
          return true;
        } else {
          router.navigate(['/']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error checking permissions:', error);
        router.navigate(['/']);
        return of(false);
      })
    );
    
  
};
