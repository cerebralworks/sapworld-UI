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
	public isOpenedCoverModal: boolean;
	public togglecoverSelectModal: boolean;
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
	private postedJobsMatchDetailsUsers: any[] = [];
	private checkArray: any[] = [];
	private userDetails: any = {};
	public selectedCoverUrl: any;

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
				this.onGetJobScoringById();
				setTimeout(() => {
					this.onGetJobScoringByIds(true, true);
				},1000);
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
		}else{
			requestParams.page = this.page;			
		}
		requestParams.id = this.jobId;
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
				if (response) {
					if(response.profile){
						this.userDetails = response.profile;
						//this.onGetPostedJobs(this.postedJobsDetails) ;
					}
				}
			}, error => {
			}
		)
		this.subscriptions.push(sb);
	}
	/**
	**	To Get the user scoring details 
	**/
	
	onGetJobScoringByIds = (isMultipleMatch: boolean = false, isCount: boolean = false) => {
		let requestParams: any = {};
		requestParams.page = this.page;			
		requestParams.id = this.jobId;
		requestParams.additional_fields = 'job_application';
		const sb = this.employerService.getJobScoring(requestParams).subscribe(
			response => {
				if(response.profile){
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
	  **	To get coverletter popup status
	  **/
	  onToggleCoverForm = (status, selectedCoverUrl?) => {
		if (selectedCoverUrl) {
		  this.selectedCoverUrl = selectedCoverUrl;
		}
		this.isOpenedCoverModal = status; 
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
				if(response.profile){
					this.userDetails = response.profile;
					//this.onGetPostedJobs(this.postedJobsDetails) ;
				}
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
				this.page = 1;
				this.postedJobsMatchDetailsUsers =[];
				this.toggleMatchModal = false;
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
					this.postedJobsMatchDetailsUsers =[];
					this.toggleMatchModal = false;
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
				this.postedJobsMatchDetailsUsers =[];
				this.toggleMatchModal = false;
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
	**	To Check the previous and the next button 
	**/
	
	onChangeUsers = (type) => {
		const count = this.matchingUsersMeta  && this.matchingUsersMeta.count ? parseInt(this.matchingUsersMeta.count) : 0;
		if (type == 'next') {
			if (count > this.page) {
				if (this.matchingUsersMeta.count > 1 && this.matchingUsersMeta.count !== this.page) {
					this.postedJobsMatchDetailsUsers =[];
					this.toggleMatchModal = false;
					this.matchingUsers = { ...this.matchingUsers, profile: {} };
					this.page++;
					this.onGetJobScoringById(true);
				}
			}
		} else if (type == 'prev' && this.page > 1) {
			if (this.matchingUsersMeta.count > 1 ) {
				this.postedJobsMatchDetailsUsers =[];
				this.toggleMatchModal = false;
				this.matchingUsers = { ...this.matchingUsers, profile: {} };
				this.page--;
				this.onGetJobScoringById(true);
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
	**	Popup status
	**/

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
	  const filteredValues = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 0);
	  if (!this.utilsHelperService.isEmptyObj(filteredValues)) {
        return filteredValues.file;
      }
    }
    return "";
  }

  onShowMatches = (event) => {
	  var temp = event.target.className.split(' ');
	  if(this.matchedElement ==true){
			this.matchedElement = false;
	 }else{
		  this.matchedElement = true;
	  }
	this.missingElement = false;

    if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
	}
	 
  }

  onShowMissing = (event) => {
	  if(this.missingElement ==true){
		this.missingElement = false;
		this.matchedElement = true;
		this.moreElement = true;
	 }else{
		  this.missingElement = true;
		this.matchedElement = false;
		this.moreElement = false;
	  }
	  if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
	  }
    
  }

  onShowMore = (event) => {
	  if(this.moreElement ==true){
			this.moreElement = false;
	 }else{
		  this.moreElement = true;
	  }
	this.missingElement = false;
    if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
	  }
  }

  onReset = () => {
	 
    this.moreElement = true;
    this.matchedElement = true;
    this.missingElement = false;
  }


	
	OpenMatchesWithID(profileId,companyId){
		
		if(profileId && companyId){
			this.router.navigate(['/employer/job-multiple-candidate-matches'], { queryParams: {jobId: null,id: profileId ,employeeId:companyId,path:'userscoring'} });
		}
	}
	

	/**
	**	To open the popup for the matches jobs
	**/

  OpenMatchPopup = (details) => {
	  this.userDetails = details;
	  this.toggleMatchModal = true;
	  if(details['meta']['matches']){
		 if(details['meta']['matches']>1){
			if (this.toggleMatchModal) {
				var ids =''
				if(this.postedJobsDetails['id']){
					ids= this.postedJobsDetails['id'];
				}
				details['matches'] = details['matches'].filter(function(a,b){ return a.id != ids })
				this.postedJobsMatchDetails=details['matches'];
			}
			setTimeout(() => {
				if (this.toggleMatchModal) {
				  this.mbRef = this.modelService.open(this.deleteModal, {
					windowClass: 'modal-holder',
					centered: true,
					backdrop: 'static',
					keyboard: false
				  });
				}
			});
		}
	}
  }
  OpenMatchPopups = (details) => {
	 if(details['meta']['matches']){
		 if(details['meta']['matches']>1){
			 return false;
		 }
	 }
	 return true;
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
			this.router.navigate(['/employer/job-multiple-candidate-matches'], { queryParams: {jobId: selectedIds,id: this.userDetails['profile']['id'],employeeId:this.postedJobsMatchDetails[0].company,path:'userscoring'} });
		}
	}
	
	
	/**
	**	To get the boolean to string
	**/
	
	onGetYesOrNoValue = (value: boolean) => {
		if (value == true) {
			return "Yes";
		} else {
			return "No"
		}
	}
	
}
