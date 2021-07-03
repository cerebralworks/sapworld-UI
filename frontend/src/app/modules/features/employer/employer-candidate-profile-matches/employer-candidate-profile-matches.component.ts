import { Component, OnDestroy,OnChanges, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedService } from '@shared/service/shared.service';
import { DataService } from '@shared/service/data.service';

import * as lodash from 'lodash';
import { CandidateProfile } from '@data/schema/create-candidate';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employer-candidate-profile-matches',
  templateUrl: './employer-candidate-profile-matches.component.html',
  styleUrls: ['./employer-candidate-profile-matches.component.css']
})
export class EmployerCandidateProfileMatchesComponent implements OnInit, OnDestroy,OnChanges {
  public isOpenedJDModal: boolean = false;
  public isOpenedResumeModal: boolean = false;
  public isOpenedOtherPostModal: boolean = false;
  public jobId: string;
  public postedJobsDetails: any;
  public page: number = 1;
  public userId: string;
  public matchingUsers: any = {};
  public cusLoadsh: any = lodash;
  public isOpenedSendMailModal: boolean;
  public currentUserInfo: CandidateProfile;
  public matchedElement: boolean = true;
  public missingElement: boolean = false;
  public moreElement: boolean = true;
  public isMultipleMatches: boolean = false;
  public matchingUsersMeta: any = { count: 0 };
  public matchingUsersNew: any;
  public selectedResumeUrl: string;
  private subscriptions: Subscription[] = [];
  
  public languageSource=[];
	public nationality=[];
	public required: boolean = true;
	public desired: boolean = true;
	public optional: boolean = true;
	public nice: boolean = true;
	public IsValidate: boolean = false;

  constructor(
	private dataService: DataService,
    private route: ActivatedRoute,
    private employerService: EmployerService,
    private location: Location,
    public utilsHelperService: UtilsHelperService,
    public sharedService: SharedService,
    private router: Router
  ) {
	  this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        let urlQueryParams = {...params};

        if(urlQueryParams && urlQueryParams.jobId) {
			sessionStorage.setItem('jobId',urlQueryParams.jobId);
        }
        if(urlQueryParams && urlQueryParams.userId) {
			sessionStorage.setItem('userId',urlQueryParams.userId);
        }
	}
	});
	 
	 var jobIds:any=0;
	 var userIds:any=0;
	 if(sessionStorage.getItem('jobId')){
		jobIds = parseInt(sessionStorage.getItem('jobId'));
	}if(sessionStorage.getItem('userId')){
		userIds = parseInt(sessionStorage.getItem('userId'));
	}
	 
    this.jobId = jobIds;
    this.userId = userIds;
	this.router.navigate([], {queryParams: {userId: null,jobId:null}, queryParamsHandling: 'merge'});
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
      this.onGetJobScoringById(true, true);
    }
	this.dataService.getCountryDataSource().subscribe(
		response => {
        if (response && Array.isArray(response) && response.length) {
          this.nationality = response;
	
        }
      }
    );
	  this.dataService.getLanguageDataSource().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.languageSource = response;
        }
		}
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.length > 0 && this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  onGetPostedJob() {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = this.jobId;
    const sb = this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
        if (response && response.details) {
			if(response.details.skills){
				response.details.skills = this.utilsHelperService.differenceByPropValArray(response.details.skills, response.details.hands_on_experience, 'skill_id')
				
			}
          this.postedJobsDetails = response.details;
        }
      }, error => {
      }
    )
    this.subscriptions.push(sb);
  }

  ngOnChanges(changes): void {
    setTimeout( async () => {
		var arr = [];
		if(this.postedJobsDetails){
			  if(this.postedJobsDetails.match_select){
				Object.keys(this.postedJobsDetails.match_select).forEach(key => {
					arr.push(this.postedJobsDetails.match_select[key]) 
				});
				var requiredFilter = arr.filter(function(a,b){return a=='0'});
				var desiredFilter = arr.filter(function(a,b){return a=='1'});
				var niceFilter = arr.filter(function(a,b){return a=='2' });
				var optionalFilter = arr.filter(function(a,b){return a=='' });
				if(requiredFilter.length>0){
					this.required =true;
				}if(desiredFilter.length>0){
					this.desired=true;
				}else{
					this.desired=false;
				}if(niceFilter.length>0){
					this.nice =true;
				}else{
					this.nice =false;
				}if(optionalFilter.length>0){
					this.optional =true;
				}else{
					this.optional =false;
				}
				
			  }
		  }
		
	});
	  
  }
  onGetJobScoringById = (isMultipleMatch: boolean = false, isCount: boolean = false) => {
    let requestParams: any = {};
    if (!isMultipleMatch) {
      requestParams.user_id = this.userId;
    }
    requestParams.id = this.jobId;
    requestParams.page = this.page;
    requestParams.additional_fields = 'job_application';

    const sb = this.employerService.getJobScoring(requestParams).subscribe(
      response => {
		  if(!isMultipleMatch){
			  if(response.profile){
				  if(parseInt(this.userId) == response.profile.id ){
					  if (response && !isCount  ) {
						  this.matchingUsers = { ...response }
						}
						if (isCount) {
						  this.matchingUsersMeta = { ...response.meta }
						  }
				  }
			  }
		  }else{
        if (response && !isCount  ) {
          this.matchingUsers = { ...response }
        }
        if (isCount) {
          this.matchingUsersMeta = { ...response.meta }
		  }}
      }, error => {
      }
    )
    this.subscriptions.push(sb);
  }
  onGetJobScoringByIdNew = () => {
    let requestParams: any = {};
    requestParams.id = this.jobId;
    requestParams.page = this.page;
    requestParams.additional_fields = 'job_application';

    const sb = this.employerService.getJobScoring(requestParams).subscribe(
      response => {
        if (response) {
          this.matchingUsersNew = { ...response };
        }

      }, error => {
      }
    )
    this.subscriptions.push(sb);
  }

  onViewOtherMatches = () => {
	  if(this.IsValidate==false){
    if (this.matchingUsersMeta.count > 1 && this.matchingUsersMeta.count !== this.page) {
      this.isMultipleMatches = true;
      this.onGetJobScoringById(true);
      this.page++;
      setTimeout(() => {
		  this.IsValidate =true;
        this.onGetJobScoringByIdNew();
		this.missingElement = true;
    this.matchedElement = true;
    this.moreElement = true;
      }, 300);
    }
	  }

  }

  onChangeUser = (type) => {
    const count = this.matchingUsers && this.matchingUsers.meta && this.matchingUsers.meta.count ? parseInt(this.matchingUsers.meta.count) : 0;
    if (type == 'next') {
      if (count > this.page) {
        if (this.matchingUsersMeta.count > 1 && this.matchingUsersMeta.count !== this.page) {
          this.matchingUsersNew = { ...this.matchingUsersNew, profile: {} };
          this.matchingUsers = { ...this.matchingUsers, profile: {} };
          this.page++;
          this.onGetJobScoringById(true);
          if (count > this.page) {
            this.page++;
            setTimeout(() => {
              this.onGetJobScoringByIdNew();
            }, 300);
          };
        }
      }
    } else if (type == 'prev' && this.page > 2) {
      if (this.matchingUsersMeta.count > 1 && this.matchingUsersMeta.count !== this.page) {
        this.matchingUsersNew = { ...this.matchingUsersNew, profile: {} };
        this.matchingUsers = { ...this.matchingUsers, profile: {} };
        this.page--;

        !this.isEven(this.page) && this.page--;
        this.onGetJobScoringByIdNew();
        if (count > this.page) {
          this.page--;
          setTimeout(() => {
            this.onGetJobScoringById(true); this.page++;
        }, 300);
        }
      }
      }
  }

