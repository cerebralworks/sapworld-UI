import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-applied-job',
  templateUrl: './applied-job.component.html',
  styleUrls: ['./applied-job.component.css']
})
export class AppliedJobComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	public appliedJobs: any[] = [];
	public appliedJobMeta: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	showFirstLastButtons = true;

	/**	
	**	To implement the package section constructor
	**/
	
	constructor(
		private userService: UserService
	) { }

	/**
	**		When the page loads the OnInitCalls 
	**/
	
	ngOnInit(): void {
		this.onGetAppliedJobs();
	}

	/**
	**	To get the Applied Jobs Details API Calls
	**/

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
		  if(document.getElementById('appliedCountValue')){
				document.getElementById('appliedCountValue').innerHTML="("+this.appliedJobMeta.total+")";
			}
		  if(this.appliedJobMeta.total){
			  this.length =this.appliedJobMeta.total;
		  }
        }, error => {
        }
      )
	}

	/**
	**	To handle the pagination
	**/	
	
	handlePageEvent(event: PageEvent) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.onGetAppliedJobs();
	}

	/**
	**	To delete the job application API 
	**/	
	  
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
