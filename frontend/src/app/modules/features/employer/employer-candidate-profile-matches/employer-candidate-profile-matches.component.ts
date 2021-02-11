import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedService } from '@shared/service/shared.service';

import * as lodash from 'lodash';
import { CandidateProfile } from '@data/schema/create-candidate';

@Component({
  selector: 'app-employer-candidate-profile-matches',
  templateUrl: './employer-candidate-profile-matches.component.html',
  styleUrls: ['./employer-candidate-profile-matches.component.css']
})
export class EmployerCandidateProfileMatchesComponent implements OnInit {

  public isOpenedJDModal: boolean = false;
  public isOpenedResumeModal: boolean = false;
  public isOpenedOtherPostModal: boolean = false;
  public jobId: string;
  public postedJobsDetails: any;
  public page: number = 0;
  public userId: string;
  public matchingUsers: any = {};
  public cusLoadsh: any = lodash;
  public isOpenedSendMailModal: boolean;
  public currentUserInfo: CandidateProfile;
  public matchedElement: boolean = true;
  public missingElement: boolean = true;
  public moreElement: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService,
    private location: Location,
    public utilsHelperService: UtilsHelperService,
    public sharedService: SharedService
  ) {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  onChange(array: any[] = [], item, field) {
    if (!this.utilsHelperService.isEmptyObj(item) && array && array.length) {
      return array.find((val) => {
        return val[field] == item[field];
      });
    }
  }

  ngOnInit(): void {
    if (this.jobId && this.userId) {
      this.onGetPostedJob();
      this.onGetJobScoringById();
    }
  }

  onGetPostedJob() {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = this.jobId;
    this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
        if (response && response.details) {
          this.postedJobsDetails = response.details;
        }
      }, error => {
      }
    )
  }

  onGetJobScoringById = (isMultipleMatch: boolean = false) => {
    let requestParams: any = {};
    if (!isMultipleMatch) {
      requestParams.user_id = this.userId;
    }
    requestParams.id = this.jobId;
    requestParams.page = this.page;

    this.employerService.getJobScoring(requestParams).subscribe(
      response => {
        if (response && !this.utilsHelperService.isEmptyObj(response.profile)) {
          this.matchingUsers = { ...response }
        }

      }, error => {
      }
    )
  }

  onViewOtherMatches = () => {
    this.onGetJobScoringById(true);
  }

  onChangeUser = (type) => {
    if (type == 'next') {
      const count = this.matchingUsers && this.matchingUsers.meta && this.matchingUsers.meta.count ? this.matchingUsers.meta.count : 0;
      console.log('count', count);

      if(this.page > count) {
        this.page++;
        this.onGetJobScoringById(true);
      }

    } else if (type == 'prev' && this.page > 0) {
      this.page--;
      if (this.page <= 0) {
        this.onGetJobScoringById(true);
      }

    }
  }

  onRedirectBack = () => {
    this.location.back();
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleOtherPostModal = (status) => {
    this.isOpenedOtherPostModal = status;
  }

  inArray(needle, haystack, matchAll = false) {
    if ((Array.isArray(needle) && Array.isArray(haystack)) && needle.length && haystack.length) {
      if (matchAll) {
        return needle.every(i => haystack.includes(i));
      } else {
        return needle.some(i => haystack.includes(i));
      }
    }
    return false;
  }

  onChangeValue(array1: any[] = [], array2: any[] = [], type = 'array', field: string = 'id', filterArray: string = '') {
    if (array1 && array1.length && array2 && array2.length) {
      let result;
      if (type == 'array') {
        result = lodash.uniq([...array1, ...array2])
      }
      if (type == 'arrayObj') {
        result = lodash.uniqBy([...array1, ...array2], field)
      }
      if (result && result.length) {
        return result;
      }
    }
    return [];
  }

  onLoweCase(array: any[] = []) {
    if (array && array.length) {
      return array.map(v => v.toLowerCase());
    }
  }

  onDiff = (arr1: any[] = [], arr2: any[] = []) => {
    console.log(arr1, arr2);

    if (arr1 && arr1.length && arr2 && arr2.length) {
      let difference = arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
      console.log('difference', difference);
      return difference;
    }
    return [];
  }

  onChangeStringNumber(field1, field2, item, type, isString: boolean = false) {
    let lowerCaseJob = [];
    if (this.postedJobsDetails && this.postedJobsDetails[field1]) {
      lowerCaseJob = isString ? this.onLoweCase(this.postedJobsDetails[field1]) : this.postedJobsDetails[field1];
    }
    let lowerCaseUser = [];
    if (this.matchingUsers && this.matchingUsers.profile && this.matchingUsers.profile[field2]) {
      lowerCaseUser = isString ? this.onLoweCase(this.matchingUsers.profile[field2]) : this.matchingUsers.profile[field2];
    }

    console.log('lowerCaseJob', lowerCaseJob);
    console.log('lowerCaseUser', lowerCaseUser);
console.log(item);
const itemMod = isString ? item.toLowerCase() : item;
    if (lowerCaseJob.includes(itemMod) && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (!lowerCaseUser.includes(itemMod) && type == 'info') {
      return { type: 'info', class: 'text-blue' }
    } else if (!lowerCaseJob.includes(itemMod) && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }

  onChangeObj(field1, field2, item, type, filterField) {
    let lowerCaseJob = [];
    if (this.postedJobsDetails && this.postedJobsDetails[field1]) {
      lowerCaseJob = this.postedJobsDetails[field1]
    }
    let lowerCaseUser = [];
    if (this.matchingUsers && this.matchingUsers.profile && this.matchingUsers.profile[field2]) {
      lowerCaseUser = this.matchingUsers.profile[field2]
    }
    let jobIndex = lowerCaseJob.findIndex(val => val[filterField] == item[filterField]);

    let userIndex = lowerCaseUser.findIndex(val => val[filterField] == item[filterField]);
    if (jobIndex > -1 && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (userIndex == -1 && type == 'info') {
      return { type: 'info', class: 'text-blue' }
    } else if (jobIndex == -1 && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }

  onToggleSendMail = (status,item?) => {
    if(item && !this.utilsHelperService.isEmptyObj(item)) {
      this.currentUserInfo = item;
    }
    this.isOpenedSendMailModal = status;
  }

  onShowMatches = () => {
    this.matchedElement = true;
    this.missingElement = false;
    this.moreElement = false;
  }

  onShowMissing = () => {
    this.missingElement = true;
    this.matchedElement = false;
    this.moreElement = false;
  }

  onShowMore = () => {
    this.moreElement = true;
    this.matchedElement = false;
    this.missingElement = false;
  }

  onReset = () => {
    this.moreElement = true;
    this.matchedElement = true;
    this.missingElement = true;
  }

}
