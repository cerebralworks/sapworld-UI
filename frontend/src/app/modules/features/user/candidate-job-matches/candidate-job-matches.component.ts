import { Location } from '@angular/common';
import { Component, OnInit,HostListener  } from '@angular/core';
import { ActivatedRoute,Router,NavigationStart } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import * as lodash from 'lodash';
import { Subscription } from 'rxjs';
import { environment as env } from '@env';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-candidate-job-matches',
  templateUrl: './candidate-job-matches.component.html',
  styleUrls: ['./candidate-job-matches.component.css']
})
export class CandidateJobMatchesComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	public screenWidth: any;
	public isOpenedJDModal: boolean = false;
	public userInfo: CandidateProfile;
	public jobId: string;
	public page: number = 1;
	public matchingJob: any = {};
	public cusLoadsh: any = lodash;
	public currentJobDetails: any;
	public description: any;
	public isOpenedResumeSelectModal: boolean;
	public matchedElement: boolean = true;
	public missingElement: boolean = false;
	public matchFind: boolean = false;
	public moreElement: boolean = true;
	public isMultipleMatches: boolean;
	// public matchingUsersMeta: any;
	public matchingJobNew: any;
	private subscriptions: Subscription[] = [];
	matchingJobMeta: any;
	public loading : boolean;
	public userDetails:any;
	public userprofilepath:any;
	/**
	**	To implements the import Packages in constructor
	**/
	
	constructor(
		private route: ActivatedRoute,
		private userSharedService: UserSharedService,
		private userService: UserService,
		private location: Location,
		public utilsHelperService: UtilsHelperService,
		public sharedService: SharedService,
		private router: Router,
		private meta: Meta
	) {	}

	/**
	**	When the page loads the OnInit Calls
	**/
	
	ngOnInit(): void {
	this.userprofilepath = `${env.apiUrl}/images/user/`;
	  this.screenWidth = window.innerWidth;	
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.id) {
					sessionStorage.setItem('view-job-id',urlQueryParams.id);
				}
			}
		});
		
		this.meta.updateTag({property: 'og:title', content: 'testing jobs in matches'});
		this.meta.updateTag({property: 'og:image', content: 'http://149.56.180.254/assets/images/employer-screen-02.png'});
		
		this.router.navigate([], {queryParams: {id: null}, queryParamsHandling: 'merge'});
		var jobIds:any = 0;
		if(sessionStorage.getItem('view-job-id')){
			jobIds = parseInt(sessionStorage.getItem('view-job-id'));
		}
		//this.jobId = this.route.snapshot.paramMap.get('id');
		this.jobId = jobIds;
		this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				if(response){
					if(response.skills){
						response.skillses = this.utilsHelperService.differenceByPropValArray(response.skills, response.hands_on_experience, 'skill_id')
					}
					this.userInfo = response;
					this.userDetails = response;
					if (this.jobId && this.matchFind ==false) {
						
						this.onGetUserScoringById();
						this.matchFind = true;
						setTimeout(() => {
							this.onGetUserScoringByIds(true, true);
						},1000);
						
					}
				}
			}
		)
		
	}

	/**
	**	To check the Array Fields
	**/
	
	onChange(array: any[] = [], item, field) {
		if (!this.utilsHelperService.isEmptyObj(item) && array && array.length) {
			return array.find((val) => {
				return val[field] == item[field];
			});
		}
	}

	/**
	**	To View the All candidates Details
	**/
	
	onViewOtherMatches = () => {
		this.page=1;
		if (this.matchingJobMeta.count > 1 && this.matchingJobMeta.count !== this.page) {
			this.isMultipleMatches = true;
			this.onGetUserScoringById(true);
			this.page++;
			setTimeout(() => {
				this.onGetUserScoringByIdNew();
			}, 300);
		}
	}
	
	/**
	**	To Get the userscoring details
	**/
	
	onGetUserScoringById = (isMultipleMatch: boolean = false, isCount: boolean = false) => {
		
		let requestParams: any = {};
		if (!isMultipleMatch) {
			requestParams.job_id = this.jobId;
		}
		requestParams.page = this.page;
		requestParams.id = this.userInfo.id;
		requestParams.expand = "company";
		requestParams.visa_sponsered = false;
		if(this.userInfo && this.userInfo.city ){
			requestParams.city = this.userInfo.city;
			requestParams.country = this.userInfo.country;
		}
		if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == true) {
			//requestParams.work_authorization = this.userInfo.work_authorization;
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
	
		if(this.userInfo && this.userInfo.experience) {
			requestParams.max_experience = this.userInfo.experience;
		}
		if(this.userInfo && this.userInfo.country && this.userInfo.willing_to_relocate == true) {
			requestParams.country = [this.userInfo.country];
			if(this.userInfo && this.userInfo.preferred_locations) {
				if(this.userInfo.preferred_locations.length !=0) {
					var temp= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
					if(temp.length!=0){
						var tempData=temp.map(function(a,b){ return a.country});
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
		const sb = this.userService.getUserScoring(requestParams).subscribe(
		response => {
			if(response.jobs.skills){
				response.jobs.skills = this.utilsHelperService.differenceByPropValArray(response.jobs.skills, response.jobs.hands_on_experience, 'skill_id')
			}
			if(!isMultipleMatch){
				if(response.jobs){
					if(parseInt(this.jobId) == response.jobs.id ){
						if (response && !isCount) {
							this.matchingJob = { ...this.matchingJob, jobs: {} };
							this.matchingJob = { ...response };
							this.loading=true;
							if(this.matchingJob['jobs']['match_select'] && this.matchingJobNew){
								if(!this.utilsHelperService.isEmptyObj(this.matchingJobNew['jobs'])){
									this.matchingJobNew['jobs']['match_select'] = this.matchingJob['jobs']['match_select'];
								}
							}
						}
						if (isCount) {
							this.matchingJobMeta = { ...response.meta }
						}
					}else{
						this.router.navigate(['/user/dashboard'], {queryParams: {'nomatch':true}});
					}
				}
			}else{
				if (response && !isCount) {
					this.matchingJob = { ...this.matchingJob, jobs: {} };
					this.matchingJob = { ...response }
					this.loading=true;
					if(this.matchingJob['jobs']['match_select'] && this.matchingJobNew){
						if(!this.utilsHelperService.isEmptyObj(this.matchingJobNew['jobs'])){
							this.matchingJobNew['jobs']['match_select'] = this.matchingJob['jobs']['match_select'];
						}
					}
				}
				if (isCount) {
					this.matchingJobMeta = { ...response.meta }
				}
			}
		}, error => {
			this.router.navigate(['/user/dashboard'], {queryParams: {'nomatch':true}});
		})
		this.subscriptions.push(sb);
	}
	
	/**
	**	To Get the userscoring details
	**/
	
	onGetUserScoringByIds = (isMultipleMatch: boolean = false, isCount: boolean = false) => {
		
		let requestParams: any = {};
		if (!isMultipleMatch) {
			requestParams.job_id = this.jobId;
		}
		requestParams.page = this.page;
		requestParams.id = this.userInfo.id;
		requestParams.expand = "company";
		requestParams.visa_sponsered = false;
		if(this.userInfo && this.userInfo.city ){
			requestParams.city = this.userInfo.city;
			requestParams.country = this.userInfo.country;
		}
		if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == true) {
			//requestParams.work_authorization = this.userInfo.work_authorization;
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
	
		if(this.userInfo && this.userInfo.experience) {
			requestParams.max_experience = this.userInfo.experience;
		}
		if(this.userInfo && this.userInfo.country && this.userInfo.willing_to_relocate == true) {
			requestParams.country = [this.userInfo.country];
			if(this.userInfo && this.userInfo.preferred_locations) {
				if(this.userInfo.preferred_locations.length !=0) {
					var temp= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
					if(temp.length!=0){
						var tempData=temp.map(function(a,b){ return a.country});
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
		const sb = this.userService.getUserScoring(requestParams).subscribe(
		response => {
			
			if (isCount) {
				this.matchingJobMeta = { ...response.meta }
			}
				
		}, error => {
		})
		this.subscriptions.push(sb);
	}

	/**
	**	To Get the userscoring details 
	**	when show the the multiple user sections with the pagination
	**/
	
	onGetUserScoringByIdNew = () => {
		
		let requestParams: any = {};
		// requestParams.id = this.jobId;
		requestParams.page = this.page;
		requestParams.visa_sponsered = false;
		requestParams.id = this.userInfo.id;
		requestParams.expand = "company";
		requestParams.visa_sponsered = false;
		if(this.userInfo && this.userInfo.city ){
			requestParams.city = this.userInfo.city;
			requestParams.country = this.userInfo.country;
		}
		if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == true) {
			//requestParams.work_authorization = this.userInfo.work_authorization;
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
		if(this.userInfo && this.userInfo.country && this.userInfo.willing_to_relocate == true) {
			requestParams.country = [this.userInfo.country];
			if(this.userInfo && this.userInfo.preferred_locations) {
				if(this.userInfo.preferred_locations.length !=0) {
					var temp= this.userInfo.preferred_locations.filter(function(a,b){ return a.city!='' && a.city!=null&&a.country!=''&&a.country!=null});
					if(temp.length!=0){
						var tempData=temp.map(function(a,b){ return a.country});
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
		if(this.userInfo && this.userInfo.experience) {
			requestParams.max_experience = this.userInfo.experience;
		}
		const sb = this.userService.getUserScoring(requestParams).subscribe(
		response => {
			if (response) {
				if(response['jobs']['match_select'] ){
					if(!this.utilsHelperService.isEmptyObj(response['jobs'])){
						response['jobs']['match_select'] = this.matchingJob['jobs']['match_select'];
					}
				}
				this.matchingJobNew = { ...this.matchingJobNew, jobs: {} };
				this.matchingJobNew = { ...response };       
			}
		}, error => {
		})
		this.subscriptions.push(sb);
	}

	/**
	**	To Click the previous and next Button,change the jobs
	**/
	
	onChangeUser = (type) => {
		const count = this.matchingJob && this.matchingJob.meta && this.matchingJob.meta.count ? this.matchingJob.meta.count : 0;
		if (type == 'next') {
			if (count > this.page) {
				if (this.matchingJobMeta.count > 1 && this.matchingJobMeta.count !== this.page) {
					//this.matchingJobNew = { ...this.matchingJobNew, jobs: {} };
					this.matchingJob = { ...this.matchingJob, jobs: {} };
					this.page++;
					this.onGetUserScoringById(true);
					if (count > this.page) {
						this.page++;
						setTimeout(() => {
							this.onGetUserScoringByIdNew();
						}, 300);
					};
				}
			}
		} else if (type == 'prev' && this.page > 2) {
			if (this.matchingJobMeta.count > 1 ) {
				//this.matchingJobNew = { ...this.matchingJobNew, jobs: {} };
				//this.matchingJob = { ...this.matchingJob, jobs: {} };
				this.page--;
				!this.isEven(this.page) && this.page--;
				this.onGetUserScoringByIdNew();
				if (count > this.page) {
					this.page--;
					setTimeout(() => {
						this.onGetUserScoringById(true); this.page++;
					}, 300);
				}
				this.matchingJobNew['jobs']['match_select'] = this.matchingJob['jobs']['match_select'];
			}
			
		}
	}
	
	
	/**
	**	To Check the previous and the next button 
	**/
	
	onChangeUsers = (type) => {
		const count = this.matchingJobMeta  && this.matchingJobMeta.count ? parseInt(this.matchingJobMeta.count) : 0;
		//var nxt : HTMLElement = document.getElementById('carouselProfile');
		var nxt1 : HTMLElement = document.getElementById('cardsliders');
		
		if(type == 'next') {
			nxt1.classList.add("slideanimations")
			//nxt.classList.add("slideanimations")
			setTimeout(()=>{
			//nxt.classList.remove('slideanimations')
		    nxt1.classList.remove('slideanimations')
			},1000)
			if (count > this.page) {
				if (this.matchingJobMeta.count > 1 && this.matchingJobMeta.count !== this.page) {
					/* this.matchingJob = { ...this.matchingJob, jobs: {} }; */
					this.page++;
					
					this.onGetUserScoringById(true);
				}
			}
		} else if (type == 'prev' && this.page > 1) {
		   nxt1.classList.add("slidearight")
		   // nxt.classList.add("slidearight")
			setTimeout(()=>{
			//nxt.classList.remove('slidearight')
		    nxt1.classList.remove('slidearight')
			},1000)
			if (this.matchingJobMeta.count > 1 ) {
				/* this.matchingJob = { ...this.matchingJob, jobs: {} }; */
				this.page--;				
				this.onGetUserScoringById(true);
			}
		}
		
	}
	
	/**
	**	To Checking the number is event or not
	**/
	
	isEven = (num) => {
		if(num % 2 == 0) {
			return true;
		}
		return false;
	}

	/**
	**	To Click back Button navigate to matches page
	**/
	
	onRedirectBack = () => {
		//this.location.back();
		this.router.navigate(['/user/dashboard'], {queryParams: {activeTab: 'matches'}})
	}

	/**
	**	To Open the job description in the model view
	**/
	
	onToggleJDModal = (status,description) => {
		this.isOpenedJDModal = status;
		this.description = description;
	}

	/**
	**	To Checking Array Values to string
	**/
	
	inArray(needle, haystack, matchAll = false) {
		if ((Array.isArray(needle) && Array.isArray(haystack)) && needle.length && haystack.length) {
			if (matchAll) {
				return needle.every(i => haystack.includes(i));
			} else {
				return needle.some(i => haystack.includes(i));
			}
		}
		return false;
	}

	/**
	**	While page is navigate the array content reloads again
	**/

	onChangeValue(array1: any[] = [], array2: any[] = [], type = 'array', field: string = 'id', filterArray: string = '') {
		if (array1 && array1.length && array2 && array2.length) {
			let result;
			if (type == 'array') {
				result = lodash.uniq([...array1, ...array2])
			}
			if (type == 'arrayObj') {
				result = lodash.uniqBy([...array1, ...array2], field)
			}
			if (result && result.length) {
				return result;
			}
		}
		return [];
	}

	/**
	**	To Change the array to lowerCase the string
	**/

	onLoweCase(array: any[] = []) {
		if (array && array.length) {
			return array.map(v => v.toLowerCase());
		}
	}

	/**
	**	To Checking difference between the two arrays
	**/

	onDiff = (arr1: any[] = [], arr2: any[] = []) => {
		if (arr1 && arr1.length && arr2 && arr2.length) {
			let difference = arr1
			.filter(x => !arr2.includes(x))
			.concat(arr2.filter(x => !arr1.includes(x)));
			return difference;
		}
		return [];
	}

	/**
	**	To Check the matches details with the string and numbers
	**/

	onChangeStringNumber(field1, field2, item, type, isString: boolean = false) {
		let lowerCaseJob = [];
		if (this.userInfo && this.userInfo[field1]) {
			lowerCaseJob = isString ? this.onLoweCase(this.userInfo[field1]) : this.userInfo[field1];
		}
		let lowerCaseUser = [];
		if (this.matchingJob && this.matchingJob.jobs && this.matchingJob.jobs[field2]) {
			lowerCaseUser = isString ? this.onLoweCase(this.matchingJob.jobs[field2]) : this.matchingJob.jobs[field2];
		}
		if (lowerCaseJob.includes(item.toLowerCase()) && type == 'check') {
			return { type: 'check', class: 'text-green' }
		} else if (!lowerCaseJob.includes(item?.toLowerCase()) && type == 'close') {
			return { type: 'close', class: 'text-danger' }
		}
		return { type: '', class: '' }
	}

	/**
	**	To Check the matches details with the Object data's
	**/

	onChangeObj(field1, field2, item, type, filterField) {
		let lowerCaseJob = [];
		if (this.userInfo && this.userInfo[field1]) {
			lowerCaseJob = this.userInfo[field1]
		}
		let lowerCaseUser = [];
		if (this.matchingJob && this.matchingJob.jobs && this.matchingJob.jobs[field2]) {
			lowerCaseUser = this.matchingJob.jobs[field2]
		}
		let jobIndex = lowerCaseJob.findIndex(val => val[filterField] == item[filterField]);
		let userIndex = lowerCaseUser.findIndex(val => val[filterField] == item[filterField])
		if (jobIndex > -1 && type == 'check') {
			return { type: 'check', class: 'text-green' }
		} else if (userIndex == -1 && type == 'close') {
			return { type: 'close', class: 'text-danger' }
		}
		return { type: '', class: '' }
	}

	/**
	**	To Open the toggle resume open
	**/

	onToggleResumeSelectModal = (status, item?) => {
		if (!this.utilsHelperService.isEmptyObj(item)) {
			this.currentJobDetails = item;
		}
		this.isOpenedResumeSelectModal = false;
		if(status ==true ){
			if(this.isMultipleMatches == true){
				if(this.currentJobDetails.id == this.matchingJob.jobs.id){
					this.matchingJob = { ...this.matchingJob, jobs: {} };
					this.page--;
					this.onGetUserScoringById(true);
				}else if(this.currentJobDetails.id == this.matchingJobNew.jobs.id){
					this.matchingJobNew = { ...this.matchingJobNew, jobs: {} };
					this.onGetUserScoringByIdNew();		
				}
			}else if(this.currentJobDetails.id == this.matchingJob.jobs.id){
				this.matchingJob = { ...this.matchingJob, jobs: {} };
				this.onGetUserScoringById(true);
			}
		}

	}
	
	/**
	**	To set the resume popup status
	**/
	
	onToggleResumeSelectModals = (status, item?) => {
		if (!this.utilsHelperService.isEmptyObj(item)) {
			this.currentJobDetails = item;
		}
		this.isOpenedResumeSelectModal = status;
	}

	/**
	**	To Show the matches details data's Shown
	**/

	onShowMatches = (event) => {
		var temp = event.target.className.split(' ');
		if(this.matchedElement == true){
			this.matchedElement = false;
		}else{
			this.matchedElement = true;
		}
		if(this.missingElement == false && this.matchedElement == false ){
			this.missingElement = true;
			this.matchedElement = true;
		}
	}

	/**
	**	To Show the missing details data's Shown
	**/

	onShowMissing = (event) => {
		var temp = event.target.className.split(' ');
		if(this.missingElement ==true){
			this.missingElement = false;
		}else{
			this.missingElement = true;
		}
		if(this.missingElement == false && this.matchedElement == false ){
			this.missingElement = true;
			this.matchedElement = true;
		}
	}
	
	/**
	**	To reset the fields
	**/

	onReset = () => {
		this.missingElement = true;
		this.matchedElement = true;
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
	
	
	@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
    @HostListener('window:popstate', ['$event'])
  onPopState(event) {
	this.router.events.subscribe((event: NavigationStart) => {
     if (event.navigationTrigger === 'popstate') {
	   this.onRedirectBack();
     }
   });
  }
}
