import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { ValidatorService } from '../services/validator.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-database',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-database.component.html',
  styleUrl: './add-database.component.css'
})
export class AddDatabaseComponent implements OnInit {

  IsSubmit = false; websiteData: any = [];
  platformtypevalue: string = '';
  show_web_fields: boolean = true;
  show_db_fields: boolean = true;
  config_type: boolean = true;
  customers: any = [];
  panels: any = [];
  website_names: any = [];
  WebForm!: FormGroup;
  tomcat_version: any = ["10", "9", "8.5", "8.0", "7.0", "6.0", "5.5", "5.0", "4.1", "4.0"];
  ubuntu_version: any = ["24.04", "23.10", "23.04", "22.10", "22.04", "21.10", "21.04", "20.10", "20.04", "19.10"];
  nginx_version: any = ["1.27", "1.26", "1.25", "1.24", "1.23", "1.22", "1.21", "1.20", "1.19", "1.18"];
  mongo_version: any = ["7.0", "6.0", "5.0", "4.4", "4.2", "4.0", "3.6", "3.4", "3.2", "3.0"];
  socket_version: any = ["4.7.5", "4.7.4", "4.7.3", "4.7.0", "4.6", "4.5", "4.4", "4.1.3", "4.1.2", "4.1.1", "4.1.0", "4.0.1", "4.0.0"];
  java_version: any = ["22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "9", "8"];

  constructor(private mainService: MainService, private fb: FormBuilder, private router: Router) { }




  ngOnInit(): void {

    this.getCustomer();
    this.getPanel();
    this.Websites();

    this.WebForm = this.fb.group({
      customer: ['', Validators.required],
      platform: ['database', Validators.required],
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
      db_reset: ['']
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

    Websites() {
    this.mainService.GetWebsite().subscribe({
      next: (res: any) => {
        this.websiteData = res;
      }, error: (e) => {

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

  checkstatus(event: any) {
    const web_status = event.target.value;
    const selectedMotherPanel = this.WebForm.get('mother_panel')?.value;

    if (web_status === 'whitelabel') {
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

      const panelId = this.WebForm.get('mother_panel')?.value;
      const type = this.WebForm.get('website_type')?.value;

      console.log(panelId,type)
      if (panelId && type) {
        this.website_names = this.websiteData.filter((d: any) => d.mother_panel._id === panelId && d.website_type === type && d.platform === 'website');
      } else {
        this.website_names = [];
      }
    
  }


  chec_conf(event: any) {
    const c_value = event.target.value;


    const dbFields = [
      'db_ip', 'db_ubutnu', 'db_time_zone', 'db_version', 'db_index', 'db_grafana', 'db_auth', 'db_firewall', 'db_log', 'db_reset'
    ];
    if (c_value === 'new') {
      this.show_db_fields = true;
      dbFields.forEach(field => {
        const control = this.WebForm.get(field);
        if (control) {
          control.clearValidators();
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


  onSubmitWeb() {
    this.IsSubmit = true;

    if (this.WebForm.get('che_con')?.value === 'copy') {
      if (this.WebForm.valid) {

        let data = { m_detail: this.WebForm.get('mother_panel')?.value }

        this.mainService.getDatabaseByMother(data).subscribe({
          next: (res: any) => {
            this.CopyFields(res);

            let formdata = this.WebForm.value;

            this.mainService.AddDatabase(formdata).subscribe({
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

        this.mainService.AddDatabase(data).subscribe({
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


  CopyFields(data: any) {

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
