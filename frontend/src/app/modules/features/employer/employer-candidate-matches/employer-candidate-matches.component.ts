import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Location } from '@angular/common';
import { Component, OnDestroy,EventEmitter,Output, OnInit,Input } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import {PageEvent} from '@angular/material/paginator';
import { environment as env } from '@env';
@Component({
  selector: 'app-employer-candidate-matches',
  templateUrl: './employer-candidate-matches.component.html',
  styleUrls: ['./employer-candidate-matches.component.css']
})
export class EmployerCandidateMatchesComponent implements OnInit, OnDestroy {

  /**
  **	Variable Declaration
  **/
  
	@Input()screenWidth:any;
  @Output() onEvent = new EventEmitter<boolean>();
  
  public isOpenedResumeModal: boolean;
  public isOpenedSendMailModal: boolean;
  public filter_location: boolean =false;
  public page: number = 1;
  public limit: number = 10;
  length = 0;
  pageIndex = 1;
  pageSizeOptions = [10, 25,50,100];
  showFirstLastButtons = true;
  public countrySelect: boolean = false;
  public postedJobCountry: any = [];
  public Country: any = [];
  public userList: any[] = [];
  public countryFilterList: any[] = [];
  public userMeta: any;
  public userInfo: any;
  public currentUserInfo: CandidateProfile;
  public postedJobs: any[] = [];
  public TotalCount: any[] = [];
  public postedJobMeta: any;
  public selectedJob: any;
  public queryParams: any = { job_types: [], sort: ''};
  public experienceFilter: { value: {min: number, max: number}; text: string; }[];
  public minMaxExp: any[] = [];
  public skills: any[] = [];
  public customParseInt = parseInt
  public minValue: number = 100;
  public maxValue: number = 400;
  public options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min:</b> " + value;
        case LabelType.High:
          return "<b>Max:</b> " + value;
        default:
          return "$" + value;
      }
    }
  };
  public skillItems: any;
  public selectedResumeUrl: any;
  public selectedResume: any;
  public savedProfiles: any[] = [];
  public userListForCountry: any[] = [];
  public userListForCountryMeta: any;
  public countryCount: any = {};
  public selectCountry: string = "";
  public customObject: any = Object;
  public tempQueryParams: any = {};
  public loggedUserInfo: any;
  public randomNum: number;
  public userprofilepath :any;

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private userService: UserService,
    private employerSharedService: EmployerSharedService,
    private employerService: EmployerService,
    private location: Location,
    private toastrService: ToastrService,
    private accountService: AccountService
  ) {
    this.experienceFilter = [
      {value: {min: 0, max: 1}, text: ''},
      {value: {min: 1, max: 3}, text: '1 - 3'},
      {value: {min: 3, max: 5}, text: '3 - 5'},
      {value: {min: 5, max: 7}, text: '5 - 7'},
      {value: {min: 7, max: 10}, text: '7 - 10'},
      {value: {min: 10, max: 20}, text: '10 '}
    ]
	
	/**
	**	Validate the params value in routing strategy
	**/
	
    this.route.queryParams.subscribe(params => {
		this.selectedJob = sessionStorage.getItem('match-job-id');
		if(params && !this.utilsHelperService.isEmptyObj(params)) {
			let urlQueryParams = {...params};

			if(urlQueryParams && urlQueryParams.id) {
				sessionStorage.setItem('match-job-id',urlQueryParams.id);
				this.selectedJob = {id: urlQueryParams.id};
				if(urlQueryParams && urlQueryParams.location_id) {
					sessionStorage.setItem('location_id',urlQueryParams.location_id);
					this.selectedJob = {id: urlQueryParams.id,job_location:{id: urlQueryParams.location_id}};
				}
			}
			if(urlQueryParams && urlQueryParams.reset) {
				sessionStorage.clear();
			}

			const jobTypes = this.route.snapshot.queryParamMap.get('job_types');
			if(jobTypes) {
				var jobTypesSplited = new Array();
				jobTypesSplited = jobTypes.split(",");
				if(jobTypesSplited && jobTypesSplited.length) {
					for (let a in jobTypesSplited ) {
					  jobTypesSplited[a] = parseInt(jobTypesSplited[a], 10);
					}
					urlQueryParams.job_types = jobTypesSplited;
				}
			}

			const skillTags = this.route.snapshot.queryParamMap.get('skill_tags');
			if(skillTags) {
				let skillArray = new Array();
				skillArray = skillTags.split(",");
				if(skillArray && skillArray.length) {
					for (let a in skillArray ) {
					  skillArray[a] = parseInt(skillArray[a], 10);
					}
					this.skills = skillArray;
				}
			}

			const minExperience = this.route.snapshot.queryParamMap.get('min_experience');
			const maxExperience = this.route.snapshot.queryParamMap.get('max_experience');
			if(parseInt(minExperience) >= 0 && parseInt(maxExperience) >= 0) {
				const tempExp = this.experienceFilter.filter((val) => {
					return ((val.value.min >= parseInt(minExperience)) && (val.value.max <= parseInt(maxExperience)))
				})
				if(tempExp.length) {
					this.minMaxExp = [...tempExp]
				}
			}

			this.queryParams = {...this.queryParams, ...urlQueryParams };
		}
    });
		this.router.navigate([], {queryParams: {location_id: null,id: null,reset: null,job_location: null}, queryParamsHandling: 'merge'});
  }

	/**
	**	Initiallize the Component to get the employer profile
	**/
	
	validateSubscribe = 0;
	ngOnInit(): void {
		this.randomNum = Math.random();

		this.router.routeReuseStrategy.shouldReuseRoute = () => {
		  return false;
		};
		this.dataService.getSkillDataSource().subscribe(
		  response => {
			this.skillItems = response
		  }
		);

		this.employerSharedService.getEmployerProfileDetails().subscribe(
		  details => {
			if(details) {
			  if((details && details.id) && this.validateSubscribe == 0) {
				this.onGetPostedJobCount(details.id);
				this.onGetPostedJob(details.id);				
				this.validateSubscribe ++;
			  }
			}
		  }
		)
		// this.onGetCandidateListForCountry();

		this.accountService
		  .isCurrentUser()
		  .subscribe(response => {
			this.loggedUserInfo = response;
		  });

	}

	/**
	**	When any change accoured the docheck calls
	**/
	
	ngDoCheck(): void {
		this.tempQueryParams = {...this.queryParams}
	}

	/**
	**	Resume Filter to get the default resume URL
	**/
	
	onGetFilteredValue(resumeArray: any[]): any {
		if(resumeArray && Array.isArray(resumeArray)) {
		  const filteredValue = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1);
		  if(!this.utilsHelperService.isEmptyObj(filteredValue)) {
			return this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1).file;
		  }
		  const filteredValues = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 0);
		  if(!this.utilsHelperService.isEmptyObj(filteredValues)) {
			return filteredValues.file;
		  }
		}
		return "";
	}
	
	/**
	**	When the component leaves to next component or new page
	**/
	
	ngOnDestroy(): void {
		this.validateSubscribe = null;
	}
	
	/**
	**	To set the job to get candidates
	**/
	 
	onSetJob = (item) =>{
		this.Country=[];
		this.countrySelect=false;
		this.page=1;
		this.limit=10;
		this.resetData();
		this.clearFilters();
		this.selectedJob = item;
		sessionStorage.setItem('match-job-id',this.selectedJob.id);
		//sessionStorage.setItem('location_id',this.selectedJob['job_location']['id']);
		if(this.selectedJob && this.selectedJob.id) {
			this.userList = [];
			// const removeEmpty = this.utilsHelperService.clean(this.queryParams);
			// let url = this.router.createUrlTree(['/employer/dashboard'], {queryParams: {...removeEmpty, id: this.selectedJob.id}, relativeTo: this.route}).toString();
			//this.location.go(url);
			const navigationExtras: NavigationExtras = {
				queryParams: {activeTab:'matches', 'id': this.selectedJob.id}
			};	
			//this.onGetCandidateList(this.selectedJob.id);
			//this.router.navigate([], navigationExtras);
			this.onGetCandidateList(this.selectedJob.id);
		}
	}
	
	/**
	**	To list the country for the selected job
	**/
	
	onGetCandidateListForCountry() {
		let requestParams: any = {...this.queryParams};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.status = 1;
		requestParams.city = (this.selectedJob&& this.selectedJob.city )? this.selectedJob.city : '';
		if(requestParams.job_types && requestParams.job_types.length) {
			requestParams.job_types = requestParams.job_types.join(',')
		}
		const removeEmpty = this.utilsHelperService.clean(requestParams)
		this.userService.getUsers(removeEmpty).subscribe(
		response => {
			if(response && response.items && response.items.length > 0) {
				const userListForCountry = [...response.items];
				userListForCountry.map((value, index) => {
					if(value.country) {
						this.userListForCountry.push(value.country);
					}
				});
				this.userListForCountry.forEach((i) => { this.countryCount[i] = (this.countryCount[i]||0) + 1;});
				this.userListForCountry = this.userListForCountry.filter( function( item, index, inputArray ) {
				return inputArray.indexOf(item) == index;
				});
			}
			this.userListForCountryMeta = { ...response.meta };
		}, error => {
		}
		)
	}

	/**
	**	Change the country select values
	**/
	
	onChangeCountry = (item) => {
		this.selectCountry = item;
		this.userList = this.userList.filter((value) => {
			if(value && value.country) {
			return value.country.includes(item);
			}
		})
		// this.selectedJob && this.selectedJob.id && this.onGetCandidateList(this.selectedJob.id);
	}

	/**
	**	To get the posted job details
	**/
	
	onGetPostedJob(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		//requestParams.status = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					response.items = response.items.filter(function(a,b){ return a.status !=0 });
					this.postedJobs = [...response.items];
					if(this.postedJobs && this.postedJobs.length && this.postedJobs[0]) {
						if(this.selectedJob && this.selectedJob.id) {
							const filterJob = this.postedJobs.find((val) => {
								if(this.selectedJob && this.selectedJob.id)
								return parseInt(val.id) == parseInt(this.selectedJob.id);
							});
							if(filterJob && !this.utilsHelperService.isEmptyObj(filterJob)) {
								this.selectedJob = filterJob;
							}
							this.onGetCandidateList(this.selectedJob.id);
						}else {
							if(!sessionStorage.getItem('match-job-id')){
								this.selectedJob = this.postedJobs[0];
							}else{
								var ids = parseInt(sessionStorage.getItem('match-job-id'));
								var temps = this.postedJobs.filter(function(a,b){ return a.id==ids })
								if(temps.length==1){
									this.selectedJob = temps[0];
								}else{
									this.selectedJob = this.postedJobs[0];
								}
							}
							this.onGetCandidateList(this.selectedJob.id);              
						}
					}
				}
				this.postedJobMeta = { ...response.meta }
			}, error => {
			}
		)
	}
  
	/**
	**	To get posted job count
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
					if(!this.selectedJob){
						this.selectedJob ={id:1,job_location:{id:1}};
						var tempLen =response['count'].length-1;
						this.selectedJob.id = response['count'][tempLen]['id'];
						this.selectedJob['job_location']['id'] = response['count'][tempLen]['location_id'];
						this.onGetCandidateList(this.selectedJob.id);
					}
					
					this.TotalCount =response['count'];
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('MatchesCount')){
						document.getElementById('MatchesCount').innerHTML="("+TotalValue+")";
					}			
				}else{			
				}
			}, error => {
			}
		)
	}
  
	/**
	**	To Check the count
	**/
	
	checkDataCount(id){
		if(id !=undefined && id!=null && id !='' ){
			var tempData= this.TotalCount.filter(function(a,b){ return a.id == id });
				if(tempData.length==1){
					return tempData[0]['count'];
				}
		}
		return 0;
	}

	/**
	**	To get Candidate lists
	**/
	
	onGetCandidateList(jobId) {
		let requestParams: any = {...this.queryParams};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.status = 1;
		requestParams.expand = 'is_saved_profile';
		requestParams.expand = 'is_saved_profile';
		requestParams.visa  = false;
		requestParams.filter_location  = this.filter_location;
		// if(!this.route.snapshot.queryParamMap.get('skill_tags')) {
		  requestParams.skill_tags_filter_type = 1;
		  requestParams.job_posting = jobId;
		  //requestParams.location_id = location_id;
		// }else {
		//   requestParams.skill_tags_filter_type = 0;
		// }
		if(!this.route.snapshot.queryParamMap.get('skill_tags')) {
			requestParams.skill_tags_filter_type = 1;
			if(this.postedJobs){
				var temps = this.postedJobs.filter(function(a,b){ return a.id==jobId});
				if(temps.length==1){
					if(temps[0].hands_on_experience && temps[0].hands_on_experience.length){
						var temp =[];
						for(let i=0;i<temps[0].hands_on_experience.length;i++){
							if(temps[0].hands_on_experience[i]['skill_id']){
								temp.push(temps[0].hands_on_experience[i]['skill_id']);
							}					  
						}
						if(temp.length !=0){
							requestParams.skill_tags = temp.join(',');
						}
					}			  
					requestParams.visa = this.selectedJob['visa_sponsorship'] ;
				}else{
					requestParams.skill_tags_filter_type = 1;
				}
			}
		}else {
			requestParams.skill_tags_filter_type = 0;
		}
		if(!this.route.snapshot.queryParamMap.get('min_experience')) {
			requestParams.min_experience = this.selectedJob.experience;
		}
		if(this.route.snapshot.queryParamMap.get('min_experience')) {
			if(this.postedJobs){
				var temps = this.postedJobs.filter(function(a,b){ return a.id==jobId});
				if(temps.length==1){
					if(temps[0].experience >= requestParams.min_experience && temps[0].experience >= requestParams.max_experience ){
						requestParams.min_experience = 100
						requestParams.max_experience = 101					
					}if(temps[0].experience >= requestParams.min_experience && temps[0].experience <= requestParams.max_experience  ){
						requestParams.min_experience = temps[0].experience
					}
				}
			}
		}
		if(requestParams.job_types && requestParams.job_types.length) {
			requestParams.job_types = requestParams.job_types.join(',')
		}
		requestParams.additional_fields = 'job_application';
		requestParams.city = this.selectedJob.city;
		/* 
		if(this.selectCountry) {
		  requestParams.country = this.selectCountry;
		} */
		if(this.selectedJob.country) {
			requestParams.country = this.selectedJob.country;
		}
		if(this.selectedJob.work_authorization && this.selectedJob.work_authorization !='' ) {
			requestParams.work_authorization = this.selectedJob.work_authorization;
			if(this.selectedJob.work_authorization==2){
				requestParams.work_authorization =1;
			}
		}
		const removeEmpty = this.utilsHelperService.clean(requestParams)
		this.userService.getUsers(removeEmpty).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					this.userList = [...response.items];
					this.userprofilepath = `${env.apiUrl}/images/user/`;
					this.savedProfiles = this.userList.filter(function(a,b){ return a.is_saved_profile ==true}).map(function(a,b){ return a.id});
				}else if(response && response.items && response.items.length == 0) {
					this.userList = [];
				}
				this.userMeta = { ...response.meta };
				if(this.countrySelect==false){
					//this.postedJobCountry = response['country'];
					this.countrySelect=true;			 
				}	
				if(this.userMeta.total){
					this.length = this.userMeta.total
				}
			}, error => {
				this.userList = [];
			}
		)
	}

	/**
	**	To load more data's
	**/
	
	onLoadMoreJob = () => {
		this.page = this.page + 1;
		if(this.selectedJob &&this.selectedJob.id) {
			this.onGetCandidateList(this.selectedJob.id);
		}
	}

	/**
	**	To Filter the job type 
	**/
	
	onFiltertByJobType = (fieldName, value) => {
		if(value != 'undefined') {
			if(this.queryParams.job_types){
				let index = this.queryParams.job_types.indexOf(value);
				if(index > -1) {
					this.queryParams.job_types.splice(index, 1)
				}else {
					this.queryParams.job_types.push(value)
				}
			}
			this.page=1;
			if( this.queryParams.job_types &&  this.queryParams.job_types.length) {
				this.onRedirectRouteWithQuery({[fieldName]: this.queryParams.job_types.join(',')})
			}else {
				this.onRedirectRouteWithQuery({[fieldName]: [].toString()})
			}
		}
	}

	/**
	**	To Filter by skills
	*
	
	onFiltertBySkill = (item) => {
		if(item != 'undefined') {
			let index = this.skills.findIndex((element) => {
				return element == item.id;
			});
			if(index > -1) {
				this.skills.splice(index, 1)
			}else {
				this.skills.push(parseInt(item.id))
			}
			this.page=1;
			if( this.skills &&  this.skills.length) {
				this.onRedirectRouteWithQuery({skill_tags: this.skills.join(',')})
			}else {
				this.onRedirectRouteWithQuery({skill_tags: [].toString()})
			}
		}
	}
       **/
	/**
	**	To Filer by experience
	**/
	
	onFiltertByExperience = (item) => {
		if(item != 'undefined') {
			let index = this.minMaxExp.findIndex((element) => {
				return ((element.value.min == item.value.min) && (element.value.max == item.value.max))
			});
			if(index > -1) {
				this.minMaxExp.splice(index, 1)
			}else {
				this.minMaxExp.push(item)
			}
			const min = Math.min.apply(null, this.minMaxExp.map(function(item) {
				if(item && item.value && (item.value.min || item.value.min == 0)) {
					return item.value.min;
				}
			}));
			const max = Math.max.apply(null, this.minMaxExp.map(function(item) {
				if(item && item.value && (item.value.max || item.value.max == 0)) {
					return item.value.max;
				}
			}));
			this.page=1;
			if(this.minMaxExp.length == 0) {
				this.onRedirectRouteWithQuery({min_experience: "", max_experience: ""})
			}
			if((min || min ==0) && max && this.minMaxExp.length) {
				this.onRedirectRouteWithQuery({min_experience: min, max_experience: max})
			}
		}
	}

	/**
	**	To Filter the data's with query as params
	**/
	
	onRedirectRouteWithQuery = (params: any = {}) => {
		this.queryParams = { ...this.queryParams, ...params };
		const removeEmpty = this.utilsHelperService.clean(this.queryParams);
		if(removeEmpty && removeEmpty.job_types && Array.isArray(removeEmpty.job_types)) {
			removeEmpty.job_types = removeEmpty.job_types.join(',');
		}
		const navigationExtras: NavigationExtras = {
			queryParams: {...removeEmpty}
		};
		this.router.navigate([], navigationExtras);
	}

	/**
	**	To Check the default experience
	**/
	
	onCheckExpDefault = (item) => {
		if(((item.value.min >= parseInt(this.queryParams.min_experience)) && (item.value.max <= parseInt(this.queryParams.max_experience)))) {
			return true;
		}
		return false;
	}

	/**
	**	To Filter the salary
	**/
	
	onChangeEve = (event) => {
		if(event != 'undefined') {
			this.onRedirectRouteWithQuery({min_salary: event.value, max_salary: event.highValue})
		}else {
			this.onRedirectRouteWithQuery({min_salary: '', max_salary: ''})
		}
	}

	/**
	**	To clear all the filters in params
	**/
	
	onClearFilter = () => {
		const navigationExtras: NavigationExtras = {
			queryParams: {activeTab:'matches', 'id': this.selectedJob.id}
		};
		this.onGetCandidateList(this.selectedJob.id);
		this.router.navigate([], navigationExtras);
		// this.onRedirectRouteWithQuery({activeTab:'matches', 'id': this.selectedJob.id})
	}
  
	/**
	**	To clear all the filters
	**/
	
	clearFilters(){
		if(this.queryParams.domain){
			delete this.queryParams.domain;			
		}
		if(this.queryParams.skills){
			document.getElementById('skills').className="btn btn-fltr";
			delete this.queryParams.skills;			
		}if(this.queryParams.programming_skills){
			document.getElementById('programming_skills').className="btn btn-fltr";
			delete this.queryParams.programming_skills;			
		}if( this.queryParams.optinal_skills){
			document.getElementById('optinal_skills').className="btn btn-fltr";
			delete this.queryParams.optinal_skills;			
		}if( this.queryParams.employer_role_type){
			document.getElementById('employer_role_type').className="btn btn-fltr";
			delete this.queryParams.employer_role_type;			
		}if( this.queryParams.certification){
			document.getElementById('certification').className="btn btn-fltr";
			delete this.queryParams.certification;			
		}if( this.queryParams.end_to_end_implementation){
			document.getElementById('end_to_end_implementation').className="btn btn-fltr";
			delete this.queryParams.end_to_end_implementation;			
		}if( this.queryParams.availability){
			document.getElementById('availability').className="btn btn-fltr";
			delete this.queryParams.availability;			
		}if( this.queryParams.travel_opportunity){
			document.getElementById('travel_opportunity').className="btn btn-fltr";
			delete this.queryParams.travel_opportunity;			
		}if( this.queryParams.remote){
			document.getElementById('remote').className="btn btn-fltr";
			delete this.queryParams.remote;			
		}if( this.queryParams.willing_to_relocate){
			 document.getElementById('willing_to_relocate').className="btn btn-fltr";
			delete this.queryParams.willing_to_relocate;			
		}if( this.queryParams.language){
			document.getElementById('language').className="btn btn-fltr";
			delete this.queryParams.language;			
		}if(this.queryParams.education){
			document.getElementById('education').className="btn btn-fltr";
			delete this.queryParams.education;			
		}
	}

	/**
	**	To open the resume popup status
	**/
	
	onToggleResumeForm = (status, selectedResumeUrl?) => {
	   console.log(selectedResumeUrl);
		if (selectedResumeUrl) {
			this.selectedResumeUrl = `${env.apiUrl}/documents/resume/${selectedResumeUrl}`;;
		}
		this.isOpenedResumeModal = status;
	}

	/**
	**	To Open the send mail status
	**/
	
	onToggleSendMail = (status,item?) => {
		if(item && !this.utilsHelperService.isEmptyObj(item)) {
			this.currentUserInfo = item;
		}
		if(status ==true && !item){
			this.isOpenedSendMailModal = false;
		}else{
			this.isOpenedSendMailModal = status;
				if(this.selectedJob &&this.selectedJob.id && status ==false) {
				setTimeout(() => {
					this.onGetCandidateList(this.selectedJob.id);
				},1000);
			}
		}		
		
	}

	/**
	**	To save the profile
	**/
	
	onSaveProfile = (item) => {
		if((item && item.id)) {
			let requestParams: any = {};
			requestParams.user_id = item.id;
			requestParams.delete = 0
			this.employerService.saveProfile(requestParams).subscribe(
				response => {
					this.savedProfiles.push(item.id);
					this.onEvent.emit(true);
				}, error => {
					this.onEvent.emit(true);
				}
			)
		}else {
			this.toastrService.error('Something went wrong', 'Failed')
		}
	}
  
	/**
	**	To unsave the user details
	**/
	
	onUnSaveProfile = (item) => {
		if ((item && item.id)) {
			let requestParams: any = {};
			requestParams.user_id = item.id;
			requestParams.delete = 1;
			this.employerService.saveProfile(requestParams).subscribe(
				response => {
					this.savedProfiles = this.savedProfiles.filter(function(a,b){ return a!=item.id});
					this.onEvent.emit(true);
				}, error => {
					this.onEvent.emit(true);
				}
			)
		} else {
			this.toastrService.error('Something went wrong', 'Failed')
		}
	}
  
	/**
	**	To Filter the jobs data's
	**/
	
	handleChange(clr){
		var temp = clr.target.className.split(' ');
		if(temp[temp.length-1]=='btn-fltr-active'){
			clr.target.className = clr.target.className.replace('btn-fltr-active','');
			if(clr.target.id == 'domain' && this.queryParams.domain){
				delete this.queryParams.domain;			
			}
			if(clr.target.id == 'skills' && this.queryParams.knowledge){
				delete this.queryParams.knowledge;			
			}if(clr.target.id == 'programming_skills' && this.queryParams.programming_skills){
				delete this.queryParams.programming_skills;			
			}if(clr.target.id == 'optinal_skills' && this.queryParams.optinal_skills){
				delete this.queryParams.optinal_skills;			
			}if(clr.target.id == 'employer_role_type' && this.queryParams.employer_role_type){
				delete this.queryParams.employer_role_type;			
			}if(clr.target.id == 'certification' && this.queryParams.certification){
				delete this.queryParams.certification;			
			}if(clr.target.id == 'end_to_end_implementation' && this.queryParams.end_to_end_implementation){
				delete this.queryParams.end_to_end_implementation;			
			}if(clr.target.id == 'availability' && this.queryParams.availability){
				delete this.queryParams.availability;			
			}if(clr.target.id == 'travel_opportunity' && this.queryParams.travel_opportunity){
				delete this.queryParams.travel_opportunity;			
			}if(clr.target.id == 'remote' && this.queryParams.remote){
				delete this.queryParams.remote;			
			}if(clr.target.id == 'willing_to_relocate' && this.queryParams.willing_to_relocate){
				delete this.queryParams.willing_to_relocate;			
			}if(clr.target.id == 'language' && this.queryParams.language){
				delete this.queryParams.language;			
			}if(clr.target.id == 'education' && this.queryParams.education){
				delete this.queryParams.education;			
			}if(clr.target.id == 'filter_location'){
				this.filter_location = false;	
			}
		}else{
			clr.target.className = 'btn btn-fltr btn-fltr-active';
			if(clr.target.id == 'domain') {
				if( this.selectedJob &&  this.selectedJob.domain) {
					this.queryParams.domain = this.selectedJob.domain.join(',');
				}
			}if(clr.target.id == 'skills') {
				if( this.selectedJob &&  this.selectedJob.skills) {
					this.queryParams.knowledge = this.utilsHelperService.differenceByPropValArray(this.selectedJob.skills, this.selectedJob.hands_on_experience, 'skill_id').join(',');
				}
			}if(clr.target.id == 'programming_skills') {
				if( this.selectedJob &&  this.selectedJob.programming_skills) {
					this.queryParams.programming_skills = this.selectedJob.programming_skills.join(',');
				}
			}if(clr.target.id == 'optinal_skills') {
				if( this.selectedJob &&  this.selectedJob.optinal_skills) {
					this.queryParams.optinal_skills = this.selectedJob.optinal_skills.join(',');
				}
			}if(clr.target.id == 'employer_role_type') {
				if( this.selectedJob &&  this.selectedJob.employer_role_type) {
					this.queryParams.employer_role_type = this.selectedJob.employer_role_type;
				}
			}if(clr.target.id == 'certification') {
				if( this.selectedJob &&  this.selectedJob.certification) {
					this.queryParams.certification = this.selectedJob.certification;
				}
			}if(clr.target.id == 'end_to_end_implementation') {
				if( this.selectedJob &&  this.selectedJob.end_to_end_implementation) {
					this.queryParams.end_to_end_implementation = this.selectedJob.end_to_end_implementation;
				}
			}if(clr.target.id == 'availability') {
				if( this.selectedJob &&  this.selectedJob.availability) {
					this.queryParams.availability = this.selectedJob.availability;
				}
			}if(clr.target.id == 'travel_opportunity') {
				if( this.selectedJob &&  this.selectedJob.travel_opportunity) {
					this.queryParams.travel_opportunity = this.selectedJob.travel_opportunity;
				}
			}if(clr.target.id == 'remote') {
				if( this.selectedJob &&  this.selectedJob.remote) {
					this.queryParams.remote = this.selectedJob.remote;
				}
			}if(clr.target.id == 'willing_to_relocate') {
				if( this.selectedJob &&  this.selectedJob.willing_to_relocate) {
					this.queryParams.willing_to_relocate = this.selectedJob.willing_to_relocate;
				}
			}if(clr.target.id == 'language') {
				if( this.selectedJob &&  this.selectedJob.language) {
					this.queryParams.language = this.selectedJob.language.join(',');
				}
			}if(clr.target.id == 'education') {
				if( this.selectedJob &&  this.selectedJob.education) {
					this.queryParams.education = this.selectedJob.education;
				}
			}if(clr.target.id == 'filter_location'){
				this.filter_location = true;	
			}		  
		}	
		this.onGetCandidateList(this.selectedJob.id);
	}
	
	filterCountry(clr){
		var temp = clr.target.className.split(' ');
		if(temp[temp.length-1]=='btn-fltr-active' || temp[temp.length-2]=='btn-fltr-active'){
			if(this.countryFilterList.length+1 == this.selectedJob?.job_locations?.length){
				
			}else{
				clr.target.className = clr.target.className.replace('btn-fltr-active','');
				var dataCheck = clr.target.id.split('_')[1].toString();
				this.countryFilterList.push(dataCheck);
			}
		}else{
			clr.target.className = 'btn btn-fltr btn-fltr-active';
			var dataCheck = clr.target.id.split('_')[1].toString();
			dataCheck = this.countryFilterList.filter(function(a,b){ return a != dataCheck });
			this.countryFilterList = dataCheck;
			
		}	
		if(this.countryFilterList.length==0){
			this.queryParams.location_filter = null;
		}else{
			this.queryParams.location_filter = this.countryFilterList;
		}
		this.onGetCandidateList(this.selectedJob.id);
		
	}
	/**
	**	To Reset all the filter data's
	**/
	
	resetData(){
		if(this.queryParams.domain){
			delete this.queryParams.domain;			
		}if(this.queryParams.skills){
			delete this.queryParams.skills;			
		}if(this.queryParams.knowledge){
			delete this.queryParams.knowledge;			
		}if(this.queryParams.programming_skills){
			delete this.queryParams.programming_skills;			
		}if(this.queryParams.optinal_skills){
			delete this.queryParams.optinal_skills;			
		}if(this.queryParams.employer_role_type){
			delete this.queryParams.employer_role_type;			
		}if(this.queryParams.certification){
			delete this.queryParams.certification;			
		}if(this.queryParams.end_to_end_implementation){
			delete this.queryParams.end_to_end_implementation;			
		}if(this.queryParams.availability){
			delete this.queryParams.availability;			
		}if(this.queryParams.travel_opportunity){
			delete this.queryParams.travel_opportunity;			
		}if(this.queryParams.remote){
			delete this.queryParams.remote;			
		}if(this.queryParams.willing_to_relocate){
			delete this.queryParams.willing_to_relocate;			
		}if(this.queryParams.language){
			delete this.queryParams.language;			
		}if(this.queryParams.education){
			delete this.queryParams.education;			
		}if(this.queryParams.location_id){
			delete this.queryParams.location_id;			
		}
		if(document.getElementById('domain')){
			document.getElementById('domain').className = "btn btn-fltr " ; 
		}if(document.getElementById('skills')){
			document.getElementById('skills').className = "btn btn-fltr " ; 
		}if(document.getElementById('programming_skills')){
			document.getElementById('programming_skills').className = "btn btn-fltr " ; 
		}if(document.getElementById('optinal_skills')){
			document.getElementById('optinal_skills').className = "btn btn-fltr " ; 
		}if(document.getElementById('certification')){
			document.getElementById('certification').className = "btn btn-fltr " ; 
		}if(document.getElementById('facing_role')){
			document.getElementById('facing_role').className = "btn btn-fltr " ; 
		}if(document.getElementById('employer_role_type')){
			document.getElementById('employer_role_type').className = "btn btn-fltr" ; 
		}if(document.getElementById('training_experience')){
			document.getElementById('training_experience').className = "btn btn-fltr " ; 
		}if(document.getElementById('willing_to_relocate')){
			document.getElementById('willing_to_relocate').className = "btn btn-fltr " ; 
		}if(document.getElementById('end_to_end_implementation')){
			document.getElementById('end_to_end_implementation').className = "btn btn-fltr " ; 
		}if(document.getElementById('education')){
			document.getElementById('education').className = "btn btn-fltr " ; 
		}if(document.getElementById('travel_opportunity')){
			document.getElementById('travel_opportunity').className = "btn btn-fltr " ; 
		}if(document.getElementById('remote')){
			document.getElementById('remote').className = "btn btn-fltr " ; 
		}if(document.getElementById('availability')){
			document.getElementById('availability').className = "btn btn-fltr " ; 
		}if(document.getElementById('language')){
			document.getElementById('language').className = "btn btn-fltr " ; 
		}
		if(this.selectedJob.extra_criteria){
			if(this.selectedJob.extra_criteria.length && this.selectedJob.extra_criteria.length!=0)
				for(let i=0;i<this.selectedJob.extra_criteria.length;i++){
					if(this.selectedJob.match_select[this.selectedJob.extra_criteria[i]['title']]=='0'){
					var titleData = this.selectedJob.extra_criteria[i]['title']+'_'+i;
					if(document.getElementById(titleData)){
						document.getElementById(titleData).className = "btn btn-fltr " ; 
					}
				}else if(this.selectedJob.match_select[this.selectedJob.extra_criteria[i]['title']]=='1'){
					var titleData = this.selectedJob.extra_criteria[i]['title']+'_'+i;
					if(document.getElementById(titleData)){
						document.getElementById(titleData).className = "btn btn-fltr " ; 
					}
				}else if(this.selectedJob.match_select[this.selectedJob.extra_criteria[i]['title']]=='2'){
					var titleData = this.selectedJob.extra_criteria[i]['title']+'_'+i;
					if(document.getElementById(titleData)){
						document.getElementById(titleData).className = "btn btn-fltr " ; 
					}
				}
			}
		}
	}
		
	/**
	**	To Filter the dublicates
	**/
	
	filterData(arr){
		var tempsData =  arr.filter(function(elem, index, self) {
			return index === self.indexOf(elem);
		});
		return tempsData;
	}
	
	/**
	**	To pagination changes
	**/ 
	
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		if(this.selectedJob &&this.selectedJob.id) {
		  this.onGetCandidateList(this.selectedJob.id);
		}
	}
	
	/**
	**	To Filter the country based data
	**/
	
	ValidateByCountry(value,event){
		if(value!=undefined && value !=null && value !=''){	
			
			if(event.target.style.color!="rgb(255, 41, 114)"){
				event.target.style.color="rgb(255, 41, 114)";
				if(this.Country.length==0){
					this.Country = [value];
				}else{
					this.Country = this.Country.filter(function(a,b){ return a != value});
					this.Country.push(value);
				}
			}else{
				event.target.style.color='#000';
				
					this.Country = this.Country.filter(function(a,b){ return a != value});
			}
			this.onGetCandidateList(this.selectedJob.id);
			
		}
	}
	
	/**
	**	To Filter the jobTypes
	**/
	
	checkJobType(item){
		var data = this.sharedService.onGetJobType(item);
		if(data.length){
			if(data.length!=0){
				return data['join'](', ');
			}
		}
		return data;
	}

}
