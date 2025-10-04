import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as CryptoJS from 'crypto-js';

import { environment } from '../../environments/environment';


const Backend_URL = environment.apiUrl+'/auth';
const Private_KEY = CryptoJS.enc.Hex.parse(environment.private_key);
const iv = CryptoJS.lib.WordArray.random(16);
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isAuthenticated = false;
  private token: string = '';
  private tokenTimer: any;
  private userId: any = '';
  private userName: any = '';
  private email: any = '';
  private level: any = '';
  private permissions: string[] = [];
  private authStatusListner = new Subject<boolean>();
  private permissionListner = new BehaviorSubject<string[]>(this.permissions)

  constructor(private http:HttpClient, private router: Router) { }

  encrypt(data: string): string {
    
    const encrypted = CryptoJS.AES.encrypt(data, Private_KEY, {iv: iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7
    });

    return iv.toString() + ':' + encrypted.toString();
  }

  decrypt(encryptedData: string): string {
    const [ivString, encryptedString] = encryptedData.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivString);
  const encrypted = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(encryptedString)
  });

    const bytes = CryptoJS.AES.decrypt(encrypted, Private_KEY,{iv:iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  login(data: any) {
    const encrypt_data = this.encrypt(JSON.stringify(data));
    return this.http.post(Backend_URL + "/login", {body_data:encrypt_data})
  }

  saveAuthData(authData: any)
  {      
    this.token = authData.token;
    const expiresInDuration = authData.expiresIn;
    this.setAuthTimer(expiresInDuration);
    this.isAuthenticated = true;
    this.userId = authData.id;
    this.userName = authData.name;
    this.email = authData.email;
    this.level = authData.level;
    this.permissions = authData.permissions;
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
    this.authStatusListner.next(true);
    localStorage.setItem('token', this.token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', this.userId);
    localStorage.setItem('userName', this.userName);
    localStorage.setItem('email', this.email);
    localStorage.setItem('level', this.level);
    // localStorage.setItem('permission', this.permissions);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    //console.log("Setting Timer " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }


  
  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.level = '';
    clearInterval(this.tokenTimer);
    this.clearAuthData();
    this.authStatusListner.next(false);
    this.userId = '';
    this.userName = '';
    this.email = '';
    this.permissions = [];
    this.router.navigate(['/login']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userName = authInformation.userName;
      this.email = authInformation.email;
      this.level = authInformation.level;
      // this.permissions = authInformation.permissions;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const email = localStorage.getItem("email");
    const level = localStorage.getItem("level");
    // const permissions = localStorage.getItem('permission');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName,
      email: email,
      level: level,
      // permissions: permissions
    }
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('level');
    // localStorage.removeItem('permission');
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserlevel()
  {
    return this.level;
  }

  getUserName()
  {
    return this.userName;
  }

  getToken() {
    return this.token;
  }

  // getUserPermissions()
  // {
  //   return this.permissions;
  // }


  GetPermissions():Observable<string[]>
  {
    let user_id = localStorage.getItem('userName');
    // console.log('u',user_id)
    return this.http.get<string[]>(`${Backend_URL}/permissions/${user_id}`).pipe(
      tap((permission:any) => {
        // console.log('Fetched permissions:', permission);
        this.permissions = permission;
        this.permissionListner.next(this.permissions);
      }),
      catchError(error => {
        console.error('Error fetching permissions', error);
        return of([]);
      })
    );
  }

  getPermissionListner(): Observable<string[]> { // use
    return this.permissionListner.asObservable();
  }

  hasPermission(permission: string): boolean {

    if(this.level === '1')
    {
      return true;
    }
   
    return this.permissions.includes(permission); 
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  addUser(data: any)
  {
   return this.http.post(Backend_URL+'/add-user',data);
  }

  getUsers()
  {
    return this.http.get(Backend_URL+'/get-users');
  }

  getUserById(string:any)
  {
    return this.http.get(Backend_URL+'/get-user/'+string)
  }

  UpdateUser(data: any)
  {
    return this.http.post(Backend_URL+'/update-user', data);
  }

  UserStatus(data: any)
  {
    return this.http.post(Backend_URL+'/user-status', data);
  }

  ActiveUser(data: any)
  {
    return this.http.post(Backend_URL+'/active-status', data);
  }

  UpdatePassword(data:any)
  {
    const encrypt = this.encrypt(JSON.stringify(data));
    return this.http.post(Backend_URL+'/updatepassword',{body_data: encrypt})
  }

  updatePermissions(userId: string, permissions: string[])
  {
    return this.http.put(Backend_URL+'/permissions/'+userId, {permissions});
  }

  deleteUser(data: any)
  {
    return this.http.post(Backend_URL+'/delete-user',data);
  }

  checkUserIdNotTaken(userId: string): Observable<boolean> {
    return this.http.get<{ isTaken: boolean }>(`${Backend_URL}/checkUserId/${userId}`).pipe(
      map(response => response.isTaken)
    );
  }

  validateUserId(currentUserId: string | null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      
      if (currentUserId && control.value === currentUserId) {
        return of(null); // Skip validation if the userId hasn't changed
      }
      return this.checkUserIdNotTaken(control.value).pipe(map(isTaken => (isTaken ? { userIdTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }


CheckUniqueEmail(email: string): Observable<boolean>{
  return this.http.get<{isTaken: boolean}>(`${Backend_URL}/checkEmail/${email}`).pipe(map(response => response.isTaken))
}

  validateUniqueEmail(currentEmail: string | null): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (currentEmail && control.value === currentEmail) {
          return of(null); // Skip validation if the email hasn't changed
        }
          return this.CheckUniqueEmail(control.value).pipe(map(isTaken => (isTaken ? {EmailTaken : true} : null)),
            catchError(() => of(null))
        );
      }
  }

  CheckUniqueNumber(number: string): Observable<boolean>{
    return this.http.get<{isTaken: boolean}>(`${Backend_URL}/checkNumber/${number}`).pipe(map(response => response.isTaken))
  }
  
    validateUniqueNumber(currentNumber: string | null): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
          if (currentNumber && control.value === currentNumber) {
            return of(null); // Skip validation if the number hasn't changed
          }
            return this.CheckUniqueNumber(control.value).pipe(map(isTaken => (isTaken ? {NumberTaken : true} : null)),
              catchError(() => of(null))
          );
        }
    }
}
