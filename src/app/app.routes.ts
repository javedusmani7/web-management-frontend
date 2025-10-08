import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { permissionGuard } from './permission.guard';

import { AddWebsiteComponent } from './add-website/add-website.component';
import { AwcaccountComponent } from './awcaccount/awcaccount.component';
import { CloudflareAccountComponent } from './cloudflare-account/cloudflare-account.component';
import { CustomerComponent } from './customer/customer.component';
import { DomainManagerComponent } from './domain-manager/domain-manager.component';
import { EditwebsiteComponent } from './editwebsite/editwebsite.component';
import { EmailVerficationComponent } from './email-verfication/email-verfication.component';
import { GoogleVerificationComponent } from './google-verification/google-verification.component';
import { HomeComponent } from './home/home.component';
import { InformationPageComponent } from './information-page/information-page.component';
import { InternationalAccountComponent } from './international-account/international-account.component';
import { LoginComponent } from './login/login.component';
import { MotherPanelComponent } from './mother-panel/mother-panel.component';
import { OtherAccountsComponent } from './other-accounts/other-accounts.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { SabaaccountComponent } from './sabaaccount/sabaaccount.component';
import { ServerAccountComponent } from './server-account/server-account.component';
import { ServerSettingsComponent } from './server-settings/server-settings.component';
import { StatementsComponent } from './statements/statements.component';
import { TelegramComponent } from './telegram/telegram.component';
import { UserComponent } from './user/user.component';
import { WebsiteComponent } from './website/website.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';

import { AddMotherPanelComponent } from './add-mother-panel/add-mother-panel.component';
import { AddDatabaseComponent } from './add-database/add-database.component';
import { AddOtherComponent } from './add-other/add-other.component';
import { WebDetailsComponent } from './web-details/web-details.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'email-verification', component: EmailVerficationComponent },
    { path: 'google-verification', component: GoogleVerificationComponent },
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'users', title: 'User Detail', component: UserComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_USER' } },
    { path: 'permission/:id', component: PermissionsComponent },
    { path: 'server-detail', component: ServerAccountComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_ACCOUNT' } },
    { path: 'cloudflare-detail', component: CloudflareAccountComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_ACCOUNT' } },
    { path: 'domain-detail', component: DomainManagerComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_ACCOUNT' } },
    { path: 'awc-detail', component: AwcaccountComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_ACCOUNT' } },
    { path: 'saba-detail', component: SabaaccountComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_ACCOUNT' } },
    { path: 'international-detail', component: InternationalAccountComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_ACCOUNT' } },
    { path: 'other-account', component: OtherAccountsComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_ACCOUNT' } },
    { path: 'customer-detail', component: CustomerComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_CUST' } },
    { path: 'panel-detail', component: MotherPanelComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_PANEL' } },
    { path: 'website-detail', component: WebsiteComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_WEBSITE' } },
    { path: 'website/add', component: AddWebsiteComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'ADD_WEBSITE' } },
    { path: 'website/edit/:id', component: EditwebsiteComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'EDIT_WEBSITE' } },
    { path: 'server-settings', component: ServerSettingsComponent, canActivate: [authGuard, permissionGuard] },
    { path: 'important-information', component: InformationPageComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_INFO' } },
    { path: 'statements', component: StatementsComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_STATEMENT' } },
    { path: 'telegram', component: TelegramComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_TELEGRAM' }},
    { path: 'whatsapp', component: WhatsappComponent, canActivate: [authGuard, permissionGuard], data: { permission: 'VIEW_WHATSAPP' }},
    {path:'website/add-motherpanel',component: AddMotherPanelComponent,canActivate:[authGuard,permissionGuard],data: { permission: 'ADD_WEBSITE' }},
    {path:'website/add-database',component: AddDatabaseComponent,canActivate:[authGuard,permissionGuard],data: { permission: 'ADD_WEBSITE' }},
    {path:'website/add-other',component: AddOtherComponent,canActivate:[authGuard,permissionGuard],data: { permission: 'ADD_WEBSITE' }},
    {path:'details/:type/:id',component: WebDetailsComponent,canActivate:[authGuard,permissionGuard],data: { permission: 'ADD_WEBSITE' }},
];
