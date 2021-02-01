import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MyserviceService } from './myservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private myservice: MyserviceService, 
    private router: Router) {}
  
  canActivate(): boolean {
    if(this.myservice.loggedIn()){
      return true
    }else{
      this.router.navigate(['/login']);
      return false
    }
  }
}