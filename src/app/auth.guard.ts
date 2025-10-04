import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {
  const token = localStorage.getItem("token");
 
  if(!token)
    {
      inject(Router).navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  if(inject(UserService).getIsAuth())
    {
      return true;
    }
    else
    {
      inject(Router).navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
};
