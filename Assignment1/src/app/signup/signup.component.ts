import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { ConfirmedValidator } from '../confirm-password';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private formbuild: FormBuilder,
    private toastr: ToastrService,
    private myservice: MyserviceService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  //signup Form validations
  signupForm = this.formbuild.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    phone: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}")]],
    email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$")]],
    password: ['', [Validators.required, Validators.pattern("([a-zA-Z]([a-zA-Z0-9-\W]{4,8})([0-9]))")]],/* (?=.*[@#$%^&-+=()]) */
    confirmPassword: ['', [Validators.required/* , Validators.minLength(4), Validators.maxLength(20) */]],
    date: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    address1: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
    address2: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
    city: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    state: ['', [Validators.required]],
    zip: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]]
  },
  {
    validator: ConfirmedValidator('password', 'confirmPassword')  
  });

  /**
   * description: check validity of form and call then call service
   */
  submit() {
    this.signupForm.markAllAsTouched();
    if (!this.signupForm.valid) {
      return false;
    }

    //add a new user
    this.myservice.registerUser(this.signupForm.value)
      .subscribe(
        res => {
          this.toastr.success(JSON.stringify(res), 'Success!');
          this.router.navigate(['/login']);
        },
        err => {
          console.log(err);          
          this.toastr.error(err.error.msg, 'Failure!');
        }
      )
  }
}