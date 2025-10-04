import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-information-page',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink],
  templateUrl: './information-page.component.html',
  styleUrl: './information-page.component.css'
})
export class InformationPageComponent implements OnInit {
  panels: any = [];websiteData:any = [];InfoForm: FormGroup = new FormGroup({});
  websites:any = [];showModal:boolean = false;eventData:any
  selectedPanelId: string = '';
  selectedWebsite: string = '';
  viewDetail: boolean = false;
  details: any = [];
  UserlinksArray: string[] = [];
  ManagementLinkArray: string[] = [];

  constructor(private mainservice: MainService){}

  ngOnInit(): void {
      this.GetMotherPanel();
      this.InfoForm = new FormGroup({
        web_main_link: new FormControl(""),
        userLinkId: new FormControl(""),
        userLinkPassword: new FormControl(""),
        userLinkId2: new FormControl(""),
        userLinkPassword2: new FormControl(""),
        userLinkId3: new FormControl(""),
        userLinkPassword3: new FormControl(""),
        web_mgt_link: new FormControl(""),
        mgtLinkId: new FormControl(""),
        mgtLinkPassword: new FormControl(""),
        userAlternativeLink: new FormControl(""),
        mgtAlternativeLink: new FormControl(""),
      })
  }

  GetMotherPanel()
  {
      this.mainservice.getPanel().subscribe({
        next:(res:any)=>{
          this.panels = res
        }, error:(e) =>
        {

        }
      })
  }

  GetWebsite(event:any)
  {
    this.eventData = event
    this.selectedPanelId = event.target.value;

    this.mainservice.GetWebsite().subscribe({
      next:(res:any)=>{
        this.websiteData = res;
        this.websites = this.websiteData.filter((d: any) => d.mother_panel._id === this.selectedPanelId && d.platform !== "database").map((w:any) => w.website_name);
        
      },error:(e)=>{

      }
    })
  }

  WebsiteD(event: any)
  {
    this.selectedWebsite = event.target.value;
  }

  isAllSelected(): boolean {
    return !!this.selectedPanelId && !!this.selectedWebsite;
  }

  ViewData()
  {
    this.viewDetail = true;
    const filteredData = this.websiteData.filter(
      (d: any) =>
        d.mother_panel._id === this.selectedPanelId &&
        d.website_name === this.selectedWebsite
    );

    this.details = filteredData[0];
    this.UserlinksArray = this.details.userAlternativeLink[0].split(',');
    this.ManagementLinkArray = this.details.mgtAlternativeLink[0].split(',');
    
  }

  EditPage()
  {
    this.InfoForm.patchValue({
      web_main_link: this.details?.web_main_link,
        userLinkId: this.details?.userLinkId,
        userLinkPassword: this.details?.userLinkPassword,
        userLinkId2: this.details?.userLinkId2,
        userLinkPassword2: this.details?.userLinkPassword2,
        userLinkId3: this.details?.userLinkId3,
        userLinkPassword3: this.details?.userLinkPassword3,
        web_mgt_link: this.details?.web_mgt_link,
        mgtLinkId: this.details?.mgtLinkId,
        mgtLinkPassword: this.details?.mgtLinkPassword,
        userAlternativeLink: this.details?.userAlternativeLink,
        mgtAlternativeLink: this.details?.mgtAlternativeLink,
    });
    this.showModal = true
  }

  closeModal()
  {
    this.InfoForm.reset();
    this.showModal = false;    
  }

  OnSubmit()
  {
    
    const userAlternativeLink = this.InfoForm.get('userAlternativeLink')?.value;
      if (typeof userAlternativeLink === 'string') {
        const alternativeLinks = userAlternativeLink.split(',').map((link:any) => 'ag.' + link.trim());
        this.InfoForm.patchValue({
          mgtAlternativeLink: alternativeLinks.join(',')
        });
      }
    
      let data = this.InfoForm.value;

     this.mainservice.UpdateWebsite({_id:this.details?._id,data,type:'info'}).subscribe({
      next: (res: any) => {
        this.GetWebsite(this.eventData);
        this.msgSuccess();
        this.showModal = false;  
        setTimeout(() => {
          this.ViewData()
        }, 1500);     
        
      }, error: (e) => {
        this.msgFailure();
      }
    })
  }



  CopyServer(alternativeLink: string)
  {
    
    if (alternativeLink) {
      const links = alternativeLink.split(',');
      const formattedLinks = links.map((link: string) => `if ($http_origin ~ "${link}") {set $cors "true";}`).join('\n');
       this.copyToClipboard(formattedLinks);
    }
      
  }

  copyNormal(alternativeLink: string)
  {
    if (alternativeLink) {
      this.copyToClipboard(alternativeLink);
    }
  }

  copyToClipboard(text: string)
  {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  



  msgSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Successfully Updated!',
      showConfirmButton: false,
      timer: 1500
    });
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
