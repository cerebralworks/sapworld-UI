import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-applied-job',
  templateUrl: './applied-job.component.html',
  styleUrls: ['./applied-job.component.css']
})
export class AppliedJobComponent implements OnInit {
  public appliedJobs: any[] = [];
  public appliedJobMeta: any;
  public page: number = 1;
  public limit: number = 25;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.onGetAppliedJobs();
  }


  onGetAppliedJobs = () => {
      let requestParams: any = {};
      requestParams.page = this.page;
      requestParams.limit = this.limit;
      requestParams.expand = "job_posting,user";
      this.userService.applicationsListForUser(requestParams).subscribe(
        response => {
          if(response && response.items && response.items.length > 0) {
            this.appliedJobs = [...this.appliedJobs, ...response.items];
          }
          this.appliedJobMeta = { ...response.meta }
        }, error => {
        }
      )
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    this.onGetAppliedJobs();
  }

}
