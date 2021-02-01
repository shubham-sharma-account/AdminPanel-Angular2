import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/local-storage.service';
import { MyserviceService } from 'src/app/myservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  name: string;
  email: string;
  phone: string;
  date: string;
  gender: string;
  address1: string;
}


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit/* , AfterViewInit */ {

  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'date', 'gender', 'address1', 'edit', 'delete', 'status'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private myservice: MyserviceService,
    private storageService: LocalStorageService,
    private router: Router,
    private tostr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getAllUser();
    this.spinnerOnPageLoad()
  }

  ngOnDestroy() {
    this.spinnerOnPageLoad()
  }

  //spinner function
  spinnerOnPageLoad() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllUser() {
    this.myservice.getAllUsers()
      .subscribe(
        res => {
          console.log(res);
          //this.usersDetails = res;
          this.dataSource = new MatTableDataSource(res['details']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      )
  }

  //logout from admin-dashboard
  logout() {
    this.storageService.clearStorage();
    this.router.navigate(['/login']);
  }

  //deactivate user
  deactivateUser(id, event) {
    let result = confirm('Do you want to Inactivate this user?')
    if (result) {
      this.myservice.deactivateuser(id)
        .subscribe(
          res => {
            this.tostr.success(JSON.stringify(res), 'Success')
            this.getAllUser();
          },
          err => {
            this.tostr.error(JSON.stringify(err), 'Failure')
          }
        )
    }
  }

  //delete user
  deleteuser(id) {
    let result = confirm('Do you want to delete this user?')
    if (result) {
      this.myservice.deleteUser(id)
        .subscribe(
          res => {
            this.tostr.success(JSON.stringify(res), 'Success')
            this.getAllUser();
          },
          err => {
            this.tostr.error(JSON.stringify(err), 'Failure')
          }
        )
    }
  }
}
  /* usersDetails: Object;
totalRecords;
page: Number = 1;
btnVal = 'Deactive';
constructor(
private storageService: LocalStorageService,
private router: Router,
private myservice: MyserviceService,
private tostr:ToastrService,
private spinner: NgxSpinnerService
) { }

ngOnInit(): void {
this.getAllUser();
this.spinnerOnPageLoad()
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

getAllUser(){
this.myservice.getAllUsers()
.subscribe(
  res => {
    this.usersDetails = res;
    this.totalRecords = Object.keys(res).length
  }
)
}

//edit user
editUser(id){
alert(id);
}

//delete user
deleteuser(id){
this.myservice.deleteUser(id)
.subscribe(
  res=>{
    this.tostr.success(JSON.stringify(res),'Success')
    this.getAllUser();
  },
  err =>{
    this.tostr.error(JSON.stringify(err),'Failure')
  }
)
}

//deactivate user
deactivateUser(id,event){
this.myservice.deactivateuser(id)
.subscribe(
  res=>{
    this.tostr.success(JSON.stringify(res),'Success')
    this.getAllUser();
  },
  err =>{
    this.tostr.error(JSON.stringify(err),'Failure')
  }
)
} */
