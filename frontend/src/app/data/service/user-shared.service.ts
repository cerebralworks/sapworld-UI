import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSharedService {

  private userProfileDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }
  /**
   * To set the user profile details
   */
  saveUserProfileDetails(details) {
    this.userProfileDetails.next(details);
  }
  /**
   * To get the user profile details
   */
  getUserProfileDetails() {
    return this.userProfileDetails.asObservable();
  }
  /**
   * To clear the user profile details
   */
  clearUserProfileDetails() {
    this.userProfileDetails.next({});
  }

}
