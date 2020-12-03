import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {


  constructor(
    public router: Router
  ) { }

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

}
