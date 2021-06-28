import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

import * as lodash from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate-job-matches',
  templateUrl: './candidate-job-matches.component.html',
  styleUrls: ['./candidate-job-matches.component.css']
})
export class CandidateJobMatchesComponent implements OnInit {

  public isOpenedJDModal: boolean = false;
  public userInfo: CandidateProfile;
  public jobId: string;
  public page: number = 1;
  public matchingJob: any = {};
  public cusLoadsh: any = lodash;
  public currentJobDetails: any;
  public description: any;
  public isOpenedResumeSelectModal: boolean;
  public matchedElement: boolean = true;
  public missingElement: boolean = true;
  public moreElement: boolean = true;
  public isMultipleMatches: boolean;
  // public matchingUsersMeta: any;
  public matchingJobNew: any;
  private subscriptions: Subscription[] = [];
  matchingJobMeta: any;

  constructor(
    private route: ActivatedRoute,
    private userSharedService: UserSharedService,
    private userService: UserService,
    private location: Location,
    public utilsHelperService: UtilsHelperService,
    public sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
      }
    )
    if (this.jobId) {
      this.onGetUserScoringById();
      this.onGetUserScoringById(true, true);
    }
  }

  onChange(array: any[] = [], item, field) {
    if (!this.utilsHelperService.isEmptyObj(item) && array && array.length) {
      return array.find((val) => {
        return val[field] == item[field];
      });
    }
  }

  onViewOtherMatches = () => {
    if (this.matchingJobMeta.count > 1 && this.matchingJobMeta.count !== this.page) {
      this.isMultipleMatches = true;
      this.onGetUserScoringById(true);
      this.page++;
      setTimeout(() => {
        this.onGetUserScoringByIdNew();
      }, 300);
    }
  }

  onGetUserScoringById = (isMultipleMatch: boolean = false, isCount: boolean = false) => {
    let requestParams: any = {};
    if (!isMultipleMatch) {
      requestParams.job_id = this.jobId;
    }

    requestParams.page = this.page;

    const sb = this.userService.getUserScoring(requestParams).subscribe(
      response => {
        // if (response && !this.utilsHelperService.isEmptyObj(response.jobs)) {
        //   this.matchingJob = { ...response }
        // }
        // if (isCount) {
        //   this.matchingUsersMeta = { ...response.meta }
        // }
        if (response && !isCount) {
          this.matchingJob = { ...response }
        }
        if (isCount) {
          this.matchingJobMeta = { ...response.meta }
        }

      }, error => {
      }
    )
    this.subscriptions.push(sb);
  }

  onGetUserScoringByIdNew = () => {
    let requestParams: any = {};
    // requestParams.id = this.jobId;
    requestParams.page = this.page;

    const sb = this.userService.getUserScoring(requestParams).subscribe(
      response => {
        if (response) {
          this.matchingJobNew = { ...response };
          this.matchingJobNew['jobs']['match_select'] = this.matchingJob['jobs']['match_select'];
        }

      }, error => {
      }
    )
    this.subscriptions.push(sb);
  }

  onChangeUser = (type) => {
    const count = this.matchingJob && this.matchingJob.meta && this.matchingJob.meta.count ? this.matchingJob.meta.count : 0;

    if (type == 'next') {
      if (count > this.page) {
        if (this.matchingJobMeta.count > 1 && this.matchingJobMeta.count !== this.page) {
          this.matchingJobNew = { ...this.matchingJobNew, jobs: {} };
          this.matchingJob = { ...this.matchingJob, jobs: {} };
          this.page++;

          this.onGetUserScoringById(true);
          if (count > this.page) {
            this.page++;
            setTimeout(() => {
              this.onGetUserScoringByIdNew();
            }, 300);
          };
        }
      }
    } else if (type == 'prev' && this.page > 2) {
      if (this.matchingJobMeta.count > 1 && this.matchingJobMeta.count !== this.page) {
        this.matchingJobNew = { ...this.matchingJobNew, jobs: {} };
        this.matchingJob = { ...this.matchingJob, jobs: {} };
        this.page--;

        !this.isEven(this.page) && this.page--;
        this.onGetUserScoringByIdNew();
        if (count > this.page) {
          this.page--;
          setTimeout(() => {
            this.onGetUserScoringById(true); this.page++;
        }, 300);
        }
      }
    }
	this.matchingJobNew['jobs']['match_select'] = this.matchingJob['jobs']['match_select'];

  }

  isEven = (num) => {
    if(num % 2 == 0) {
      return true;
    }

    return false;
}

  onRedirectBack = () => {
    this.location.back();
  }

  onToggleJDModal = (status,description) => {
    this.isOpenedJDModal = status;
	this.description = description;
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
    if (arr1 && arr1.length && arr2 && arr2.length) {
      let difference = arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
      return difference;
    }
    return [];
  }

  onChangeStringNumber(field1, field2, item, type, isString: boolean = false) {
    let lowerCaseJob = [];
    if (this.userInfo && this.userInfo[field1]) {
      lowerCaseJob = isString ? this.onLoweCase(this.userInfo[field1]) : this.userInfo[field1];
    }
    let lowerCaseUser = [];
    if (this.matchingJob && this.matchingJob.jobs && this.matchingJob.jobs[field2]) {
      lowerCaseUser = isString ? this.onLoweCase(this.matchingJob.jobs[field2]) : this.matchingJob.jobs[field2];
    }
    if (lowerCaseJob.includes(item.toLowerCase()) && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (!lowerCaseJob.includes(item?.toLowerCase()) && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }

  onChangeObj(field1, field2, item, type, filterField) {
    let lowerCaseJob = [];
    if (this.userInfo && this.userInfo[field1]) {
      lowerCaseJob = this.userInfo[field1]
    }
    let lowerCaseUser = [];
    if (this.matchingJob && this.matchingJob.jobs && this.matchingJob.jobs[field2]) {
      lowerCaseUser = this.matchingJob.jobs[field2]
    }
    let jobIndex = lowerCaseJob.findIndex(val => val[filterField] == item[filterField]);

    let userIndex = lowerCaseUser.findIndex(val => val[filterField] == item[filterField])
    if (jobIndex > -1 && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (userIndex == -1 && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }

  onToggleResumeSelectModal = (status, item?) => {
    if (!this.utilsHelperService.isEmptyObj(item)) {
      this.currentJobDetails = item;
    }
    this.isOpenedResumeSelectModal = status;
  }

  onShowMatches = (event) => {
    var temp = event.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		    event.target.className = 'matchBtn btn-sm btn btn-fltr btn-light';
			this.matchedElement = false;
	 }else{
		  event.target.className = 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		  this.matchedElement = true;
	  }
	   if(event.target.childNodes['0']){
		event.target.childNodes['0'].className='';
	  }

    if(this.missingElement == false && this.matchedElement == false ){
		this.missingElement = true;
		this.matchedElement = true;
		document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
	  }
  }

  onShowMissing = (event) => {
    var temp = event.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		    event.target.className = 'missBtn btn-sm btn btn-fltr btn-light';
			this.missingElement = false;
	 }else{
		  event.target.className = 'missBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		  this.missingElement = true;
	  }
	   if(event.target.childNodes['0']){
		event.target.childNodes['0'].className='';
	  }

    if(this.missingElement == false && this.matchedElement == false ){
		this.missingElement = true;
		this.matchedElement = true;
		document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
	  }
  }


  onReset = () => {
    
		this.missingElement = true;
		this.matchedElement = true;
  }

}
