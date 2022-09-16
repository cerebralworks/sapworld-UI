import { Component, OnInit, TemplateRef, ViewChild,Input } from '@angular/core';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {PageEvent} from '@angular/material/paginator';
import { environment as env } from '@env';
import { Meta, MetaDefinition } from '@angular/platform-browser';
@Component({
  selector: 'app-posted-job',
  templateUrl: './posted-job.component.html',
  styleUrls: ['./posted-job.component.css']
})
export class PostedJobComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	@Input()screenWidth:any;
	public isLoading: boolean;
	public postedJobs: any[] = [];
	public postedJobsMatches: any[] = [];
	public postedJobsApplied: any[] = [];
	public postedJobsShortlist: any[] = [];
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [10, 25,50,100];
	public postedJobMeta: any = {};
	public currentEmployerDetails: any = {};
	public isDeleteModalOpened: boolean = false;
	public getDataCount: boolean = false;
	public currentJobDetails: any;
	public currentJobIndex: any;
	public statusGlossary: any;
	public mbRef: NgbModalRef;
	public mbRef1: NgbModalRef;
	public isShareModel: boolean = false;
	@ViewChild('statusModal', { static: false }) deleteModal: TemplateRef<any>;
	@ViewChild('shareModal', { static: false }) shareModal: TemplateRef<any>;
	public currentValueOfStatus: any;
	public currentValueOfJob: JobPosting;
	isStatusValue: any;
    public linkedInUrl:any;
	constructor(
		public employerService: EmployerService,
		private employerSharedService: EmployerSharedService,
		private router: Router,
		private modelService: NgbModal,
		private utilsHelperService: UtilsHelperService,
		private metaService: Meta
	) { }

	validateSubscribe = 0;
	
	/**
	**	To validate the params in init
	**	and, to get the employee profiles
	**/
	 	 
	ngOnInit(): void {
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
		this.employerService.profile().subscribe(
        details => {
          if(details) {
            this.currentEmployerDetails = details['details'];
				
					if(this.currentEmployerDetails.id && this.validateSubscribe == 0) {
						if(this.getDataCount == false){
							this.onGetPostedJobCount(this.currentEmployerDetails.id);
							this.onGetAppliedJobCount(this.currentEmployerDetails.id);
							this.onGetShortListJobCount(this.currentEmployerDetails.id);
							this.onGetJobCount(this.currentEmployerDetails.id);
							this.getDataCount = true;
						}
						this.onGetPostedJob(this.currentEmployerDetails.id);
						this.validateSubscribe ++;
					}
				}
			}
		)
		this.metaService.updateTag({ content: 'New Updated tags info'}, "property='og:title'");
	}
	
	/**
	**	To get the posted job details
	**/
	 	 
	onGetPostedJob(companyId, statusValue?: number) {
		this.isLoading = true;
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		if(statusValue != null) {
		  requestParams.status = statusValue;
		  this.postedJobs = [];
		}
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				this.postedJobs =[];
				if(response && response.items && response.items.length > 0) {
					if(statusValue != null) {
						this.postedJobs = [];
					}
					this.postedJobs = [...this.postedJobs, ...response.items];
				}
				this.postedJobMeta = { ...response.meta }
				if(this.postedJobMeta.total){
					this.length = this.postedJobMeta.total;
				}
				this.isLoading = false;
			}, error => {
				this.isLoading = false;
			}
		)
	}
	
	/**
	**	To view the status of the job details
	**/
	 	 
	onSelectStatus = (value: number, job: any) => {
		if (value && !this.utilsHelperService.isEmptyObj(job)) {
			this.currentValueOfStatus = value;
			this.currentValueOfJob = job;
			if(value==0){
				this.statusGlossary = "closed";	
			}if(value==1){
				this.statusGlossary = "active";	
			}else{
				this.statusGlossary = "paused";				
			}			
			this.onChangeStatus();
			/* this.mbRef = this.modelService.open(this.deleteModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			}); */
		}
	}
	
	/** To Open share Popup*/	
	openshare(id){
	   //this.linkedInUrl="https://www.linkedin.com/sharing/share-offsite/?url=http%3A%2F%2F149.56.180.254%2F%23%2Fuser%2Fjob-matches%2Fdetails%3Fid%3D37";
	   this.linkedInUrl ="https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(`${env.clientUrl}/#/user/job-matches/details?id=`)+id;
	   console.log(this.linkedInUrl);
		this.isShareModel=true;
		setTimeout(() => {
		 this.mbRef1 = this.modelService.open(this.shareModal, {
					windowClass: 'modal-holder',
					centered: true,
					keyboard: false
				});
		});
	}
	
	/** To Close share Popup*/
	closeshare(){
		this.isShareModel=false;
		this.mbRef1.close();
	}
	
	
	/**
	**	To change the status if job details 
	**/
	 	 
	onChangeStatus = () => {
		let requestParams: any = {};
		requestParams.id = this.currentValueOfJob.id;
		requestParams.location_id = this.currentValueOfJob['job_locations'][0]['id'];
		requestParams.status = parseInt(this.currentValueOfStatus);
		requestParams.status_glossary = this.statusGlossary;
		this.employerService.changeJobStatus(requestParams).subscribe(
			response => {
				//this.onStatusModelClose();
				this.onGetPostedJob(this.currentEmployerDetails.id);
				this.onGetPostedJobCount(this.currentEmployerDetails.id);
				this.onGetAppliedJobCount(this.currentEmployerDetails.id);
				this.onGetShortListJobCount(this.currentEmployerDetails.id);
				this.onGetJobCount(this.currentEmployerDetails.id);
				this.getDataCount = true;
			}, error => {
			}
		)
	}
	
	/**
	**	To cloase the status model
	**/
	 	 
	onStatusModelClose = () => {
		this.statusGlossary = "";
		this.mbRef.close();
	}
	
	/**
	**	To triggers the model Submit
	**/
	 	 
	onStatusModelSubmit = () => {
		if(this.statusGlossary) {
			this.onChangeStatus();
		}
	}
	
	/**
	**	To get the changed status value
	**/
	 	 
	onGetChangedStatus = (value: number) => {
		if(this.isStatusValue != value) {
			this.isStatusValue = value;
		}else {
			this.isStatusValue = null;
		}
		this.page = 1;
		this.limit = 10;
		this.onGetPostedJob(this.currentEmployerDetails.id, this.isStatusValue);
	}
	
	/**
	**	To delete job confirmation view open
	**/
	 	 
	onDeleteJobConfirm = (item, index) => {
		this.currentJobDetails = item;
		this.currentJobIndex = index;
		this.isDeleteModalOpened = true;
	}
	
	/**
	**	To click delete confirmed
	**/
	 	 
	onDeleteJobConfirmed = (status) => {
		if(status == true) {
			this.onDeletePostedJob();
		}else {
			this.isDeleteModalOpened = false;
		}
	}
	
	/**
	**	To delete the job details API calls
	**/
	 	 
	onDeletePostedJob() {
		this.isLoading = true;
		let requestParams: any = {};
		requestParams.ids = [parseInt(this.currentJobDetails.id)];
		this.employerService.deletePostedJob(requestParams).subscribe(
			response => {
				this.onDeleteJobConfirmed(false);
				if (this.currentJobIndex > -1) {
					this.postedJobs.splice(this.currentJobIndex, 1);
					this.postedJobMeta.total = this.postedJobMeta.total ? this.postedJobMeta.total - 1 : this.postedJobMeta.total;
				}
				this.onGetPostedJob(this.currentEmployerDetails.id);
				this.onGetPostedJobCount(this.currentEmployerDetails.id);
				this.onGetAppliedJobCount(this.currentEmployerDetails.id);
				this.onGetShortListJobCount(this.currentEmployerDetails.id);
				this.onGetJobCount(this.currentEmployerDetails.id);
				this.isLoading = false;
			}, error => {
				this.onDeleteJobConfirmed(false);
				this.isLoading = false;
			}
		)
	}
  	
	/**
	**	To get the posted job details Count
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
					this.postedJobsMatches=response['count'];
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
	**	To get the applied job details count
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
					this.postedJobsApplied=response['count'];
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
	**	To Shortlisted job details count
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
					this.postedJobsShortlist=response['count'];
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
	
	
	/**
	**	To assign the delete popup Text
	**/

	onConfirmDelete = () => {
		const x = confirm('Are you sure you want to delete?');
		if (x) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	**	To load more details of the posted job details
	**/
	 	 
	onLoadMoreJob = () => {
		this.page = this.page + 1;
		if(this.currentEmployerDetails.id) {
			this.onGetPostedJob(this.currentEmployerDetails.id);
		}
	}	
		
	/**
	**	To triggers when the pagination 
	**/
	 	 
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		if(this.currentEmployerDetails.id) {
		  this.onGetPostedJob(this.currentEmployerDetails.id);
		}
	}
		
	/**
	**	To check the matches details count with the id
	**/
	 	 
	CheckMatchesCount(id){
		if(id !=undefined && id!=null && id !='' ){
			var tempData= this.postedJobsMatches.filter(function(a,b){ return a.id == id  });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
		}
		return 0;
	}
	
	/**
	**	To check the Applied details count with the id
	**/
	
	CheckAppliedCount(id){
		if(id !=undefined && id!=null && id !='' ){
			var tempData= this.postedJobsApplied.filter(function(a,b){ return a.id == id });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
		}
		return 0;
	}
	
	/**
	**	To check the shortlisted details count with the id
	**/
	
	CheckShortlistedCount(id){
		if(id !=undefined && id!=null && id !='' ){
			var tempData= this.postedJobsShortlist.filter(function(a,b){ return a.id == id  });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
		}
		return 0;
	}

}
