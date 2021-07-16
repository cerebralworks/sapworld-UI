import { Component, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedService } from '@shared/service/shared.service';
import { DataService } from '@shared/service/data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';

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
	
	/**
	**	Variable declaration
	**/
	
	public isOpenedJDModal: boolean = false;
	public isOpenedResumeModal: boolean = false;
	public isOpenedOtherPostModal: boolean = false;
	public toggleMatchModal: boolean =false;
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
	public isHideData: boolean = true;
	public isMultipleMatches: boolean = false;
	public matchingUsersMeta: any = { count: 0 };
	public matchingUsersNew: any;
	public selectedResumeUrl: string;
	private subscriptions: Subscription[] = [];
	private postedJobsMatchDetails: any[] = [];
	private checkArray: any[] = [];
	private userDetails: any = {};

	@ViewChild('deleteModal', { static: false }) deleteModal: TemplateRef<any>;
	public mbRef: NgbModalRef;
	public languageSource=[];
	public nationality=[];
	public required: boolean = true;
	public desired: boolean = true;
	public optional: boolean = true;
	public nice: boolean = true;
	public IsValidate: boolean = false;
	public matchForm: FormGroup;
	
	constructor(
		private dataService: DataService,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private employerService: EmployerService,
		private location: Location,
		private modelService: NgbModal,
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

	/**
	**	To Check the change fields of the array
	**/
	
	onChange(array: any[] = [], item, field) {
		if (!this.utilsHelperService.isEmptyObj(item) && array && array.length) {
			return array.find((val) => {
				return val[field] == item[field];
			});
		}
	}
	/**
	**	To initialize the page loads
	**/
	
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
	
	/**
	**	To Build Form
	**/
	
	private buildForm(): void {
		// this.matchForm = this.formBuilder.array({
			// title: ['', [Validators.required]]
		// });
	}
	
	/**
	**	To page leave function triggers
	**/
	
	ngOnDestroy(): void {
		this.subscriptions.length > 0 && this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	
	/**
	**	To Get the posted job Details
	**/
	
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
	
	/**
	**	To Check if any changes happens in the page 
	**/
	
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
	
	/**
	**	To Get the user scoring details 
	**/
	
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
				if (response) {
					if(response.job.skills){
						response.job.skills = this.utilsHelperService.differenceByPropValArray(response.job.skills, response.job.hands_on_experience, 'skill_id')
					}
					if(response.profile.skills){
						response.profile.skills = this.utilsHelperService.differenceByPropValArray(response.profile.skills, response.profile.hands_on_experience, 'skill_id')
					}
				}
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
					}
				}
			}, error => {
			}
		)
		this.subscriptions.push(sb);
	}
	
	/**
	**	To Check if any changes happens in the page 
	**/
	
	onGetJobScoringByIdNew = () => {
		let requestParams: any = {};
		requestParams.id = this.jobId;
		requestParams.page = this.page;
		requestParams.additional_fields = 'job_application';
		const sb = this.employerService.getJobScoring(requestParams).subscribe(
		response => {
			if (response) {
				if(response.job.skills){
					response.job.skills = this.utilsHelperService.differenceByPropValArray(response.job.skills, response.job.hands_on_experience, 'skill_id')
				}	
				if(response.profile.skills){
					response.profile.skills = this.utilsHelperService.differenceByPropValArray(response.profile.skills, response.profile.hands_on_experience, 'skill_id')
				}	
			}
			if (response) {
				this.matchingUsersNew = { ...response };
			}
		}, error => {
		})
		this.subscriptions.push(sb);
	}

	/**
	**	To Show the view othermatches details
	**/
	
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

	/**
	**	To Check the previous and the next button 
	**/
	
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

	/**
	**	To Check event or not 
	**/
	
	isEven = (num) => {
		if(num % 2 == 0) {
			return true;
		}
		return false;
	}

	/**
	**	To Click the back button 
	**/
	
	onRedirectBack = () => {
		// this.location.back();
		this.router.navigate(['/employer/dashboard'], { queryParams: {activeTab: 'matches', id: this.jobId} });
	}
	
	
	/**
	**	To Open jobdescription status
	**/
	
	onToggleJDModal = (status) => {
		this.isOpenedJDModal = status;
	}

	/**
	**	To Open Resume status
	**/
	
	onToggleResumeForm = (status, selectedResumeUrl?: string) => {
		if (selectedResumeUrl) {
			this.selectedResumeUrl = selectedResumeUrl;
		}
		this.isOpenedResumeModal = status;
	}

	/**
	**	To Open otherpost jobs status
	**/
	
	onToggleOtherPostModal = (status) => {
		this.isOpenedOtherPostModal = status;
	}

	/**
	**	Array to Strings
	**/
	
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
	OpenMatchesWithID(profileId,companyId){
		
		if(profileId && companyId){
			this.router.navigate(['/employer/job-multiple-candidate-matches'], { queryParams: {jobId: null,id: profileId ,employeeId:companyId,path:'userscoring'} });
		}
	}
	

	onGetPostedJobs(companyId) {
    let requestParams: any ={};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.expand = 'company';
    requestParams.company = companyId;
    requestParams.skills_filter = 'false';
    requestParams.work_authorization = '';
    requestParams.visa_sponsered = false;	
	
    if(this.userDetails && this.userDetails.city && this.userDetails.willing_to_relocate == true ) {
      requestParams.work_authorization = this.userDetails.work_authorization;
      requestParams.visa_sponsered = this.userDetails.visa_sponsered;
	  
		  requestParams.city = [this.userDetails.city];
	  
	  if(this.userDetails && this.userDetails.preferred_locations) {
			if(this.userDetails.preferred_locations.length !=0) {
				var temp:any[]= this.userDetails.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
				if(temp.length!=0){
					var tempData=temp.map(function(a,b){ return a.city});
					//tempData[tempData.length]=this.userDetails.city;
					tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
					if(tempData && tempData.length){
						requestParams.city = tempData.join(',');
					}
				}
			}
	  }
    }
    if(this.userDetails && this.userDetails.country && this.userDetails.willing_to_relocate == true ) {
      requestParams.country = [this.userDetails.country];
	  if(this.userDetails && this.userDetails.preferred_locations ) {
			if(this.userDetails.preferred_locations.length !=0) {
				var temp:any[]= this.userDetails.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
				if(temp.length!=0){
					var temp=temp.map(function(a,b){ return a.country});
				}
				if(this.userDetails.authorized_country.length && this.userDetails.authorized_country.length !=0){
					var authorized_countrys= this.nationality.filter((el) => {
						  return this.userDetails.authorized_country.some((f) => {
							return f === el.id ;
						  });
					});
					if(authorized_countrys.length !=0){
						authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
						//temp = temp.concat(authorized_countrys);
					}
					
				}
				
				if(temp.length!=0){
					var tempData=temp;
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
						tempData = tempData.concat(EUCountry);
					}
					//tempData[tempData.length]=this.userDetails.country;
					tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
					if(tempData && tempData.length){
						requestParams.country = tempData.join(',');
					}
				}
			} else if(this.userDetails.authorized_country.length && this.userDetails.authorized_country.length !=0){
				var authorized_countrys= this.nationality.filter((el) => {
						  return this.userDetails.authorized_country.some((f) => {
							return f === el.id ;
						  });
					});
					if(authorized_countrys.length !=0){
						authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
					}
				var temp:any[] = authorized_countrys ; 
				if(temp.length!=0){
					var tempData=temp;
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
						tempData = tempData.concat(EUCountry);
					}
					//tempData[tempData.length]=this.userDetails.country;
					tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
					if(tempData && tempData.length){
						requestParams.country = tempData.join(',');
					}
				}
			} 
	  }
    } else{
		if(this.userDetails && this.userDetails.authorized_country.length && this.userDetails.authorized_country.length !=0){
				
			var authorized_countrys= this.nationality.filter((el) => {
						  return this.userDetails.authorized_country.some((f) => {
							return f === el.id ;
						  });
					});
					if(authorized_countrys.length !=0){
						authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
					}
				var temp:any[] = authorized_countrys ; 
			if(temp.length!=0){
				var tempData=temp;
				if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
					var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
					'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
					'france','poland','germany','portugal','greece','slovakia','hungary',
					'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
					]
					tempData = tempData.concat(EUCountry);
				}
				//tempData[tempData.length]=this.userDetails.country;
				tempData =tempData.filter(function(item, pos) {
							return tempData.indexOf(item) == pos;
						})
				if(tempData && tempData.length){
					requestParams.country = tempData.join(',');
				}
			}
		}
	} 
	
    if(this.userDetails && this.userDetails.skills && this.userDetails.skills.length) {
		var temps = [];
		if(this.userDetails.hands_on_experience && this.userDetails.hands_on_experience.length){
			for(let i=0;i<this.userDetails.hands_on_experience.length;i++){
				if(this.userDetails.hands_on_experience[i]['skill_id']  &&this.userDetails.hands_on_experience[i]['skill_id'] !=''){
					temps.push(this.userDetails.hands_on_experience[i]['skill_id']);
				}
				
			}
			
		}
      requestParams.skills = temps.join(',')
      requestParams.skills_filter = 'false';
    }

	
	if(this.userDetails && this.userDetails.job_type) {
		if(this.userDetails.job_type && this.userDetails.job_type['length']) {
			 requestParams.type = this.userDetails.job_type['join'](',')
		}
	}
