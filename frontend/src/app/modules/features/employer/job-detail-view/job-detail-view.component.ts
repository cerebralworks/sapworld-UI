import { Location} from '@angular/common';
import { Component, OnInit,HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized ,NavigationStart} from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { GetResponse } from '@data/schema/response';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { filter, pairwise } from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import { SharedApiService } from '@shared/service/shared-api.service';


@Component({
  selector: 'app-job-detail-view',
  templateUrl: './job-detail-view.component.html',
  styleUrls: ['./job-detail-view.component.css']
})
export class JobDetailViewComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/	
	
	public screenWidth: any;
	public isOpenedJDModal: boolean = false;
	public postedJobsDetails: any = {};
	public skills: GetResponse;
	public industries: GetResponse;
	public loggedUserInfo: LoggedIn;
	public previousUrl: string;
	public postedJobs: any[] = [];
	public postedJobMeta: any = {};
	public selectedColor: any = [];
	public companyIdValue: any = '';
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [10, 25,50,100];
	CommonColor = ["blue","orange","purple","red","yallow","dblue","green"];
	public validateSubscribe: number = 0;
	public loading : boolean;
	public empID:any;
	constructor(
		public employerService: EmployerService,
		private route: ActivatedRoute,
		public sharedService: SharedService,
		private SharedAPIService: SharedApiService,
		private accountService: AccountService,
		private location: Location,
		public utilsHelperService: UtilsHelperService,
		private employerSharedService: EmployerSharedService,
		public router: Router
	) {
	   this.empID=this.route.snapshot.queryParamMap.get('empids');
	}

	/**
	**	TO initialize the Function triggers
	** To validate the params in the job details view
	**/
	 
	ngOnInit(): void {
	  this.screenWidth = window.innerWidth;	
		this.onGetSkills();
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
		this.route.queryParams.subscribe(params => {
		    
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				var decode = urlQueryParams.id.replaceAll(' ','+');
				if(urlQueryParams && urlQueryParams.id) {
					sessionStorage.setItem('view-job-id',this.utilsHelperService.decryptData(decode));
				}
			}
		});
		if(!this.router.url.includes('linkedin-share')){
		this.router.navigate([], {queryParams: {id: null}, queryParamsHandling: 'merge'});
	    }
		var jobId = 0;
		if(sessionStorage.getItem('view-job-id')){
			jobId = parseInt(sessionStorage.getItem('view-job-id'));
		}    
		if(jobId) {
			this.onGetPostedJobDetails(jobId);
			this.onGetSkill();
			this.onGetIndustries();
			this.onGetLanguage('');
		}
		if(this.empID==null){
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				if(details) {
					if((details && details.id) && this.validateSubscribe == 0) {
						this.companyIdValue = details.id;
						this.onGetPostedJob(details.id);
						this.validateSubscribe ++;
					}
				}
			}
		)
		}else{
			 this.companyIdValue = this.empID;
			 this.onGetPostedJob(this.empID);
		}
		this.accountService
		.isCurrentUser()
		.subscribe(response => {
			this.loggedUserInfo = response;
		});
	}
	
	goNavigate(){
	     var jobId=sessionStorage.getItem('view-job-id');
	      if(this.loggedUserInfo.role.includes(1) && this.router.url.includes('linkedin-share')){
			  this.router.navigate(['/employer/job-detail-view/details'], { queryParams: { id: jobId } })
			}else if(this.loggedUserInfo.role.includes(0) && this.router.url.includes('linkedin-share')){
			   this.router.navigate(['/user/job-matches/details'], {queryParams: {'id': jobId }});
			}else{
			 sessionStorage.setItem('linkedin',this.utilsHelperService.encryptData(jobId));
			 this.router.navigate(['/'])
			}
	
	}
	
	/**
	**	To back button triggers
	**	Assign set pathname
	**/
	 
	onRedirectBack = () => {
		if(this.loggedUserInfo.isLoggedIn && this.loggedUserInfo.role.includes(1)) {
		    sessionStorage.clear();
			this.router.navigate(['/employer/dashboard'], {queryParams: {activeTab: 'postedJobs'}})
		}else if(this.router.url.includes('admin')){
		this.router.navigate(['/admin/employer-dashboard'], {queryParams: {activeTab: 'postedJobs','empids':this.empID}})
		}else {
			this.location.back();
		}
	}

	/**
	**	TO get the posted job details Count
	**/
	 
	onGetPostedJobDetails(jobId) {
		let requestParams: any = {};
		requestParams.expand = 'company';
		requestParams.id = jobId;
		if(this.empID !=null){
		 requestParams.emp_id=this.empID;
		}else if(this.router.url.includes('linkedin-share')){
		 requestParams.jobshare=true;
		}
		this.employerService.getPostedJobDetails(requestParams).subscribe(
			response => {
				if(response && response.details) {
					this.postedJobsDetails = response.details;
					this.loading = true;
				}
			}, error => {
			this.router.navigate(['/employer/dashboard'],{queryParams:{activeTab:'postedJobs'}});
			}
		)
	}

	/**
	**	TO get the posted job details
	**/
	 
	onGetPostedJob(companyId) {
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'most_popular.desc';
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				this.postedJobs = [];
				if(response && response.items && response.items.length > 0) {
				  this.postedJobs = [...this.postedJobs, ...response.items];
				}
				this.postedJobMeta = { ...response.meta };
				this.length = this.postedJobMeta.total-1;
			}, error => {
			}
		)
	}

	/**
	**	To check the job description status
	**/
	 
	onToggleJDModal = (status) => {
		this.isOpenedJDModal = status;
	}

	/**
	**	To find the skills array from string
	**/
	 
	onFindSkillsFromID = (arrayValues: Array<any>) => {
		if(this.skills && this.skills.items && Array.isArray(this.skills.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
			const temp = this.skills.items.filter(r=> {
				return arrayValues.includes(r.id)
			});
			return this.onConvertArrayObjToString(temp, 'tag');
		}
		return '--';
	}

	/**
	**	TO get the domain array from string
	**/
	 
	onFindDomainFromID = (arrayValues: Array<any>) => {
		if(this.industries && this.industries.items && Array.isArray(this.industries.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
			const temp = this.industries.items.filter(r=> {
				return arrayValues.includes(r.id)
			});
			return this.onConvertArrayObjToString(temp, 'name');
		}
		return '--';
	}
	
	/**
	**	To get the skills array from string
	**/
	 
	onFindSkillsFromSingleID = (value: any) => {
		if(value && this.skills && this.skills.items && Array.isArray(this.skills.items)) {
			const temp = this.skills.items.find(r=> {
				return value == r.id
			});
			return temp;
		}
		return '--';
	}
	/**
	**	To get the skills array from string
	**/
	 
	onGetSkill() {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		this.employerService.getSkill(requestParams).subscribe(
			response => {
			this.skills = response;
			}, error => {
			}
		)
	}
	
	/**
	**	TO get the industries array from string
	**/
	 
	onGetIndustries() {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		this.employerService.getIndustries(requestParams).subscribe(
			response => {
				this.industries = response;
			}, error => {
			}
		)
	}
	
	/**
	**	TO Convert array from string
	**/
	 
	onConvertArrayToString = (value: any[]) => {
		if (!Array.isArray(value)) return "--";
		return value.join(", ");
	}
	
	/**
	**	To convert array to Object
	**/
	 
	onConvertArrayObjToString = (value: any[], field: string = 'name') => {
		if ((!Array.isArray(value) || value.length==0)) return "--";
		return value.map(s => s[field]).join(", ");
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
	**	To convert array from string
	**/
	 
	onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?:string) => {
		if (!Array.isArray(value) || value.length == 0) return "--";
		return value.map(s => {
			let element = this.onFindSkillsFromSingleID(s.domain);
			if(field && (element && element.tag)) {
				return element.tag + ' (' + s.experience + ' ' + s.experience_type + ')'
			}
		}).join(", ");
	}
	
	/**
	**	To split the new line data's
	**/
	 
	onSplitValueWithNewLine = (value: string) => {
		if (value == "" || value == "-") return "-";
		if (value) {
			let splitValue: any = value.split(",");
			splitValue = splitValue.join(", \n");
			return splitValue;
		}
	};
	
	/**
	**	To pagination changes
	**/ 
	
	handlePageEvent(event: PageEvent) {
		//this.length = event.length-1;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		this.onGetPostedJob(this.companyIdValue);
	}
	
	/**
	**	Class changing
	**/
	
	renderClassed(index){
		if(index){
			if(this.selectedColor.length ==0){
				this.selectedColor = ["blue","orange","purple","red","yallow","dblue","green"];
			}
			var returnVal = this.selectedColor[0];
			this.selectedColor.splice(0, 1);
			return returnVal;
		}
		//return 'blue';
	}
	
	/**
	**	To get the skill details
	**/
	  onGetSkills() {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.status = 1;
		requestParams.search = '';

		this.SharedAPIService.onGetSkill(requestParams);
		 
	  }
	  
	  /**
	**	To get the language details
	**/
	
	onGetLanguage(query) {
		let requestParams:any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.status = 1;
		requestParams.search = query;
		this.SharedAPIService.onGetLanguage(requestParams);
	}
	  
	  @HostListener('window:resize', ['$event'])
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
	this.router.events.subscribe((event: NavigationStart) => {
     if (event.navigationTrigger === 'popstate') {
	   this.router.navigate(['/employer/dashboard'], {queryParams: {activeTab: 'postedJobs'}});
     }
   });
  }

  }
