import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewChild,HostListener } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { tabInfo } from '@data/schema/create-candidate';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@shared/service/data.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { UserService } from '@data/service/user.service';
import { EmployerService } from '@data/service/employer.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, DoCheck, OnDestroy {
	
	/**
	**	Variable declaration 
	**/
	
	public currentTabInfo: tabInfo = {
		tabName: 'chart',
		tabNumber: 7
	};
	public toggleResumeModal: boolean;
	public dashboardView: boolean = false;
	public dashboardViewAPI: boolean = false;
	public toggleresumeSelectModal: boolean = false;
	public nomatchmodel: boolean = false;
	public toggleMatchesModal: boolean = false;
	@ViewChild('deleteModal', { static: false }) deleteModal: TemplateRef<any>;
	@ViewChild('noMatchModal', { static: false }) noMatchModal: TemplateRef<any>;
	@ViewChild('matchesModal', { static: false }) matchesModal: TemplateRef<any>;
	public mbRef: NgbModalRef;
	public mbRefs: NgbModalRef;
	public mbRefss: NgbModalRef;
	public queryParams: any = {};
	public userInfo:any;
	public nationality:any[]=[];
	public screenWidth: any;
	public checkDB : boolean = false;
	public applicantCouuntDetails:any = 0;
	constructor(
		private route: ActivatedRoute,
		private userSharedService: UserSharedService,
		private router: Router,
		private dataService: DataService,
		private modelService: NgbModal,
		private userService: UserService,
		private sharedApiService: SharedApiService,
		private employerService: EmployerService,
		private utilsHelperService: UtilsHelperService
	) { 
	
	}
	
	/**
	**	To initialize the view the function calls
	**/
	
	ngOnInit(): void {
	  this.screenWidth = window.innerWidth;	
		this.dataService.getCountryDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
					this.nationality = response;
				}
			}
		);
		
		
		if(this.route.snapshot.queryParams['nomatch']=='true' || this.route.snapshot.queryParams['nomatch']===true){
		       this.nomatchmodel = true;
				setTimeout(() => {
					this.mbRefss = this.modelService.open(this.noMatchModal, {
						windowClass: 'modal-holder',
						centered: true,
						backdrop: 'static',
						keyboard: false
					});
				});
		     
		}
		this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				if(response){
					this.userInfo = response;
					if(response.profile_completed){
						if(response.profile_completed == false  ){
							this.dashboardView = false;
							this.router.navigate(['/user/create-candidate']);
						}else{
							this.dashboardView = true; 
							if(this.dashboardViewAPI ==false){
								this.onGetAppliedJobs();
								this.onGetShortListJobs();
								this.onGetPostedJob();
								this.dashboardViewAPI =true;
							}
						}
					}
				}
			}
		)
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
		const activeTab = this.route.snapshot.queryParamMap.get('activeTab');
		if(activeTab) {
			switch (activeTab) {
				case 'profile':
					this.onTabChange({tabName: 'profile', tabNumber: 1})
					break;
				case 'matches':
					this.onTabChange({tabName: 'matches', tabNumber: 2})
					break;
				case 'visaSponsored':
					this.onTabChange({tabName: 'visaSponsored', tabNumber: 3})
					break;
				case 'applied':
					this.onTabChange({tabName: 'applied', tabNumber: 4})
					break;
				case 'shortlisted':
					this.onTabChange({tabName: 'shortlisted', tabNumber: 5})
					break;
				case 'resume':
					this.onTabChange({tabName: 'resume', tabNumber: 6})
					break;
				case 'chart':
					this.onTabChange({tabName: 'chart', tabNumber: 7})
					break;
				default:
					break;
			}
		}
	}
	
	/***To close No match popup **/
	
	closeNoMatch(){
		this.mbRefss.close();
		this.nomatchmodel=false;
		this.router.navigate(['/user/dashboard'],{queryParams:{activeTab:'matches'}})
	}

	validateOnPrfile = 0;
	
	/**
	** 	To check the data's in any changes happens in the page
	**/
	
	ngDoCheck(): void {
		const profileCompletionValue = this.dataService.getProfileCompletion();
		const matchesCompletionValue = this.dataService.getMatchesCompletion();
		if(matchesCompletionValue == false){
			if(profileCompletionValue && this.validateOnPrfile == 0) {
				this.toggleResumeModal = true;
				setTimeout(() => {
					this.onOpenResumeModal()
				});
				this.validateOnPrfile ++;
			}
		}else{
			if(matchesCompletionValue == true && this.validateOnPrfile == 0) {
				this.dataService.clearMatchesCompletion();
				this.toggleMatchesModal = true;
				setTimeout(() => {
					this.mbRefs = this.modelService.open(this.matchesModal, {
						windowClass: 'modal-holder',
						centered: true,
						backdrop: 'static',
						keyboard: false
					});
				});
				this.validateOnPrfile ++;
			}
		}
		
	}
	
	/**
	**	To open the resume title popup 
	**/
		
	onOpenResumeModal = () => {
		if (this.toggleResumeModal) {
			this.mbRef = this.modelService.open(this.deleteModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
		}
	}
	
	/**
	** To close the matches View
	**/
	
	closeMatches(){
		this.toggleMatchesModal = false;
		this.mbRefs.close();
		this.validateOnPrfile= 0;
		const profileCompletionValue = this.dataService.getProfileCompletion();
		if(profileCompletionValue && this.validateOnPrfile == 0) {
			this.toggleResumeModal = true;
			setTimeout(() => {
				this.onOpenResumeModal()
			});
			this.validateOnPrfile ++;
		}
	}
	
	/**
	** To navigte matches
	**/
	
	navigateMatches(){
		this.mbRefs.close();
		this.router.navigate(['/user/dashboard'], {queryParams: {activeTab: 'matches'}})
	}
	/**
	**	To function calls while the page leaves
	**/
	
	ngOnDestroy(): void {
		this.toggleResumeModal = false;
		this.dataService.clearProfileCompletion()
		this.dataService.clearMatchesCompletion()
		this.validateOnPrfile = null;
	}
	
	/**
	**	To change the function triggers
	**/
	
	onTabChange = (tabInfo: tabInfo) => {
		sessionStorage.clear();
		this.currentTabInfo = tabInfo;
		const navigationExtras: NavigationExtras = {
			queryParams: {...this.queryParams, activeTab: tabInfo.tabName}
		};
		this.router.navigate([], navigationExtras);
	}
  
	/**
	**	To Get the applied jobs Count
	**/	
	  
	onGetAppliedJobs = () => {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 100000;
		//requestParams.expand = "job_posting,user,employer";
		this.userService.applicationsListForUser(requestParams).subscribe(
			response => {
				this.applicantCouuntDetails=response['meta']['total'];
				/*if(response && response['meta'] && response['meta']['total'] ) {
					if(document.getElementById('appliedCountValue')){
						document.getElementById('appliedCountValue').innerHTML="("+response['meta']['total']+")";
					}
				}*/
			}, error => {
			}
		)
	} 
	
	/**
	**	To Get the Shortlist jobs Count
	**/	
	  
	onGetShortListJobs = () => {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 100000;
		requestParams.short_listed = 1;
		//requestParams.expand = "job_posting,user,employer";
		this.userService.applicationsListForUser(requestParams).subscribe(
			response => {
				if(response && response['meta'] && response['meta']['total'] ) {
					if(document.getElementById('shortlistedJob')){
						document.getElementById('shortlistedJob').innerHTML="("+response['meta']['total']+")";
					}
				}
			}, error => {
			}
		)
	}
  
	/**
	**	To Get the matches jobs Count
	**/	
	 
	onGetPostedJob() {
		let requestParams: any = {};
		requestParams.view = 'users';
		requestParams.company = this.userInfo.id;
		requestParams.visa_sponsered = false;
		requestParams.is_user_get = false;
		requestParams.sort = 'created_at.desc';
		if( this.userInfo &&  this.userInfo.visa_sponsered){
			requestParams.visa_sponsered = this.userInfo.visa_sponsered;
		}
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('matchesCountValue')){
						document.getElementById('matchesCountValue').innerHTML="("+TotalValue+")";
					}			
				}else{
					if(document.getElementById('matchesCountValue')){
						document.getElementById('matchesCountValue').innerHTML="(0)";
					}
				}
			}, error => {
				if(document.getElementById('matchesCountValue')){
						document.getElementById('matchesCountValue').innerHTML="(0)";
					}
			}
		)
	}
	  
	/**
	**	To refresh jobs Count
	**/	
	  
	refreshCountDetails = (status) => {
		if(status ==true){
			this.onGetAppliedJobs();
			this.onGetShortListJobs();
		}
	}
  
	/**
	**	To open the resume in popup view
	**/	
	  
	onToggleResumeSelectModal(status){
		if(status==true){			
			this.userService.profile().subscribe(
			  response => {
					if(response['details']){
						this.userInfo = response['details'];
						this.userInfo['meta'] = response['meta'];
						//this.userSharedService.clearUserProfileDetails();
						this.userSharedService.saveUserProfileDetails(this.userInfo);
					}
				}, error => {
					//this.modalService.dismissAll();
				}
			)
		}
	}
	
	/**
	**	To Open add resume popup
	**/	
	  
	OpenAddResume(){
		this.toggleresumeSelectModal = true;
		this.mbRef.close()
	}
	
	goBack(){
	if(this.queryParams['activeTab']==='matches'){
		this.router.navigate(['/user/dashboard']);
		return false;
	}else{
	   window.history.go(-1); 
	   return false;
	}
	
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
   if(this.queryParams['activeTab']==='matches' || this.queryParams['activeTab']==='applied'){
   setTimeout(()=>{
		this.router.navigate(['/user/dashboard']);
		})
	}
  }
}
