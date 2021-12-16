import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { AccountService } from '@data/service/account.service';
import { UserService } from '@data/service/user.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer} from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { FormBuilder, FormControl,FormArray, FormGroup, Validators } from '@angular/forms';
import { DayService, WeekService, WorkWeekService,PrintService, MonthService, AgendaService, MonthAgendaService,CurrentAction,EventSettingsModel,ResourcesModel,CellClickEventArgs,EJ2Instance,View} from '@syncfusion/ej2-angular-schedule';
import { extend, Internationalization } from '@syncfusion/ej2-base';

import {    ScheduleComponent, ScheduleModel,EventRenderedArgs, ActionEventArgs } from "@syncfusion/ej2-angular-schedule";
@Component({
  selector: 'app-calendar',
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService,PrintService],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})

export class CalendarComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	public appliedJobs: any[] = [];
	public appliedJobMeta: any;
	public currentView: View = 'Month';
    public intl: Internationalization = new Internationalization();
	public createUserForm: FormGroup;
	public currentProfileInfo: any;
	public currentuser : any;
	public loggedUserInfo : any;
	public sendmail : boolean = false;
	public isReadOnly: number = 3;
	public isShowCalenderForm: boolean = false;
	public isShowIframe: boolean = false;
	public isFormDataShow: boolean = false;
	public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'calender'};
	public invitelink : boolean = true;
	@ViewChild("openCalender", { static: false }) calenderModel: TemplateRef<any>;
	public mbRefs: NgbModalRef;
	public url: any = '';
	public urls: any = '';
	@ViewChild("scheduleObj", { static: false })
	public scheduleObj: ScheduleComponent;
	public eventSettings: EventSettingsModel; 
	
	constructor(
		
		private formBuilder: FormBuilder,
		private utilsHelperService: UtilsHelperService,
		private userservice : UserSharedService, 
		private accountService : AccountService,
		private userService :UserService, 
		private sanitizer: DomSanitizer,
		private modalService: NgbModal,
		private http : HttpClient 
		
	) { }
	
	/**
	**	Intialize the component 
	**	To get the user information details
	**/
	ngOnInit(): void {
		this.buildForm();
		this.onGetAppliedJobs();
		this.userService.profile().subscribe(
			response => {
				this.currentProfileInfo = response.details;
				if(this.currentProfileInfo.calender_urls && this.currentProfileInfo.calender_urls.length && this.currentProfileInfo.calender_urls.length !=0 ){
					for(let i=0;i<=this.c.length;i++){
						this.c.removeAt(0);
						i=0;
						this.isShowCalenderForm =false;
						this.isShowIframe =false;
						this.isFormDataShow =true;
					}
					this.currentProfileInfo.calender_urls.map((value, index) => {
						this.c.push(this.formBuilder.group({
							title: [null, Validators.required],
							url: [null, Validators.required]
						}));
					});
				}
				if (this.currentProfileInfo && this.currentProfileInfo.latlng_text) {
					const splitedString: any[] = this.currentProfileInfo.latlng_text.split(',');
					if (splitedString && splitedString.length) {
						this.currentProfileInfo.latlng =  {
							lat: splitedString[0],
							lng: splitedString[1]
						}
					}
				}
				this.createUserForm.patchValue({
					...this.currentProfileInfo
				})
				this.cancelCalender();
			}
		)
		
	}
	
	
	/**
	**	To get the Applied Jobs Details API Calls
	**/

	onGetAppliedJobs = () => {
      let requestParams: any = {};
      requestParams.page = 1;
      requestParams.limit = 100000000;
      requestParams.expand = "job_posting,user,employer";
	  requestParams.sort = "updated_at.desc";
      this.userService.applicationsListForUser(requestParams).subscribe(
        response => {
			this.appliedJobs=[];
          if(response && response.items && response.items.length > 0) {
            this.appliedJobs = [...this.appliedJobs, ...response.items];
          }
          this.appliedJobMeta = { ...response.meta }
		  this.insertCalendarDetails();
        }, error => {
        }
      )
	}
	
	
	/**
	**	To insert calendar details
	**/
	
	insertCalendarDetails(){
		if(this.appliedJobs && this.appliedJobs['length'] && this.appliedJobs['length']!=0){
			var tempArray=[];
			for(let i=0;i<=this.appliedJobs.length-1;i++){
				var ArrayValue = this.appliedJobs[i];
				var ArrayValueEvents = this.appliedJobs[i]['events'];
				if(ArrayValue && ArrayValueEvents && ArrayValueEvents['length'] &&ArrayValueEvents['length']!=0){
					
					for(let j=0;j<=ArrayValueEvents['length']-1;j++){
						var CategoryColor = "#008000";
						var input1Date =  new Date();
						var input2Date =  new Date();

						var ArrayResource = ArrayValueEvents[j];
						if(typeof ArrayResource['data'] === 'string'){
							ArrayResource['data']=JSON.parse(ArrayResource['data']);
						}
						if(ArrayResource['data'] &&ArrayResource['data']['resource'] && ArrayResource['status']){
							
							var dataValue = ArrayResource['data']['resource'] ;
							
							if(dataValue['end_time'] && dataValue['start_time']){
								var tempStatus= ArrayValue['application_status'].filter(function(a,b){ return parseInt(a.id) == parseInt(ArrayResource['status']) })[0];
								var titleUpper =ArrayValue['job_posting']['title'].toUpperCase();
								var statusUpper = tempStatus['status'].toUpperCase();
								var tempDescription= '<h6> <strong>Title : </strong>You have scheduled for the screening process of <a style="color:blue;font-weight: bolder;">'+statusUpper+'</a> in <a style="color:blue;font-weight: bolder;">'+titleUpper +'</a> job</h6> </br>';
								
								input2Date =  new Date(dataValue['end_time']);
								if (input1Date.getTime() < input2Date.getTime()){
									CategoryColor = "blue";
									
									if(ArrayResource['created'] || ArrayResource['rescheduled']){
										if(dataValue['location'] && dataValue['location']['join_url']){
											tempDescription += '<h6> <strong>Meeting Link : </strong> <a href="'+dataValue['location']['join_url']+'" target="_blank" rel="noopener noreferrer"  style="color:blue;"  > click here </a></h6> </br>';
										}
										if(dataValue['location'] && dataValue['location']['type'] =='outbound_call'){
											tempDescription += '<h6> <strong>Telephone Round  </strong> <a  style="color:blue;" > '+dataValue['location']['location']+' </a></h6> </br>';
										}
										if(dataValue['location'] && dataValue['location']['type'] =='custom'){
											tempDescription += '<h6> <strong>Meeting Link : </strong> <a href="'+dataValue['location']['location']+'" target="_blank" rel="noopener noreferrer"  style="color:blue;"  > click here </a></h6> </br>';
										}
									}
									
								}
								
								if(ArrayValue['status'] === ArrayResource['status']  && !ArrayResource['rescheduled'] && !ArrayResource['canceled'] && ArrayValueEvents['length']-1 == j ){
									tempDescription += '<h6> <strong>Reschedule Meeting : </strong><a href="'+ArrayValue['reschedule_url']+'" target="_blank" rel="noopener noreferrer"> click here </a></h6> </br>';
									tempDescription += '<h6> <strong>Cancel Meeting : </strong><a href="'+ArrayValue['cancel_url']+'" target="_blank" rel="noopener noreferrer"> click here </a></h6> </br>';
									//CategoryColor = "#008000";
								}
								
								if(ArrayResource['canceled']){
									if(ArrayResource['canceledreason']){
										var cancelreason = ArrayResource['canceledreason']['reason'];
									}
									tempArray.splice(-1);
									CategoryColor = "#ff0000";
									var newCancel= new Date(ArrayResource['canceled']);
									tempDescription += '<h6> <strong>Cancelled Meeting at : </strong> </br><a style="color:blue;" >'+newCancel.toDateString()+' '+newCancel.toLocaleTimeString()+' </a></h6></br><h6> <strong>Reason For Cancelled : </strong></br>'+cancelreason+'</h6>';
								}
								if(ArrayResource['rescheduled_canceled']){
								   var reasons = ArrayResource['reason']['reason'];
								}
								if(ArrayResource['rescheduled']){
									tempArray.splice(-1);
									if (input1Date.getTime() < input2Date.getTime()){
										CategoryColor = "#ffa500";
									}
									
									var newCancel= new Date(ArrayResource['rescheduled']);
									tempDescription += '<h6> <strong>Rescheduled Meeting at : </strong> </br><a style="color:blue;" >'+newCancel.toDateString()+' '+newCancel.toLocaleTimeString()+' </a></h6> </br><h6> <strong>Reason For Reschedule : </strong></br>'+reasons+'</h6>';
								
								}
								var tempTitle= ArrayValue['job_posting']['title']+' - '+tempStatus['status'];
								tempTitle=tempTitle.toUpperCase();
								var tempInsertData = {
									'Id':j,
									'Subject':tempTitle,
									'StartTime':dataValue['start_time'],
									'EndTime':dataValue['end_time'],
									'CategoryColor':CategoryColor,
									'Description':tempDescription
								}
								tempArray.push(tempInsertData);
								if(ArrayResource['rescheduled_canceled']){
									tempArray.splice(-1);
								}
							}
							
						}
					}
				}
			}
			
			  this.eventSettings = { dataSource:tempArray};
			
		}
	}
	openPopup(){
		console.log('test');
	}
	/**
	**	To assign the tab change functionality
	**/
	onTabChange(data){
		this.currentTabInfo=data;
		
	}
	
	/**
	**	To view the calendar for the user
	**/
	
	enableaddCalender(){
		this.isShowCalenderForm = true;
		this.isFormDataShow = false;
		this.isShowIframe = false;
	}
	
	/**
	**	To view the add calendar view
	**/
	
	enableViewCalender(){
		this.isShowCalenderForm = false;
		this.isFormDataShow = false;
		this.isShowIframe = false;
	}
	
	/**
	**	To click the cancel event for the user
	**/
	cancelCalender(){
		if(this.c.value[0]['url']==null || this.c.value[0]['url']==undefined || this.c.value[0]['url']=='' ||
		this.c.value[0]['title']==null || this.c.value[0]['title']==undefined || this.c.value[0]['title']==''){
			this.enableViewCalender();
		}else{
			this.isShowCalenderForm = false;
			this.isFormDataShow = true;
			this.isShowIframe = false;
		}
	}
	
	/**
	**	To save the user profile information
	**/
	
	onSaveComapnyInfoCalender(){
		/* if (this.createUserForm.valid) {
			this.updateCompany('calender');
		} */
	}
	
	/**
	**	To refresh the calender
	**/
	
	refresh(){
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.urls);
		setTimeout(() => {		
			var checkURL =document.getElementsByTagName('iframe')[0].src.split('?');
			var windowURL= window.location.origin+'/';
			var checkURLs =checkURL[0].split('null');
			if(checkURL[0]==windowURL || checkURLs[0]==windowURL ){
				document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
			}
			var styles =`<style>.legacy-branding .badge{display:none;height:0px;}.app-error {margin-top:0px !important;}</style>`;
			document.body.getElementsByClassName('legacy-branding')[0]['style']['display']='none';
		},500);
	}
	/**
	**	To open the calendar and view the availability of the calender
	**/
	
	openCalenderView(item){
		var tempUrl =item.url;
		this.urls =item.url;
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(tempUrl);
		setTimeout(() => {
			this.mbRefs = this.modalService.open(this.calenderModel, {
				windowClass: 'modal-holder',
				size: 'xl',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
			setTimeout(() => {		
				var checkURL =document.getElementsByTagName('iframe')[0].src.split('?');
				var windowURL= window.location.origin+'/';
				var checkURLs =checkURL[0].split('null');
				if(checkURL[0]==windowURL || checkURLs[0]==windowURL ){
					document.getElementsByTagName('iframe')[0].src = windowURL+'#/not-found';
				}
				var styles =`<style>.legacy-branding .badge{display:none;height:0px;}.app-error {margin-top:0px !important;}</style>`;
				document.body.getElementsByClassName('legacy-branding')[0]['style']['display']='none';

			},500);
		});
		
	}
	
	/**
	**	To close the calender
	**/
	
	closeCalender(){
		this.mbRefs.close();
	}
	
	
	/**
	**	To Build the profile Form
	**/
	
	private buildForm(): void {
		
		this.createUserForm = this.formBuilder.group({
			calender_urls:new FormArray([this.formBuilder.group({
				title: [null, Validators.required],
				url: [null, Validators.required]
			})])
		});
	}

	/**
	**	To Get the profile Form
	**/
	
	get f() {
		return this.createUserForm.controls;
	}
	
	/**
	**	To Get the calendar Form
	**/
	
	get c() {
		return this.f.calender_urls as FormArray;
	}
	
	
	/**
	**	To save user data
	**/
	
	onSaveUser(data){
		if(this.createUserForm.valid){
			this.updateUser(data);
		}
	}
	
	/**
	**	create a new CALENDER_URL
	**/
	
	onDuplicateCalender = (index) => {
		if(this.c.value[index]['title']== null ||this.c.value[index]['title'].trim() == ''||this.c.value[index]['url']== null ||this.c.value[index]['url'].trim() == '' ){
		  
	  }else{
		this.c.push(this.formBuilder.group({
			title: [null, Validators.required],
			url: [null, Validators.required]
		}));
	  }
	}
	
	/**
	**	Remove the CALENDER_URL
	**/
	
	onRemoveCalender = (index) => {
		if(index == 0 &&this.c.value.length==1) {
			this.c.reset();
			this.isShowCalenderForm = false;
			this.isShowIframe = false;
			this.updateUser(false);
		}else {
			this.c.removeAt(index);
		}
	}
	

	/**
	**	To update the calender changes in user profile
	**/	
	  
	updateUser(data) {
		if(this.currentProfileInfo && !this.utilsHelperService.isEmptyObj(this.currentProfileInfo)) {
			let requestParams = {...this.currentProfileInfo};
			requestParams.privacy = 'privacy';
			requestParams.calender_urls = this.c.value;
			this.userService.update(requestParams).subscribe(
				response => {
					if(data==true){
						
					}if(data=='view'){
						this.cancelCalender();
					}else if(data == false){
						this.enableViewCalender();
					}
				}, error => {
					
				}
			)
		}			
	}
	
	public onEventRendered(args: EventRenderedArgs): void {
		const categoryColor: string = args.data.CategoryColor as string;
		if (!args.element || !categoryColor) {
		  return;
		}
		
		  args.element['firstChild']['style']['borderLeftColor'] = categoryColor;
		  if(args.element.className.includes('e-agenda-item')){
			  
		  }else{
			args.element.style.backgroundColor = categoryColor;
		  }
	}
	
	public onPrintClick(): void {
		this.scheduleObj.print();
	}
}
