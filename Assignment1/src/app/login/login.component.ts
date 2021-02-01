import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../local-storage.service';

declare var FB: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private formbuild: FormBuilder,
    private myservice: MyserviceService,
    private router: Router,
    private toastr: ToastrService,
    private zone: NgZone,
    private storageService: LocalStorageService) { }

  ngOnInit(): void {
    this.loginWithFb();
  }

  loginForm = this.formbuild.group({
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$")]],
    password: ['', [Validators.required, Validators.pattern("([a-zA-Z]([a-zA-Z0-9-\W]{4,8})([0-9]))")]],
    acceptTerms: [false]
  });

  /**
   * description: Call when user click on Login button, to
   * check from valid or not and calling service
   */
  login() {
    this.loginForm.markAllAsTouched();          //touch every feild if empty
    if (!this.loginForm.valid) {
      return false;                             //return false if form not valid
    }

    //check user role
    this.myservice.getUserRole(this.loginForm.value)
      .subscribe(
        data => {
          if (data['role'] == 'admin') {
            this.myservice.loginUser(this.loginForm.value)
              .subscribe(
                data => {
                  if (!this.loginForm.value.acceptTerms) {                        //if user doesn't select keep me sign in 
                    this.storageService.setTokenSession(JSON.stringify(data));    //set Token in sessionStorage
                  }
                  else {
                    this.storageService.setToken(JSON.stringify(data));         //set Token in localStorage
                  }
                  this.toastr.success('Login Successfull', 'Success!', { positionClass: 'toast-bottom-right' });
                  this.router.navigate(['/admin-dashboard']);
                },
                err => {
                  this.toastr.error(err.error.msg,'Failure');
                }
              );
          }else if(data['role']=='user' && data['status']=='Active'){
            this.myservice.loginUser(this.loginForm.value)
              .subscribe(
                data => {
                  if (!this.loginForm.value.acceptTerms) {
                    this.storageService.setTokenSession(JSON.stringify(data));    //set Token in sessionStorage
                  }
                  else {
                    this.storageService.setToken(JSON.stringify(data));         //set Token in localStorage
                  }
                  this.toastr.success('Login Successfull', 'Success!', { positionClass: 'toast-bottom-right' });
                  this.router.navigate(['/dashboard']);
                },
                err => {
                  this.toastr.error(err.error.msg,'Failure');
                }
              );
          }else{
            this.toastr.error('Your account have been deactivated','Failure');
          }
        },
        err =>{
          this.toastr.error(err.error.msg,'Failure');          
        }
      )
  }


  loginWithFb() {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '834067537434246',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  /**
   * description: Call when click on 'Login with facebook' button
   */
  submitLogin() {
    console.log("submit login to facebook");
    // FB.login();
    FB.login((response) => {
      console.log('submitLogin', response);
      if (response.authResponse) {
        this.me();
        setTimeout(() => {
          this.zone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        }, 1000);
      }
      else {
        this.toastr.success('login failed', 'Failed!');
      }
    });
  }

  /**
   * description: Call to get details from facebook and store in localstorage
   */
  me() {
    FB.api('/me?fields=id,name,first_name,last_name,picture.width(150).height(150)',
      function (result) {
        if (result && !result.error) {
          sessionStorage.setItem('FbDetails', JSON.stringify(result))
        } else {
          console.log(result.error);
        }
      });
  }
}