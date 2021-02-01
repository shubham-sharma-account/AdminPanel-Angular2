import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/myservice.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedValidator } from '../../confirm-password';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public hideFeilds;
  public routerlink;
  constructor(
    private myservice: MyserviceService,
    private formbuild: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.userDetails();
  }

  //fetching user details
  userDetails() {
      let userId = this.route.snapshot.paramMap.get('id');
      this.hideFeilds = this.route.snapshot.paramMap.get('feilds');
      if(this.hideFeilds == 'hide'){
        this.routerlink = '/admin-dashboard/user-list';
      }else{
        this.routerlink = '/dashboard';
      }
      this.myservice.getUserDetails(userId)
      .subscribe(
        res=>{
          let feilds = this.route.snapshot.paramMap.get('feilds');
          if(feilds == 'hide'){
            this.loadUserData(res);
          }else{
            this.loadData(res);
          }
        },
        err=>{
          console.log(err);
          
        }
      )
  }

  editForm: FormGroup;
  //load data into editUser from when user upadte his details
  loadData(result) {
    this.editForm = this.formbuild.group({
      date: [result.date, [Validators.required]],
      gender: [result.gender, [Validators.required]],
      oldPassword: ['', [Validators.required, Validators.pattern("([a-zA-Z]([a-zA-Z0-9-\W]{4,8})([0-9]))")]],
      password: ['', [Validators.required, Validators.pattern("([a-zA-Z]([a-zA-Z0-9-\W]{4,8})([0-9]))")]],
      confirmPassword: ['', [Validators.required]],
      address1: [result.address1, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      address2: [result.address2, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      city: [result.city, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      state: [result.state, [Validators.required]],
      zip: [result.zip, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      name: [result.name, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      phone: [result.phone, [Validators.required, Validators.pattern("^[6-9][0-9]{9}")]],
      email: [result.email, [Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$")]],
    },
    {
      validator: ConfirmedValidator('password','confirmPassword')
    });
  }

  //load data when admin update user
  loadUserData(result) {
    this.editForm = this.formbuild.group({
      date: [result.date, [Validators.required]],
      gender: [result.gender, [Validators.required]],
      oldPassword: [''],
      password: [''],
      confirmPassword: [''],
      address1: [result.address1, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      address2: [result.address2, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      city: [result.city, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      state: [result.state, [Validators.required]],
      zip: [result.zip, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      name: [result.name, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      phone: [result.phone, [Validators.required, Validators.pattern("^[6-9][0-9]{9}")]],
      email: [result.email, [Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$")]],
    });
  }

  saveDetails() {
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return false;
    }

    this.myservice.saveEditDetails(this.editForm.value)
      .subscribe(
        res => {
          this.toastr.success(JSON.stringify(res), 'Success!');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        },
        err => {
         
          this.toastr.error(JSON.stringify(err.error.msg), 'Failure!');
        })
  }

  updateDetails(){
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return false;
    }
    let val = prompt('Enter your email address');
    this.myservice.validAdmin(val)
    .subscribe(
      res=>{
        this.myservice.saveDetails(this.editForm.value)
    .subscribe(
      res => {
        this.toastr.success(JSON.stringify(res), 'Success!');
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard/user-list']);
        }, 500);
      },
      err => {
        this.toastr.error(JSON.stringify(err.error.msg), 'Failure!');
      }
    )
      },
      err=>{
        this.toastr.error(JSON.stringify(err.error.msg), 'Failure!');
      }
    )
  }
}