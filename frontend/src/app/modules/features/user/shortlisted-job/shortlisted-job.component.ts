import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import {PageEvent} from '@angular/material/paginator';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
	selector: 'app-shortlisted-job',
	templateUrl: './shortlisted-job.component.html',
	styleUrls: ['./shortlisted-job.component.css']
})

export class ShortlistedJobComponent implements OnInit {
	
	public isOpenedResumeSelectModal: boolean = false;
	public userAccept: boolean = false;
	public shortlistJobs: any[] = [];
	public appliedJobMeta: any;
	public currentJobDetails: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	showFirstLastButtons = true;

	constructor(private userService: UserService,
    public utilsHelperService: UtilsHelperService) { }

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
				if(document.getElementById('shortlistedJob')){
					document.getElementById('shortlistedJob').innerHTML="("+response['meta']['total']+")";
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
	
	getIdVal(items){
		if(items){
			if(items['id']){
				var data = '#Open'+items['id']
				return data;
			}
		}
		return '#Open'
	}
	
	getIdVals(items){
		if(items){
			if(items['id']){
				var data = 'Open'+items['id']
				return data;
			}
		}
		return 'Open'
	}
	
	stopPropagation(event){
		if(event && event.path){
			if(event['path'][1]){
				if(event['path'][1]['href']){
					var temp= event['path'][1]['href'].split('/')
					temp = temp[temp.length-1];
					if(document.getElementById(temp)){
						document.getElementById(temp).setAttribute('href',temp);
					}
				}
			}

		}
	}
	
	onToggleResumeSelectModal = (status, item?) => {
    if(!this.utilsHelperService.isEmptyObj(item)) {
      this.currentJobDetails = item['job_posting'];
    }
		this.isOpenedResumeSelectModal = status;
		this.userAccept = status;
	}
	
	onToggleResumeSelectModalClose(status){
		if(status ==false){
			this.page = 1;
			this.onGetshortlistJobs();
		}
		this.isOpenedResumeSelectModal = false;
		this.userAccept = false;
	}
}
