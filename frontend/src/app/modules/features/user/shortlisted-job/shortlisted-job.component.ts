import { Component, OnInit,Input } from '@angular/core';
import { UserService } from '@data/service/user.service';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
	selector: 'app-shortlisted-job',
	templateUrl: './shortlisted-job.component.html',
	styleUrls: ['./shortlisted-job.component.css']
})

export class ShortlistedJobComponent implements OnInit {
	
	/**
	**	Variable declaration 
	**/
	
	@Input()screenWidth:any;
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
	
	
	/**
	**	To initialize the page calls
	**/	
	 
	ngOnInit(): void {
		this.onGetshortlistJobs();
	}

	/**
	**	To Get the shortlisted jobs
	**/	
	  
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

	/**
	**	To check the pagination changes
	**/	
	  
	handlePageEvent(event: PageEvent) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.onGetshortlistJobs();
	}

	/**
	**	To delete the job application 
	**/	
	  
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
	
	/**
	**	To assign the collapse id and href
	**/	
	  
	getIdVal(items){
		if(items){
			if(items['id']){
				var data = '#Open'+items['id']
				return data;
			}
		}
		return '#Open'
	}
	
	/**
	**	To assign the close collapse id
	**/	
	  
	getIdVals(items){
		if(items){
			if(items['id']){
				var data = 'Open'+items['id']
				return data;
			}
		}
		return 'Open'
	}
	
	/**
	**	To set the href for close id
	**/	
	  
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
	
	/**
	**	To Open the resume model popup
	**/	
	  
	onToggleResumeSelectModal = (status, item?) => {
    if(!this.utilsHelperService.isEmptyObj(item)) {
      this.currentJobDetails = item['job_posting'];
    }
		this.isOpenedResumeSelectModal = status;
		this.userAccept = status;
	}
	
	/**
	**	To Close the resume model popup
	**/	
	  
	onToggleResumeSelectModalClose(status){
		if(status ==false){
			this.page = 1;
			this.onGetshortlistJobs();
		}
		this.isOpenedResumeSelectModal = false;
		this.userAccept = false;
	}
}
