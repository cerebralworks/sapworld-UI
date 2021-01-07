import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { SharedService } from '@shared/service/shared.service';

@Component({
  selector: 'app-employer-candidate-profile-matches',
  templateUrl: './employer-candidate-profile-matches.component.html',
  styleUrls: ['./employer-candidate-profile-matches.component.css']
})
export class EmployerCandidateProfileMatchesComponent implements OnInit {

  public isOpenedJDModal: boolean = false;
  public isOpenedResumeModal: boolean = false;
  public isOpenedOtherPostModal: boolean = false;
  public jobId: string;
  public postedJobsDetails: any;
  public page: number = 0;
  public userId: string;
  public matchingUsers: any = {};

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService,
    private location: Location,
    public utilsHelperService: UtilsHelperService,
    public sharedService: SharedService
    ) {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.userId = this.route.snapshot.paramMap.get('userId');
   }

  ngOnInit(): void {
    if(this.jobId && this.userId) {
      this.onGetPostedJob();
      this.onGetJobScoringById();
    }
  }

  onGetPostedJob() {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = this.jobId;
    this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
        if(response && response.details) {
          this.postedJobsDetails = response.details;
        }
      }, error => {
      }
    )
  }

  onGetJobScoringById = () => {
    let requestParams: any = {};
    if(this.page == 0) {
      requestParams.user_id = this.userId;
    }
    requestParams.id = this.jobId;
    requestParams.page = this.page;

    this.employerService.getJobScoring(requestParams).subscribe(
      response => {
        if(response && !this.utilsHelperService.isEmptyObj(response.profile)) {
          this.matchingUsers = {...response}
        }

      }, error => {
      }
    )
  }

  onChangeUser = (type) => {
    if(type == 'next') {
      this.page++;
      this.onGetJobScoringById();
    }else if(type == 'prev' && this.page > 0) {
    //  let index = this.matchingUsers.findIndex((val) => {
    //    console.log(val);

    //     return parseInt(val.id) == parseInt(item.id)
    //   })
    //   if(index > -1) {
    //     this.matchingUsers.splice(index, 0)
    //   }
      this.page--;
      if(this.page <= 0) {
        this.onGetJobScoringById();
      }

    }

  }

  onRedirectBack = () => {
    this.location.back();
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleOtherPostModal = (status) => {
    this.isOpenedOtherPostModal = status;
  }

  inArray(needle, haystack, matchAll = false) {
    if((Array.isArray(needle) && Array.isArray(haystack)) && needle.length && haystack.length) {
      if (matchAll) {
        return needle.every(i => haystack.includes(i));
    } else {
        return needle.some(i => haystack.includes(i));
    }
    }
    return false;
}

}
