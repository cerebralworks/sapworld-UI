import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSharedService {

  private userProfileDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  saveUserProfileDetails(details) {
    this.userProfileDetails.next(details);
  }

  getUserProfileDetails() {
    return this.userProfileDetails.asObservable();
  }

  clearUserProfileDetails() {
    this.userProfileDetails.next({});
  }

}
