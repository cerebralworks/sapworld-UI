import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';

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

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService,
    private location: Location
    ) {
    this.jobId = this.route.snapshot.paramMap.get('id');
   }

  ngOnInit(): void {
    if(this.jobId) {
      this.onGetPostedJob()
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

}
