import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
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
    public sharedService: SharedService,
    private router: Router
  ) {
	  
	  this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        let urlQueryParams = {...params};

        if(urlQueryParams && urlQueryParams.id) {
			sessionStorage.setItem('view-job-id',urlQueryParams.id);
        }
	}
	});
	this.router.navigate([], {queryParams: {id: null}, queryParamsHandling: 'merge'});
	var jobIds:any = 0;
	if(sessionStorage.getItem('view-job-id')){
		jobIds = parseInt(sessionStorage.getItem('view-job-id'));
	}
	
    //this.jobId = this.route.snapshot.paramMap.get('id');
    this.jobId = jobIds;
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
   // this.location.back();
   
   this.router.navigate(['/user/job-matches/details'], {queryParams: {id: this.jobId}});
   
  }
  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

}
