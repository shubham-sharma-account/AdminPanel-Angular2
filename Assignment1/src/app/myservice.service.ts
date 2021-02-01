import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) { }

  url = "http://localhost:5000";

  //post data
  registerUser(customer: Object) {
    return this.http.post(this.url, customer);
  }

  //get all users data
  getAllUsers() {
    return this.http.get(this.url);
  }

  //count Users
  countTotalUsers() {
    return this.http.get(this.url+'/countTotal');
  }

  //count active Users
  activeUsers() {
    return this.http.get(this.url+'/activeTotal');
  }

  //count deactive Users
  deactiveUsers() {
    return this.http.get(this.url+'/deactiveTotal');
  }

  //delete User
  deleteUser(id){
    console.log(id);
    return this.http.delete(this.url+'/?id='+id);
  }

  //deactivate User
  deactivateuser(id){
    console.log(id);
    return this.http.put(this.url+'/?id='+id,null)
  }

  //login service 
  loginUser(customer: Object) {
    return this.http.post(this.url+'/login', customer);
  }

  getUserRole(customer: Object) {
    return this.http.post(this.url+'/getUserRole', customer);
  }

  userDashboard(token: Object){
    return this.http.post(this.url+'/dashboard', token);
  }

  /**
   * desciption : check token, return false if not present
   */
  loggedIn(){
    return (this.storageService.getToken() || this.storageService.getTokenSession() || this.storageService.getFbData());
  }

  //get User details to edit his/her data
  getUserDetails(id){
    console.log(id);
    return this.http.get(this.url+'/edit/?id='+id);
  }

  //Save edited details
  saveEditDetails(customer: Object){
    return this.http.put(this.url+'/editData',customer);
  }

  //check admin is valid or not by his/her password
  validAdmin(email){
    console.log(email);
    return this.http.get(this.url+'/validAdmin/?email='+email);
  }

  //Save user details edited by admin
  saveDetails(user: Object){
    return this.http.put(this.url+'/editDetails',user);
  }
}