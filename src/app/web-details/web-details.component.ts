import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-web-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web-details.component.html',
  styleUrl: './web-details.component.css'
})
export class WebDetailsComponent implements OnInit {

  type: any;
  detail_id: any;
  innerTitle: string = '';
  serverDetail: any = [];
  sslDetail: any = [];
  DbDetail: boolean = false;
  WebDetail: boolean = false;
  databaseDetail: any = [];
  websiteData: any;

  constructor(private mainservice: MainService, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type');
    this.detail_id = this.route.snapshot.paramMap.get('id');

    this.GetTypeDetail(this.type, this.detail_id);
  }


  GetTypeDetail(type: any, id: any) {

    const payload = { type: type, data: id }

    this.mainservice.getTypeDetail({ payload }).subscribe({
      next: (res: any) => {
        console.log(res)
        this.websiteData = res;

       if (this.type === 'other') {
  this.type = this.websiteData?.platform === 'database' ? 'data' : '';
}

        function booleanToYesNo(value: boolean) {
          return value ? "yes" : "no";
        }

        if (this.type === "data") {
          this.DbDetail = true;
          this.WebDetail = false;
          this.innerTitle = 'Database Detail';
          this.databaseDetail = [
            ["Website Name", this.websiteData.website_name],
            ["Region", this.websiteData.region == 'ind' ? 'India' : this.websiteData.region === 'bd' ? 'Bangladesh' : this.websiteData.region === 'nu' ? 'Neutral' : ' '],
            ["Customer", this.websiteData?.customer?.name],
            ["website Status", this.websiteData.website_status == 'lable' ? 'WhiteLable' : 'MotherPanel'],
            ["motherpanel Name", this.websiteData?.mother_panel?.name],
            ["Platform", this.websiteData.platform],
            ["Website Type", this.websiteData.website_type],
            ["ip Address", this.websiteData.db_ip],
            ["ubuntu Version", this.websiteData.db_ubutnu],
            ["timezone", this.websiteData.db_time_zone],
            ["mongo Version", this.websiteData.db_version],
            ["indexing Queries", booleanToYesNo(this.websiteData.db_index)],
            ["promithious Grefana", booleanToYesNo(this.websiteData.db_grafana)],
            ["db Authentication", booleanToYesNo(this.websiteData.db_auth)],
            ["db Firewall", booleanToYesNo(this.websiteData.db_firewall)],
            ["mongo Log Clear Date", this.convertUTCtoLocal(this.websiteData.db_log)],
            ["last Hard Reset", this.convertUTCtoLocal(this.websiteData.db_reset)]
          ].filter((item:any) => item[1] !== null && item[1] !== undefined && item[1] !== '');
        }
        else {
          this.WebDetail = true;
          this.DbDetail = false;
          this.innerTitle = 'Website Details'
          this.databaseDetail = [
            ["Website Name", this.websiteData.website_name],
            ["Region", this.websiteData.region == 'ind' ? 'India' : this.websiteData.region === 'bd' ? 'Bangladesh' : this.websiteData.region === 'nu' ? 'Neutral' : ' '],
            ["Customer", this.websiteData?.customer?.name],
            ["website Status", this.websiteData?.website_status == 'label' ? 'WhiteLable' : 'MotherPanel'],
            ["motherpanel Name", this.websiteData?.mother_panel?.name],
            ["Platform", this.websiteData.platform],
            ["Website Type", this.websiteData.website_type],
            ["Technologies", this.websiteData.web_technology],
            ["Cloudflare", booleanToYesNo(this.websiteData.web_cloud_s)],
            ["Data Source", this.websiteData.web_data_source],
            ["BetMatch Source", this.websiteData.web_bet_match],
            ["DomainManager Account", this.websiteData.web_domain.account_name],
            ["AWC Status", booleanToYesNo(this.websiteData.web_awc_s)],
            ["SABA Status", booleanToYesNo(this.websiteData.web_saba_s)],
            ["International Status", booleanToYesNo(this.websiteData.web_inter_s)],
            ["Domain WhiteList", booleanToYesNo(this.websiteData.web_domain_whitelist)],
            ["Redis WhiteList", booleanToYesNo(this.websiteData.web_redis_allow)],
            ["User Link", this.websiteData.web_main_link],
            ["MGT Link", this.websiteData.web_mgt_link],
            ["Different Server", booleanToYesNo(this.websiteData.web_diff_server)]
          ].filter((item:any) => item[1] !== null && item[1] !== undefined && item[1] !== '');

          if (booleanToYesNo(this.websiteData.web_cloud_s) == 'yes') {
            const cloudflareIndex = this.databaseDetail.findIndex((item: any) => item[0] === "Cloudflare");
            if (cloudflareIndex !== -1) {
              // Insert "Cloudflare Account" right after "Cloudflare"
              this.databaseDetail.splice(cloudflareIndex + 1, 0, ["Cloudflare Account", this.websiteData?.web_cloud_ac?.account_name]);
            }
          }

          if (booleanToYesNo(this.websiteData.web_awc_s) == 'yes') {
            const awcindex = this.databaseDetail.findIndex((item: any) => item[0] === "AWC Status");
            if (awcindex !== -1) {
              this.databaseDetail.splice(awcindex + 1, 0, ["AWC Account", this.websiteData?.web_awc?.master_account_name]);
              this.databaseDetail.splice(awcindex + 2, 0, ["AWC CallBack", this.websiteData?.awc_call_back]);
            }
          }
          if (booleanToYesNo(this.websiteData.web_saba_s) == 'yes') {
            const sabaindex = this.databaseDetail.findIndex((item: any) => item[0] === "SABA Status");
            if (sabaindex !== -1) {
              this.databaseDetail.splice(sabaindex + 1, 0, ["SABA Account", this.websiteData?.web_saba?.master_account_name]);
              this.databaseDetail.splice(sabaindex + 2, 0, ["SABA Callback", this.websiteData?.saba_call_back]);
            }
          }
          if (booleanToYesNo(this.websiteData.web_inter_s) == 'yes') {
            const interindex = this.databaseDetail.findIndex((item: any) => item[0] === "International Status");
            if (interindex !== -1) {
              this.databaseDetail.splice(interindex + 1, 0, ["International Account", this.websiteData?.web_inter?.master_account_name]);
              this.databaseDetail.splice(interindex + 2, 0, ["International CallBack", this.websiteData?.inter_call_back]);
            }
          }

          this.serverDetail = [
            ["Project Name", this.websiteData.web_project_name],
            ["Server Name", this.websiteData.web_server_name],
            ["Server Company", this.websiteData.web_server_comp.company_name],
            ["Server Account", this.websiteData.web_server_comp.account_name],
            ["Server Password", this.websiteData.web_server_password],
            ["IP Address", this.websiteData.web_server_ip],
            ["Ubuntu Version", this.websiteData.web_ubuntu],
            ["TimeZone", this.websiteData.web_time_zone],
            ["Cache Clear Date", this.convertUTCtoLocal(this.websiteData.web_cache)],
            ["Hard Reset Date", this.convertUTCtoLocal(this.websiteData.web_reset)],
            ["New Config", booleanToYesNo(this.websiteData.web_config)],
            ["Nagios", booleanToYesNo(this.websiteData.web_nagios)],
            ["Java Version", this.websiteData.web_java_ver],
            ["Tomcat Version", this.websiteData.web_tom_ver],
            ["Tomcat Cache Size", this.websiteData.web_tom_cache],
            ["Tomcat Log Date", this.convertUTCtoLocal(this.websiteData.web_tom_log)],
             ["Node Version", this.websiteData?.web_node_ver],
              ["Angular Version", this.websiteData?.web_angular_ver],
            ["Nginx Version", this.websiteData.web_nginx_ver],
            ["Nginx Cache Size", this.websiteData.web_nginx_cache],
            ["Nginx Worker Conn", this.websiteData.web_nginx_conn],
            ["Nginx Open File", this.websiteData.web_nginx_file],
            ["Nginx Log Date", this.convertUTCtoLocal(this.websiteData.web_nginx_log)],
            ["PM2 Log Date", this.convertUTCtoLocal(this.websiteData.web_pm_log)],
            ["Max Body", this.websiteData.web_max_body]
          ].filter((item:any) => item[1] !== null && item[1] !== undefined && item[1] !== '');

          this.sslDetail = [
            ["Socket Version", this.websiteData.web_socket_ver],
            ["SSL", booleanToYesNo(this.websiteData.web_ssl)],
            ["SSL Name", this.websiteData.web_ssl_name],
            ["SSL Expiry", this.convertUTCtoLocal(this.websiteData.web_ssl_ex)],
            ["SSL Updated", booleanToYesNo(this.websiteData.web_ssl_up)],
            ["SSL Update Date", this.convertUTCtoLocal(this.websiteData.web_ssl_date)],
            ["SSL Cache Size", this.websiteData.web_ssl_cache],
            ["HTTP/2", booleanToYesNo(this.websiteData.web_http2)],
            ["Gzip", booleanToYesNo(this.websiteData.web_gzip)]
          ].filter((item:any) => item[1] !== null && item[1] !== undefined && item[1] !== '');


          console.log(this.websiteData)
        }

      }
    })
  }

  convertUTCtoLocal(utcDate: string) {
    const localDate = this.datePipe.transform(utcDate, 'medium', '+0530');
    return localDate;
  }


}
