import { Component, OnInit } from '@angular/core';
import { EmployerService } from '@data/service/employer.service';

@Component({
  selector: 'app-posted-job',
  templateUrl: './posted-job.component.html',
  styleUrls: ['./posted-job.component.css']
})
export class PostedJobComponent implements OnInit {
  public isLoading: boolean;
  public postedJobs: any;

  constructor(
    public employerService: EmployerService
  ) { }

  ngOnInit(): void {
    this.onGetPostedJob();
  }

  onGetPostedJob() {
    this.isLoading = true;
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getPostedJob(requestParams).subscribe(
      response => {
        this.postedJobs = response;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    )
  }

}
