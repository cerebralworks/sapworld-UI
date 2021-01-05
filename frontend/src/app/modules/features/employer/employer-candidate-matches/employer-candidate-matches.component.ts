import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-employer-candidate-matches',
  templateUrl: './employer-candidate-matches.component.html',
  styleUrls: ['./employer-candidate-matches.component.css']
})
export class EmployerCandidateMatchesComponent implements OnInit, OnDestroy {

  public isOpenedResumeModal: boolean;
  public isOpenedSendMailModal: boolean;
  public page: number = 1;
  public limit: number = 25;
  public userList: any[] = [];
  public userMeta: any;
  public userInfo: any;
  public postedJobs: any[] = [];
  public postedJobMeta: any;
  public selectedJob: any;
  public queryParams: any;

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private userService: UserService,
    private employerSharedService: EmployerSharedService,
    private employerService: EmployerService,
    private location: Location
  ) { }

  validateSubscribe = 0;
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        this.queryParams = {...params};
        if(this.queryParams&& this.queryParams.id) {
          this.selectedJob = {id: this.queryParams.id};
        }

      }
    });

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          if((details && details.id) && this.validateSubscribe == 0) {
            this.onGetPostedJob(details.id);
            this.validateSubscribe ++;
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.validateSubscribe = 0;
  }

  onSetJob = (item) =>{
    this.selectedJob = item;
    if(this.selectedJob && this.selectedJob.id) {
      this.userList = [];
      let url = this.router.createUrlTree(['/employer/dashboard'], {queryParams: {...this.queryParams, id: this.selectedJob.id}, relativeTo: this.route}).toString();
      this.location.go(url);
      this.onGetCandidateList(this.selectedJob.id);
    }

  }

  onGetPostedJob(companyId) {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
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
              this.onGetCandidateList(this.selectedJob.id);
            }else {
              this.selectedJob = this.postedJobs[0];
              this.onGetCandidateList(this.selectedJob.id);
            }

          }

        }
        this.postedJobMeta = { ...response.meta }

      }, error => {
      }
    )
  }

  onGetCandidateList(jobId) {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.status = 1;
    requestParams.skill_tags_filter_type = 1;
    requestParams.job_posting = jobId;

    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.userService.getUsers(removeEmpty).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.userList = [...response.items];
        }
        this.userMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    if(this.selectedJob &&this.selectedJob.id) {
      this.onGetCandidateList(this.selectedJob.id);
    }

  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
