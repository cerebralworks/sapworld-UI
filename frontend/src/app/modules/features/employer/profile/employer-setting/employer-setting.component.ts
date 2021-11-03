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

@Component({
  selector: 'app-employer-setting',
  templateUrl: './employer-setting.component.html',
  styleUrls: ['./employer-setting.component.css']
})
export class EmployerSettingComponent implements OnInit {
	
	
  
	/**	
	**	Variable Declaration
	**/
	
	public createCompanyForm: FormGroup;
	public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'account'};
	public employerDetails: any;
	TooltipLabel = TooltipLabel;
	public companyProfileInfo: any;
	public loggedUserInfo: any;
	public socialMediaLinks: any[] = [];
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	public invalidMobile: boolean = false;
	public inviteStatus: boolean = false;
	public randomNum: number;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	@ViewChild("openSuccessPopup", { static: false }) openSuccessModal: TemplateRef<any>;
	public mbRef: NgbModalRef;
 
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
		private router: Router
	) { }

	/**
	**	Initially the Component loads
	**/
	
	ngOnInit(): void {
		
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
			if(this.companyProfileInfo.invite_urls && this.companyProfileInfo.invite_urls.length && this.companyProfileInfo.invite_urls.length !=0 ){
				for(let i=0;i<=this.t.length;i++){
						this.t.removeAt(0);
						i=0;
					}
					this.companyProfileInfo.invite_urls.map((value, index) => {
						this.t.push(this.formBuilder.group({
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
			invite_urls:new FormArray([this.formBuilder.group({
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
		}else {
			this.t.removeAt(index);
		}
	}
	

	/**
	**	To Save the Company Info
	**/
	
	onSaveComapnyInfo = () => {
		
		if (this.createCompanyForm.valid) {
			this.updateCompany();
			
		}
	}
	
	/**
	**	Update Company Values
	**/
	updateCompany(){
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
		this.employerService.updateCompanyProfile(requestParams).subscribe(
			response => {
				this.onGetProfileInfo();
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
		this.updateCompany();
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
}
