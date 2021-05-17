import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { tabInfo } from '@data/schema/create-candidate';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@shared/service/data.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedApiService } from '@shared/service/shared-api.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, DoCheck, OnDestroy {

  public currentTabInfo: tabInfo = {
    tabName: 'Profile',
    tabNumber: 1
  };
  public toggleResumeModal: boolean;
  public dashboardView: boolean = false;
  @ViewChild('deleteModal', { static: false }) deleteModal: TemplateRef<any>;
  public mbRef: NgbModalRef;
  public queryParams: any = {};

  constructor(
    private route: ActivatedRoute,
    private userSharedService: UserSharedService,
    private router: Router,
    private dataService: DataService,
    private modelService: NgbModal,
    private sharedApiService: SharedApiService,
    private utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
	  this.onGetCountry('');
	  this.onGetLanguage('');
	  this.userSharedService.getUserProfileDetails().subscribe(
		  response => {
			  if(response){
			  if(response.profile_completed){
			  if(response.profile_completed == false  ){
				this.dashboardView = false;
				this.router.navigate(['/user/create-candidate']);
			}else{
				this.dashboardView = true; 
			  }
			}else{
				this.dashboardView = true; 
			 }
			 }else{
				this.dashboardView = true; 
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

  ngOnDestroy(): void {
    this.toggleResumeModal = false;
    this.dataService.clearProfileCompletion()
    this.validateOnPrfile = null;
  }

  onTabChange = (tabInfo: tabInfo) => {
    this.currentTabInfo = tabInfo;
    const navigationExtras: NavigationExtras = {
      queryParams: {...this.queryParams, activeTab: tabInfo.tabName}
    };

    this.router.navigate([], navigationExtras);
  }
  
  onGetCountry(query) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.status = 1;
		requestParams.search = query;

		this.sharedApiService.onGetCountry(requestParams);
		 
	  }
	  
	  onGetLanguage(query) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.status = 1;
		requestParams.search = query;

		this.sharedApiService.onGetLanguage(requestParams);
	  }

}
