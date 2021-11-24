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

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	public createUserForm: FormGroup;
	public currentProfileInfo: any;
	public currentuser : any;
	public loggedUserInfo : any;
	public sendmail : boolean = false;
	public isShowCalenderForm: boolean = false;
	public isShowIframe: boolean = false;
	public isFormDataShow: boolean = false;
	public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'calender'};
	public invitelink : boolean = true;
	@ViewChild("openCalender", { static: false }) calenderModel: TemplateRef<any>;
	public mbRefs: NgbModalRef;
	public url: any = '';
	public urls: any = '';
	
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
	**	To assign the tab change functionality
	**/
	onTabChange(data){
		this.currentTabInfo=data;
		
	}
	
	/**
	**	To send the invite link to user profile.
	**/	
	
	sendlink(){
		
		var data = { 'email' : this.currentuser.email } ;
		this.sendmail=true;
		this.invitelink=false;
		this.accountService.userSignupInviteUrl(data,this.loggedUserInfo).subscribe(data => {
		    
		},error=>{
			
		})
		
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
	
	get c() {
		return this.f.calender_urls as FormArray;
	}
	
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
}
