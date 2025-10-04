import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ValidatorService } from '../services/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editwebsite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editwebsite.component.html',
  styleUrl: './editwebsite.component.css'
})
export class EditwebsiteComponent implements OnInit {

  IsSubmit = false;
  platformtypevalue: string = '';
  show_cloud: boolean = false;
  show_awc:boolean = false;
  show_saba:boolean = false;
  show_inter: boolean = false;
  customers: any = [];
  panels: any = [];
  WebForm!: FormGroup;
  cloudAccounts: any = [];
  domainManager: any = [];
  awc_account: any = [];
  saba_account: any = [];
  international_account: any = [];
  server_account: any = [];
  tomcat_version: any = ["10","9","8.5","8.0","7.0","6.0","5.5","5.0","4.1","4.0"];
  ubuntu_version: any = ["24.04","23.10","23.04","22.10","22.04","21.10","21.04","20.10","20.04","19.10"];
  nginx_version: any = ["1.27","1.26","1.25","1.24","1.23","1.22","1.21","1.20","1.19","1.18"];
  mongo_version: any = ["7.0","6.0","5.0","4.4","4.2","4.0","3.6","3.4","3.2","3.0"];
  socket_version: any = ["4.7.5","4.7.4","4.7.3","4.7.0","4.6","4.5","4.4","4.1.3","4.1.2","4.1.1","4.1.0","4.0.1","4.0.0"];
  java_version: any = ["22","21","20","19","18","17","16","15","14","13","12","11","10","9","8"];
  id: string | null = null;

