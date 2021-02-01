import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './local-storage.service';
import { MyserviceService } from './myservice.service';

@Injectable({
  providedIn: 'root'
})
export class Auth2Guard implements CanActivate {
  public token;
  constructor(
    private myservice: MyserviceService, 
    private router: Router,
    private storageService: LocalStorageService,
    private tostr: ToastrService) {}
  
  canActivate(): boolean {
    if(!this.myservice.loggedIn()){
      return true
    }else{
      if (this.storageService.getToken()) {                               //check token in localStorage
        this.token = JSON.parse(this.storageService.getToken());          //get token from localStorage
      } else if (this.storageService.getTokenSession()) {                 //check token in sessionStorage
        this.token = JSON.parse(this.storageService.getTokenSession());   //get token from sessionStorage
      }
      let tokenObj = { 'token': this.token }
      //send token to userDashboard service to get his/her data
      this.myservice.userDashboard(tokenObj)                //check role of user by his token
      .subscribe(data=>{
        if(data['role'] == 'admin'){
          this.tostr.warning('Please logout first to login again','Warning')
          this.router.navigate(['/admin-dashboard'])       //navigate admin-dashboard if role is admin
        }else{
          this.tostr.warning('Please logout first to login again','Warning')
          this.router.navigate(['/dashboard']);            //navigate UserDashboard if role is admin
        }        
      },
      err=>{
        console.log(err);
      })
    }
  }
}
