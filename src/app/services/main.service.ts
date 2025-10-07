import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const Backend_URL_Custom = environment.apiUrl + '/custom';
const Backend_URL_Account = environment.apiUrl + '/account';
const Backend_URL_Website = environment.apiUrl + '/website';
const Backend_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }

  addCustomer(data: any) {
    return this.http.post(Backend_URL_Custom + '/add-customer', data);
  }

  getCustomer() {
    return this.http.get(Backend_URL_Custom + '/customer-list');
  }

  CheckCustName(panelName: string): Observable<{ isTaken: boolean }> {
    const url = `${Backend_URL_Custom}/checkcustomer/${panelName}`;
    return this.http.get<{ isTaken: boolean }>(url).pipe(
      catchError((error) => {
        // Handle errors if needed
        console.error('Error checking panel name:', error);
        throw error; // Rethrow or handle as per your application's error handling strategy
      })
    );
  }

  UpdateCustomer(data: any) {
    return this.http.post(Backend_URL_Custom + '/update-cust', data);
  }

  deleteCustomer(data: any) {
    return this.http.post(Backend_URL_Custom + '/delete-cust', data);
  }

  addPanel(data: any) {
    return this.http.post(Backend_URL_Custom + '/add-panel', data);
  }

  getPanel() {
    return this.http.get(Backend_URL_Custom + '/panel-list');
  }

  UpdatePanel(data: any) {
    return this.http.post(Backend_URL_Custom + '/update-panel', data);
  }

  CheckPanelName(panelName: string): Observable<{ isTaken: boolean }> {
    const url = `${Backend_URL_Custom}/checkpanel/${panelName}`;
    return this.http.get<{ isTaken: boolean }>(url).pipe(
      catchError((error) => {
        // Handle errors if needed
        console.error('Error checking panel name:', error);
        throw error; // Rethrow or handle as per your application's error handling strategy
      })
    );
  }


  deletePanel(data: any) {
    return this.http.post(Backend_URL_Custom + '/delete-panel', data);
  }

  addAccount(data: any) {
    return this.http.post(Backend_URL_Account + '/add-account', data);
  }

  AccountList(type: any) {
    return this.http.get(Backend_URL_Account + '/account-list/' + type);
  }

  UpdateAccount(data: any) {
    return this.http.post(Backend_URL_Account + '/update-account', data);
  }

  getAllAccounts() {
    return this.http.get(Backend_URL_Account + '/all-account');
  }

  DeleteAccount(data: any) {
    return this.http.post(Backend_URL_Account + '/delete-account', data);
  }

  AddWebsite(data: any) {
    return this.http.post(Backend_URL_Website + '/add-website', data);
  }

  GetWebsite() {
    return this.http.get(Backend_URL_Website + '/get-website');
  }

  getWebsiteById(data: string) {
    return this.http.get(Backend_URL_Website + '/website-detail/' + data)
  }

  getWebsiteByMother(data: any) {
    return this.http.post(Backend_URL_Website + '/website-mother', data);
  }

  UpdateWebsite(data: any) {
    return this.http.post(Backend_URL_Website + '/update-website', data);
  }

  PanelByCustomer(c_id: any) {
    return this.http.post(Backend_URL_Website + '/getPanel', c_id);
  }

  getLogs() {
    return this.http.get(Backend_URL_Custom + '/getLogs');
  }

  getUserLog(string: any) {
    return this.http.get(Backend_URL_Custom + '/getLog/' + string);
  }


  AddMasterAccount(data: any) {
    return this.http.post(Backend_URL_Account + '/addotherAccount', data);
  }

  MasterAccountList() {
    return this.http.get(Backend_URL_Account + '/master-account-list');
  }

  UpdateMasterAccount(data: any) {
    return this.http.post(Backend_URL_Account + '/update-master', data);
  }

  DeleteMasterAccount(data: any) {
    return this.http.post(Backend_URL_Account + '/delete-master-account', data);
  }

  AddAgentAccount(data: any) {
    return this.http.post(Backend_URL_Account + '/addagentAccount', data);
  }

  AgentAccountList() {
    return this.http.get(Backend_URL_Account + '/agent-account-list');
  }

  getServerAccountList() {
    return this.http.get(Backend_URL_Account + '/account-list/server');
  }

  getCloudAccountList() {
    return this.http.get(Backend_URL_Account + '/account-list/cloud');
  }

  getDomainAccountList() {
    return this.http.get(Backend_URL_Account + '/account-list/domain');
  }

  getCompanyAccountList() {
    return this.http.get(Backend_URL_Account + '/company-lists');
  }

  getCompanyMasterAccountList(data: any) {
    return this.http.get(Backend_URL_Account + `/master-account-lists/company/${data}`);
  }

  getAgentAccountList(data: any) {
    return this.http.get(Backend_URL_Account + `/agent-account-lists/company/awc/master_account/${data}`);
  }

  hasGoogleSetup(data: any) {
    return this.http.post(Backend_URL + '/google-auth/has-setup', data);
  }

  generategoogleAuthQR(data: any) {
    return this.http.post(Backend_URL + '/google-auth/google-2fa', data);
  }

  verifyGoogleOtp(data: any) {
    return this.http.post(Backend_URL + '/google-auth/verify-google-otp', data);
  }

  addtelegram(data: any) {
    return this.http.post(Backend_URL + '/telegram/add', data);
  }

  updateTelegram(data: any) {
    return this.http.post(Backend_URL + '/telegram/update', data);
  }

  getTelegram() {
    return this.http.get(Backend_URL + '/telegram/lists');
  }

  getWhatsapp() {
    return this.http.get(Backend_URL + '/whatsapp/lists');
  }

  addWhatsapp(data: any) {
    return this.http.post(Backend_URL + '/whatsapp/add', data);
  }

  updateWhatsapp(data: any) {
    return this.http.post(Backend_URL + '/whatsapp/update', data);
  }
  sendEmailOtp(data: any) {
    return this.http.post(Backend_URL + '/email-auth/email/send-otp', data);
  }

  verifyEmailOtp(data: any) {
    return this.http.post(Backend_URL + '/email-auth/email/verify-otp', data);
  }

  resendOTP(data: any) {
    return this.http.post(Backend_URL + '/email-auth/email/resend-otp', data);
  }

  showPassword(data: any) {
    return this.http.post(Backend_URL + '/account/show-password', data);
  }

  
}
