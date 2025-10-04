import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ValidatorService } from '../services/validator.service';
import { TagInputModule } from 'ngx-chips';



@Component({
  selector: 'app-add-website',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TagInputModule],
  templateUrl: './add-website.component.html',
  styleUrl: './add-website.component.css'
})
export class AddWebsiteComponent implements OnInit {
  IsSubmit = false; websiteData: any = [];
  platformtypevalue: string = '';
  show_cloud: boolean = false;
  show_awc: boolean = false;
  show_saba: boolean = false;
  show_inter: boolean = false;
  show_web_fields: boolean = true;
  show_db_fields: boolean = true;
  config_type: boolean = false;
  customers: any = [];
  panels: any = [];
  website_names: any = [];
  WebForm!: FormGroup;
  cloudAccounts: any = [];
  domainManager: any = [];
  awc_account: any = [];
  saba_account: any = [];
  international_account: any = [];
  server_account: any = [];
  tomcat_version: any = ["10", "9", "8.5", "8.0", "7.0", "6.0", "5.5", "5.0", "4.1", "4.0"];
  ubuntu_version: any = ["24.04", "23.10", "23.04", "22.10", "22.04", "21.10", "21.04", "20.10", "20.04", "19.10"];
  nginx_version: any = ["1.27", "1.26", "1.25", "1.24", "1.23", "1.22", "1.21", "1.20", "1.19", "1.18"];
  mongo_version: any = ["7.0", "6.0", "5.0", "4.4", "4.2", "4.0", "3.6", "3.4", "3.2", "3.0"];
  socket_version: any = ["4.7.5", "4.7.4", "4.7.3", "4.7.0", "4.6", "4.5", "4.4", "4.1.3", "4.1.2","4.1.1", "4.1.0", "4.0.1", "4.0.0"];
  java_version: any = ["22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "9", "8"];

  constructor(private mainService: MainService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getCustomer();
    this.getPanel();
    this.getAccounts();
    this.OtherAccounts();
    this.Websites();
    this.WebForm = this.fb.group({
      region: ['', Validators.required],
      customer: ['', Validators.required],
      platform: ['', Validators.required],
      website_name: ['', [Validators.required, ValidatorService.alphanumeric]],
      website_type: ['', Validators.required],
      website_status: ['', Validators.required],
      mother_panel: ['', Validators.required],
      che_con: [''],
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
      awc_call_back: [''],
      web_saba_s: [''],
      web_saba: [''],
      saba_call_back: [''],
      web_inter_s: [''],
      web_inter: [''],
      inter_call_back: [''],
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
  }

  Websites() {
    this.mainService.GetWebsite().subscribe({
      next: (res: any) => {
        this.websiteData = res;
      }, error: (e) => {

      }
    })
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

  getAccounts() {
    this.mainService.getAllAccounts().subscribe({
      next: (res: any) => {
        this.server_account = res.filter((account: any) => account.account_type === 'server');
        this.cloudAccounts = res.filter((account: any) => account.account_type === 'cloud');
        this.domainManager = res.filter((account: any) => account.account_type === 'domain');
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  OtherAccounts() {
    this.mainService.MasterAccountList().subscribe({
      next: (res: any) => {
        this.awc_account = res.filter((account: any) => account.company_name === 'awc');
        this.saba_account = res.filter((account: any) => account.company_name === 'saba');
        this.international_account = res.filter((account: any) => account.company_name === 'int');
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  SelectAccount(event: any): void {
    const server_name = event.target.value
    console.log(server_name)
  }

  PaltformType(event: any): void {
    this.platformtypevalue = event.target.value;

    if (this.platformtypevalue === 'database') {
      this.onPanelOrTypeChange();
    }

    const dbFields = [
      'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
    ];

    const websiteFields = [
      'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain', 'web_awc_s', 'web_awc', 'awc_call_back', 'web_saba_s', 'web_saba', 'saba_call_back', 'web_inter_s', 'web_inter', 'inter_call_back', 'web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache',
      'web_http2', 'web_gzip'
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

  chec_conf(event: any) {
    const c_value = event.target.value;

    const platformType = this.platformtypevalue;

    console.log('Platform Type:', platformType);

    if(platformType === 'website')
    {
      
      const websiteFields = [
        'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain', 'web_awc_s', 'web_awc', 'awc_call_back', 'web_saba_s', 'web_saba', 'saba_call_back', 'web_inter_s', 'web_inter', 'inter_call_back', 'web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache',
        'web_http2', 'web_gzip'
      ];
  
      if (c_value === 'new') {
        this.show_web_fields = true;
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
      else {
        this.show_web_fields = false;
        websiteFields.forEach(field => {
          const control = this.WebForm.get(field);
          if (control) {
            control.clearValidators();
            control.updateValueAndValidity();
          }
        });
      }
    }
     else if(platformType === 'database')
     {
      const dbFields = [
        'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
      ];
      if (c_value === 'new') {
        this.show_db_fields = true;
        dbFields.forEach(field => {
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
      else {
        this.show_db_fields = false;
  
        dbFields.forEach(field => {
          const control = this.WebForm.get(field);
          if (control) {
            control.clearValidators();
            control.updateValueAndValidity();
          }
        });
      }
     }

  }

  checkstatus(event: any) {
    const web_status = event.target.value;
    const selectedMotherPanel = this.WebForm.get('mother_panel')?.value;
    
    if (web_status === 'label') {
      this.show_web_fields = false;
      this.config_type = true;
      const cheConControl = this.WebForm.get('che_con');
      if (!cheConControl) {
        // Add the control with validators if it doesn't exist
        this.WebForm.addControl('che_con', this.fb.control('', Validators.required));
      } else {
        // Update validators if the control already exists
        cheConControl.setValidators([Validators.required]);
        cheConControl.updateValueAndValidity({ emitEvent: false });
      }
    }
    else {
      this.show_web_fields = true;
      this.config_type = false;
      this.WebForm.removeControl('che_con');
    }
  }

  cloudchange(event: any) {
    const cloud_status = event.target.value;


    this.show_cloud = cloud_status === 'yes'

    if (cloud_status === 'yes') {
      this.WebForm.get('web_cloud_ac')?.setValidators([Validators.required]);
      this.WebForm.get('web_cloud_ac')?.updateValueAndValidity({ emitEvent: false });
    }
    else {

      this.WebForm.removeControl('web_cloud_ac');
    }



  }

  awcchange(event: any) {
    const awc_status = event.target.value;

    this.show_awc = awc_status === 'yes'

    if (awc_status === 'yes') {
      this.WebForm.get('web_awc')?.setValidators([Validators.required]);
      this.WebForm.get('awc_call_back')?.setValidators([Validators.required]);
      this.WebForm.get('web_awc')?.updateValueAndValidity({ emitEvent: false });
    }
    else {
      this.WebForm.removeControl('web_awc');
      this.WebForm.removeControl('awc_call_back');
    }
  }

  sabachange(event: any) {
    const saba_status = event.target.value;

    this.show_saba = saba_status === 'yes'

    if (saba_status === 'yes') {
      this.WebForm.get('web_saba')?.setValidators([Validators.required]);
      this.WebForm.get('saba_call_back')?.setValidators([Validators.required]);
      this.WebForm.get('web_saba')?.updateValueAndValidity({ emitEvent: false });
    }
    else {
      this.WebForm.removeControl('web_saba');
      this.WebForm.removeControl('saba_call_back');
    }



  }

  interchange(event: any) {
    const inter_status = event.target.value;

    this.show_inter = inter_status === 'yes'

    if (inter_status === 'yes') {
      this.WebForm.get('web_inter')?.setValidators([Validators.required]);
      this.WebForm.get('inter_call_back')?.setValidators([Validators.required]);
      this.WebForm.get('web_inter')?.updateValueAndValidity({ emitEvent: false });
    }
    else {
      this.WebForm.removeControl('web_inter');
      this.WebForm.removeControl('inter_call_back');
    }


  }

  onPanelOrTypeChange() {
    if (this.platformtypevalue === 'database') {
      const panelId = this.WebForm.get('mother_panel')?.value;
      const type = this.WebForm.get('website_type')?.value;

      if (panelId && type) {
        this.website_names = this.websiteData.filter((d: any) => d.mother_panel._id === panelId && d.website_type === type && d.platform === 'website');
      } else {
        this.website_names = [];
      }
    }
  }

  onSubmitWeb() {
    this.IsSubmit = true;

    if (this.WebForm.get('che_con')?.value === 'copy') {
      if (this.WebForm.valid) {

        let data = { m_detail: this.WebForm.get('mother_panel')?.value,platformType: this.platformtypevalue }

        this.mainService.getWebsiteByMother(data).subscribe({
          next: (res: any) => {
            this.CopyFields(res, this.platformtypevalue);

            let formdata = this.WebForm.value;


            if (this.platformtypevalue === 'database') {
              const websiteFields = [
                'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain', 'web_awc_s', 'web_awc', 'awc_call_back', 'web_saba_s', 'web_saba', 'saba_call_back', 'web_inter_s', 'web_inter', 'inter_call_back', 'web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache',
                'web_http2', 'web_gzip'
              ];
              websiteFields.forEach(field => delete formdata[field]);
            } else if (this.platformtypevalue === 'website') {
              const dbFields = [
                'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
              ];
              dbFields.forEach(field => delete formdata[field]);
            }
            this.mainService.AddWebsite(formdata).subscribe({
              next: (res: any) => {
                this.IsSubmit = false;
                this.msgSuccess();

              }, error: (e) => {
                this.msgFailure();
              }
            })

          },
          error: (e) => {
            this.msgFailure();
          }
        })
      }
      else {
        // console.log('Copy error', this.WebForm)
        //  console.log('Invalid Form',this.WebForm)
        // Object.keys(this.WebForm.controls).forEach(controlName => {
        //   const control = this.WebForm.get(controlName);
        //   if (control && control.invalid) {
        //     console.log(`Control: ${controlName}`, control.errors);
        //   }
        // });
      }
    }
    else {
      if (this.WebForm.valid) {
        let data = this.WebForm.value;


        if (this.platformtypevalue === 'database') {
          const websiteFields = [
            'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain', 'web_awc_s', 'web_awc', 'awc_call_back', 'web_saba_s', 'web_saba', 'saba_call_back', 'web_inter_s', 'web_inter', 'inter_call_back', 'web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache',
            'web_http2', 'web_gzip'
          ];
          websiteFields.forEach(field => delete data[field]);
        } else if (this.platformtypevalue === 'website') {
          const dbFields = [
            'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
          ];
          dbFields.forEach(field => delete data[field]);
        }


        this.mainService.AddWebsite(data).subscribe({
          next: (res: any) => {
            this.IsSubmit = false;
            this.msgSuccess();

          }, error: (e) => {
            this.msgFailure();
          }
        })
      }
      else {
        // console.log('Invalid Form',this.WebForm)
        // Object.keys(this.WebForm.controls).forEach(controlName => {
        //   const control = this.WebForm.get(controlName);
        //   if (control && control.invalid) {
        //     console.log(`Control: ${controlName}`, control.errors);
        //   }
        // });
      }
    }

  }


  CopyFields(data: any, platformType: string) {

    if(platformType == 'website')
    {
      const websiteFields = [
        'web_technology', 'web_cloud_s', 'web_cloud_ac', 'web_data_source', 'web_bet_match', 'web_domain', 'web_awc_s', 'web_awc', 'awc_call_back', 'web_saba_s', 'web_saba', 'saba_call_back', 'web_inter_s', 'web_inter', 'inter_call_back', 'web_domain_whitelist', 'web_redis_allow', 'web_main_link', 'web_mgt_link', 'web_diff_server', 'web_project_name', 'web_server_name', 'web_server_comp', 'web_server_acc', 'web_server_password', 'web_server_ip', 'web_ubuntu', 'web_time_zone', 'web_cache', 'web_reset', 'web_config', 'web_nagios', 'web_java_ver', 'web_tom_ver', 'web_tom_cache', 'web_tom_log', 'web_nginx_ver', 'web_nginx_cache', 'web_nginx_conn', 'web_nginx_file', 'web_nginx_log', 'web_pm_log', 'web_max_body', 'web_socket_ver', 'web_ssl', 'web_ssl_name', 'web_ssl_ex', 'web_ssl_up', 'web_ssl_date', 'web_ssl_cache', 'web_http2', 'web_gzip'
      ];
  
      websiteFields.forEach(field => {
        if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
          this.WebForm.get(field)?.patchValue(data[field]);
        }
        else {
          this.WebForm.removeControl(field);
        }
  
      });
    }
    else if(platformType == 'database' )
    {
      const dbFields = [
        'db_ip', 'db_ubutnu', 'che_con', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
      ];

      
      dbFields.forEach(field => {
        if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
          this.WebForm.get(field)?.patchValue(data[field]);
        }
        else {
          this.WebForm.removeControl(field);
        }
  
      });
    }
    
  }


  // removeEmptyValues(obj: any): any {
  //   if (obj === null || obj === undefined) {
  //     return undefined;
  //   }

  //   if (typeof obj === 'object') {
  //     // Create a new object to avoid modifying the original object
  //     const cleanedObj: any = Array.isArray(obj) ? [] : {};

  //     for (const key in obj) {
  //       if (obj.hasOwnProperty(key)) {
  //         const value = obj[key];
  //         const cleanedValue = this.removeEmptyValues(value);
  //         // Only add the key if cleanedValue is not undefined or empty
  //         if (cleanedValue !== undefined && cleanedValue !== '' && cleanedValue !== false && cleanedValue !== 0) {
  //           cleanedObj[key] = cleanedValue;
  //         }
  //       }
  //     }
  //     return cleanedObj;
  //   }

  //   // Return the value itself if it's not an object or array
  //   return obj;
  // }

  msgSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Successfully Added!',
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(() => {
      this.router.navigate(['/website-detail']);
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
