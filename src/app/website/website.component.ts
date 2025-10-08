import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MainService } from '../services/main.service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-website',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './website.component.html',
  styleUrl: './website.component.css'
})
export class WebsiteComponent implements OnInit {

  customers: any = []; panels: any = []; websiteData: any = []; platforms: any = [];
  websites: any = [];
  selectedCustomerId: string = '';
  selectedPanelId: string = '';
  selectedPlatform: string | null = '';
  selectedWebsite: string = '';
  databaseDetail: any = [];
  innerTitle: string = '';
  serverDetail: any = [];
  sslDetail: any = [];
  DbDetail: boolean = false;
  WebDetail: boolean = false;
  canAddWeb: boolean = false;
  canEditWeb: boolean = false;
  activeTab: string = 'motherpanel';
  motherPanel:any = [];
  webDetail:any = [];
  dataBaseDetail:any=[];
  otherDetail:any=[];



  constructor(private mainservice: MainService, private userservice: UserService, private router: Router, private datePipe: DatePipe, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.canAddWeb = this.userservice.hasPermission('ADD_WEBSITE');
    this.canEditWeb = this.userservice.hasPermission('EDIT_WEBSITE');

    this.GetWebDetails();
  }

    setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getCustomers() {
    this.mainservice.getCustomer().subscribe({
      next: (res: any) => {
        this.customers = res;
      }, error: (e) => {

      }
    })
  }

  Websites() {
    this.mainservice.GetWebsite().subscribe({
      next: (res: any) => {
        this.websiteData = res;
      }, error: (e) => {

      }
    })
  }

  GetPanel(event: any) {
    this.selectedCustomerId = event.target.value;
    // let data = {"cust_id": customer_id};
    let ddt;
    ddt = this.websiteData.filter((d: any) => d.customer._id === this.selectedCustomerId).map((pa: any) => (pa.mother_panel));
    this.panels = Array.from(new Set(ddt.map((item: any) => item._id)))
      .map(id => {
        return ddt.find((item: any) => item._id === id);
      });

  }

  GetWebDetails()
  {
    this.mainservice.GetAllWebDetails().subscribe({
      next:(res:any) => {
        console.log(res)
        this.motherPanel = res?.panel;
        this.webDetail = res?.web;
        this.dataBaseDetail = res?.data;
        this.otherDetail = res?.other
      }
    })
  }

  GetPlatform(event: any) {
    this.platforms = [];
    this.selectedPlatform = null;
    this.selectedPanelId = event.target.value;
    this.websites = [];
    this.cdr.detectChanges()
    this.platforms = this.websiteData.filter((d: any) => d.mother_panel._id === this.selectedPanelId && d.customer._id === this.selectedCustomerId).map((pt: any) => pt.platform);
    this.platforms = [...new Set(this.platforms)];

  }

  GetWebsite(event: any) {
    this.selectedPlatform = event.target.value;
    this.selectedWebsite = '';
    this.websites = this.websiteData.filter(
      (d: any) =>
        d.customer._id === this.selectedCustomerId &&
        d.mother_panel._id === this.selectedPanelId &&
        d.platform === this.selectedPlatform
    ).map((w: any) => w.website_name);

  }

  WebsiteD(event: any) {
    this.selectedWebsite = event.target.value;
  }

  isAllSelected(): boolean {
    return !!this.selectedCustomerId && !!this.selectedPanelId && !!this.selectedPlatform && !!this.selectedWebsite;
  }

