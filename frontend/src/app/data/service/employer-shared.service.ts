import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployerSharedService {

  private employerProfileDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private employerCompanyDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  saveEmployerProfileDetails(details) {
    this.employerProfileDetails.next(details);
  }

  getEmployerProfileDetails() {
    return this.employerProfileDetails.asObservable();
  }

  clearEmployerProfileDetails() {
    this.employerProfileDetails.next({});
  }
  
  saveEmployerCompanyDetails(details) {
    this.employerCompanyDetails.next(details);
  }

  getEmployerCompanyDetails() {
    return this.employerCompanyDetails.asObservable();
  }

  clearEmployerCompanyDetails() {
    this.employerCompanyDetails.next({});
  }

}