isEven = (num) => {
    if(num % 2 == 0) {
      return true;
    }

    return false;
}

  onRedirectBack = () => {
   // this.location.back();
	this.router.navigate(['/employer/dashboard'], { queryParams: {activeTab: 'matches', id: this.jobId} });
	
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

  onToggleResumeForm = (status, selectedResumeUrl?: string) => {
    if (selectedResumeUrl) {
      this.selectedResumeUrl = selectedResumeUrl;
    }
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

    if (arr1 && arr1.length && arr2 && arr2.length) {
      let difference = arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
      return difference;
    }
    return [];
  }

  onChangeStringNumber(field1, field2, item, type, isString: boolean = false, isNew: boolean = false) {
    let lowerCaseJob = [];
    if (this.postedJobsDetails && this.postedJobsDetails[field1]) {
      lowerCaseJob = isString ? this.onLoweCase(this.postedJobsDetails[field1]) : this.postedJobsDetails[field1];
    }
    let lowerCaseUser = [];
    if (!isNew && this.matchingUsers && this.matchingUsers.profile && this.matchingUsers.profile[field2]) {
      lowerCaseUser = isString ? this.onLoweCase(this.matchingUsers.profile[field2]) : this.matchingUsers.profile[field2];
    }
    if (isNew && this.matchingUsersNew && this.matchingUsersNew.profile && this.matchingUsersNew.profile[field2]) {
      lowerCaseUser = isString ? this.onLoweCase(this.matchingUsersNew.profile[field2]) : this.matchingUsersNew.profile[field2];
    }

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

  onChangeObj(field1, field2, item, type, filterField, isNew = false) {
    let lowerCaseJob = [];
    if (this.postedJobsDetails && this.postedJobsDetails[field1]) {
      lowerCaseJob = this.postedJobsDetails[field1]
    }
    let lowerCaseUser = [];
    if (!isNew && this.matchingUsers && this.matchingUsers.profile && this.matchingUsers.profile[field2]) {
      lowerCaseUser = this.matchingUsers.profile[field2]
    }
    if (isNew && this.matchingUsersNew && this.matchingUsersNew.profile && this.matchingUsersNew.profile[field2]) {
      lowerCaseUser = this.matchingUsersNew.profile[field2]
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

  onToggleSendMail = (status, item?) => {
    if (item && !this.utilsHelperService.isEmptyObj(item)) {
      this.currentUserInfo = item;
    }
    this.isOpenedSendMailModal = status;
  }

  onGetFilteredValue(resumeArray: any[]): any {
    if (resumeArray && Array.isArray(resumeArray)) {
      const filteredValue = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1);
      if (!this.utilsHelperService.isEmptyObj(filteredValue)) {
        return filteredValue.file;
      }
    }
    return "";
  }

  onShowMatches = (event) => {
	  var temp = event.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		    document.getElementById('matchBtnVal').className = 'matchBtn btn-sm btn btn-fltr btn-light';
			this.matchedElement = false;
	 }else{
		  document.getElementById('matchBtnVal').className = 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		  this.matchedElement = true;
	  }
	   if(event.target.childNodes['0']){
		event.target.childNodes['0'].className='';
	  }
	this.missingElement = false;
	document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light';
	

    if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
		document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('moreBtnVal').className= 'moreBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
	  }
	  if(document.getElementById('matchBtnVal').childNodes['0']){
		document.getElementById('matchBtnVal').childNodes['0'].className='';
	  }
	  if(document.getElementById('missBtnVal').childNodes['0']){
		document.getElementById('missBtnVal').childNodes['0'].className='';
	  }
	  if(document.getElementById('moreBtnVal').childNodes['0']){
		document.getElementById('moreBtnVal').childNodes['0'].className='';
	  }
  }

  onShowMissing = (event) => {
	  var temp = event.toElement.className.split(' ');
	  	  if(temp[temp.length-1]=='btn-fltr-active'){
		  event.target.className = 'missBtn btn-sm btn btn-fltr btn-light';
			this.missingElement = false;
			document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('moreBtnVal').className= 'moreBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		this.matchedElement = true;
		this.moreElement = true;
	 }else{
		  event.target.className= 'missBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		  this.missingElement = true;
		  document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light ';
		document.getElementById('moreBtnVal').className= 'moreBtn btn-sm btn btn-fltr btn-light ';
		this.matchedElement = false;
		this.moreElement = false;
	  }

	   if(event.target.childNodes['0']){
		event.target.childNodes['0'].className='';
	  }

	  if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
		document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('moreBtnVal').className= 'moreBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
	  }
	  if(document.getElementById('matchBtnVal').childNodes['0']){
		document.getElementById('matchBtnVal').childNodes['0'].className='';
	  }
	  if(document.getElementById('missBtnVal').childNodes['0']){
		document.getElementById('missBtnVal').childNodes['0'].className='';
	  }
	  if(document.getElementById('moreBtnVal').childNodes['0']){
		document.getElementById('moreBtnVal').childNodes['0'].className='';
	  }
    
  }

  onShowMore = (event) => {
	  var temp = event.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		  document.getElementById('moreBtnVal').className = 'moreBtn btn-sm btn btn-fltr btn-light';
			this.moreElement = false;
	 }else{
		  document.getElementById('moreBtnVal').className= 'moreBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		  this.moreElement = true;
	  }
	   if(event.target.childNodes['0']){
		event.target.childNodes['0'].className='';
	  }
	this.missingElement = false;
	document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light';
	
    if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
		document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('moreBtnVal').className= 'moreBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
	  }
	  if(document.getElementById('matchBtnVal').childNodes['0']){
		document.getElementById('matchBtnVal').childNodes['0'].className='';
	  }
	  if(document.getElementById('missBtnVal').childNodes['0']){
		document.getElementById('missBtnVal').childNodes['0'].className='';
	  }
	  if(document.getElementById('moreBtnVal').childNodes['0']){
		document.getElementById('moreBtnVal').childNodes['0'].className='';
	  }
  }

  onReset = () => {
	 
    this.moreElement = true;
    this.matchedElement = true;
    this.missingElement = false;
		document.getElementById('matchBtnVal').className= 'matchBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
		document.getElementById('missBtnVal').className= 'missBtn btn-sm btn btn-fltr btn-light';
		document.getElementById('moreBtnVal').className= 'moreBtn btn-sm btn btn-fltr btn-light btn-fltr-active';
  }

findLanguageArray(value){
		if(value){
			
			if(this.languageSource){
				var array = this.languageSource.filter(function(a,b){ return a.id == value})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['name'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			
			}
			
		}
		
		return '--';
	}
	findCountry(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			
			}
			
		}
		
		return '--';
	}
	
	checkType(array,value,education){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(education == 'education'){
					if(array.filter(function(a,b){ return a.degree!=value}).length !=0){
						return true;
					}
				}else if(array.filter(function(a,b){ return a!=value}).length !=0){
					return true;
				}
			}
		}
		return false;
	}
	checkLanMatch(array,value){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(array.filter(function(a,b){ return a==value}).length !=0){
					return true;
				}
			}
		}
		return false;
	}
	checkLanExtra(array,value,language){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(language =='language'){
					if(array.filter(function(a,b){ return a.language!=value}).length !=0){
						return true;
					}
				}else if(array.filter(function(a,b){ return a!=value}).length !=0){
					return true;
				}
			}
		}
		return false;
	}
	
}
