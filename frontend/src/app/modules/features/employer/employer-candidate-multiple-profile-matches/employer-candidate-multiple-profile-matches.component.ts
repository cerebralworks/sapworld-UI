import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  public missingElement: boolean = false;
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

  constructor(
    private route: ActivatedRoute,
    private userSharedService: UserSharedService,
    private userService: UserService,
    private location: Location,
    public utilsHelperService: UtilsHelperService,
    private employerService: EmployerService,
    public sharedService: SharedService,
    private router: Router) { }

  ngOnInit(): void {
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
	
	onGetCandidateInfo() {
		let requestParams: any = {};
		requestParams.id = this.userID;
		this.userService.profileView(requestParams).subscribe(
		response => {
			if(response && response.details) {
				this.userInfo = {...response.details, meta: response.meta};
				this.onGetPostedJobs(this.employeeID);
			}
		}, error => {
		})
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
	
    if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == true ) {
      requestParams.work_authorization = this.userInfo.work_authorization;
      requestParams.visa_sponsered = this.userInfo.visa_sponsered;
	  
		  requestParams.city = [this.userInfo.city];
	  
	  if(this.userInfo && this.userInfo.preferred_locations) {
			if(this.userInfo.preferred_locations.length !=0) {
				var temp= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
				if(temp.length!=0){
					var tempData=temp.map(function(a,b){ return a.city});
					tempData[tempData.length]=this.userInfo.city;
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
    if(this.userInfo && this.userInfo.country && this.userInfo.willing_to_relocate == true ) {
      requestParams.country = [this.userInfo.country];
	  if(this.userInfo && this.userInfo.preferred_locations ) {
			if(this.userInfo.preferred_locations.length !=0) {
				var temp= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
				if(this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
					//temp = temp.concat(this.userInfo.authorized_country);
				}
				
				if(temp.length!=0){
					var tempData=temp.map(function(a,b){ return a.country});
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
					}
					tempData[tempData.length]=this.userInfo.country;
					tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
					if(tempData && tempData.length){
						requestParams.country = tempData.join(',');
					}
				}
			}
	  }
    }
    if(this.userInfo && this.userInfo.skills && this.userInfo.skills.length) {
		var temps = [];
		if(this.userInfo.hands_on_experience && this.userInfo.hands_on_experience.length){
			for(let i=0;i<this.userInfo.hands_on_experience.length;i++){
				if(this.userInfo.hands_on_experience[i]['skill_id']  &&this.userInfo.hands_on_experience[i]['skill_id'] !=''){
					temps.push(this.userInfo.hands_on_experience[i]['skill_id']);
				}
				
			}
			
		}
      requestParams.skills = temps.join(',')
      requestParams.skills_filter = 'false';
    }

	
		if(this.userInfo && this.userInfo.job_type) {
			requestParams.type = this.userInfo.job_type;
			if(requestParams.type && requestParams.type.length) {
			  requestParams.type = requestParams.type.join(',')
			}
		}

	
    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.employerService.getPostedJob(removeEmpty).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
			this.postedJobsMatchDetails=response.items;
			if(this.employeePath =='userscoring'){
				this.TotalMatchJobs = this.postedJobsMatchDetails;
			}else{
				for(let i=0;i<this.jobID.length;i++){
					var idVal = parseInt(this.jobID[i]);
					var temp = this.postedJobsMatchDetails.filter(function(a,b){ return a.id == idVal})
					if(temp.length!=0){
						var score =4;
						var profile = temp[0]
						if (this.userInfo['work_authorization'] == profile.work_authorization) {
							score += 1;
						}
						if (this.userInfo['travel_opportunity'] <= profile.travel) {
							score += 1;
						}
						if (this.userInfo['job_type'] == profile.job_type) {
							score += 1;
						}
						if (this.userInfo['availability'] >= profile.availability) {
							score += 1;
						}
						if (this.userInfo['end_to_end_implementation'] <= profile.end_to_end_implementation) {
							score += 1;
						}
						temp[0]['score']=score;
						this.TotalMatchJobs.push(temp[0])
					}
				}
			}
			this.ShowData()
        }
       
      }, error => {
      }
    )
  }
  
	ShowData(){
	  
		  if(this.TotalMatchJobs.length==1){
			   this.isMultipleMatches = false;
			  this.matchingJob.jobs = this.TotalMatchJobs[0];
		  }else if(1<this.TotalMatchJobs.length){
			  this.isMultipleMatches = true;
			  this.pageCount = 2;
			  this.page = 2;
			  this.matchingJob.jobs = this.TotalMatchJobs[0];
			  this.matchingJobNew.jobs = this.TotalMatchJobs[1];
		  }
	  
	}
	

	onChangeUser = (type) => {
		const count = this.TotalMatchJobs.length

		if (type == 'next') {
			if (count > this.page) {
				if(this.TotalMatchJobs[this.pageCount]){
					this.matchingJob.jobs = this.TotalMatchJobs[this.pageCount];
					this.pageCount = this.pageCount+1;
					this.page++;
				}else{
					this.matchingJob={};
				}
				if(this.TotalMatchJobs[this.pageCount]){
					this.matchingJobNew.jobs = this.TotalMatchJobs[this.pageCount];
					this.pageCount = this.pageCount+1;
					this.page++;
				}else{
					this.matchingJobNew={}
				}
        
			}
		} else if (type == 'prev' && this.pageCount > 2) {
			this.pageCount = this.pageCount-1;
			if(this.TotalMatchJobs[this.pageCount-1]){
				
				this.matchingJobNew.jobs = this.TotalMatchJobs[this.pageCount-1];
				this.page--;
			}else{
				this.matchingJobNew={}
			}
			!this.isEven(this.page) && this.page--;
			this.pageCount = this.pageCount-1;
			if(this.TotalMatchJobs[this.pageCount-1]){
				this.matchingJob.jobs = this.TotalMatchJobs[this.pageCount-1];
				!this.isEven(this.pageCount) && this.pageCount++;
			}else{
				this.matchingJob={};
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
    //this.location.back();
	if(this.employeePath =='userscoring'){
		this.router.navigate(['/employer/job-candidate-matches/details/view']);
	}else{
		this.router.navigate(['/employer/candidate-profile']);
	}
  }

  onToggleJDModal = (status,description) => {
    this.isOpenedJDModal = status;
	this.description = description;
  }

  onToggleResumeSelectModal = (status, item?) => {
    if (!this.utilsHelperService.isEmptyObj(item)) {
      this.currentJobDetails = item;
    }
    this.isOpenedResumeSelectModal = status;
  }

  onToggleSendMail = (status, item?) => {
    if (item && !this.utilsHelperService.isEmptyObj(item)) {
      this.postedJobsDetails = item;
      this.currentUserInfo = this.userInfo;
    }
    this.isOpenedSendMailModal = status;
  }

}
