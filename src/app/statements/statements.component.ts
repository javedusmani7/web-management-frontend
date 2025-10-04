import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { MainService } from '../services/main.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.css'
})
export class StatementsComponent implements OnInit {
  isLoading = false; logs: any = []; p: number = 1;user:any = [];
  userfilter:boolean = false;


constructor(private mainservice: MainService,private userservice: UserService){}

ngOnInit(): void {
  const user_level = this.userservice.getUserlevel();
  if(user_level === '1')
  {
    this.userfilter = true;
    this.getLogs();
    this.UserList();
  }
  else
  {
    const user_name = this.userservice.getUserName();
    this.LogByUser(user_name);
  }
 
}


  getLogs(){
    this.isLoading = true;
    this.mainservice.getLogs().subscribe({
      next:(res)=>{
        this.logs = res;
        this.isLoading = false;
      },error:(e)=>{
        console.log(e);
        this.isLoading = false;
      }
    })
  }


  UserList()
  {
    this.isLoading = true;
    this.userservice.getUsers().subscribe({
      next:(res:any)=>{
        this.user = res;
        this.isLoading = false;
      }, error:(e) => {
        console.log(e);
        this.isLoading = false;
      }
    });
  }

  LogByUser(string:any)
  {
    this.mainservice.getUserLog(string).subscribe({
      next:(res:any)=>{
        this.logs = res;
          this.isLoading = false;
      }, error:(e)=>{
        console.log(e);
        this.isLoading = false;
      }
    })
  }

  LogUser(event:any)
  {
    const user_id = event.target.value;

    if(user_id != '')
    {
      this.logs = [];
      this.mainservice.getUserLog(user_id).subscribe({
        next:(res:any)=>{
          this.logs = res;
            this.isLoading = false;
        }, error:(e)=>{
          console.log(e);
          this.isLoading = false;
        }
      })
    }
    else
    {
      this.logs = [];
      this.getLogs();
    }
    
  }
}