if(this.userDetails && this.userDetails.experience) {
      requestParams.max_experience = this.userDetails.experience;
    }
	
    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.employerService.getPostedJob(removeEmpty).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
			this.postedJobsMatchDetails=response.items;
        }
       
      }, error => {
      }
    )
  }
  
  OpenMatchPopup = (companyId,details) => {
	  this.userDetails = details;
	  this.onGetPostedJobs(companyId) ;
	  this.toggleMatchModal = true;
    
		setTimeout(() => {
			if (this.toggleMatchModal) {
      this.mbRef = this.modelService.open(this.deleteModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    } });
  }
  
  updateSelectedTimeslots(event,id){
	  if(id){
		  if(event){
			  if(event.target){
				  if(event.target.checked ==true || event.target.checked ==true ){
					  if(event.target.checked ==true){
						  this.checkArray.push(id);
					  }else{
						  this.checkArray = this.checkArray.filter(function(a,b){ return a != id });
					  }
				  }
			  }
		}
	}
  }
	MatchCandidate(){
		
		if(this.checkArray.length!=0){
			this.mbRef.close();
			var selectedIds = this.checkArray.join(',');
			this.router.navigate(['/employer/job-multiple-candidate-matches'], { queryParams: {jobId: selectedIds,id: this.userDetails.id,employeeId:this.postedJobsMatchDetails[0].company.id,path:'userscoring'} });
		}
	}
	
}
