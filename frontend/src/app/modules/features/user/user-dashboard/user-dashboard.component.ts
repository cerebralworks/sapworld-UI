import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
		tabName: 'Profile',
		tabNumber: 1
	};
	public toggleResumeModal: boolean;
	public dashboardView: boolean = false;
	public dashboardViewAPI: boolean = false;
	public toggleresumeSelectModal: boolean = false;
	@ViewChild('deleteModal', { static: false }) deleteModal: TemplateRef<any>;
	public mbRef: NgbModalRef;
	public queryParams: any = {};
	public userInfo:any;
	public nationality:any[]=[];
	
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
	) { }
	
	/**
	**	To initialize the view the function calls
	**/
	
	ngOnInit(): void {
		this.dataService.getCountryDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
					this.nationality = response;
				}
			}
		);
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
				default:
					break;
			}
		}
	}

	validateOnPrfile = 0;
	
	/**
	** 	To check the data's in any changes happens in the page
	**/
	
	ngDoCheck(): void {
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
	**	To function calls while the page leaves
	**/
	
	ngOnDestroy(): void {
		this.toggleResumeModal = false;
		this.dataService.clearProfileCompletion()
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
				if(response && response['meta'] && response['meta']['total'] ) {
					if(document.getElementById('appliedCountValue')){
						document.getElementById('appliedCountValue').innerHTML="("+response['meta']['total']+")";
					}
				}
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
		requestParams.sort = 'created_at.desc';
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

}
