import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilsHelperService } from './utils-helper.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private skillTags = new BehaviorSubject<any>({});
  private countryLists = new BehaviorSubject<any>({});
  private programLists = new BehaviorSubject<any>({});
  private languageLists = new BehaviorSubject<any>({});
  private industries = new BehaviorSubject<any>({});
  private userPhoto = new BehaviorSubject<any>({});
  private tabInfo = new BehaviorSubject<any>({});
  private calendlyInfo = new BehaviorSubject<any>({});
  private notification = new BehaviorSubject<any>({});
  private profileCompletion: boolean = false;
  private matchesSuccessfull: boolean = false;

  setSkillDataSource(data: {}) {
    this.skillTags.next(data);
  }

  clearSkillDataSource(): any {
    this.skillTags.next({});
  }

  getSkillDataSource(): Observable<any> {
    return this.skillTags.asObservable();
  }
  setCalendlyDataSource(data: {}) {
    this.calendlyInfo.next(data);
  }

  clearCalendlyDataSource(): any {
    this.calendlyInfo.next({});
  }

  getCalendlyDataSource(): Observable<any> {
    return this.calendlyInfo.asObservable();
  }
  setNotificationDataSource(data: {}) {
    this.notification.next(data);
  }

  clearNotificationDataSource(): any {
    this.notification.next({});
  }

  getNotificationDataSource(): Observable<any> {
    return this.notification.asObservable();
  }
  
  setLanguageDataSource(data: {}) {
    this.languageLists.next(data);
  }

  clearLanguageDataSource(): any {
    this.languageLists.next({});
  }

  getLanguageDataSource(): Observable<any> {
    return this.languageLists.asObservable();
  }
  
  setCountryDataSource(data: {}) {
    this.countryLists.next(data);
  }

  clearCountryDataSource(): any {
    this.countryLists.next({});
  }
  
  getCountryDataSource(): Observable<any> {
    return this.countryLists.asObservable();
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

  setProgramDataSource(data: {}) {
    this.programLists.next(data);
  }

  clearProgramDataSource(): any {
    this.programLists.next({});
  }

  getProgramDataSource(): Observable<any> {
    return this.programLists.asObservable();
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
  
  setMatchesCompletion() {
    this.matchesSuccessfull = true;
  }

  clearMatchesCompletion(): any {
    this.matchesSuccessfull = false;
  }

  getMatchesCompletion(): any {
    return this.matchesSuccessfull;
  }

}
