import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import * as counry from "@shared/json/currency.json";
import  *  as  currencies  from  '@shared/json/currency.json';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public currencyArray: any;

  constructor(
    public router: Router
  ) {
    this.currencyArray = currencies;
   }

  getCurrentRoleFromUrl = () => {
    if(this.router.url.includes('employer')) {
      return { roleName: 'employer', roleId: 1}
    }else if(this.router.url.includes('user')) {
      return { roleName: 'user', roleId: 0}
    }else if(this.router.url.includes('admin')) {
      return { roleName: 'admin', roleId: 2}
    }
  }

  onGetJobType = (index?) => {
     let jobTypeArray = ['Full Time', 'Part Time', 'Freelance', 'Internship', 'Temporary', 'Remote', 'Contract', 'Day Job'];
     if(index > -1) { return jobTypeArray[index] }
     return jobTypeArray;
  }

  onGetCurrency = (index?) => {
    if(index > -1) { return this.currencyArray.default[index] }
    return this.currencyArray.default;
 }

}
