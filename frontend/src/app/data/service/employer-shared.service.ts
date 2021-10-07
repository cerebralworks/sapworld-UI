import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployerSharedService {

  private employerProfileDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private employerCompanyDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }
  
  /**
   * To Save the user profile details
   */
  saveEmployerProfileDetails(details) {
    this.employerProfileDetails.next(details);
  }

   /**
   * To Get the user profile details
   */
  getEmployerProfileDetails() {
    return this.employerProfileDetails.asObservable();
  }

   /**
   * To Clear the user profile details
   */
  clearEmployerProfileDetails() {
    this.employerProfileDetails.next({});
  }
  
  /**
   * To Save the user Company details
   */
  saveEmployerCompanyDetails(details) {
    this.employerCompanyDetails.next(details);
  }

   /**
   * To get the user Company details
   */
  getEmployerCompanyDetails() {
    return this.employerCompanyDetails.asObservable();
  }

	/**
   * To claer the user comapny details
   */
  clearEmployerCompanyDetails() {
    this.employerCompanyDetails.next({});
  }

}
