import { Location } from '@angular/common';
import { Component, OnInit,HostListener  } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { EmployerService } from '@data/service/employer.service';

import * as lodash from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employer-candidate-multiple-profile-matches',
  templateUrl: './employer-candidate-multiple-profile-matches.component.html',
  styleUrls: ['./employer-candidate-multiple-profile-matches.component.css']
})
export class EmployerCandidateMultipleProfileMatchesComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	public screenWidth: any;
	public isOpenedJDModal: boolean = false;
	public isOpenedSendMailModal: boolean = false;
	public userInfo: CandidateProfile;
	public jobId: string;
	public page: number = 1;
	public pageCount: number = 1;
	public matchingJob: any = {};
	public cusLoadsh: any = lodash;
	public currentJobDetails: any;
	public description: any;
	public userID: any;
	public jobID: any;
	public employeeID: any;
	public isOpenedResumeSelectModal: boolean;
	public matchedElement: boolean = true;
	public missingElement: boolean ;
	public moreElement: boolean = true;
	public isMultipleMatches: boolean;
	// public matchingUsersMeta: any;
	public matchingJobNew: any = {} ;
	private subscriptions: Subscription[] = [];
	matchingJobMeta: any;
	postedJobsMatchDetails: any;
	postedJobsDetails: any;
	currentUserInfo: any;
	employeePath: any;
	TotalMatchJobs: any[]=[];
    loading : boolean;
	public userDetails:any;
	constructor(
		private route: ActivatedRoute,
		private userSharedService: UserSharedService,
		private userService: UserService,
		private location: Location,
		public utilsHelperService: UtilsHelperService,
		private employerService: EmployerService,
		public sharedService: SharedService,
		private router: Router) { }

	/**
	**	To page loads the init triggers
	**/
	
	ngOnInit(): void {
		
	  this.screenWidth = window.innerWidth;	
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.id) {
					sessionStorage.setItem('view-user-id',urlQueryParams.id);
					sessionStorage.setItem('view-jobId-id',urlQueryParams.jobId);
					sessionStorage.setItem('view-Employee-id',urlQueryParams.employeeId);
					sessionStorage.setItem('view-Employee-Path',urlQueryParams.path);
				}
			}
		});
		this.router.navigate([], {queryParams: {userscoring: null,path: null,id: null,jobId: null,employeeId: null}, queryParamsHandling: 'merge'});
		if(sessionStorage.getItem('view-user-id')){
			this.userID = parseInt(sessionStorage.getItem('view-user-id'));
			this.onGetCandidateInfo();
		}
		if(sessionStorage.getItem('view-jobId-id')){
			this.jobID = sessionStorage.getItem('view-jobId-id').split(',');
		}
		if(sessionStorage.getItem('view-Employee-id')){
			this.employeeID =  parseInt(sessionStorage.getItem('view-Employee-id'));
		}
		if(sessionStorage.getItem('view-Employee-Path')){
			this.employeePath =  sessionStorage.getItem('view-Employee-Path');
		}
	}
	
	/**
	**	To Get the candidate information
	**/
	
	onGetCandidateInfo() {
		let requestParams: any = {};
		requestParams.id = this.userID;
		this.userService.profileView(requestParams).subscribe(
		response => {
			if(response && response.details) {
				//response['details']['skillses'] = response['details']['skills']
				response['details']['skillses'] = this.utilsHelperService.differenceByPropValArray(response['details']['skills'], response['details'].hands_on_experience, 'skill_id')
				this.userInfo = {...response.details, meta: response.meta};
				this.userDetails = response.details;
				this.onGetPostedJobs();
			}
		}, error => {
		})
	}
	


    /**
	**	To show the users details matches
	**/
	onShowMatches = (event) => {
	  var temp = event.target.className.split(' ');
	  var match = document.getElementById('matchBtnVal');
	  if(match.classList.contains('btn-fltr-active')){
	       match.classList.remove("btn-fltr-active");
			this.matchedElement = false;
	 }else{
	      match.classList.add("btn-fltr-active");
		  this.matchedElement = true;
	  }
    if(this.missingElement == false && this.matchedElement == false ){
		this.matchedElement = true;
	  }
	  
    }

	/**
	**	To sjow the user details missing
	**/
  onShowMissing = (event) => {
	  var temp = event.target.className.split(' ');
	  var miss = document.getElementById('missBtnVal');
	  if(miss.classList.contains('btn-fltr-active')){
	       
		   miss.classList.remove("btn-fltr-active");
			this.missingElement = false;
	 }else{
	      
		  miss.classList.add("btn-fltr-active");
		  this.missingElement = true;
	  }
	   
	  if(this.missingElement == false && this.matchedElement == false ){
		this.matchedElement = true;
	  }
    
  }
  
  
	
	/**
	**	To get the posted jobs matches for the user
	**/
	
	onGetPostedJobs() {
		let requestParams: any = {};
		requestParams.view = 'users_matches_details';
		requestParams.company = this.employeeID;
		requestParams.id = this.userID;
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					if(this.employeePath =='userscorings'){
						this.TotalMatchJobs = [];
						for(let i=0;i<response['count'].length;i++){
							if(this.TotalMatchJobs.length!=0){
								response['count'][i]['match_select']=this.TotalMatchJobs[0]['match_select'];
							}
							response['count'][i]['score']=parseFloat(response['count'][i]['score'].toFixed(1));
							this.TotalMatchJobs.push(response['count'][i])
						}
					}else if(this.jobID =='all'){
						this.TotalMatchJobs = [];
						for(let i=0;i<response['count'].length;i++){
							if(this.TotalMatchJobs.length!=0){
								response['count'][i]['match_select']=this.TotalMatchJobs[0]['match_select'];
							}
							response['count'][i]['score']=parseFloat(response['count'][i]['score'].toFixed(1));
							this.TotalMatchJobs.push(response['count'][i])
						}
					}else{
						for(let i=0;i<response['count'].length;i++){
							var idVal = parseInt(response['count'][i]['id']);
							
							var temp = this.jobID.filter(function(a,b){ return a == idVal})
							if(temp.length!=0){
								idVal = parseInt(temp[0]);
								temp = response['count'].filter(function(a,b){ return a.id == idVal});
								if(temp.length!=0){
									/* if(this.TotalMatchJobs.length!=0){
										temp[0]['match_select']=this.TotalMatchJobs[0]['match_select'];
									}
									temp[0]['score']=temp[0]['score'].toFixed(1); */
									for(let j=0;j<temp.length;j++){
										if(typeof temp[j]['score'] != 'string'){

											if(this.TotalMatchJobs.length!=0){
												//temp[j]['match_select']=this.TotalMatchJobs[0]['match_select'];
											}
											temp[j]['score']=parseFloat(temp[j]['score'].toFixed(1));
											this.TotalMatchJobs.push(temp[j]);
											response['count'][i]['skills']=this.utilsHelperService.differenceByPropValArray(response['count'][i]['skills'], response['count'][i]['hands_on_experience'], 'skill_id')
											
										}
									}
								}
							}
							
						}
					}
				}
				if(this.TotalMatchJobs && this.TotalMatchJobs.length && this.TotalMatchJobs.length > 0) {
					//this.TotalMatchJobs = this.TotalMatchJobs.sort((a,b)=> { return a.score - b.score });
					
				}
				if(response && response['count'] && response['count'].length > 0) {
					//response['count'] = response['count'].sort((a,b)=> { return a.score - b.score });
					this.postedJobsMatchDetails=response['count'];
				}
				this.ShowData()
				
			}, error => {
			}
		)
	}
	
	
	/**
	**	To Show the user details
	**/
	
	ShowData(){
	  
		  if(this.TotalMatchJobs.length==1){
			   this.isMultipleMatches = false;
			  this.matchingJob.jobs = this.TotalMatchJobs[0];
			  this.loading = true;
		  }else if(1<this.TotalMatchJobs.length){
			  this.isMultipleMatches = true;
			  this.pageCount = 1;
			  this.page = 1;
			  this.matchingJob.jobs = this.TotalMatchJobs[0];
			  //this.matchingJobNew.jobs = this.TotalMatchJobs[1];
			  this.loading = true;
		  }
	}
	
	/**
	**	To next and previous button clicks
	**/
	
	onChangeUserr = (type) => {
	
		const count = this.TotalMatchJobs.length;
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
				if(this.TotalMatchJobs[this.pageCount]){
				    
					this.matchingJob.jobs = this.TotalMatchJobs[this.pageCount];
					this.pageCount = this.pageCount+1;
					this.page++;
				}else{
					this.matchingJob={};
				}
				/*if(this.TotalMatchJobs[this.pageCount]){
					//this.matchingJobNew.jobs = this.TotalMatchJobs[this.pageCount];
					this.pageCount = this.pageCount+1;
					this.page++;
				}else{
					this.matchingJobNew={}
				}*/
			}
		} else if (type == 'prev' && this.pageCount > 1) {
			this.pageCount = this.pageCount-1;
			/*if(this.TotalMatchJobs[this.pageCount-1]){
				
				this.matchingJobNew.jobs = this.TotalMatchJobs[this.pageCount-1];
				this.page--;
			}else{
				this.matchingJobNew={}
			}*/
			//!this.isEven(this.page) && this.page--;
			 nxt1.classList.add("slidearight")
		   // nxt.classList.add("slidearight")
			setTimeout(()=>{
			//nxt.classList.remove('slidearight')
		    nxt1.classList.remove('slidearight')
			},1000)
			//this.pageCount = this.pageCount-1;
			if(this.TotalMatchJobs[this.pageCount-1]){
				this.matchingJob.jobs = this.TotalMatchJobs[this.pageCount-1];
				this.page--;
				//!this.isEven(this.pageCount) && this.pageCount++;
			}else{
				this.matchingJob={};
			}
		}
    }
	
	/**
	**	To check the even or not
	**/
	
	isEven = (num) => {
		if(num % 2 == 0) {
		  return true;
		}

		return false;
	}
	
	/**
	**	To click the prevoius page
	**/
	
	onRedirectBack = () => {
		//this.location.back();
		if(this.employeePath =='userscoring'){
			this.router.navigate(['/employer/job-candidate-matches/details/view']);
		}else{
			this.router.navigate(['/employer/candidate-profile']);
		}
	}

	/**
	**	To Open job descriprion popup
	**/
	
	onToggleJDModal = (status,description) => {
		this.isOpenedJDModal = status;
		this.description = description;
	}

	/**
	**	To check the resume status popup
	**/
	
	onToggleResumeSelectModal = (status, item?) => {
		if (!this.utilsHelperService.isEmptyObj(item)) {
			this.currentJobDetails = item;
		}
		this.isOpenedResumeSelectModal = status;
	}

	/**
	**	To Check the send mail popup status
	**/
	
	onToggleSendMail = (status, item?) => {
		if (item && !this.utilsHelperService.isEmptyObj(item)) {
			this.postedJobsDetails = item;
			this.currentUserInfo = this.userInfo;
		}
		//this.isOpenedSendMailModal = status;
		if(status ==true && !item){
			this.isOpenedSendMailModal = false;
		}else{
			this.isOpenedSendMailModal = status;
		}
		if(status == false){
			if(this.postedJobsDetails['id']==this.matchingJob['jobs']['id']){
				this.matchingJob['jobs']['mail'] =true;
			}else{
				this.matchingJobNew['jobs']['mail'] =true;
			}
			
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
	
	/**
	**	Resize the window change the layout
	**/
	
	@HostListener('window:resize', ['$event'])  
	onResize(event) {  
		this.screenWidth = window.innerWidth;  
	}
	
}	
