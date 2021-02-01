import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../local-storage.service';
import { MyserviceService } from '../myservice.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  public totalUser;
  public activeUser;
  public deactiveUser;
  constructor(
    private storageService: LocalStorageService,
    private router: Router,
    private myservice: MyserviceService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.countAllUsers();
    this.activeUsers();
    this.deactiveUsers();
    this.spinnerOnPageLoad();
  }

  ngOnDestroy(){
    this.spinnerOnPageLoad()
  }

  //spinner function
  spinnerOnPageLoad() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  //logout from admin-dashboard
  logout() {
    this.storageService.clearStorage();
    this.router.navigate(['/login']);
  }

  //count all Users
  countAllUsers(){
    this.myservice.countTotalUsers()
    .subscribe(
      data =>{
        this.totalUser = data
        
      }
    )
  }

  //count all Users
  activeUsers(){
    this.myservice.activeUsers()
    .subscribe(
      data =>{
        this.activeUser = data
        
      }
    )
  }

  //count all Users
  deactiveUsers(){
    this.myservice.deactiveUsers()
    .subscribe(
      data =>{
        this.deactiveUser = data
        
      }
    )
  }
}
