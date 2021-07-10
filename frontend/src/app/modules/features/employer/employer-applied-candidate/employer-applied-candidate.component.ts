import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-employer-applied-candidate',
  templateUrl: './employer-applied-candidate.component.html',
  styleUrls: ['./employer-applied-candidate.component.css']
})
export class EmployerAppliedCandidateComponent implements OnInit {
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
  public postedJobs: any[] = [];
  public TotalCount: any[] = [];
  public Company: any ='';
  public validateSubscribe: number = 0;
  public shortlistModal: any = null;

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

  ngOnInit(): void {

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          if((details && details.id) && this.validateSubscribe == 0) {
			  this.Company = details.id;
            this.onGetPostedJob(details.id);
            this.onGetPostedJobCount(details.id);
            this.validateSubscribe ++;
          }
        }
      }
    )
  }

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
      }, error => {
      }
    )
  }
  
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
		if(response['count']){
			this.TotalCount =response['count'];
			var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
			if(document.getElementById('ApplicantsCount')){
				document.getElementById('ApplicantsCount').innerHTML="("+TotalValue+")";
			}
			
		}else{
			
		}
      }, error => {
      }
    )
  }
  
  checkDataCount(id){
	  if(id !=undefined && id!=null && id !=''){
		  var tempData= this.TotalCount.filter(function(a,b){ return a.id == id });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
	  }
	  return 0;
  }

  onGetAppliedJobs = () => {
      let requestParams: any = {};
      requestParams.page = this.page;
      requestParams.limit = this.limit;
      requestParams.expand = "job_posting,user,employer";
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

  onShortListUser = (item, values) => {
    if((values == 'true' || values == 'null'|| values == 'false')) {
      if((this.selectedJob && this.selectedJob.id) && (item.user && item.user.id)) {
        let requestParams: any = {};
        requestParams.job_posting = this.selectedJob.id;
        requestParams.user = item.user.id;
        requestParams.short_listed = values == 'true' ? true : false;
		if(values == 'null'){
			requestParams.short_listed =null;
		}
        this.employerService.shortListUser(requestParams).subscribe(
          response => {
			  if(response['details']['short_listed']==true){
					this.onGetPostedJobCount(this.Company);
					this.onGetAppliedJobs();
			  }else{
				this.appliedJobs = this.appliedJobs.map((value) => {
				  if(value.id == item.id) {
					value.short_listed = response['details']['short_listed'];
				  }
				  return value;
				});
			  }
          }, error => {
          }
        )
      }else {
        this.toastrService.error('Something went wrong, please try again', 'Failed')
      }
    }

  }

  handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
    this.onGetAppliedJobs();
  }

}
