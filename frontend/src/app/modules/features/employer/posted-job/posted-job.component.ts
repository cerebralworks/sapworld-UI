import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-posted-job',
  templateUrl: './posted-job.component.html',
  styleUrls: ['./posted-job.component.css']
})
export class PostedJobComponent implements OnInit {
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

  @ViewChild('statusModal', { static: false }) deleteModal: TemplateRef<any>;
  public currentValueOfStatus: any;
  public currentValueOfJob: JobPosting;
  isStatusValue: any;

  constructor(
    public employerService: EmployerService,
    private employerSharedService: EmployerSharedService,
    private router: Router,
    private modelService: NgbModal,
    private utilsHelperService: UtilsHelperService
  ) { }

  validateSubscribe = 0;
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          this.currentEmployerDetails = details;
          if(this.currentEmployerDetails.id && this.validateSubscribe == 0) {
            if(this.getDataCount == false){
				this.onGetPostedJobCount(this.currentEmployerDetails.id);
				this.onGetAppliedJobCount(this.currentEmployerDetails.id);
				this.onGetShortListJobCount(this.currentEmployerDetails.id);
				this.getDataCount = true;
			}
			this.onGetPostedJob(this.currentEmployerDetails.id);
            this.validateSubscribe ++;
          }
        }
      }
    )
  }

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

  onSelectStatus = (value: number, job: any) => {
    if (value && !this.utilsHelperService.isEmptyObj(job)) {
      this.currentValueOfStatus = value;
      this.currentValueOfJob = job;
      this.mbRef = this.modelService.open(this.deleteModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  onChangeStatus = () => {
    let requestParams: any = {};
    requestParams.id = this.currentValueOfJob.id;
    requestParams.status = parseInt(this.currentValueOfStatus);
    requestParams.status_glossary = this.statusGlossary;

    this.employerService.changeJobStatus(requestParams).subscribe(
      response => {
        this.onStatusModelClose();
      }, error => {
      }
    )
  }

  onStatusModelClose = () => {
    this.statusGlossary = "";
    this.mbRef.close();
  }

  onStatusModelSubmit = () => {
    if(this.statusGlossary) {
      this.onChangeStatus();
    }
  }

  onGetChangedStatus = (value: number) => {
    if(this.isStatusValue != value) {
      this.isStatusValue = value;
    }else {
      this.isStatusValue = null;
    }
    this.onGetPostedJob(this.currentEmployerDetails.id, this.isStatusValue);
  }

  onDeleteJobConfirm = (item, index) => {
    this.currentJobDetails = item;
    this.currentJobIndex = index;
    this.isDeleteModalOpened = true;
  }

  onDeleteJobConfirmed = (status) => {
    if(status == true) {
      this.onDeletePostedJob();
    }else {
      this.isDeleteModalOpened = false;
    }
  }

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
        this.isLoading = false;
      }, error => {
        this.onDeleteJobConfirmed(false);
        this.isLoading = false;
      }
    )
  }
  
  
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
  

  onConfirmDelete = () => {
    const x = confirm('Are you sure you want to delete?');
    if (x) {
      return true;
    } else {
      return false;
    }
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    if(this.currentEmployerDetails.id) {
      this.onGetPostedJob(this.currentEmployerDetails.id);
    }
  }
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		if(this.currentEmployerDetails.id) {
		  this.onGetPostedJob(this.currentEmployerDetails.id);
		}
	}
	
	CheckMatchesCount(id){
	  if(id !=undefined && id!=null && id !=''){
		  var tempData= this.postedJobsMatches.filter(function(a,b){ return a.id == id });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
	  }
	  return 0;
  }
	CheckAppliedCount(id){
	  if(id !=undefined && id!=null && id !=''){
		  var tempData= this.postedJobsApplied.filter(function(a,b){ return a.id == id });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
	  }
	  return 0;
  }
	CheckShortlistedCount(id){
	  if(id !=undefined && id!=null && id !=''){
		  var tempData= this.postedJobsShortlist.filter(function(a,b){ return a.id == id });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
	  }
	  return 0;
  }

}
