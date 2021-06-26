import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private employerService: EmployerService
  ) {
    this.userID = this.route.snapshot.queryParamMap.get('id');
    this.jobId = this.route.snapshot.queryParamMap.get('jobId');
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
    this.location.back();
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
