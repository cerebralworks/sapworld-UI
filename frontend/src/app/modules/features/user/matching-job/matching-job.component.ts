import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-matching-job',
  templateUrl: './matching-job.component.html',
  styleUrls: ['./matching-job.component.css']
})
export class MatchingJobComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	public isOpenedResumeSelectModal: boolean = false;
	@Output() onEvent = new EventEmitter<boolean>();
	public countrySelect: boolean = false;
	public callJobsData: boolean = false;
	public visa: boolean = false;
	public Country: any = [];
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	showFirstLastButtons = true;
	public postedJobs: any[] = [];
	public nationality: any[] = [];
	public postedJobCountry: any[] = [];
	public postedJobMeta: any;
	public userInfo: any;
	public currentJobDetails: any;
	public sortByValue: string = 'created_at.desc';
	public experienceFilter: { value: {min: number, max: number}; text: string; }[];
	public queryParams: any = { type: [], sort: ''};
	public minMaxExp: any[] = [];
	public skills: any[] = [];
	public customObject: any = Object;
	public minSalary: number = 30000;
	public maxSalary: number = 300000;
	public options: Options = {
		floor: 30000,
		ceil: 300000,
		translate: (value: number, label: LabelType): string => {
			switch (label) {
				case LabelType.Low:
					return "<b>Min:</b> " + value;
				case LabelType.High:
					return "<b>Max:</b> " + value;
				default:
					return "" + value;
			}
		}
	};
	public skillItems: any = {};
	public customParseInt: any = parseInt;
	public cityString: string;
	public skillString: any;
	tempQueryParams: any;

	constructor(
		public sharedService: SharedService,
		private router: Router,
		private route: ActivatedRoute,
		public utilsHelperService: UtilsHelperService,
		private dataService: DataService,
		private employerService: EmployerService,
		private userSharedService: UserSharedService
	) {
		
		this.experienceFilter = [
		  {value: {min: 0, max: 1}, text: 'Freshers'},
		  {value: {min: 1, max: 3}, text: '1 - 3 Years'},
		  {value: {min: 3, max: 5}, text: '3 - 5 Years'},
		  {value: {min: 5, max: 7}, text: '5 - 7 Years'},
		  {value: {min: 7, max: 10}, text: '7 - 10 Years'},
		  {value: {min: 10, max: 20}, text: '10 Years & above'}
		]
		
		/**
		**	Routing params get the values 
		**/
	
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				// this.skillString = this.route.snapshot.queryParamMap.get('search');
				this.cityString = this.route.snapshot.queryParamMap.get('city');
				const jobTypes = this.route.snapshot.queryParamMap.get('type');
				if(jobTypes) {
					var jobTypesSplited = new Array();
					jobTypesSplited = jobTypes.split(",");
					if(jobTypesSplited && jobTypesSplited.length) {
						for (let a in jobTypesSplited ) {
							jobTypesSplited[a] = parseInt(jobTypesSplited[a], 10);
						}
						urlQueryParams.type = jobTypesSplited;
					}
				}
				const skillTags = this.route.snapshot.queryParamMap.get('skills');
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
				const minSalary = this.route.snapshot.queryParamMap.get('min_salary');
				const maxSalary = this.route.snapshot.queryParamMap.get('max_salary');
				if(minSalary) {
					this.minSalary = parseInt(minSalary);
				}
				if(maxSalary) {
					this.maxSalary = parseInt(maxSalary);
				}
				this.queryParams = {...this.queryParams, ...urlQueryParams };
			}
		});
	}

	validateAPI = 0;
	
	/**
	**	When the page loads init function calls
	**/
	
	ngOnInit(): void {
		this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				this.userInfo = response;
				if(this.userInfo && this.userInfo.skills && this.userInfo.skills.length && this.validateAPI == 0) {
          
				}
			}
		)
		this.dataService.getCountryDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
					this.nationality = response;
					this.validateAPI++;
				}
			}
		);
		this.onGetPostedJob('');
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};    

		this.experienceFilter = [
			{value: {min: 0, max: 1}, text: 'Freshers'},
			{value: {min: 1, max: 3}, text: '1 - 3 Years'},
			{value: {min: 3, max: 5}, text: '3 - 5 Years'},
			{value: {min: 5, max: 7}, text: '5 - 7 Years'},
			{value: {min: 7, max: 10}, text: '7 - 10 Years'},
			{value: {min: 10, max: 20}, text: '10 Years & above'}
		]

		this.dataService.getSkillDataSource().subscribe(
			response => {
				this.skillItems = response
			}
		);
	}

	/**
	**	When Any Changes happens in the page the function triggers
	**/
	
	ngDoCheck(): void {
		this.tempQueryParams = {...this.queryParams}
	}

	/**
	**	When you change the page the function triggers
	**/
	
	ngOnDestroy(): void {
		this.validateAPI = null;
	}

	/**
	**	To get the posted job details API 
	**	Assign the values in the Array
	**/
	
	onGetPostedJob(value:any) {
		let requestParams: any = {...this.queryParams};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.expand = 'company';
		requestParams.skills_filter = 'false';
		if(value){			
			requestParams.status = value;
			requestParams.is_user_get = true;
		}else{
			requestParams.status = '1';
			requestParams.is_user_get = false;
		}
		requestParams.work_authorization = '';
		//requestParams.visa_sponsered = false;
		requestParams.user_list = true;	
		requestParams.user_id = this.userInfo.id;	
		if(this.visa ==true){
			requestParams.visa = true;			
		}
		if(this.userInfo && this.userInfo.city ){
			requestParams.city = this.userInfo.city;
			requestParams.country = this.userInfo.country;
		}
		if(this.userInfo && this.userInfo.willing_to_relocate ){
			requestParams.relocate = this.userInfo.willing_to_relocate;
		}
		if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == true ) {
			requestParams.work_authorization = this.userInfo.work_authorization;
			if(this.userInfo.visa_sponsered ==true || this.userInfo.visa_sponsered =='true'){
				requestParams.visa_sponsered = this.userInfo.visa_sponsered;
			}
			
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
					if(this.userInfo.authorized_country && this.userInfo.authorized_country.length && this.userInfo.authorized_country.length !=0){
						var authorized_countrys= this.nationality.filter((el) => {
							return this.userInfo.authorized_country.some((f) => {
								return f === el.id ;
							});
						});
					}
					if(temp.length!=0){
						var tempData=temp;
						if(tempData.filter(function(a,b){ return a == 'europe'}).length==1){
							var EUCountry =['austria','liechtenstein','belgium','lithuania','czechia',
							'luxembourg','denmark','malta','estonia','etherlands','finland','norway',
							'france','poland','germany','portugal','greece','slovakia','hungary',
							'slovenia','iceland','spain','italy','sweden','latvia','switzerland','reland'
							]
							//tempData = tempData.concat(EUCountry);
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
							//tempData = tempData.concat(EUCountry);
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
						//tempData = tempData.concat(EUCountry);
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
		if(this.Country.length!=0 ){
			if(this.Country && this.Country.length){
				requestParams.country = this.Country.join(',');
				requestParams.city =null;
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
	
		if(!this.route.snapshot.queryParamMap.get('max_experience')) {
			requestParams.max_experience = this.userInfo.experience;
		}
		if(this.route.snapshot.queryParamMap.get('max_experience')) {
			if(this.userInfo){
				if(this.userInfo.experience >= requestParams.min_experience && !(this.userInfo.experience >= requestParams.max_experience) ){
					requestParams.max_experience = this.userInfo.experience
				}if(!(this.userInfo.experience > requestParams.min_experience) && !(this.userInfo.experience > requestParams.max_experience) ){
					requestParams.min_experience = 100
					requestParams.max_experience = 101
				}
			}
		}
		/* if(!this.route.snapshot.queryParamMap.get('min_experience')) {
			requestParams.min_experience = this.userInfo.experience;
		} */
		if(requestParams.type && requestParams.type.length) {
			requestParams.type = requestParams.type.join(',')
		}else{
			if(this.userInfo && this.userInfo.job_type) {
				requestParams.type = this.userInfo.job_type;
				if(requestParams.type && requestParams.type.length) {
					requestParams.type = requestParams.type.join(',')
				}
			}
		}	
		const removeEmpty = this.utilsHelperService.clean(requestParams)
		this.employerService.getPostedJob(removeEmpty).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					this.postedJobs =[];
					this.postedJobs = [...this.postedJobs, ...response.items];
				}
				this.postedJobMeta = { ...response.meta };
				if(this.countrySelect==false){			
					var tempLen = response['country'].map(function(a,b){ return a.country} );
					tempLen = tempLen.filter(function(item, pos) { return tempLen.indexOf(item) == pos; })
					for(let i=0;i<tempLen['length'];i++){
						var tempcountry = tempLen[i];
						var filter = response['country'].filter(function(a,b){ return a.country.toLowerCase() == tempcountry.toLowerCase() }).length
						this.postedJobCountry.push({count:filter,country:tempcountry});
					}
					response['country'] = this.postedJobCountry ;
					this.countrySelect=true;
					if(response['country']){
						var TotalValue =response['country'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
						if(document.getElementById('matchesCountValue')){
							document.getElementById('matchesCountValue').innerHTML="("+TotalValue+")";
						}			 
					}else{
						if(document.getElementById('matchesCountValue')){
							document.getElementById('matchesCountValue').innerHTML="(0)";
					}
				}
			}
			if(this.postedJobMeta.total){
				this.length = this.postedJobMeta.total;
			}
			}, error => {
			}
		)
	}
	
	/**
	**	To validate the country details to show the matches section
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
			this.onGetPostedJob('');
		}
	}
	
	/**
	**	To validate the visa details to show the matches section
	**/
	
	ValidateByVisa(event){
		if(event.target.style.color!="rgb(255, 41, 114)"){
			event.target.style.color="rgb(255, 41, 114)";
			this.visa = true;
		}else{
			event.target.style.color='#000';
			this.visa = false;
		}
		this.onGetPostedJob('');
	}
	
	/**
	**	To Open the resume in popup view
	**/
	
	onToggleResumeSelectModal = (status, item?) => {
		if(!this.utilsHelperService.isEmptyObj(item)) {
			this.currentJobDetails = item;
		}
		this.isOpenedResumeSelectModal = false;
		this.onEvent.emit(true);
		this.onGetPostedJob('');
	}
	
	onToggleResumeSelectModals = (status, item?) => {
		if(!this.utilsHelperService.isEmptyObj(item)) {
			this.currentJobDetails = item;
		}
		this.isOpenedResumeSelectModal = status;
		this.onEvent.emit(true);
		this.onGetPostedJob('');
	}

	onLoadMoreJob = () => {
		this.page = this.page + 1;
		this.onGetPostedJob('');
	}

	/**
	**	To Sort the values in filters
	**/
	
	onSortByValues = (fieldName, value) => {
		if(value != 'undefined' || value != '' || value != null) {
			this.onRedirectRouteWithQuery({[fieldName]: value})
		}else {
			this.onRedirectRouteWithQuery({[fieldName]: ''})
		}
	}

	/**
	**	To Filter the matches in jobtype
	**/
	
	onFiltertByJobType = (fieldName, value) => {
		if(value != 'undefined') {
			this.page=1;
			if(this.queryParams && Array.isArray(this.queryParams.type)) {
				let index = this.queryParams.type.indexOf(value);
				if(index > -1) {
					this.queryParams.type.splice(index, 1)
				}else {
					this.queryParams.type.push(value)
				}
			}
			if( this.queryParams.type &&  this.queryParams.type.length) {
				this.onRedirectRouteWithQuery({[fieldName]: this.queryParams.type.join(',')})
			}else {
				this.onRedirectRouteWithQuery({[fieldName]: [].toString()})
			}
		}
	}

	/**
	**	To Filter the matches in Skills
	**/
	
	onFiltertBySkill = (item) => {
		if(item != 'undefined') {
			this.page=1;
			let index = this.skills.findIndex((element) => {
				return element == item.id;
			});
			if(index > -1) {
				this.skills.splice(index, 1)
			}else {
				this.skills.push(parseInt(item.id))
			}
			if( this.skills &&  this.skills.length) {
				this.onRedirectRouteWithQuery({skills: this.skills.join(',')})
			}else {
				this.onRedirectRouteWithQuery({skills: [].toString()})
			}
		}
	}

	/**
	**	To Filter the matches in Skills
	**/
	
  onFiltertByExperience = (item) => {
		if(item != 'undefined') {
			this.page=1;
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
			if(this.minMaxExp.length == 0) {
				this.onRedirectRouteWithQuery({min_experience: "", max_experience: ""})
			}
			if((min || min ==0) && max && this.minMaxExp.length) {
				this.onRedirectRouteWithQuery({min_experience: min, max_experience: max})
			}
		}
	}

	/**
	**	To Filter the matches in Salary
	**/
	
	onFilterWithSalary = (event) => {
		this.page=1;
		if(event != 'undefined') {
			this.onRedirectRouteWithQuery({min_salary: event.value, max_salary: event.highValue})
		}else {
			this.onRedirectRouteWithQuery({min_salary: '', max_salary: ''})
		}
	}

	/**
	**	To Routes the filter setion
	**/
	
	onRedirectRouteWithQuery = (params: any = {}) => {
		this.queryParams = { ...this.queryParams, ...params };
		const removeEmpty = this.utilsHelperService.clean(this.queryParams);
		if(removeEmpty && removeEmpty.type && Array.isArray(removeEmpty.type)) {
			removeEmpty.type = removeEmpty.type.join(',');
		}
		const navigationExtras: NavigationExtras = {
			queryParams: {...removeEmpty}
		};
		this.router.navigate([], navigationExtras);
	}

	/**
	**	To clear all the filters
	**/
	
	onClearFilter = () => {
		const navigationExtras: NavigationExtras = {
			queryParams: {activeTab:'matches'}
		};
		this.router.navigate([], navigationExtras);
		// this.onRedirectRouteWithQuery({activeTab:'matches', 'id': this.selectedJob.id})
	}

	/**
	**	To check the matches in experience
	**/
	
	onCheckExpDefault = (item) => {
		if(((item.value.min >= parseInt(this.queryParams.min_experience)) && (item.value.max <= parseInt(this.queryParams.max_experience)))) {
			return true;
		}
		return false;
	}
  
	/**
	**	To paginate the filter values
	**/
	
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		//this.pageSize = event.pageSize;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		this.onGetPostedJob('');
	}
	
	/**
	**	To find the country values 
	**/
	
	findCountry(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'];
					})
					if(temp.length !=0){
						return temp;
					}
				}
			}
		}
		return [];
	}
	
	checkStatus(value){
		if(this.postedJobMeta['status'] && this.postedJobMeta['status']['length']){
			value = parseInt(value);
			var values:any = this.postedJobMeta['status'].filter(function(a,b){ return a.status == value });
			if(values && values.length !=0){
				return true;
			}
		}
		return false;
	}
	checkStatusCount(value){
		if(this.postedJobMeta['status'] && this.postedJobMeta['status']['length']){
			value = parseInt(value);
			var values:any = this.postedJobMeta['status'].filter(function(a,b){ return a.status == value });
			if(values && values.length !=0){
				return values[0]['count'];
			}
		}
		return '0';
	}
	
	statusChange(value,event){
		if(event.target.style.color!="rgb(255, 41, 114)"){
			event.target.style.color="rgb(255, 41, 114)";
			this.page = 1;
			this.limit = 10;
			this.onGetPostedJob(value);
		}else{
			event.target.style.color='#000';
			this.page = 1;
			this.limit = 10;
			this.onGetPostedJob('');
		}
		
	}

}

export interface queryParams {
  type: any[];
  min_salary: number;
  max_salary: number;
  skills: any[];
}
