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

  ngOnInit(): void {
	  
	  //this.onGetCountry('');
	 // this.onGetLanguage('');
	  
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
	  sessionStorage.clear();
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
  
  onGetPostedJob() {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 10000;
    requestParams.expand = '';
    requestParams.skills_filter = 'false';
    requestParams.work_authorization = '';
    requestParams.visa_sponsered = false;
	
    if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == true ) {
      requestParams.work_authorization = this.userInfo.work_authorization;
      requestParams.visa_sponsered = this.userInfo.visa_sponsered;
	  
		  requestParams.city = [this.userInfo.city];
	  
	  if(this.userInfo && this.userInfo.preferred_locations) {
			if(this.userInfo.preferred_locations.length !=0) {
				var temp:any[]= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
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
				var temp:any[]= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
				if(temp.length!=0){
					var temp=temp.map(function(a,b){ return a.country});
				}
				if(this.userInfo && this.userInfo.authorized_country && this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
					var authorized_countrys= this.nationality.filter((el) => {
						  return this.userInfo.authorized_country.some((f) => {
							return f === el.id ;
						  });
					});
					if(authorized_countrys.length !=0){
						authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
						temp = temp.concat(authorized_countrys);
					}
					
				}
				
				if(temp.length!=0){
					var tempData=temp;
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
						tempData = tempData.concat(EUCountry);
					}
					tempData[tempData.length]=this.userInfo.country;
					tempData =tempData.filter(function(item, pos) {
								return tempData.indexOf(item) == pos;
							})
					if(tempData && tempData.length){
						requestParams.country = tempData.join(',');
					}
				}
			} else if(this.userInfo.authorized_country && this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
				var authorized_countrys= this.nationality.filter((el) => {
						  return this.userInfo.authorized_country.some((f) => {
							return f === el.id ;
						  });
					});
					if(authorized_countrys.length !=0){
						authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
					}
				var temp:any[] = authorized_countrys ; 
				if(temp.length!=0){
					var tempData=temp;
					if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
						var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
						'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
						'france','poland','germany','portugal','greece','slovakia','hungary',
						'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
						]
						tempData = tempData.concat(EUCountry);
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
    } else{
		if(this.userInfo && this.userInfo.authorized_country && this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
				
			var authorized_countrys= this.nationality.filter((el) => {
						  return this.userInfo.authorized_country.some((f) => {
							return f === el.id ;
						  });
					});
					if(authorized_countrys.length !=0){
						authorized_countrys = authorized_countrys.map(function(a,b){ return a.nicename.toLowerCase()});
					}
				var temp:any[] = authorized_countrys ; 
			if(temp.length!=0){
				var tempData=temp;
				if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
					var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
					'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
					'france','poland','germany','portugal','greece','slovakia','hungary',
					'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
					]
					tempData = tempData.concat(EUCountry);
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

    if(this.queryParams && this.queryParams.skills && this.queryParams.skills.length) {
      const tempSkill = (this.queryParams && this.queryParams.skills) ? this.queryParams.skills.split(',') : [];
      //const tempSkillsMerged = [...this.userInfo.skills, ...tempSkill];
      const tempSkillsMerged = [...tempSkill];
      if(tempSkillsMerged && tempSkillsMerged.length) {
		  if(this.userInfo.hands_on_experience && this.userInfo.hands_on_experience.length){
			for(let i=0;i<this.userInfo.hands_on_experience.length;i++){
				if(this.userInfo.hands_on_experience[i]['skill_id']  &&this.userInfo.hands_on_experience[i]['skill_id'] !=''){
					//tempSkillsMerged.push(this.userInfo.hands_on_experience[i]['skill_id']);
				}
				
			}
			
		}
		  
        const removedDuplicates = tempSkillsMerged.filter( function( item, index, inputArray ) {
          return inputArray.indexOf(item) == index;
        });

        requestParams.skills = removedDuplicates.join(',')
        requestParams.skills_filter = 'true';
      }

    }
		if(this.userInfo && this.userInfo.job_type) {
			requestParams.type = this.userInfo.job_type;
			if(requestParams.type && requestParams.type.length) {
			  requestParams.type = requestParams.type.join(',')
			}
		}
if(this.userInfo && this.userInfo.experience) {
      requestParams.max_experience = this.userInfo.experience;
    }
	
    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.employerService.getPostedJob(removeEmpty).subscribe(
      response => {
		  
        if(response['country']){
			var postedJobCountry =[];
			var tempLen = response['country'].map(function(a,b){ return a.country} );
			tempLen = tempLen.filter(function(item, pos) { return tempLen.indexOf(item) == pos; })
			for(let i=0;i<tempLen['length'];i++){
				var tempcountry = tempLen[i];
				var filter = response['country'].filter(function(a,b){ return a.country.toLowerCase() == tempcountry.toLowerCase() }).length
				postedJobCountry.push({count:filter,country:tempcountry});
			}
			response['country'] = postedJobCountry ;
			var TotalValue =response['country'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
			
			if(document.getElementById('matchesCountValue')){
				document.getElementById('matchesCountValue').innerHTML="("+TotalValue+")";
			}
			 
		 }else{
			 if(document.getElementById('matchesCountValue')){
				document.getElementById('matchesCountValue').innerHTML="(0)";
			}
		 }
		
       
      }, error => {
      }
    )
  }
  
  refreshCountDetails = (status) => {
    if(status ==true){
		this.onGetAppliedJobs();
		this.onGetShortListJobs();
	}
  }
  
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
  OpenAddResume(){
	  this.toggleresumeSelectModal = true;
	  this.mbRef.close()
  }

}
