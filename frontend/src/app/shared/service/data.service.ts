import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilsHelperService } from './utils-helper.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private skillTags = new BehaviorSubject<any>({});
  private industries = new BehaviorSubject<any>({});
  private userPhoto = new BehaviorSubject<any>({});
  private tabInfo = new BehaviorSubject<any>({});
  private profileCompletion: boolean = false;

  setSkillDataSource(data: {}) {
    this.skillTags.next(data);
  }

  clearSkillDataSource(): any {
    this.skillTags.next({});
  }

  getSkillDataSource(): Observable<any> {
    return this.skillTags.asObservable();
  }

  setIndustriesDataSource(data: {}) {
    this.industries.next(data);
  }

  clearIndustriesDataSource(): any {
    this.industries.next({});
  }

  getIndustriesDataSource(): Observable<any> {
    return this.industries.asObservable();
  }

  setUserPhoto(data: {}) {
    this.userPhoto.next(data);
  }

  clearUserPhoto(): any {
    this.userPhoto.next({});
  }

  getUserPhoto(): Observable<any> {
    return this.userPhoto.asObservable();
  }

  setTabInfo(data: any[]) {
    this.tabInfo.next(data);
  }

  clearTabInfo(): any {
    this.tabInfo.next([]);
  }

  getTabInfo(): Observable<any> {
    return this.tabInfo.asObservable();
  }

  setProfileCompletion() {
    this.profileCompletion = true;
  }

  clearProfileCompletion(): any {
    this.profileCompletion = false;
  }

  getProfileCompletion(): any {
    return this.profileCompletion;
  }

}
