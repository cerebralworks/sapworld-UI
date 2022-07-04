import { Component, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild,HostListener } from '@angular/core';

import { Location } from '@angular/common';
import { ActivatedRoute,Router ,NavigationStart} from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedService } from '@shared/service/shared.service';
import { DataService } from '@shared/service/data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';

import * as lodash from 'lodash';
import { CandidateProfile } from '@data/schema/create-candidate';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';
import { environment as env } from '@env';

@Component({
  selector: 'app-employer-candidate-profile-matches',
  templateUrl: './employer-candidate-profile-matches.component.html',
  styleUrls: ['./employer-candidate-profile-matches.component.css']
})
export class EmployerCandidateProfileMatchesComponent implements OnInit, OnDestroy,OnChanges {
	
	/**
	**	Variable declaration
	**/
	
	public screenWidth: any;
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
	public location_id: string;
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
	public loading : boolean;
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
	public userprofilepath:any;
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
				if(urlQueryParams && urlQueryParams.location_id) {
					sessionStorage.setItem('location_id',urlQueryParams.location_id);
				}
			}
		});
		var jobIds:any=0;
		var userIds:any=0;
		var location_ids:any=0;
		if(sessionStorage.getItem('jobId')){
			jobIds = parseInt(sessionStorage.getItem('jobId'));
		}if(sessionStorage.getItem('userId')){
			userIds = parseInt(sessionStorage.getItem('userId'));
		}if(sessionStorage.getItem('location_id')){
			location_ids = parseInt(sessionStorage.getItem('location_id'));
		}	 
		this.jobId = jobIds;
		this.userId = userIds;
		this.location_id = location_ids;
		this.router.navigate([], {queryParams: {location_id: null,userId: null,jobId:null}, queryParamsHandling: 'merge'});
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
	  this.screenWidth = window.innerWidth;	
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
		//requestParams.location_id = this.location_id;
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
		requestParams.location_id = this.location_id;
		requestParams.additional_fields = 'job_application';
		const sb = this.employerService.getJobScoring(requestParams).subscribe(
			response => {
				this.userprofilepath = `${env.apiUrl}/images/user/`;
				this.postedJobsMatchDetailsUsers =[];
				this.toggleMatchModal = false;
				this.matchingUsers = { ...this.matchingUsers, profile: {} };
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
								this.matchingUsers = { ...response };
								this.loading = true;
							}
							if (isCount) {
								this.matchingUsersMeta = { ...response.meta }
							}
						}
					}
				}else{
					if (response && !isCount  ) {
						this.matchingUsers = { ...response };
						this.loading = true;
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
				
				this.postedJobsMatchDetailsUsers =[];
				this.toggleMatchModal = false;
				this.matchingUsers = { ...this.matchingUsers, profile: {} };
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
		requestParams.location_id = this.location_id;
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
		  this.selectedCoverUrl = `${env.apiUrl}/documents/cover/${selectedCoverUrl}`;
		}
		this.isOpenedCoverModal = status; 
	}
	/**
	**	To Check if any changes happens in the page 
	**/
	
	onGetJobScoringByIdNew = () => {
		let requestParams: any = {};
		requestParams.id = this.jobId;
		requestParams.location_id = this.location_id;
		requestParams.page = this.page;
		requestParams.additional_fields = 'job_application';
		const sb = this.employerService.getJobScoring(requestParams).subscribe(
		response => {
			this.postedJobsMatchDetailsUsers =[];
			this.toggleMatchModal = false;
			this.matchingUsersNew = { ...this.matchingUsersNew, profile: {} };
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
			this.postedJobsMatchDetailsUsers =[];
			this.toggleMatchModal = false;
			this.matchingUsersNew = { ...this.matchingUsersNew, profile: {} };
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
		//var nxt : HTMLElement = document.getElementById('carouselProfile');
		var nxt1 : HTMLElement = document.getElementById('cardsliders');
		if (type == 'next') {
		    nxt1.classList.add("slideanimations")
			//nxt.classList.add("slideanimations")
			setTimeout(()=>{
			//nxt.classList.remove('slideanimations')
		    nxt1.classList.remove('slideanimations')
			},1000)
			if (count > this.page) {
				if (this.matchingUsersMeta.count > 1 && this.matchingUsersMeta.count !== this.page) {
					/* this.postedJobsMatchDetailsUsers =[];
					this.toggleMatchModal = false;
					this.matchingUsers = { ...this.matchingUsers, profile: {} }; */
					this.page++;
					this.onGetJobScoringById(true);
				}
			}
		} else if (type == 'prev' && this.page > 1) {
		   nxt1.classList.add("slidearight")
		   // nxt.classList.add("slidearight")
			setTimeout(()=>{
			//nxt.classList.remove('slidearight')
		    nxt1.classList.remove('slidearight')
			},1000)
			if (this.matchingUsersMeta.count > 1 ) {
				/* this.postedJobsMatchDetailsUsers =[];
				this.toggleMatchModal = false;
				this.matchingUsers = { ...this.matchingUsers, profile: {} }; */
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
		this.router.navigate(['/employer/dashboard'], { queryParams: {activeTab: 'matches',reset: 'true', id: this.jobId} });
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
			this.selectedResumeUrl = `${env.apiUrl}/documents/resume/${selectedResumeUrl}`;
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
	if(status ==true && !item){
		this.isOpenedSendMailModal = false;
	}else{
		this.isOpenedSendMailModal = status;
	}
	if(status == false){
		if(this.currentUserInfo['id']==this.matchingUsers['profile']['id']){
			this.matchingUsers['profile']['mail'] =true;
		}else{
			this.matchingUsersNew['profile']['mail'] =true;
		}
		
	}
	
  }
	
	/**
	**	To filter the array values
	**/
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
	
	/**
	**	To show the matches details 
	**/
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

	/**
	**	To show the missing details
	**/
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
	/**
	**	To show the more details
	**/
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
	
	/**
	**	To reset the filter details
	**/
  onReset = () => {
	 
    this.moreElement = true;
    this.matchedElement = true;
    this.missingElement = false;
  }

	/**
	**	To navigate the multiple matches details page
	**/
	
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
  
    /**
	**	To check the matches details
	**/
  OpenMatchPopups = (details) => {
	 if(details['meta']['matches']){
		 if(details['meta']['matches']>1){
			 return false;
		 }
	 }
	 return true;
  }
  
  /**
	**	To check the matched details
	**/
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
  
  /**
	**	To navigate the job multiple matches details
	**/
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
	
	@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
@HostListener('window:popstate', ['$event'])
  onPopState(event) {
	this.router.events.subscribe((event: NavigationStart) => {
     if (event.navigationTrigger === 'popstate') {
	   this.onRedirectBack();
     }
   });
  }
}