  constructor(private mainService: MainService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      // Perform other operations with the ID
      if (this.id) {
        // Fetch data using the ID
        this.fetchData(this.id);
      }
    });
    this.getCustomer();
    this.getPanel();
    this.getAccounts();
    this.OtherAccounts();
    this.WebForm = this.fb.group({
      region: ['', Validators.required],
      customer: ['', Validators.required],
      platform: ['', Validators.required],
      website_name: ['', [Validators.required, ValidatorService.alphanumeric]],
      website_type: ['', Validators.required],
      website_status: ['', Validators.required],
      mother_panel: ['', Validators.required],
      db_ip: [''],
      db_ubutnu: [''],
      db_time_zone: [''],
      db_version: [''],
      db_index: [''],
      db_grafana: [''],
      db_auth: [''],
      db_firewall: [''],
      db_log: [''],
      db_reset: [''],
      web_technology: [''],
      web_cloud_s: [''],
      web_cloud_ac: [''],
      web_data_source: [''],
      web_bet_match: [''],
      web_domain: [''],
      web_awc_s: [''],
      web_awc: [''],
      awc_call_back:[''],
      web_saba_s: [''],
      web_saba: [''],
      saba_call_back:[''],
      web_inter_s: [''],
      web_inter: [''],
      inter_call_back:[''],
      web_domain_whitelist: [''],
      web_redis_allow: [''],
      web_main_link: [''],
      web_mgt_link: [''],
      web_diff_server: [''],
      web_project_name: [''],
      web_server_name: [''],
      web_server_comp: [''],
      web_server_acc: [''],
      web_server_password: [''],
      web_server_ip: [''],
      web_ubuntu: [''],
      web_time_zone: [''],
      web_cache: [''],
      web_reset: [''],
      web_config: [''],
      web_nagios: [''],
      web_java_ver: [''],
      web_tom_ver: [''],
      web_tom_cache: [''],
      web_tom_log: [''],
      web_nginx_ver: [''],
      web_nginx_cache: [''],
      web_nginx_conn: [''],
      web_nginx_file: [''],
      web_nginx_log: [''],
      web_pm_log: [''],
      web_max_body: [''],
      web_socket_ver: [''],
      web_ssl: [''],
      web_ssl_name: [''],
      web_ssl_ex: [''],
      web_ssl_up: [''],
      web_ssl_date: [''],
      web_ssl_cache: [''],
      web_http2: [''],
      web_gzip: ['']
    })

    // this.id = this.route.snapshot.paramMap.get('id');

    // You can also subscribe to the paramMap observable for more dynamic parameter access

  
  }


  getCustomer() {
    this.mainService.getCustomer().subscribe({
      next: (res: any) => {
        this.customers = res;
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  getPanel() {
    this.mainService.getPanel().subscribe({
      next: (res: any) => {
        this.panels = res;
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  getAccounts(){
    this.mainService.getAllAccounts().subscribe({
      next: (res: any) => {
        this.server_account = res.filter((account:any) => account.account_type === 'server' );
        this.cloudAccounts = res.filter((account: any) => account.account_type === 'cloud');
        this.domainManager = res.filter((account: any) => account.account_type === 'domain');
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  OtherAccounts()
  {
    this.mainService.MasterAccountList().subscribe({
      next: (res: any) => {
        this.awc_account = res.filter((account:any) => account.company_name === 'awc' );
        this.saba_account = res.filter((account: any) => account.company_name === 'saba');
        this.international_account = res.filter((account: any) => account.company_name === 'int');
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  SelectAccount(event: any): void {
    const server_name = event.target.value
  }

  fetchData(id: string)
  {
    this.mainService.getWebsiteById(id).subscribe({
      next:(res:any)=>{
         
          this.platformtypevalue = res.platform;
               // Clear all form fields initially
      this.clearForm();

      // Patch common fields
      this.WebForm.patchValue({
        region: res.region,
        customer: res.customer._id,
        platform: res.platform,
        website_name: res.website_name,
        website_type: res.website_type,
        website_status: res.website_status,
        mother_panel: res.mother_panel._id
      });
     
      
      // Patch database-specific fields if platform is 'database'
      if (this.platformtypevalue === 'database') {
       
        this.patchDatabaseFields(res);
      }

      // Patch website-specific fields if platform is 'website'
      if (this.platformtypevalue === 'website') {
        if(this.booleanToYesNo(res.web_cloud_s) == 'yes')
        {
          this.show_cloud = true;
        }
        if(this.booleanToYesNo(res.web_awc_s) == 'yes')
          {
            this.show_awc = true;
          }
          if(this.booleanToYesNo(res.web_saba_s) == 'yes')
            {
              this.show_saba = true;
            }
            if(this.booleanToYesNo(res.web_inter_s) == 'yes')
              {
                this.show_inter = true;
              }
        this.patchWebsiteFields(res);
      }

      this.updateValidators();
      },error:(e)=>{
       
      }
    })
  }

  clearForm() {
    this.WebForm.reset();
  }
  booleanToYesNo(value:boolean) {
    return value ? "yes" : "no";
  }

  patchDatabaseFields(data: any) {
    
    const dbFields = [
      'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 
      'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
    ];
  
    dbFields.forEach(field => {
      if(field === 'db_grafana' || field === 'db_auth' || field === 'db_firewall' || field === 'db_index')
      {
        this.WebForm.get(field)?.patchValue(this.booleanToYesNo(data[field]))
      }
      else if(field === 'db_log' || field === 'db_reset')
      {
          this.WebForm.get(field)?.patchValue(this.formatDate(data[field]));
      }
      else
      {
        if (data[field] !== null && data[field] !== undefined) {
          this.WebForm.get(field)?.patchValue(data[field]);
        }
      }

     
    });
  }

  // formatDate(dateString: string): string {
  //   const formattedDate = this.datePipe.transform(dateString, 'dd-MM-yyyy HH:mm');
  //   return formattedDate || '';
  // }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  patchWebsiteFields(data: any) {
    const websiteFields = [
        'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain','web_awc_s', 'web_awc','awc_call_back','web_saba_s', 'web_saba','saba_call_back','web_inter_s', 'web_inter', 'inter_call_back','web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache','web_http2', 'web_gzip'
    ];
  
    websiteFields.forEach(field => {
      if(field === 'web_cloud_s' || field === 'web_awc_s' || field === 'web_saba_s' || field === 'web_inter_s' || field === 'web_config' || field === 'web_diff_server' || field === 'web_domain_whitelist' || field === 'web_gzip' || field === 'web_http2' || field === 'web_nagios' || field === 'web_redis_allow' || field === 'web_ssl' || field === 'web_ssl_up')
      {
        this.WebForm.get(field)?.patchValue(this.booleanToYesNo(data[field]));
      } else if(field === 'web_awc' || field === 'web_cloud_ac' || field === 'web_domain' || field === 'web_inter' || field === 'web_saba' || field === 'web_server_comp'){
            this.WebForm.get(field)?.patchValue(data[field]?._id);         
      }
      else if(field === 'web_nginx_log' || field === 'web_pm_log' || field === 'web_reset' || field === 'web_ssl_date' || field === 'web_ssl_ex' || field === 'web_tom_log' || field === 'web_cache')
      {
        this.WebForm.get(field)?.patchValue(this.formatDate(data[field]));
      }
      else
      {
        if (data[field] !== null && data[field] !== undefined) {
          this.WebForm.get(field)?.patchValue(data[field]);
        }
      }
      
    });
  }

  updateValidators() {
    const dbFields = [
      'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
    ];
  
    const websiteFields = [
      'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain','web_awc_s', 'web_awc','awc_call_back','web_saba_s', 'web_saba','saba_call_back','web_inter_s', 'web_inter', 'inter_call_back','web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache','web_http2', 'web_gzip'
    ];
  
    dbFields.forEach(field => {
      const control = this.WebForm.get(field);
      if (control) {
        control.clearValidators();
        if (this.platformtypevalue === 'database') {
          if (field === 'db_ip') {
            control.setValidators([Validators.required, ValidatorService.ipAddressValidator()]);
          } else if (field === 'db_time_zone') {
            control.setValidators([Validators.required, ValidatorService.alphanumeric]);
          } else {
            control.setValidators([Validators.required]);
          }
        }
        control.updateValueAndValidity();
      }
    });
  
    websiteFields.forEach(field => {
      const control = this.WebForm.get(field);
      if (control) {
        control.clearValidators();
        if (this.platformtypevalue === 'website') {
          if (field === 'web_server_ip') {
            control.setValidators([Validators.required, ValidatorService.ipAddressValidator()]);
          } else {
            control.setValidators([Validators.required]);
          }
        }
        control.updateValueAndValidity();
      }
    });
  }

  cloudchange(event:any)
  {
    const cloud_status = event.target.value;


    this.show_cloud = cloud_status === 'yes'
    
      if(cloud_status === 'yes')
      {
        this.WebForm.get('web_cloud_ac')?.setValidators([Validators.required]);
        this.WebForm.get('web_cloud_ac')?.updateValueAndValidity({ emitEvent: false });
      }
      else
      {
        
        this.WebForm.removeControl('web_cloud_ac');
      }

     
     
  }

  awcchange(event:any)
  {
    const awc_status = event.target.value;

    this.show_awc = awc_status === 'yes'

    if(awc_status === 'yes')
      {
        this.WebForm.get('web_awc')?.setValidators([Validators.required]);
        this.WebForm.get('web_awc')?.updateValueAndValidity({ emitEvent: false });
      }
      else
      {
        this.WebForm.removeControl('web_awc');
        this.WebForm.removeControl('awc_call_back')
      }

  
    
  }

  sabachange(event:any)
  {
      const saba_status = event.target.value;

      this.show_saba = saba_status === 'yes'

      if(saba_status === 'yes')
        {
          this.WebForm.get('web_saba')?.setValidators([Validators.required]);
          this.WebForm.get('web_saba')?.updateValueAndValidity({ emitEvent: false });
        }
        else
        {
          this.WebForm.removeControl('web_saba');
          this.WebForm.removeControl('saba_call_back')
        }      
  }

  interchange(event:any)
  {
      const inter_status = event.target.value;

      this.show_inter = inter_status === 'yes'

      if(inter_status === 'yes')
        {
          this.WebForm.get('web_inter')?.setValidators([Validators.required]);
          this.WebForm.get('web_inter')?.updateValueAndValidity({ emitEvent: false });
        }
        else
        {
          this.WebForm.removeControl('web_inter');
          this.WebForm.removeControl('inter_call_back');
        }        
  }
  
  PaltformType(event: any): void {
    this.platformtypevalue = event.target.value;
  
    const dbFields = [
      'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
    ];
  
    const websiteFields = [
      'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain','web_awc_s', 'web_awc','awc_call_back','web_saba_s', 'web_saba','saba_call_back','web_inter_s', 'web_inter', 'inter_call_back','web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset','web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache','web_http2', 'web_gzip'
    ];
  
    dbFields.forEach(field => {
      const control = this.WebForm.get(field);
      if (control) {
        control.clearValidators();
        if (this.platformtypevalue === 'database') {
          if (field === 'db_ip') {
            control.setValidators([Validators.required, ValidatorService.ipAddressValidator()]);
          } else if (field === 'db_time_zone') {
            control.setValidators([Validators.required, ValidatorService.alphanumeric]);
          } else {
            control.setValidators([Validators.required]);
          }
        }
        control.updateValueAndValidity();
      }
    });
  
    websiteFields.forEach(field => {
      const control = this.WebForm.get(field);
      if (control) {
        control.clearValidators();
        if (this.platformtypevalue === 'website') {
          if (field === 'web_server_ip') {
            control.setValidators([Validators.required, ValidatorService.ipAddressValidator()]);
          } else {
            control.setValidators([Validators.required]);
          }
        }
        control.updateValueAndValidity();
      }
    });
  }
  

  onSubmitWeb() {
    this.IsSubmit = true;
    if (this.WebForm.get('web_cloud_s')?.value === 'no') {
      this.WebForm.removeControl('web_cloud_ac');
    }

    if (this.WebForm.get('web_awc_s')?.value === 'no') {
      this.WebForm.removeControl('web_awc');
      this.WebForm.removeControl('awc_call_back')
    }

    if (this.WebForm.get('web_saba_s')?.value === 'no') {
      this.WebForm.removeControl('web_saba');
      this.WebForm.removeControl('saba_call_back')
    }

    if (this.WebForm.get('web_inter_s')?.value === 'no') {
      this.WebForm.removeControl('web_inter');
      this.WebForm.removeControl('inter_call_back');
    }

    this.WebForm.updateValueAndValidity();
    if (this.WebForm.valid) {
 

      let data = this.WebForm.value;
   

      if (this.platformtypevalue === 'database') {
        const websiteFields = [
         'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain','web_awc_s', 'web_awc','awc_call_back','web_saba_s', 'web_saba','saba_call_back','web_inter_s', 'web_inter', 'inter_call_back','web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache','web_http2', 'web_gzip'
        ];
        websiteFields.forEach(field => delete data[field]);
      } else if (this.platformtypevalue === 'website') {
        const dbFields = [
          'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
        ];
        dbFields.forEach(field => delete data[field]);
      }

      
      this.mainService.UpdateWebsite({_id:this.id,data}).subscribe({
        next: (res: any) => {
          this.IsSubmit = false;
          this.msgSuccess();

        }, error: (e) => {
          this.msgFailure();
        }
      })
    }
    else
    {
      console.log(this.WebForm.valid)
    }
  
    
  }


  msgSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Successfully Updated!',
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
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
