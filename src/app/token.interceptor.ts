import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from './services/user.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  let auth_service = inject(UserService);

  const newReq = req.clone({
    headers: req.headers.set('Authorization', `${auth_service.getToken()}`),
  });
  return next(newReq);
};