  ViewData() {
    this.serverDetail = [];
    this.sslDetail = [];
    const filteredData = this.websiteData.filter(
      (d: any) =>
        d.customer._id === this.selectedCustomerId &&
        d.mother_panel._id === this.selectedPanelId &&
        d.platform === this.selectedPlatform &&
        d.website_name === this.selectedWebsite
    );

    function booleanToYesNo(value: boolean) {
      return value ? "yes" : "no";
    }

    if (this.selectedPlatform === "database") {
      this.DbDetail = true;
      this.WebDetail = false;
      this.innerTitle = 'Database Detail';
      this.databaseDetail = [
        ["Website Name", filteredData[0].website_name],
        ["Region", filteredData[0].region == 'ind' ? 'India' : filteredData[0].region === 'bd' ? 'Bangladesh' : filteredData[0].region === 'nu' ? 'Neutral' : ' ' ],
        ["Customer", filteredData[0].customer.name],
        ["website Status", filteredData[0].website_status == 'lable' ? 'WhiteLable' : 'MotherPanel'],
        ["motherpanel Name", filteredData[0].mother_panel.name],
        ["Platform", filteredData[0].platform],
        ["Website Type", filteredData[0].website_type],
        ["ip Address", filteredData[0].db_ip],
        ["ubuntu Version", filteredData[0].db_ubutnu],
        ["timezone", filteredData[0].db_time_zone],
        ["mongo Version", filteredData[0].db_version],
        ["indexing Queries", booleanToYesNo(filteredData[0].db_index)],
        ["promithious Grefana", booleanToYesNo(filteredData[0].db_grafana)],
        ["db Authentication", booleanToYesNo(filteredData[0].db_auth)],
        ["db Firewall", booleanToYesNo(filteredData[0].db_firewall)],
        ["mongo Log Clear Date", this.convertUTCtoLocal(filteredData[0].db_log)],
        ["last Hard Reset", this.convertUTCtoLocal(filteredData[0].db_reset)]
      ]
    }
    else {
      this.WebDetail = true;
      this.DbDetail = false;
      this.innerTitle = 'Website Details'
      this.databaseDetail = [
        ["Website Name", filteredData[0].website_name],
        ["Region", filteredData[0].region == 'ind' ? 'India' : filteredData[0].region === 'bd' ? 'Bangladesh' : filteredData[0].region === 'nu' ? 'Neutral' : ' '],
        ["Customer", filteredData[0].customer.name],
        ["website Status", filteredData[0].website_status == 'label' ? 'WhiteLable' : 'MotherPanel'],
        ["motherpanel Name", filteredData[0].mother_panel.name],
        ["Platform", filteredData[0].platform],
        ["Website Type", filteredData[0].website_type],
        ["Technologies", filteredData[0].web_technology],
        ["Cloudflare", booleanToYesNo(filteredData[0].web_cloud_s)],
        ["Data Source", filteredData[0].web_data_source],
        ["BetMatch Source", filteredData[0].web_bet_match],
        ["DomainManager Account", filteredData[0].web_domain.account_name],
        ["AWC Status", booleanToYesNo(filteredData[0].web_awc_s)],
        ["SABA Status", booleanToYesNo(filteredData[0].web_saba_s)],
        ["International Status", booleanToYesNo(filteredData[0].web_inter_s)],
        ["Domain WhiteList", booleanToYesNo(filteredData[0].web_domain_whitelist)],
        ["Redis WhiteList", booleanToYesNo(filteredData[0].web_redis_allow)],
        ["User Link", filteredData[0].web_main_link],
        ["MGT Link", filteredData[0].web_mgt_link],
        ["Different Server", booleanToYesNo(filteredData[0].web_diff_server)]
      ]

      if (booleanToYesNo(filteredData[0].web_cloud_s) == 'yes') {
        const cloudflareIndex = this.databaseDetail.findIndex((item: any) => item[0] === "Cloudflare");
        if (cloudflareIndex !== -1) {
          // Insert "Cloudflare Account" right after "Cloudflare"
          this.databaseDetail.splice(cloudflareIndex + 1, 0, ["Cloudflare Account", filteredData[0]?.web_cloud_ac?.account_name]);
        }
      }

      if (booleanToYesNo(filteredData[0].web_awc_s) == 'yes') {
        const awcindex = this.databaseDetail.findIndex((item: any) => item[0] === "AWC Status");
        if (awcindex !== -1) {
          this.databaseDetail.splice(awcindex + 1, 0, ["AWC Account", filteredData[0]?.web_awc?.master_account_name]);
          this.databaseDetail.splice(awcindex + 2, 0, ["AWC CallBack", filteredData[0]?.awc_call_back]);
        }
      }
      if (booleanToYesNo(filteredData[0].web_saba_s) == 'yes') {
        const sabaindex = this.databaseDetail.findIndex((item: any) => item[0] === "SABA Status");
        if (sabaindex !== -1) {
          this.databaseDetail.splice(sabaindex + 1, 0, ["SABA Account", filteredData[0]?.web_saba?.master_account_name]);
          this.databaseDetail.splice(sabaindex + 2, 0, ["SABA Callback", filteredData[0]?.saba_call_back]);
        }
      }
      if (booleanToYesNo(filteredData[0].web_inter_s) == 'yes') {
        const interindex = this.databaseDetail.findIndex((item: any) => item[0] === "International Status");
        if (interindex !== -1) {
          this.databaseDetail.splice(interindex + 1, 0, ["International Account", filteredData[0]?.web_inter?.master_account_name]);
          this.databaseDetail.splice(interindex + 2, 0, ["International CallBack", filteredData[0]?.inter_call_back]);
        }
      }

      this.serverDetail = [
        ["Project Name", filteredData[0].web_project_name],
        ["Server Name", filteredData[0].web_server_name],
        ["Server Company", filteredData[0].web_server_comp.company_name],
        ["Server Account", filteredData[0].web_server_comp.account_name],
        ["Server Password", filteredData[0].web_server_password],
        ["IP Address", filteredData[0].web_server_ip],
        ["Ubuntu Version", filteredData[0].web_ubuntu],
        ["TimeZone", filteredData[0].web_time_zone],
        ["Cache Clear Date", this.convertUTCtoLocal(filteredData[0].web_cache)],
        ["Hard Reset Date", this.convertUTCtoLocal(filteredData[0].web_reset)],
        ["New Config", booleanToYesNo(filteredData[0].web_config)],
        ["Nagios", booleanToYesNo(filteredData[0].web_nagios)],
        ["Java Version", filteredData[0].web_java_ver],
        ["Tomcat Version", filteredData[0].web_tom_ver],
        ["Tomcat Cache Size", filteredData[0].web_tom_cache],
        ["Tomcat Log Date", this.convertUTCtoLocal(filteredData[0].web_tom_log)],
        ["Nginx Version", filteredData[0].web_nginx_ver],
        ["Nginx Cache Size", filteredData[0].web_nginx_cache],
        ["Nginx Worker Conn", filteredData[0].web_nginx_conn],
        ["Nginx Open File", filteredData[0].web_nginx_file],
        ["Nginx Log Date", this.convertUTCtoLocal(filteredData[0].web_nginx_log)],
        ["PM2 Log Date", this.convertUTCtoLocal(filteredData[0].web_pm_log)],
        ["Max Body", filteredData[0].web_max_body]
      ];

      this.sslDetail = [
        ["Socket Version", filteredData[0].web_socket_ver],
        ["SSL", booleanToYesNo(filteredData[0].web_ssl)],
        ["SSL Name", filteredData[0].web_ssl_name],
        ["SSL Expiry", this.convertUTCtoLocal(filteredData[0].web_ssl_ex)],
        ["SSL Updated", booleanToYesNo(filteredData[0].web_ssl_up)],
        ["SSL Update Date", this.convertUTCtoLocal(filteredData[0].web_ssl_date)],
        ["SSL Cache Size", filteredData[0].web_ssl_cache],
        ["HTTP/2", booleanToYesNo(filteredData[0].web_http2)],
        ["Gzip", booleanToYesNo(filteredData[0].web_gzip)]
      ]


      console.log(filteredData)
    }

  }

  convertUTCtoLocal(utcDate: string) {
    const localDate = this.datePipe.transform(utcDate, 'medium', '+0530');
    return localDate;
  }

  EditPage() {
    const filteredData = this.websiteData.filter(
      (d: any) =>
        d.customer._id === this.selectedCustomerId &&
        d.mother_panel._id === this.selectedPanelId &&
        d.platform === this.selectedPlatform &&
        d.website_name === this.selectedWebsite
    );

    if (filteredData.length > 0) {
      const websiteId = filteredData[0]._id;
      this.router.navigate(['/website/edit', websiteId]);
    }
  }

}
