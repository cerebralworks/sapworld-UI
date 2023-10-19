import { Location } from '@angular/common';
import { Component,EventEmitter,Output,Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';

@Component({
  selector: 'app-employer-applied-candidate',
  templateUrl: './employer-applied-candidate.component.html',
  styleUrls: ['./employer-applied-candidate.component.css']
})
export class EmployerAppliedCandidateComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	@Input()screenWidth:any;
	@Output() onEvent = new EventEmitter<boolean>();
	public appliedJobs: any[] = [];
	public appliedJobMeta: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	public selectedJob: any;
	public queryParams: any;
	public postedJobMeta: any;
	public employerDetails: any;
	public postedJobs: any[] = [];
	public TotalCount: any[] = [];
	public Company: any ='';
	public validateSubscribe: number = 0;
	public shortlistModal: any = null;
	public showCount: boolean = false;
	public showJob: boolean = false;

	constructor(
		private employerService: EmployerService,
		public utilsHelperService: UtilsHelperService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private employerSharedService: EmployerSharedService,
		private toastrService: ToastrService
	) {
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.id) {
					this.selectedJob = {id: urlQueryParams.id};
					sessionStorage.setItem('view-application-job-id',urlQueryParams.id);
				}
				this.queryParams = {...this.queryParams, ...urlQueryParams };
			}
		});
		this.router.navigate([], {queryParams: {id: null}, queryParamsHandling: 'merge'});
	}

	/**
	**	To Initialize the page loads
	**/	
	  
	ngOnInit(): void {
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				this.employerDetails = details;
				if(details) {
					if((details && details.id) && this.validateSubscribe == 0) {
						this.Company = details.id;
						this.onGetPostedJobCount(details.id);
						this.validateSubscribe ++;
					}
				}
			}
		)
	}

	/**
	**	To Change the jobs applied candidate
	**/	
	  
	onSetJob = (item) =>{
		this.page=1;
		this.limit =10;
		this.selectedJob = item;
		if(this.selectedJob && this.selectedJob.id) {
			sessionStorage.setItem('view-application-job-id',this.selectedJob.id);
			this.appliedJobs = [];
			const removeEmpty = this.utilsHelperService.clean(this.queryParams);
			let url = this.router.createUrlTree(['/employer/dashboard'], {queryParams: {...removeEmpty, id: this.selectedJob.id}, relativeTo: this.route}).toString();
			//this.location.go(url);
			this.onGetAppliedJobs();
		}
	}

	/**
	**	To Get the posted jobs details
	**/	
	  
	onGetPostedJob(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					this.postedJobs = response.items;
					if(this.postedJobs && this.postedJobs.length && this.postedJobs[0]) {
						if(this.selectedJob && this.selectedJob.id) {
							const filterJob = this.postedJobs.find((val) => {
								if(this.selectedJob && this.selectedJob.id)
								return parseInt(val.id) == parseInt(this.selectedJob.id);
							});
							if(filterJob && !this.utilsHelperService.isEmptyObj(filterJob)) {
								this.selectedJob = filterJob;
							}
							this.onGetAppliedJobs();
						}else {
							if(!sessionStorage.getItem('view-application-job-id')){
								this.selectedJob = this.postedJobs[0];
							}else{
								var ids = parseInt(sessionStorage.getItem('view-application-job-id'));
								var temps = this.postedJobs.filter(function(a,b){ return a.id==ids })
								if(temps.length==1){
									this.selectedJob = temps[0];
								}else{
									this.selectedJob = this.postedJobs[0];
								}
							}
							this.onGetAppliedJobs();              
						}
					}
				}
				this.postedJobMeta = { ...response.meta };
				this.showJob = true;
			}, error => {
			}
		)
	}
  
	/**
	**	To Get the applied jobs Count
	**/	
	  
	onGetPostedJobCount(companyId) {
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
				this.onGetPostedJob(this.employerDetails.id);
				if(response['count']){
					if(!this.selectedJob){
						this.selectedJob ={id:' '};
						var tempLen =response['count'].length-1;
						this.selectedJob.id = response['count'][tempLen]['id'];
						this.onGetAppliedJobs();
					}
					this.TotalCount =response['count'];
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('ApplicantsCount')){
						document.getElementById('ApplicantsCount').innerHTML="("+TotalValue+")";
					}
				}else{
			
				}
				this.showCount = true;
			}, error => {
			}
		)
	}
  
	/**
	**	To Check the data count id based on job select
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
	**	To Get the applied jobs
	**/	
	  
	onGetAppliedJobs = () => {
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.expand = "job_posting,user,employer";
		requestParams.sort = "updated_at.desc";
		requestParams.job_posting = this.selectedJob.id;
		this.employerService.applicationsList(requestParams).subscribe(
			response => {
				this.appliedJobs =[];
				if(response && response.items && response.items.length > 0) {
					this.appliedJobs = [...this.appliedJobs, ...response.items];
				}
				this.appliedJobMeta = { ...response.meta }
				if(document.getElementById('ApplicantsCount')){
					//document.getElementById('ApplicantsCount').innerHTML="("+this.appliedJobMeta.total+")";
				}
				if(this.appliedJobMeta.total){
					this.length = this.appliedJobMeta.total;
				}
			}, error => {
			}
		)
	}

	/**
	**	To Get the applied jobs users
	**/	
	  
	onShortListUser = (item, values) => {
		if((values == 'true' || values == 'null'|| values == 'false')) {
			if((this.selectedJob && this.selectedJob.id) && (item.user && item.user.id)) {
				let requestParams: any = {};
				requestParams.job_posting = this.selectedJob.id;
				requestParams.user = item.user.id;
				requestParams.short_listed = values == 'true' ? true : false;
				requestParams.view = false;
				if(values == 'null'){
					requestParams.short_listed =null;
					requestParams.application_status =null;
				}else{					
					requestParams.application_status =[{'id':1,'status':'APPLICATION UNDER REVIEW', 'date': new Date(),'comments':' ' }];
				}
				if(requestParams.short_listed ==false ){
					requestParams.application_status =[{'id':98,'status':'Not Fit for this Job', 'date': new Date(),'comments':' ' }]
				}else{					
					requestParams.application_status =[{'id':1,'status':'APPLICATION UNDER REVIEW', 'date': new Date(),'comments':' ' }];
				}
				this.employerService.shortListUser(requestParams).subscribe(
					response => {
						this.onEvent.emit(true);
						this.onGetPostedJobCount(this.Company);
						this.onGetAppliedJobs();
						/* if(response['details']['short_listed']==true){
							this.onGetPostedJobCount(this.Company);
							this.onGetAppliedJobs();
						}else{
							this.appliedJobs = this.appliedJobs.map((value) => {
								if(value.id == item.id) {
									value.short_listed = response['details']['short_listed'];
								}
								return value;
							});
						} */
					}, error => {
						this.onEvent.emit(true);
					}
				)
			}else {
				this.toastrService.error('Something went wrong, please try again' ,'', {
		  timeOut: 2500
		})
			}
		}
	}

	/**
	**	To Check the pagination changes
	**/	
	  
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		this.onGetAppliedJobs();
	}
	
	/**
	**	To filter the Location
	**/
	
	checkCity(itemValue,val){
		
		if(itemValue && itemValue.job_location && itemValue.job_posting &&  itemValue.job_posting.job_locations){
			if(itemValue.job_posting.job_locations.length !=0){
				var filterItem = itemValue.job_posting.job_locations.filter(function(a,b){ return a.id == itemValue.job_location});
				if(filterItem.length !=0){
					return filterItem[0][val]
				}
			}
		}
		
		var temp ='';
		return temp;
	}
	
}
