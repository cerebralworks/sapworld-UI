import { Component, DoCheck, OnDestroy, OnInit, TemplateRef,ElementRef, ViewChild, Input } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {PageEvent} from '@angular/material/paginator';
import { EmployerService } from '@data/service/employer.service';
export {}; declare global { interface Window { Calendly: any; } } 
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-applied-job',
  templateUrl: './applied-job.component.html',
  styleUrls: ['./applied-job.component.css']
})
export class AppliedJobComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	@Input()screenWidth:any;
	public appliedJobs: any[] = [];
	public appliedJobMeta: any;
	public itemsIDVAL: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	showFirstLastButtons = true;
	public toggleMatchesModal: boolean = false;
	@ViewChild('matchesModal', { static: false }) matchesModal: TemplateRef<any>;
	public mbRefs: NgbModalRef;
	public openBookingSite: boolean = false;
	public openNotBook: boolean = false;
	public url: any = '';
	@ViewChild('bookingModel', { static: false }) bookingModel: TemplateRef<any>;
	public bookingModelRef: NgbModalRef;
	public statusvalue: any[] = [
		{id:1,text:'APPLICATION UNDER REVIEW'},
		{id:2,text:'Hired'},
		{id:3,text:'Interview Scheduled'},
		{id:4,text:'Rejected'},
		{id:5,text:'On Hold'},
		{id:6,text:'Not Available'},
		{id:98,text:'Not a Fit'},
		{id:99,text:'Closed'}
	];
	@ViewChild('container') container: ElementRef;
	/**	
	**	To implement the package section constructor
	**/
	
	constructor(
		private userService: UserService,
		private modelService: NgbModal,
		private sanitizer: DomSanitizer,
		private employerService : EmployerService
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
	  requestParams.sort = "updated_at.desc";
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
	** Open the Popup
	**/
	
	openPopupView(){
		this.toggleMatchesModal = true;
		setTimeout(() => {
			this.mbRefs = this.modelService.open(this.matchesModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
		});
	}
	
	closeMatches(){
		this.toggleMatchesModal = false;
		this.mbRefs.close();
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
	  
	stopPropagation(event,item,index){
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
		var display = document.getElementById(index);
		var views = true;
		if(display && display.style ){
			if(display.style.display =='none'){
				views = false;
			}
		}
		if(item && item.view == false && views == true){
			let requestParams: any = {};
			requestParams.job_posting = item.job_posting.id;
			requestParams.id = item.id;
			requestParams.status = true ;
			requestParams.view = 'update_status' ;
			requestParams.company = true ;
			this.employerService.getPostedJobCount(requestParams).subscribe(
				response => {
					var display = document.getElementById(index);
					if(display && display.style){
						document.getElementById(index).style.display='none';
					}
				}, error => {
					
				}
			)

		}
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
	
	/**
	**	To filter the status of the applied job
	**/
	
	itemReturn(id,application_status){
		if(id !=null && id !=undefined ){
			var valCheck = this.statusvalue.filter(function(a,b){ return parseInt(a.id) == parseInt(id)});
			if(valCheck.length !=0){
				return valCheck[0]['text'];
			}
			if(application_status && application_status.length){
				var valChecks = application_status.filter(function(a,b){ return parseInt(a.id) == parseInt(id)});
				if(valChecks.length !=0){
					return valChecks[0]['status'];
				}
			}
			
		}
		return '--';
	}
	
	
	openPopupViewInvite(item){
		this.itemsIDVAL = item;
		this.openBookingSite = true;
		this.openNotBook = false;
		console.log(this.itemsIDVAL)
		setTimeout(() => {
			this.bookingModelRef = this.modelService.open(this.bookingModel, {
				windowClass: 'modal-holder',
				size: 'xl',
				centered: true,
				//backdrop: 'static',
				keyboard: false
			});
		});
		setTimeout(() => {
			window.Calendly.initInlineWidget({
				url: document.getElementsByClassName('checkVal')[0]['id']+"?utm_source="+this.itemsIDVAL.id,
				parentElement: document.querySelector('.calendly-inline-widget'),
				prefill: {
					name: document.getElementById("name")['value'],
					email: document.getElementById("email")['value']
					
				} ,
				branding: false 
			});
			setTimeout(() => {		
				var checkURL =document.getElementsByTagName('iframe')[0].src.split('?');
				var windowURL= window.location.origin+'/';
				if(checkURL[0]==windowURL){
					document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
				}else{
					var splitCheck = checkURL[0].split('/')['2']
					if(splitCheck != 'calendly.com'){
						document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
					}
				}
				var styles =`<style>.legacy-branding .badge{display:none;height:0px;}.app-error {margin-top:0px !important;}</style>`;
				document.body.getElementsByClassName('legacy-branding')[0]['style']['display']='none';

			},500);
		},10);
	}
	
	
	openPopupViewReschedule(item){
		this.itemsIDVAL = item;
		this.openBookingSite = true;
		this.openNotBook = true;
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.itemsIDVAL['reschedule_url']);
		setTimeout(() => {
			this.bookingModelRef = this.modelService.open(this.bookingModel, {
				windowClass: 'modal-holder',
				size: 'xl',
				centered: true,
				//backdrop: 'static',
				keyboard: false
			});
			setTimeout(() => {		
				var checkURL =document.getElementsByTagName('iframe')[0].src.split('?');
				var windowURL= window.location.origin+'/';
				if(checkURL[0]==windowURL){
					document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
				}else{
					var splitCheck = checkURL[0].split('/')['2']
					if(splitCheck != 'calendly.com'){
						document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
					}
				}
				var styles =`<style>.legacy-branding .badge{display:none;height:0px;}.app-error {margin-top:0px !important;}</style>`;
				document.body.getElementsByClassName('legacy-branding')[0]['style']['display']='none';

			},500);
		});
		
	}
	
	
	openPopupViewCancel(item){
		this.itemsIDVAL = item;
		this.openBookingSite = true;
		this.openNotBook = true;
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.itemsIDVAL['cancel_url']);
		setTimeout(() => {
			this.bookingModelRef = this.modelService.open(this.bookingModel, {
				windowClass: 'modal-holder',
				size: 'xl',
				centered: true,
				//backdrop: 'static',
				keyboard: false
			});
			setTimeout(() => {		
				var checkURL =document.getElementsByTagName('iframe')[0].src.split('?');
				var windowURL= window.location.origin+'/';
				if(checkURL[0]==windowURL){
					document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
				}else{
					var splitCheck = checkURL[0].split('/')['2']
					if(splitCheck != 'calendly.com'){
						document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
					}
				}
				var styles =`<style>.legacy-branding .badge{display:none;height:0px;}.app-error {margin-top:0px !important;}</style>`;
				document.body.getElementsByClassName('legacy-branding')[0]['style']['display']='none';

			},500);
		});
		
	}
	
	
	openPopupViewInviteNew(item,eventData){
		this.itemsIDVAL = item;
		this.openBookingSite = true;
		this.openNotBook = true;
		var tempUrl =document.getElementsByClassName('linksValue')[0]["href"];
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(tempUrl);
		setTimeout(() => {
			this.bookingModelRef = this.modelService.open(this.bookingModel, {
				windowClass: 'modal-holder',
				size: 'xl',
				centered: true,
				//backdrop: 'static',
				keyboard: false
			});
			setTimeout(() => {		
				var checkURL =document.getElementsByTagName('iframe')[0].src.split('?');
				var windowURL= window.location.origin+'/';
				if(checkURL[0]==windowURL){
					document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
				}
				var styles =`<style>.legacy-branding .badge{display:none;height:0px;}.app-error {margin-top:0px !important;}</style>`;
				document.body.getElementsByClassName('legacy-branding')[0]['style']['display']='none';

			},500);
		});
		
	}
	
	closeInvite(){
		this.onGetAppliedJobs();
		this.bookingModelRef.close();
		this.openBookingSite = false;
		this.openNotBook = false;
		
	}
	

}
