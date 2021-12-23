import { Component, DoCheck, ElementRef,TemplateRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ValidationService } from '@shared/service/validation.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { callbackify } from 'util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { tabInfo } from '@data/schema/create-candidate';
import { AccountService } from '@data/service/account.service';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { DomSanitizer} from '@angular/platform-browser';
import { DayService, WeekService, WorkWeekService,PrintService, MonthService, AgendaService, MonthAgendaService,CurrentAction,EventSettingsModel,ResourcesModel,CellClickEventArgs,EJ2Instance,View} from '@syncfusion/ej2-angular-schedule';
import { extend, Internationalization } from '@syncfusion/ej2-base';

import {    ScheduleComponent, ScheduleModel,EventRenderedArgs, ActionEventArgs } from "@syncfusion/ej2-angular-schedule";

@Component({
  selector: 'app-calendar',
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService,PrintService],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
	
	
  
	/**	
	**	Variable Declaration
	**/
	public currentView: View = 'Agenda';
	public appliedJobs: any[] = [];	
	public createCompanyForm: FormGroup;
	public currentTabInfo: tabInfo = {tabNumber: 2, tabName: 'inviteLink'};
	public employerDetails: any;
	TooltipLabel = TooltipLabel;
	public companyProfileInfo: any;
	public loggedUserInfo: any;
	public socialMediaLinks: any[] = [];
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	public invalidMobile: boolean = false;
	public inviteStatus: boolean = false;
	public inviteStatusView: boolean = false;
	public isShowForm: boolean = false;
	public isShowCalenderForm: boolean = false;
	public isShowIframe: boolean = false;
	public isFormDataShow: boolean = false;
	public randomNum: number;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	@ViewChild("openSuccessPopup", { static: false }) openSuccessModal: TemplateRef<any>;
	public mbRef: NgbModalRef;
	@ViewChild("openCalender", { static: false }) calenderModel: TemplateRef<any>;
	public mbRefs: NgbModalRef;
	public url: any = '';
	public urls: any = '';
	@ViewChild("scheduleObj", { static: false })
	public scheduleObj: ScheduleComponent;
	public eventSettings: EventSettingsModel; 
 
	constructor(
		private formBuilder: FormBuilder,
		private sharedService: SharedService,
		private utilsHelperService: UtilsHelperService,
		private dataService: DataService,
		private toastrService: ToastrService,
		private modalService: NgbModal,
		private employerSharedService: EmployerSharedService,
		private employerService: EmployerService,
		private userService: UserService,
		private accountService: AccountService,
		private sanitizer: DomSanitizer,
		private router: Router
	) { }

	/**
	**	Initially the Component loads
	**/
	
	ngOnInit(): void {
		this.onGetShortListedJobs();
		this.randomNum = Math.random();
		this.buildForm();
		this.accountService
      .getLoginCredientials()
      .subscribe(response => {
		this.loggedUserInfo = response;
        
      });
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				if (!this.utilsHelperService.isEmptyObj(details)) {
					this.employerDetails = details;
					this.createCompanyForm.patchValue({
						email_id: this.employerDetails.email,
						name: this.employerDetails.company,
						firstName: this.employerDetails.first_name,
						lastName: this.employerDetails.last_name,
					})
					this.createCompanyForm.get('email_id').disable();
					this.createCompanyForm.get('firstName').disable();
					this.createCompanyForm.get('lastName').disable();
				}
			}
		)
		this.onGetProfileInfo();

	}
	
	/**
	**	To Get the profile Info
	**/
	
	onGetProfileInfo() {
		
		let requestParams: any = {};
		this.employerService.getCompanyProfileInfo(requestParams).subscribe(
		(response: any) => {
			
			  this.employerSharedService.saveEmployerCompanyDetails(response.details);
			this.companyProfileInfo = { ...response.details };
			if(this.companyProfileInfo.invite_status == true){
				this.inviteStatusView =true;
				this.isShowForm =true;
			}
			if(this.companyProfileInfo.calender_status == true){
				this.isShowCalenderForm =true;
				this.isShowIframe =false;
				this.isFormDataShow =false;
			}else{
				this.isShowCalenderForm =false;
				this.isShowIframe =false;
				this.isFormDataShow =false;
			}
			if(this.companyProfileInfo.invite_urls && this.companyProfileInfo.invite_urls.length && this.companyProfileInfo.invite_urls.length !=0 ){
				for(let i=0;i<=this.t.length;i++){
						this.t.removeAt(0);
						i=0;
						this.isShowCalenderForm =false;
						this.isShowIframe =false;
						this.isFormDataShow =true;
					}
					this.companyProfileInfo.invite_urls.map((value, index) => {
						this.t.push(this.formBuilder.group({
							title: [null, Validators.required],
							url: [null, Validators.required]
						}));
					});
			}
			if(this.companyProfileInfo.calender_urls && this.companyProfileInfo.calender_urls.length && this.companyProfileInfo.calender_urls.length !=0 ){
				for(let i=0;i<=this.c.length;i++){
						this.c.removeAt(0);
						i=0;
					}
					this.companyProfileInfo.calender_urls.map((value, index) => {
						this.c.push(this.formBuilder.group({
							title: [null, Validators.required],
							url: [null, Validators.required]
						}));
					});
			}
				if(this.companyProfileInfo.social_media_link){
					this.companyProfileInfo.social_media_link = this.companyProfileInfo.social_media_link.filter((v,i,a)=>a.findIndex(t=>(t.media === v.media))===i)
				}
			  this.socialMediaLinks = this.companyProfileInfo.social_media_link;
			
				if (!this.utilsHelperService.isEmptyObj(this.companyProfileInfo)) {
					if(this.companyProfileInfo.contact){
						this.companyProfileInfo.contact = this.companyProfileInfo.contact[0];
					}
					this.createCompanyForm.patchValue({
						...this.companyProfileInfo
					})
					let phoneNumber: string = this.companyProfileInfo.contact;
					  if(phoneNumber) {
						let phoneComponents = {
						  IDDCC: phoneNumber.substring(0, phoneNumber.length - 10),
						  NN: phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length)
						};
					  
					  }
					this.createCompanyForm.get('email_id').disable();
					let latlngText: string = this.companyProfileInfo.latlng_text;
					if (latlngText) {
						const splitedString: any[] = latlngText.split(',');
						if (splitedString && splitedString.length) {
							this.createCompanyForm.patchValue({
								latlng: {
								  lat: splitedString[0],
								  lng: splitedString[1]
								}
							})
						}
					}
				}
			}, error => {
				this.companyProfileInfo = {};
				this.employerSharedService.clearEmployerCompanyDetails();
			}
		)
	}
	
	
	/**
	**	To Build the profile Form
	**/
	
	private buildForm(): void {
		
		this.createCompanyForm = this.formBuilder.group({
			email_id: ['', [Validators.required, ValidationService.emailValidator]],
			name: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
			city: ['', Validators.required],
			firstName: [''],
			lastName: [''],
			invite_url: [''],			
			calender_status: new FormControl(true),
			invite_urls:new FormArray([this.formBuilder.group({
				title: [null, Validators.required],
				url: [null, Validators.required]
			})]),
			calender_urls:new FormArray([this.formBuilder.group({
				title: [null, Validators.required],
				url: [null, Validators.required]
			})]),
			state: ['', Validators.required],
			address: [''],
			country: ['', Validators.required],
			zipcode: [null, Validators.compose([Validators.minLength(4)])],
			description: ['', Validators.compose([Validators.required, Validators.maxLength(2500), Validators.minLength(100)])],
			website: ['', Validators.compose([Validators.required, ValidationService.urlValidator])],
			contact: [''],
			latlng: [null],
			social_media_link: [null],
			linkedin: new FormControl(''),
			github: new FormControl(''),
			youtube: new FormControl(''),
			blog: new FormControl(''),
			portfolio: new FormControl(''),
			linkedinBoolen: new FormControl(false),
			githubBoolen: new FormControl(false),
			youtubeBoolen: new FormControl(false),
			blogBoolen: new FormControl(false),
			portfolioBoolen: new FormControl(false),
		});
	}

	/**
	**	To Get the profile Form
	**/
	
	get f() {
		return this.createCompanyForm.controls;
	}
	
	
	get t() {
		return this.f.invite_urls as FormArray;
	}
	
	get c() {
		return this.f.calender_urls as FormArray;
	}
	
	/**
	**	create a new INVITE_URL
	**/
	
	onDuplicate = (index) => {
		if(this.t.value[index]['title']== null ||this.t.value[index]['title'].trim() == ''||this.t.value[index]['url']== null ||this.t.value[index]['url'].trim() == ''||this.t.value[index]['url'].trim().split('/')[2] !=  'calendly.com'  ){
		  
	  }else{
		this.t.push(this.formBuilder.group({
			title: [null, Validators.required],
			url: [null, Validators.required]
		}));
	  }
	}
	
	/**
	**	Remove the INVITE_URL
	**/
	
	onRemove = (index) => {
		if(index == 0 &&this.t.value.length==1) {
			this.t.reset();
			this.inviteStatusView = false;
			this.isShowForm = false;
			this.updateCompany(false);
		}else {
			this.t.removeAt(index);
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
			this.updateCompany(false);
		}else {
			this.c.removeAt(index);
		}
	}
	

	/**
	**	To Save the Company Info
	**/
	
	onSaveComapnyInfo = () => {
		
		if (this.createCompanyForm.valid) {
			this.updateCompany(true);
			
		}
	}
	
	/**
	**	To Save the Company Info
	**/
	
	onSaveComapnyInfoInvite = () => {
		
		if (this.createCompanyForm.valid) {
			this.updateCompany(true);
		}else if(this.createCompanyForm.controls.invite_urls.valid){
			this.updateCompany(true);
		}
	}
	
	/**
	**	To Save the Company Info
	**/
	
	onSaveComapnyInfoCalendar = () => {
		
		if (this.createCompanyForm.valid) {
			this.updateCompany(true);
		}else if(this.createCompanyForm.controls.calender_urls.valid){
			this.updateCompany(true);
		}
	}
	
	/**
	**	Update Company Values
	**/
	updateCompany(datas){
		let requestParams: any = { ...this.createCompanyForm.value };
		requestParams.email_id = this.employerDetails.email;
		if (this.createCompanyForm.value && this.createCompanyForm.value.contact && !Array.isArray(this.createCompanyForm.value.contact)) {
			if(this.createCompanyForm.value.contact){
				requestParams.contact = [this.createCompanyForm.value.contact];
			}
		} else {
			if(this.createCompanyForm.value.contact){
				requestParams.contact = [this.createCompanyForm.value.contact];
			}
		}

		if(requestParams && requestParams.website) {
			const re = /http/gi;
			if (requestParams.website.search(re) === -1 ) {
				requestParams.website = `http://${requestParams.website}`
			}
		}
		requestParams.invite_status = true;
		if(this.c && this.c.length && this.c.length !=0){
			requestParams.invite_status = true;
			if(this.c['value'][0]['title']==null || this.c['value'][0]['url']==null){
				requestParams.calender_status = false;	
				requestParams.calender_urls = null;
			}
		}else{
			requestParams.calender_status = false;
		}
		if(this.t && this.t.length && this.t.length !=0){
			//requestParams.invite_status = true;
			if(this.t['value'][0]['title']==null || this.t['value'][0]['url']==null){
				//requestParams.calender_status = false;	
				requestParams.invite_urls = null;
			}
		}else{
			requestParams.invite_urls = null;
			//requestParams.calender_status = false;
		}
		this.employerService.updateCompanyProfile(requestParams).subscribe(
			response => {
				if(datas == true){
					this.onGetProfileInfo();
				}else if(datas == 'calender'){
					this.isShowCalenderForm = false;
					this.isFormDataShow = true;
					this.isShowIframe = false;
				}
				
			}, error => {
				this.toastrService.error('Something went wrong', 'Failed')
			}
		)
	}
	

	/**
	**	To Open the status view in the popup
	**/
	
	onOpenStatusModal = () => {
		this.mbRef = this.modalService.open(this.openSuccessModal, {
			windowClass: 'modal-holder',
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
	}
	
	closePopup(){
		this.updateCompany(true);
		this.mbRef.close();
	}
	navigateProfile(){
		
		this.closePopup();
		this.router.navigate(['/employer/profile']);
	}
	onTabChange(data){
		
		this.currentTabInfo=data;
	}
	
	sendInviteLink(){
		
		var emailData = { 'email' : this.employerDetails.email ? this.employerDetails.email.toLowerCase() : '' } ;
		this.accountService.userSignupInviteUrl(emailData,this.loggedUserInfo).subscribe(
			response => {
				this.onOpenStatusModal();
			}
		)
	}
	
	enableInviteLink(){
		this.inviteStatusView = true;
		this.isShowForm =true;
	}
	enableaddCalender(){
		this.isShowCalenderForm = true;
		this.isFormDataShow = false;
		this.isShowIframe = false;
	}
	cancelCalender(){
		//if(this.c.value[0]['title']== null ||this.c.value[0]['title'].trim() == ''||this.c.value[0]['url']== null ||this.c.value[0]['url'].trim() == '' ){
			
		//}else{
			
			this.isShowCalenderForm = false;
			this.isFormDataShow = false;
			this.isShowIframe = false;
		//}
	}
	
	onSaveComapnyInfoCalender(){
		if (this.createCompanyForm.valid) {
			this.updateCompany('calender');
		}
	}
	
	
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
	
	closeCalender(){
		this.mbRefs.close();
	}
	
	cancelSettings(){
		//if(this.companyProfileInfo.invite_status !=true ){
			this.isShowForm = false;
			this.inviteStatusView = false;
		//}
	}
	
	checkStatus(){
		if(this.createCompanyForm.valid){
			return true
		}else if(this.createCompanyForm.controls.invite_urls.valid){
			return true
		}
		return false;
	}
	checkStatusCalendar(){
		if(this.createCompanyForm.valid){
			return true
		}else if(this.createCompanyForm.controls.calender_urls.valid){
			return true
		}
		return false;
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
	
	/**
	**	TO get the shortlisted user details
	**/
	
	onGetShortListedJobs = () => {
		
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 10000000000000;
		requestParams.expand = "job_posting,user,employer";
		requestParams.sort = "updated_at.desc";
		//requestParams.job_posting = this.selectedJob.id;
		requestParams.short_listed = 1;
		this.employerService.applicationsList(requestParams).subscribe(
			response => {
				this.appliedJobs=[];
			  if(response && response.items && response.items.length > 0) {
				this.appliedJobs = [...this.appliedJobs, ...response.items];
			  }
			  //this.appliedJobMeta = { ...response.meta }
			  this.insertCalendarDetails();
			}, error => {
			}
		)
	}
	
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
							var names =  ArrayValue['user']['first_name']+' '+ ArrayValue['user']['last_name'];
							if(dataValue['end_time'] && dataValue['start_time']){
								var tempStatus= ArrayValue['application_status'].filter(function(a,b){ return parseInt(a.id) == parseInt(ArrayResource['status']) })[0];
								var titleUpper =ArrayValue['job_posting']['title'].toUpperCase();
								var statusUpper = tempStatus['status'].toUpperCase();
								var tempDescription= '<h6 style="font-size: 15px;" > <strong>Title : </strong>'+names+' scheduled for the <a style="color:blue;">'+statusUpper+'</a> in <a style="color:blue;">'+titleUpper +'</a> job</h6> </br>';
								
								input2Date =  new Date(dataValue['end_time']);
								if (input1Date.getTime() < input2Date.getTime()){
									CategoryColor = "blue";
									
									if(ArrayResource['created'] || ArrayResource['rescheduled']){
										if(dataValue['location'] && dataValue['location']['join_url']  && dataValue['location']['join_url'] !='null'  && dataValue['location']['join_url'] !=null){
											tempDescription += '<h6 style="font-size: 15px;" > <strong>Meeting Link : </strong> <a href="'+dataValue['location']['join_url']+'" target="_blank" rel="noopener noreferrer"  style="color:blue;"  > click here </a></h6> </br>';
										}
										if(dataValue['location'] && dataValue['location']['type'] =='outbound_call'  && dataValue['location']['type'] !='null'  && dataValue['location']['type'] !=null){
											tempDescription += '<h6 style="font-size: 15px;" > <strong>Telephone Round  </strong> <a  style="color:blue;" > '+dataValue['location']['location']+' </a></h6> </br>';
										}
										if(dataValue['location'] && dataValue['location']['type'] =='custom'  && dataValue['location']['join_url'] !='null'  && dataValue['location']['join_url'] !=null){
											tempDescription += '<h6 style="font-size: 15px;" > <strong>Meeting Link : </strong> <a href="'+dataValue['location']['location']+'" target="_blank" rel="noopener noreferrer"  style="color:blue;"  > click here </a></h6> </br>';
										}
									}
									
								}
								
								if(ArrayValue['status'] === ArrayResource['status']  && !ArrayResource['rescheduled'] && !ArrayResource['canceled'] && ArrayValueEvents['length']-1 == j ){
									//tempDescription += '<h6> <strong>Reschedule Meeting : </strong><a href="'+ArrayValue['reschedule_url']+'" target="_blank" rel="noopener noreferrer"> click here </a></h6> </br>';
									//tempDescription += '<h6> <strong>Cancel Meeting : </strong><a href="'+ArrayValue['cancel_url']+'" target="_blank" rel="noopener noreferrer"> click here </a></h6> </br>';
									//CategoryColor = "#008000";
								}
								
								if(ArrayResource['canceled']){
									if(ArrayResource['canceledreason']){
										var cancelreason = ArrayResource['canceledreason']['reason'];
									}
									tempArray.splice(-1);
									CategoryColor = "#ff0000";
									var newCancel= new Date(ArrayResource['canceled']);
									tempDescription += '<h6 style="font-size: 15px;" > <strong>Cancelled Meeting at : </strong> </br><a style="color:blue;" >'+newCancel.toDateString()+' '+newCancel.toLocaleTimeString()+' </a></h6></br><h6> <strong>Reason For Cancelled : </strong></br>'+cancelreason+'</h6>';
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
									tempDescription += '<h6 style="font-size: 15px;" > <strong>Rescheduled Meeting at : </strong> </br><a style="color:blue;" >'+newCancel.toDateString()+' '+newCancel.toLocaleTimeString()+' </a></h6> </br><h6 style="font-size: 15px;" > <strong>Reason For Reschedule : </strong></br>'+reasons+'</h6>';
								
								}
								
								var tempTitle= names+' - '+tempStatus['status'];
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
}
