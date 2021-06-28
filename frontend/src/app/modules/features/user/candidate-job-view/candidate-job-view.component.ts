import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-candidate-job-view',
  templateUrl: './candidate-job-view.component.html',
  styleUrls: ['./candidate-job-view.component.css']
})
export class CandidateJobViewComponent implements OnInit {

  public postedJobsDetails: JobPosting;
  public jobId: string;
  public isOpenedJDModal: boolean;

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService,
    public utilsHelperService: UtilsHelperService,
    private location: Location,
    public sharedService: SharedService
  ) {
    this.jobId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

    if(this.jobId) {
      this.onGetPostedJobDetails();
    }
  }

  onGetPostedJobDetails() {
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

}
