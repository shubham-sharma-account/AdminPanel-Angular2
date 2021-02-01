import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setToken(token: string){
    localStorage.setItem('token', token);
  }

  setTokenSession(token: string){
    sessionStorage.setItem('token', token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getTokenSession(){
    return sessionStorage.getItem('token');
  }

  getFbData(){
    return sessionStorage.getItem('FbDetails');
  }

  clearStorage(){
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('FbDetails');
  }
}