import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
	selector: 'app-shortlisted-job',
	templateUrl: './shortlisted-job.component.html',
	styleUrls: ['./shortlisted-job.component.css']
})

export class ShortlistedJobComponent implements OnInit {
	
	public shortlistJobs: any[] = [];
	public appliedJobMeta: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	showFirstLastButtons = true;

	constructor(private userService: UserService) { }

	ngOnInit(): void {
		this.onGetshortlistJobs();
	}

	onGetshortlistJobs = () => {
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.short_listed = 1;
		requestParams.expand = "job_posting,user,employer";
		this.userService.applicationsListForUser(requestParams).subscribe(
		response => {
			this.shortlistJobs=[];
			if(response && response.items && response.items.length > 0) {
				this.shortlistJobs = [...this.shortlistJobs, ...response.items];
			}
			this.appliedJobMeta = { ...response.meta }
			if(response && response['meta'] && response['meta']['total'] ) {
				if(document.getElementById('appliedCountValue')){
					document.getElementById('appliedCountValue').innerHTML="("+response['meta']['total']+")";
				}
			}
			if(this.appliedJobMeta.total){
				this.length =this.appliedJobMeta.total;
			}
		}, error => {
		
		})
	}

	handlePageEvent(event: PageEvent) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.onGetshortlistJobs();
	}

	deleteJobApplication = (id) => {
		let requestParams: any = {};
		requestParams.id = id;
		this.userService.deleteJobApplication(requestParams).subscribe(
		response => {
			console.log(response);
			this.onGetshortlistJobs();
		}, error => {
			this.onGetshortlistJobs();
		})
	}

}
