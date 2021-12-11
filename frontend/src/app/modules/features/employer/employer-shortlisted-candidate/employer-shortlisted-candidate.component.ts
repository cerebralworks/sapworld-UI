import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component,ViewEncapsulation, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-employer-shortlisted-candidate',
  templateUrl: './employer-shortlisted-candidate.component.html',
  styleUrls: ['./employer-shortlisted-candidate.component.css']
})
export class EmployerShortlistedCandidateComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	@Input()screenWidth:any;
	public shortListedJobs: any[] = [];
	public shortListedMeta: any;
	public itemsData: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	public selectedJob: any;
	public queryParams: any;
	public postedJobMeta: any;
	public employeeValue: any;
	public tempItem: any;
	public tempValue: any;
	public selectedStatusMessage: any;
	public inviteUrlLink: any ='';
	public messagePopupValueStatus: any='';
	public selectedStatusValue: any;
	public messagePopupValue: any;
	public postedJobs: any[] = [];
	public TotalCount: any[] = [];
	public statusvalue: any[] = [
	{id:1,text:'APPLICATION UNDER REVIEW'},
	{id:2,text:'Hired'},
	{id:3,text:'Interview Scheduled'},
	{id:4,text:'Rejected'},
	{id:5,text:'On Hold'},
	{id:6,text:'Not Available'}
	];
	public validateSubscribe: number = 0;
	public isCheckModel: boolean = false;
	public isErrorShown: boolean = false;
	public isErrorShownValue: boolean = false;
	public statusVal: boolean = false;
	public showJobs: boolean = false;
	public checkModalRef: NgbModalRef;
	@ViewChild("checkModal", { static: false }) checkModal: TemplateRef<any>;
	public showCount: boolean = false;
	public showJob: boolean = false;
	public showInput: boolean = false;
	public isOpenInviteUrl: boolean = false;
	public inviteRef: NgbModalRef;
	@ViewChild("InviteModel", { static: false }) InviteModel: TemplateRef<any>;
	public isOpenHistory: boolean = false;
	public historyRef: NgbModalRef;
	@ViewChild("HistoryModel", { static: false }) HistoryModel: TemplateRef<any>;
	public isResendURL: boolean = false;
	public ResendRef: NgbModalRef;
	@ViewChild("ResendURLModel", { static: false }) ResendURLModel: TemplateRef<any>;

	constructor(
		private employerService: EmployerService,
		private modalService: NgbModal,
		public utilsHelperService: UtilsHelperService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private employerSharedService: EmployerSharedService
	) {
		
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.id) {
					this.selectedJob = {id: urlQueryParams.id};
				}
				this.queryParams = {...this.queryParams, ...urlQueryParams };
			}
		});
	}

	/**
	**	TO initialize the function triggers
	**	To get the employer details
	**/
	 
	ngOnInit(): void {
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				this.employeeValue =details;
				if(details) {
					if((details && details.id) && this.validateSubscribe == 0) {
						
						this.onGetPostedJobCount(details.id);
						//this.onGetPostedJob(details.id); 
						
						this.validateSubscribe ++;
					}
				}
			}
		)
	}

	/**
	**	TO Set the new selected job
	**/
	 
	onSetJob = (item) =>{
		this.page=1;
		this.limit =10;
		this.selectedJob = item;
		if(this.selectedJob && this.selectedJob.id) {
			this.shortListedJobs = [];
			const removeEmpty = this.utilsHelperService.clean(this.queryParams);
			let url = this.router.createUrlTree(['/employer/dashboard'], {queryParams: {...removeEmpty, id: this.selectedJob.id}, relativeTo: this.route}).toString();
			this.location.go(url);
			this.onGetShortListedJobs();
		}
	}

	/**
	**	TO Get the posted job details 
	**/
	 
	onGetPostedJob(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					this.postedJobs = response.items;
					this.showJobs = true;
					if(this.postedJobs && this.postedJobs.length && this.postedJobs[0]) {
						if(this.selectedJob && this.selectedJob.id) {
							const filterJob = this.postedJobs.find((val) => {
								if(this.selectedJob && this.selectedJob.id)
								return parseInt(val.id) == parseInt(this.selectedJob.id);
							});
							if(filterJob && !this.utilsHelperService.isEmptyObj(filterJob)) {
								this.selectedJob = filterJob;
							}
							this.onGetShortListedJobs();
						}else {
							this.selectedJob = this.postedJobs[0];
							this.onGetShortListedJobs();
						}
					}
				}
				this.postedJobMeta = { ...response.meta };
				this.showJob = true;
			}, error => {
			}
		)
	}
  
	/**
	**	TO get the count details
	**/
	 
	checkDataCount(id,location_id){
		if(id !=undefined && id!=null && id !='' && location_id !=undefined && location_id!=null && location_id !=''){
			var tempData= this.TotalCount.filter(function(a,b){ return a.id == id && a.location_id == location_id });
				if(tempData.length==1){
					return tempData[0]['count'];
				}
		}
		return 0;
	}
  
	/**
	**	TO get the posted job details for shortlisted user Count
	**/
	 
	onGetPostedJobCount(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.status = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.view = 'shortlisted';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				this.onGetPostedJob(this.employeeValue.id); 
				if(response['count']){
					if(!this.selectedJob){
						this.selectedJob ={id:' '};
						var tempLen =response['count'].length-1;
						this.selectedJob.id = response['count'][tempLen]['id'];
						this.onGetShortListedJobs();
					}
					
					this.TotalCount =response['count'];
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('ApplicantsShortListCount')){
						document.getElementById('ApplicantsShortListCount').innerHTML="("+TotalValue+")";
					}
				}else{
			
				}
				this.showCount =true;
			}, error => {
			}
		)
	}

	/**
	**	TO get the shortlisted user details
	**/
	 
	onGetShortListedJobs = () => {
		
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.expand = "job_posting,user,employer";
		requestParams.sort = "updated_at.desc";
		requestParams.job_posting = this.selectedJob.id;
		requestParams.short_listed = 1;
		this.employerService.applicationsList(requestParams).subscribe(
			response => {
				this.shortListedJobs =[];
				if(response && response.items && response.items.length > 0) {
					this.shortListedJobs = [...this.shortListedJobs, ...response.items];
				}
				this.shortListedMeta = { ...response.meta }
				if(this.shortListedMeta.total){
					this.length = this.shortListedMeta.total;
				}
			}, error => {
			}
		)
	}
    
	/**
	**	To open the message popoup
	**/
	 openMessagePopup(item){
		 this.isCheckModel = true;
		 this.messagePopupValueStatus = '';
		 if (this.isCheckModel) {
			 this.messagePopupValue = item;
			 if(item.status>=7){
				var idValue = item.status-7;
				if(item['job_posting']['screening_process'][idValue]){
					this.selectedStatusValue =item.status;
					this.selectedStatusMessage = null;
					this.messagePopupValueStatus= this.messagePopupValue['job_posting']['screening_process'][idValue]['title'];
				}
			}else{
				this.selectedStatusValue =item.status;
				this.selectedStatusMessage = null;
				var values = parseInt(this.selectedStatusValue);
				var value = this.statusvalue.filter(function(a,b){ return a.id == values });
				if(value.length !=0){
					this.messagePopupValueStatus = value[0]['text'];
				}
			}
		setTimeout(() => {
        this.checkModalRef = this.modalService.open(this.checkModal, {
          windowClass: 'modal-holder',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
      }, 300);
		}
	 }
	 
	 
	/**
	**	To cancel the check buton event
	**/
	
	cancelCheck(){
		this.checkModalRef.close();
		 this.isCheckModel = false;
		 this.selectedStatusValue =null;
		 this.selectedStatusMessage = null;
		 this.isErrorShown = false;
		 this.isErrorShownValue = false;
	}
  
	/**
	**	To send a message for the shortlisted candidate
	**/
	sendMessage(){
		this.isErrorShown= false;
		this.isErrorShownValue= false;
		if(this.selectedStatusValue !=null && this.selectedStatusValue !='' && this.selectedStatusMessage != null && this.selectedStatusMessage !='' ){
			
			let requestParams: any = {};
			requestParams.job_posting = this.selectedJob.id;
			requestParams.user = this.messagePopupValue.user.id;
			requestParams.short_listed = true ;
			requestParams.view = false ;
			requestParams.status =  this.messagePopupValue.status ;
			this.messagePopupValue.application_status = this.messagePopupValue.application_status.map((val) => {
			  return { 
				id: val.id,
				status: val.status,
				date: val.date,
				comments: val.comments,
				invited: val.invited,
				canceled: val.canceled,
				rescheduled: val.rescheduled,
				created: val.created,
				invite_url: val.invite_url
			  }
			});
			requestParams.application_status =  this.messagePopupValue.application_status ;
			var datas ='';
			var values = parseInt(this.selectedStatusValue);
			if(values>=7){
				var idValue =  values-7;
				datas = this.messagePopupValue['job_posting']['screening_process'][idValue]['title'];
			}else{
				
				var value = this.statusvalue.filter(function(a,b){ return a.id == values });
				if(value.length !=0){
					datas = value[0]['text'];
				}
			}
			if(datas !=''){
				for(let i=0;i< requestParams.application_status.length;i++){
					if(requestParams.application_status[i]['status'] == datas){
						requestParams.application_status[i]['comments'] = this.selectedStatusMessage;
						this.isErrorShown= true;
					}
				}
				if(this.isErrorShown== true){
					this.employerService.shortListUser(requestParams).subscribe(
						response => {
							this.cancelCheck();
							this.onGetShortListedJobs();
						}, error => {
							this.cancelCheck();
							this.onGetShortListedJobs();
						}
					)

				}else{
					this.isErrorShownValue = true;
				}
			}
			
		}

	}
	
	
	/**
	**	TO Change the shortlisted user details
	**/
	 onChangeStatusPop(data){
		this.isErrorShown= false;
		this.isErrorShownValue= false;
		if(this.selectedStatusValue !=null && this.selectedStatusValue !=''){
			var datas ='';
			var val = parseInt(this.selectedStatusValue);
			if(val>=7){
				var idValue =  val-7;
				datas = this.messagePopupValue['job_posting']['screening_process'][idValue]['title'];
			}else{
				var values = val;
				var value = this.statusvalue.filter(function(a,b){ return a.id == values });
				if(value.length !=0){
					datas = value[0]['text'];
				}
			}
			if(datas !=''){
				for(let i=0;i< this.messagePopupValue.application_status.length;i++){
					if(this.messagePopupValue.application_status[i]['status'] == datas){
						this.messagePopupValue.application_status[i]['comments'] = this.selectedStatusMessage;
						this.isErrorShown= true;
					}
				}
				if(this.isErrorShown== false){
					this.isErrorShownValue = true;
				}
			}else{
				this.isErrorShownValue = true;
			}
		}
	 }
	
	/**
	**	TO Change the shortlisted user details
	**/
	 
	onChangeStatus = (item, values) => {
		if((this.selectedJob && this.selectedJob.id) && (item.user && item.user.id)) {
			let requestParams: any = {};
			requestParams.job_posting = this.selectedJob.id;
			requestParams.user = item.user.id;
			requestParams.short_listed = true ;
			requestParams.view = false ;
			requestParams.invite_status = false ;
			requestParams.status = values ;
			requestParams.invite_url = '' ;
			item.application_status = item.application_status.map((val) => {
			  return { 
				id: val.id,
				status: val.status,
				date: val.date,
				comments: val.comments,
				invited: val.invited,
				canceled: val.canceled,
				rescheduled: val.rescheduled,
				created: val.created,
				invite_url: ''
			  }
			});
			requestParams.application_status = item.application_status ;
			if(values>=7){
				var idValue = values-7;
				if(item['job_posting']['screening_process'][idValue]){
					var datas = {'id':values,'status':item['job_posting']['screening_process'][idValue]['title'], 'date': new Date(),'comments':' ','invite_url':'' };
					requestParams.application_status.push(datas);
				}
			}else{
				var value = this.statusvalue.filter(function(a,b){ return a.id == values});
				if(value.length !=0){
					var datas = {'id':values,'status':value[0]['text'], 'date': new Date(),'comments':' ','invite_url':'' };
					requestParams.application_status.push(datas);
				}
			}
			this.employerService.shortListUser(requestParams).subscribe(
				response => {
					this.onGetShortListedJobs();
				}, error => {
					this.onGetShortListedJobs();
				}
			)
		}else {
			//this.toastrService.error('Something went wrong, please try again', 'Failed')
		}
	}
	
	/**
	**	TO Change the shortlisted user details
	**/
	 
	onChangeInvite = (item, values) => {
		if((this.selectedJob && this.selectedJob.id) && (item.user && item.user.id)) {
			let requestParams: any = {};
			requestParams.job_posting = this.selectedJob.id;
			requestParams.user = item.user.id;
			requestParams.short_listed = true ;
			requestParams.view = false ;
			requestParams.invite_status = true ;
			requestParams.invite_send = true ;
			requestParams.status = values ;
			requestParams.invite_url = this.inviteUrlLink ;
			item.application_status = item.application_status.map((val) => {
			  return { 
				id: val.id,
				status: val.status,
				date: val.date,
				comments: val.comments,
				invited: val.invited,
				canceled: val.canceled,
				rescheduled: val.rescheduled,
				created: val.created,
				invite_url: ''
			  }
			});
			requestParams.application_status = item.application_status ;
			requestParams.application_status[requestParams.application_status.length-1]['invite_url'] =  this.inviteUrlLink ;
			requestParams.application_status[requestParams.application_status.length-1]['invited'] =  new Date() ;
			
			this.employerService.shortListUser(requestParams).subscribe(
				response => {
					this.onGetShortListedJobs();
				}, error => {
					this.onGetShortListedJobs();
				}
			)
		}else {
		}
	}

	/**
	**	To handle the pagination event
	**/
	 
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		this.onGetShortListedJobs();
	}
  
	/**
	**	To load more details 
	**/
	 
	onLoadMoreJob = () => {
		this.page = this.page + 1;
		this.onGetShortListedJobs();
	}
	
	openMessagePopupInviteLink(item,values){
		this.statusVal = true;
		this.showInput = false;
		if(values == 5 || values == 6 || values == 2 || values == 4  ){
			this.onChangeInvite(item, values);
		}else{
			if(this.employeeValue['privacy_protection'] ['invite_url'] == true ){
				if((this.selectedJob && this.selectedJob.id) && (item.user && item.user.id)) {
					
					this.inviteUrlLink = '';
					//this.inviteUrlLink = this.employeeValue['profile']['invite_url'];
					this.tempValue = values
					this.tempItem = item ;
					
					this.isOpenInviteUrl = true;
					if(this.employeeValue['profile']['invite_urls'] &&
					this.employeeValue['profile']['invite_urls']['length']&&
					this.employeeValue['profile']['invite_urls']['length']!=0&&
					this.employeeValue['profile']['invite_urls'][0]['title']!=null&&
					this.employeeValue['profile']['invite_urls'][0]['url']!=null){
						this.inviteUrlLink = '';
						this.showInput = false;
					}else{
						this.inviteUrlLink = '';
						this.showInput = true;
					}
					
					setTimeout(() => {
						this.inviteRef = this.modalService.open(this.InviteModel, {
						  windowClass: 'modal-holder',
						  centered: true,
						  backdrop: 'static',
						  keyboard: false
						});
					}, 10);
				}
			}else{
				this.onChangeInvite(item, values);
			}
		}
	}
	popupOpen = (item, values) => {
		this.statusVal = false;
		this.inviteUrlLink = '';
		this.onChangeStatus(item, values);
		
		
	}
	closePopup(){
		
		this.inviteRef.close();
		this.onGetShortListedJobs();
		this.isOpenInviteUrl = false;
		this.inviteUrlLink = '';
		/* var tempRes = this.shortListedJobs;		
		this.shortListedJobs = [];
		this.shortListedJobs = tempRes; */
		
	}
	
	closeSave(){
		this.onChangeInvite(this.tempItem,this.tempValue);
		this.closePopup();
	}
	
	enableInput(){
		this.inviteUrlLink = '';
		this.showInput = true;
	}
	
	checkChange(event){
		this.showInput = false;
		if(event && event.value){
			event.value.split('_')[0];
			this.inviteUrlLink = event.value.split('_')[0];
		}

	}
	
	validateStatus(data){
		if(data['application_status'] && data['application_status']['length'] && data['application_status']['length'] !=0 ){
			var lastID = data['application_status']['length']-1;
			if(data['application_status'][lastID] && data['application_status'][lastID]['created']){
				return true;
			}
		}
		return false;
	}
	closePopupHistory(){
		
		this.historyRef.close();
		this.isOpenHistory=false;
	}
	
	openHistoryPopup(item){
		this.isOpenHistory = true;
		this.itemsData = item;
		setTimeout(() => {
			this.historyRef = this.modalService.open(this.HistoryModel, {
			  windowClass: 'modal-holder',
			  centered: true,
			  backdrop: 'static',
			  size: 'xl',
			  keyboard: false
			});
		}, 10);
	}
	closePopupResend(){
		
		this.ResendRef.close();
		this.isResendURL=false;
	}
	closeSaveResend(){
		this.onChangeInvite(this.tempItem,this.tempValue);
		this.closePopupResend();
	}
	
	openReschedulePopup(item,values){
		this.tempValue = values
		this.tempItem = item ;
		
		if(values == 5 || values == 6 || values == 2 || values == 4  ){
			
		}else{
			if(this.employeeValue['privacy_protection'] ['invite_url'] == true ){
				if((this.selectedJob && this.selectedJob.id) && (item.user && item.user.id)) {
					this.isResendURL = true;
					this.inviteUrlLink = item['invite_url'];
					setTimeout(() => {
						this.ResendRef = this.modalService.open(this.ResendURLModel, {
						  windowClass: 'modal-holder',
						  centered: true,
						  backdrop: 'static',
						  keyboard: false
						});
					}, 10);
				}
			}
		}
	}
}
