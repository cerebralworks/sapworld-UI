import { Component, OnInit } from '@angular/core';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';

@Component({
  selector: 'app-posted-job',
  templateUrl: './posted-job.component.html',
  styleUrls: ['./posted-job.component.css']
})
export class PostedJobComponent implements OnInit {
  public isLoading: boolean;
  public postedJobs: any[] = [];
  public page: number = 1;
  public limit: number = 25;
  public postedJobMeta: any = {};
  public currentEmployerDetails: any = {};

  constructor(
    public employerService: EmployerService,
    private employerSharedService: EmployerSharedService
  ) { }

  validateSubscribe = 0;
  ngOnInit(): void {
    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          this.currentEmployerDetails = details;
          if(this.currentEmployerDetails.id && this.validateSubscribe == 0) {
            this.onGetPostedJob(this.currentEmployerDetails.id);
            this.validateSubscribe ++;
          }
        }
      }
    )
  }

  onGetPostedJob(companyId) {
    this.isLoading = true;
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    requestParams.company = companyId;
    requestParams.sort = 'created_at.desc';
    this.employerService.getPostedJob(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.postedJobs = [...this.postedJobs, ...response.items];
        }
        this.postedJobMeta = { ...response.meta }

        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    )
  }

  onDeletePostedJob(jobId, index) {
    if (this.onConfirmDelete()) {
      this.isLoading = true;
      let requestParams: any = {};
      requestParams.ids = [parseInt(jobId)];

      this.employerService.deletePostedJob(requestParams).subscribe(
        response => {
          if (index > -1) {
            this.postedJobs.splice(index, 1);
            this.postedJobMeta.total = this.postedJobMeta.total ? this.postedJobMeta.total - 1 : this.postedJobMeta.total;
          }
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
        }
      )
    }

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

}
