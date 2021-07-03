import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-applied-job',
  templateUrl: './applied-job.component.html',
  styleUrls: ['./applied-job.component.css']
})
export class AppliedJobComponent implements OnInit {
  public appliedJobs: any[] = [];
  public appliedJobMeta: any;
  public page: number = 1;
  public limit: number = 10;
  length = 0;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons = true;

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
      requestParams.expand = "job_posting,user,employer";
      this.userService.applicationsListForUser(requestParams).subscribe(
        response => {
			this.appliedJobs=[];
          if(response && response.items && response.items.length > 0) {
            this.appliedJobs = [...this.appliedJobs, ...response.items];
          }
          this.appliedJobMeta = { ...response.meta }
		  if(this.appliedJobMeta.total){
			  this.length =this.appliedJobMeta.total;
		  }
        }, error => {
        }
      )
  }

  handlePageEvent(event: PageEvent) {
	  
    this.page = event.pageIndex + 1;
    this.onGetAppliedJobs();
  }
  
  
  deleteJobApplication = (id) => {
      let requestParams: any = {};
      requestParams.id = id;
      this.userService.deleteJobApplication(requestParams).subscribe(
        response => {
			console.log(response);
			this.onGetAppliedJobs();
        }, error => {
			this.onGetAppliedJobs();
        }
      )
  }

}
