import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employer-candidate-profile-view',
  templateUrl: './employer-candidate-profile-view.component.html',
  styleUrls: ['./employer-candidate-profile-view.component.css']
})
export class EmployerCandidateProfileViewComponent implements OnInit {

  public isOpenedResumeModal: boolean;
  public isOpenedSendMailModal: boolean;
  public userDetails: CandidateProfile;
  public userID: string;
  public jobId: string;
  public postedJobsDetails: JobPosting;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private location: Location,
    public utilsHelperService: UtilsHelperService,
    private employerService: EmployerService,
    private router: Router
  ) {
	  this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        let urlQueryParams = {...params};

        if(urlQueryParams && urlQueryParams.jobId) {
			sessionStorage.setItem('jobId',urlQueryParams.jobId);
        }
        if(urlQueryParams && urlQueryParams.id) {
			sessionStorage.setItem('userId',urlQueryParams.id);
        }
	}
	});
	 
	 var jobIds:any=0;
	 var userIds:any=0;
	 if(sessionStorage.getItem('jobId')){
		jobIds = parseInt(sessionStorage.getItem('jobId'));
	}if(sessionStorage.getItem('userId')){
		userIds = parseInt(sessionStorage.getItem('userId'));
	}
	 
    this.jobId = jobIds;
    this.userID = userIds;
	
    //this.userID = this.route.snapshot.queryParamMap.get('id');
    //this.jobId = this.route.snapshot.queryParamMap.get('jobId');
	this.router.navigate([], {queryParams: {id: null,jobId:null}, queryParamsHandling: 'merge'});
  }

  ngOnInit(): void {
    if(this.userID) {
      this.onGetCandidateInfo();
    }

    if(this.jobId) {
      this.onGetPostedJob();
    }
  }
onRedirectBack = () => {
    //this.location.back();
	this.router.navigate(['/employer/job-candidate-matches/details/view'], { queryParams: {jobId: this.jobId, userId: this.userID} });
  }
  onGetPostedJob() {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = this.jobId;
    this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
        if (response && response.details) {
          this.postedJobsDetails = response.details;
        }
      }, error => {
      }
    )
  }

  onGetCandidateInfo() {
    let requestParams: any = {};
    requestParams.id = this.userID;
    this.userService.profileView(requestParams).subscribe(
      response => {
        if(response && response.details) {
          this.userDetails = {...response.details, meta: response.meta};
        }
      }, error => {
      }
    )
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
