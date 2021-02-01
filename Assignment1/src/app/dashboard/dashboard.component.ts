import { Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private myservice: MyserviceService,
    private spinner: NgxSpinnerService,
    private tostr: ToastrService,
    private storageService: LocalStorageService
  ) { }

  public details;
  public fbData;
  public userDetails: Object;
  public token;

  ngOnInit(): void {
    this.getFbData()
    this.getUserData();
    this.spinnerOnPageLoad();
  }

  ngOnDestroy(): void {
    this.spinnerOnPageLoad();
  }

  //logout from dashboard
  logout() {
    this.storageService.clearStorage();
    this.router.navigate(['/login']);
  }

  //get data by after verification of token
  getUserData() {
    if (this.storageService.getToken()) {                               //check token in localStorage
      this.token = JSON.parse(this.storageService.getToken());          //get token from localStorage
    } else if (this.storageService.getTokenSession()) {                 //check token in sessionStorage
      this.token = JSON.parse(this.storageService.getTokenSession());   //get token from sessionStorage
    }
    //send token to userDashboard service to get his/her data
    let tokenObj = { 'token': this.token }
    this.myservice.userDashboard(tokenObj)
      .subscribe(
        result => {
          this.details = result;
        }
      )
  }

  //spinner function
  spinnerOnPageLoad() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  getFbData() {
    let data = this.storageService.getFbData();       //get FbData from sessionStorage
    this.fbData = JSON.parse(data);
  }
}
