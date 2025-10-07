import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidatorService } from '../services/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-mother-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-mother-panel.component.html',
  styleUrl: './add-mother-panel.component.css'
})
export class AddMotherPanelComponent implements OnInit {

      IsSubmit = false; websiteData: any = [];
    platformtypevalue: string = '';
    show_cloud: boolean = false;
    show_awc: boolean = false;
    show_saba: boolean = false;
    show_inter: boolean = false;
      show_java: boolean = false;
  show_node: boolean = false;
  show_angular: boolean = false;
  show_java_angular: boolean = false;
  show_node_angular: boolean = false;
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
    awc_agents:any = [];
    international_account: any = [];
    server_account: any = [];
    tomcat_version: any = ["10", "9", "8.5", "8.0", "7.0", "6.0", "5.5", "5.0", "4.1", "4.0"];
    ubuntu_version: any = ["24.04", "23.10", "23.04", "22.10", "22.04", "21.10", "21.04", "20.10", "20.04", "19.10"];
    nginx_version: any = ["1.27", "1.26", "1.25", "1.24", "1.23", "1.22", "1.21", "1.20", "1.19", "1.18"];
    mongo_version: any = ["7.0", "6.0", "5.0", "4.4", "4.2", "4.0", "3.6", "3.4", "3.2", "3.0"];
    socket_version: any = ["4.7.5", "4.7.4", "4.7.3", "4.7.0", "4.6", "4.5", "4.4", "4.1.3", "4.1.2","4.1.1", "4.1.0", "4.0.1", "4.0.0"];
    java_version: any = ["22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "9", "8"];
      node_version: any = ["22", "20", "18"];
  angular_version: any = ["20", "19", "18", "16", "13"];
  
    constructor(private mainService: MainService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    this.getCustomer();
    this.getPanel();
    this.getAccounts();
    this.OtherAccounts();

      this.WebForm = this.fb.group({
            customer: ['', Validators.required],
            platform: ['website', Validators.required],
            website_name: ['', [Validators.required, ValidatorService.alphanumeric]],
            website_type: ['', Validators.required],
            website_status: ['motherpanel', Validators.required],
            mother_panel: ['', Validators.required],
            web_technology: ['', Validators.required],
            web_cloud_s: ['', Validators.required],
            web_cloud_ac: ['', Validators.required],
            web_data_source: ['', Validators.required],
            web_bet_match: ['', Validators.required],
            web_domain: ['', Validators.required],
            web_awc_s: ['', Validators.required],
            web_awc: ['', Validators.required],
            web_awc_agent:['', Validators.required],
            web_saba_s: ['', Validators.required],
            web_saba: ['', Validators.required],
            saba_call_back: ['', Validators.required],
            web_inter_s: ['', Validators.required],
            web_inter: ['', Validators.required],
            inter_call_back: ['', Validators.required],
            web_domain_whitelist: ['', Validators.required],
            web_redis_allow: ['', Validators.required],
            web_main_link: ['', Validators.required],
            web_mgt_link: ['', Validators.required],
            web_diff_server: ['', Validators.required],
            web_project_name: ['', Validators.required],
            web_server_name: ['', Validators.required],
            web_server_comp: ['', Validators.required],
            web_server_acc: ['', Validators.required],
            web_server_password: ['', Validators.required],
            web_server_ip: ['', Validators.required],
            web_ubuntu: ['', Validators.required],
            web_time_zone: ['', Validators.required],
            web_cache: ['', Validators.required],
            web_reset: ['', Validators.required],
            web_config: ['', Validators.required],
            web_nagios: ['', Validators.required],
            web_java_ver: ['', Validators.required],
            web_tom_ver: ['', Validators.required],
            web_tom_cache: ['', Validators.required],
            web_tom_log: ['', Validators.required],
          web_node_ver: ['',Validators.required],
      web_angular_ver: ['',Validators.required],
            web_nginx_ver: ['', Validators.required],
            web_nginx_cache: ['', Validators.required],
            web_nginx_conn: ['', Validators.required],
            web_nginx_file: ['', Validators.required],
            web_nginx_log: ['', Validators.required],
            web_pm_log: ['', Validators.required],
            web_max_body: ['', Validators.required],
            web_socket_ver: ['', Validators.required],
            web_ssl: ['', Validators.required],
            web_ssl_name: ['', Validators.required],
            web_ssl_ex: ['', Validators.required],
            web_ssl_up: ['', Validators.required],
            web_ssl_date: ['', Validators.required],
            web_ssl_cache: ['', Validators.required],
            web_http2: ['', Validators.required],
            web_gzip: ['', Validators.required]
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

    onPanelOrTypeChange() {
    const type = this.WebForm.get('website_type')?.value;
    // Reset all flags first
    this.show_java = false;
    this.show_node = false;
    this.show_node_angular = false;
    this.show_java_angular = false;

    this.WebForm.get('web_java_ver')?.clearValidators();
    this.WebForm.get('web_tom_ver')?.clearValidators();
    this.WebForm.get('web_tom_cache')?.clearValidators();
    this.WebForm.get('web_tom_log')?.clearValidators();
    this.WebForm.get('web_node_ver')?.clearValidators();
    this.WebForm.get('web_angular_ver')?.clearValidators();

    // Enable based on selection


    if (type === "java") {
      this.show_java = true;
      this.WebForm.get('web_java_ver')?.setValidators([Validators.required]);
      this.WebForm.get('web_tom_ver')?.setValidators([Validators.required]);
      this.WebForm.get('web_tom_cache')?.setValidators([Validators.required]);
      this.WebForm.get('web_tom_log')?.setValidators([Validators.required]);
    }
    else if (type === "node") {
      this.show_node = true;
      this.WebForm.get('web_node_ver')?.setValidators([Validators.required]);
    }
    else if (type === "nodeangular") { // fixed typo: "ndoeangular"
      this.show_node_angular = true;
      this.WebForm.get('web_node_ver')?.setValidators([Validators.required]);
      this.WebForm.get('web_angular_ver')?.setValidators([Validators.required]);
    }
    else if (type === "javangular") {
      this.show_java_angular = true;
      this.WebForm.get('web_java_ver')?.setValidators([Validators.required]);
      this.WebForm.get('web_tom_ver')?.setValidators([Validators.required]);
      this.WebForm.get('web_tom_cache')?.setValidators([Validators.required]);
      this.WebForm.get('web_tom_log')?.setValidators([Validators.required]);
      this.WebForm.get('web_angular_ver')?.setValidators([Validators.required]);
    }


    this.WebForm.get('web_java_ver')?.updateValueAndValidity();
    this.WebForm.get('web_tom_ver')?.updateValueAndValidity();
    this.WebForm.get('web_tom_cache')?.updateValueAndValidity();
    this.WebForm.get('web_tom_log')?.updateValueAndValidity();
    this.WebForm.get('web_node_ver')?.updateValueAndValidity();
    this.WebForm.get('web_angular_ver')?.updateValueAndValidity();
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
      this.WebForm.get('web_awc_agent')?.setValidators([Validators.required]);
      this.WebForm.get('web_awc')?.updateValueAndValidity({ emitEvent: false });
    }
    else {
      this.WebForm.removeControl('web_awc');
      this.WebForm.removeControl('web_awc_agent');
    }
  }

  awcMaster(event: any) {
    const awc_status = event.target.value;

    console.log(awc_status)

    this.mainService.getAWCAgent({master:awc_status}).subscribe({
      next:(res:any) => {
        console.log(res)
        this.awc_agents = res
           this.WebForm.get('web_awc_agent')?.setValidators([Validators.required]);
      this.WebForm.get('web_awc_agent')?.updateValueAndValidity({ emitEvent: false });
      }
    })
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


  onSubmitWeb()
  {

     this.IsSubmit = true;

       if (this.WebForm.valid) {
        let data = this.WebForm.value;

        this.mainService.AddMotherPanel(data).subscribe({
          next: (res: any) => {
            this.IsSubmit = false;
            this.msgSuccess();

          }, error: (e) => {
            this.msgFailure();
          }
        })
      }
      else {
        console.log('Invalid Form',this.WebForm)
        Object.keys(this.WebForm.controls).forEach(controlName => {
          const control = this.WebForm.get(controlName);
          if (control && control.invalid) {
            console.log(`Control: ${controlName}`, control.errors);
          }
        });
      }
  }


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
