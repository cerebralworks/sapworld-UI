import { Component, OnInit,HostListener } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router ,NavigationStart} from '@angular/router';
import { tabInfo } from '@data/schema/create-candidate';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { LocationStrategy } from '@angular/common';
@Component({
  selector: 'app-employer-dashboard',
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.css']
})
export class EmployerDashboardComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	public currentTabInfo: tabInfo = {
		tabName: 'dashboard',
		tabNumber: 6
	};
	public isOpenedSendMailModal: any;
	public queryParams: any = {};
	public employeeData:any = {};
	public getDataCount:boolean =false;
	public screenWidth: any;
    public checkDB : boolean = false;
	constructor(
		private route: ActivatedRoute,
		public router: Router,
		private sharedApiService: SharedApiService,
		private employerSharedService: EmployerSharedService,
		private employerService: EmployerService,
		private utilsHelperService: UtilsHelperService,
		private LocationStrategy : LocationStrategy
	){
		if(this.route.snapshot.queryParamMap.get('empids')==null){
		   this.loadEmp();
		}
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};

		this.route.queryParams.subscribe(params => {
		   if(Object.keys(params).length === 0){
		     this.checkDB = true;
			 sessionStorage.clear();
		   }
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				this.queryParams = {...params}
			}
		});
	}
	
	
	/**To get Employer details*/
	
	loadEmp(){
	this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				if(details) {
					this.employeeData = details;
					if(details && details.id && this.getDataCount == false) {
						this.onGetPostedJobCount(details.id);
						this.onGetAppliedJobCount(details.id);
						this.onGetShortListJobCount(details.id);  
						this.onGetSavedProfile();
						this.onGetJobCount(details.id);
						this.getDataCount =true;
					}
				}
			}
		)
	}
	
	/**
	**	When page loads function triggers
	**	TO checking switching tabs
	**/
	
	ngOnInit(): void {	
	  this.screenWidth = window.innerWidth;	
		const activeTab = this.route.snapshot.queryParamMap.get('activeTab');
		if(activeTab) {
			switch (activeTab) {
				case 'postedJobs':
				  this.onTabChange({tabName: 'postedJobs', tabNumber: 1})
				  break;
				case 'matches':
				  this.onTabChange({tabName: 'matches', tabNumber: 2})
				  break;
				case 'applicants':
				  this.onTabChange({tabName: 'applicants', tabNumber: 3})
				  break;
				case 'shortlisted':
				  this.onTabChange({tabName: 'shortlisted', tabNumber: 4})
				  break;
				case 'savedProfile':
				  this.onTabChange({tabName: 'savedProfile', tabNumber: 5})
				  break;
				case 'dashboard':
				  this.onTabChange({tabName: 'dashboard', tabNumber: 6})
				  break;
				default:
				  break;
			}
		}
	}

	/**
	**	TO Change the tabs via params
	**/
	
	onTabChange = (tabInfo: tabInfo) => {
		this.currentTabInfo = tabInfo;
		const navigationExtras: NavigationExtras = {
			queryParams: {...this.queryParams, activeTab: tabInfo.tabName}
		};
        this.router.navigate([], navigationExtras);
	}

	/**
	**	To Check the send mail popup status
	**/
	
	onToggleSendMail = (status) => {
		this.isOpenedSendMailModal = status;
	}
	 
	/**
	**	TO Get the posted job details count
	**/
	 
	onGetPostedJobCount(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.status = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('MatchesCount')){
						document.getElementById('MatchesCount').innerHTML="("+TotalValue+")";
					}			
				}else{
					if(document.getElementById('MatchesCount')){
						document.getElementById('MatchesCount').innerHTML="(0)";
					}
				}
			}, error => {
			}
		)
	}
	
	/**
	**	TO Get the Applied job details count
	**/
	 
	onGetAppliedJobCount(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.status = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.view = 'applicants';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('ApplicantsCount')){
						document.getElementById('ApplicantsCount').innerHTML="("+TotalValue+")";
					}			
				}else{
					if(document.getElementById('ApplicantsCount')){
						document.getElementById('ApplicantsCount').innerHTML="(0)";
					}
				}
			}, error => {
			}
		)
	}
	
	/**
	**	TO Get the posted job details count
	**/
	 
	onGetShortListJobCount(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.status = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.view = 'shortlisted';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('ApplicantsShortListCount')){
						document.getElementById('ApplicantsShortListCount').innerHTML="("+TotalValue+")";
					}			
				}else{
					if(document.getElementById('ApplicantsShortListCount')){
						document.getElementById('ApplicantsShortListCount').innerHTML="(0)";
					}
				}
			}, error => {
			}
		)
	}
  
	/**
	**	TO refresh employee job details count
	**/
	 
	refreshCountDetails = (status) => {
		if(status ==true){
			if(this.employeeData && this.employeeData.id) {
				this.onGetAppliedJobCount(this.employeeData.id);
				this.onGetShortListJobCount(this.employeeData.id);
				this.onGetSavedProfile();
				this.onGetJobCount(this.employeeData.id);
			}
		}
	}
	
	/**
	**	TO Get the saved profile details count
	**/
	 
	onGetSavedProfile = (searchString?: string) => {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 100000;
		requestParams.status = 1;
		if (searchString) {
		  requestParams.search = searchString;
		}
		this.employerService.savedProfiles(requestParams).subscribe(
			response => {
				if(response['meta']['total']){
					var TotalValue = response['meta']['total'];
					if(document.getElementById('SavedCount')){
						document.getElementById('SavedCount').innerHTML="("+TotalValue+")";
					}				
				}else{
					if(document.getElementById('SavedCount')){
						document.getElementById('SavedCount').innerHTML="(0)";
					}
				}
			}, error => {
			}
		)
	}
	
	
	/**
	**	TO Get the postedJobs count
	**/
	 
	onGetJobCount(companyId){
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 100000;
		requestParams.view = 'postedJobs';
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				if(response['meta']['total']){
					var TotalValue = response['meta']['total'];
					if(document.getElementById('PostedJobs')){
						document.getElementById('PostedJobs').innerHTML="("+TotalValue+")";
					}				
				}else{
					if(document.getElementById('PostedJobs')){
						document.getElementById('PostedJobs').innerHTML="(0)";
					}
				}
			},error => {
			}
		)
	}
	
	@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
   if(this.checkDB === true){
	 window.history.forward();
	 }
	 if(this.queryParams['activeTab']==='postedJobs' || this.queryParams['activeTab']==='matches'){
      setTimeout(()=>{
		this.router.navigate(['/employer/dashboard']);
		
		})
		
	}
  }
}
