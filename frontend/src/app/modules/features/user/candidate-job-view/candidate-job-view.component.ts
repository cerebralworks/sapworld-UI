import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Location } from '@angular/common';
import { UserSharedService } from '@data/service/user-shared.service';

@Component({
  selector: 'app-candidate-job-view',
  templateUrl: './candidate-job-view.component.html',
  styleUrls: ['./candidate-job-view.component.css']
})
export class CandidateJobViewComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	public postedJobsDetails: JobPosting;
	public jobId: string;
	public currentJobDetails: any;
	public userInfo: any;
	public isOpenedJDModal: boolean;
	public isShowApply: boolean = false;
	public userAccept: boolean = false;
	public isOpenedResumeSelectModal: boolean = false;
	public isgetValue: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private userSharedService: UserSharedService,
		private employerService: EmployerService,
		public utilsHelperService: UtilsHelperService,
		private location: Location,
		public sharedService: SharedService,
		private router: Router
	) {
	  
		/**	
		**	Checking Routing params
		**/
		this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				this.userInfo = response;
				if(this.jobId && this.isgetValue == false) {
					this.isgetValue =true;
					this.onGetPostedJobDetails();
				}
			}
		)
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.id) {
					sessionStorage.setItem('view-job-id',urlQueryParams.id);
					if(urlQueryParams.path){
						sessionStorage.setItem('view-job-path',urlQueryParams.path);
						this.router.navigate([], {queryParams: {path: null}, queryParamsHandling: 'merge'});
					}
				}
				if(urlQueryParams && urlQueryParams.show){
					this.isShowApply = true;
				}
			}
		});
		this.router.navigate([], {queryParams: {id: null,path: null}, queryParamsHandling: 'merge'});
		var jobIds:any = 0;
		if(sessionStorage.getItem('view-job-id')){
			jobIds = parseInt(sessionStorage.getItem('view-job-id'));
		}
		//this.jobId = this.route.snapshot.paramMap.get('id');
		this.jobId = jobIds;
	}

	/**	
	**	When the page loads the onint calls
	**/
		
	ngOnInit(): void {
		
	}

	/**	
	**	To get the posted job details
	**/
		
	onGetPostedJobDetails() {
		let requestParams: any = {};
		requestParams.expand = 'company';
		requestParams.id = this.jobId;
		requestParams.is_job_applied = true;
		requestParams.user_id = this.userInfo.id;
		this.employerService.getPostedJobDetails(requestParams).subscribe(
			response => {
				if(response && response.details) {
					this.postedJobsDetails = response.details;
				}
			}, error => {
			
			}
		)
	}
	
	/**	
	**	To redirect the jobview to previous page
	**/
		
	onRedirectBack = () => {
		
		// this.location.back();
		if(sessionStorage.getItem('view-job-path')=='applied'){
			sessionStorage.clear();
			this.router.navigate(['/user/dashboard'], {queryParams: {activeTab: 'applied'}});
		}else if(sessionStorage.getItem('view-job-path')=='shortlisted'){
			sessionStorage.clear();
			this.router.navigate(['/user/dashboard'], {queryParams: {activeTab: 'shortlisted'}});
		}else{
			this.router.navigate(['/user/job-matches/details'], {queryParams: {id: this.jobId}});
		}
	}
	
	navigateMatches(){
		this.router.navigate(['/user/job-matches/details'], {queryParams: {id: this.jobId}});
	}
	
	/**	
	**	To Open the resume in popup view
	**/
		
	onToggleResumeSelectModal = (status, item?) => {
		if(!this.utilsHelperService.isEmptyObj(item)) {
			this.currentJobDetails = item;
		}
		this.isOpenedResumeSelectModal = status;
		this.userAccept = status;
	}
	
	/**	
	**	To Close the resume in popup view the Function calls
	**/
		
	onToggleResumeSelectModalClose(status){
		if(status ==false){
		
		}
		this.isOpenedResumeSelectModal = false;
		this.userAccept = false;
		this.isShowApply = false;
		this.onGetPostedJobDetails();
	}

	/**	
	**	To open the jon details in popup view 
	**/
		
	onToggleJDModal = (status) => {
		this.isOpenedJDModal = status;
	}

	/**	
	**	To	return the Boolean to string
	**/
		
	onGetYesOrNoValue = (value: boolean) => {
		if (value == true) {
			return "Yes";
		} else {
			return "No"
		}
	}
	
}
