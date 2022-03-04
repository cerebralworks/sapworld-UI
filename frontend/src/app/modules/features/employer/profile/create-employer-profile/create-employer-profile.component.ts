import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, DoCheck, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { textEditorConfig } from '@config/richProfile-editor';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ValidationService } from '@shared/service/validation.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { callbackify } from 'util';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-create-employer-profile',
  templateUrl: './create-employer-profile.component.html',
  styleUrls: ['./create-employer-profile.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 0 })),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),

        group([
          animate(300, style({ height: 0 })),
          animate('200ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ height: '0', opacity: 0 }),

        group([
          animate(300, style({ height: '*' })),
          animate('400ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
  ]
})
export class CreateEmployerProfileComponent implements OnInit, DoCheck {
	
	/**	
	**	Variable Declaration
	**/
	
	public editorConfig: AngularEditorConfig = textEditorConfig;
	public createCompanyForm: FormGroup;
	public defaultProfilePic: string;
	public mbRef: any;
	public profilePicValue: any;
	public profilePicAsEvent: any;
	public previousProfilePic: string;
	public imageChangedEvent: FileList;
	public socialMediaLinks: any[] = [];
	public croppedFile: any;
	@ViewChild('companyImage', { static: false }) companyImage: ElementRef;
	public validateSubscribe: any;
	public employerDetails: any;
	public randomNum: number;
	public companyProfileInfo: any;
	public show: boolean = false;
	public invalidMobile: boolean = false;
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	//TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
 
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
		private router: Router
	) { }
	
	/**
	**	Initially the Component loads
	**/
	
	ngOnInit(): void {
		
		this.randomNum = Math.random();
		this.buildForm();

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
	**		When the  Country Chnage
	**/
	
	onCountryChange = (event) => {

	}
	
	/**
	**	To check the mobile number validation
	**/
	
	checkNumber(){
		
		if(this.createCompanyForm.controls.contact.status=="INVALID"){
			if (this.createCompanyForm.controls.contact.errors.required) {
				this.invalidMobile = false;
			}
			if (this.createCompanyForm.controls.contact.errors.validatePhoneNumber) {
				if (this.createCompanyForm.controls.contact.errors.validatePhoneNumber.valid == false ) {
					this.invalidMobile = true;
				}
				if (this.createCompanyForm.controls.contact.errors.validatePhoneNumber.valid == true ) {
					this.invalidMobile = false;
				}
			}
		}else{
			this.invalidMobile = false;
		}
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
	**	To Change the profile Image
	**/
	
	onUserPhotoUpdate = (callback = () => { }) => {
		const formData = new FormData();
		formData.append('photo', this.croppedFile, ((this.croppedFile.name) ? this.croppedFile.name : ''));
		this.employerService.photoUpdate(formData).subscribe(
			response => {
				callback();
			}, error => {
			}
		)
	}

	/**
	**	To Save the Company Info
	**/
	
	onSaveComapnyInfo = () => {
		
		if (this.createCompanyForm.valid) {
			let requestParams: any = { ...this.createCompanyForm.value };
			requestParams.email_id = this.employerDetails.email;
			if (this.createCompanyForm.value && this.createCompanyForm.value.contact && !Array.isArray(this.createCompanyForm.value.contact)) {
				if(this.createCompanyForm.value.contact){
					if(this.createCompanyForm.value.contact['e164Number'])
					requestParams.contact = [this.createCompanyForm.value.contact['e164Number']];
				}
			} else {
				if(this.createCompanyForm.value.contact){
					if(this.createCompanyForm.value.contact['e164Number'])
					requestParams.contact = [this.createCompanyForm.value.contact['e164Number']];
				}
			}

			if(requestParams && requestParams.website) {
				const re = /http/gi;
				if (requestParams.website.search(re) === -1 ) {
					requestParams.website = `http://${requestParams.website}`
				}
			}
			if (this.croppedFile) {
				this.onUserPhotoUpdate(() => {
					this.employerService.updateCompanyProfile(requestParams).subscribe(
						response => {
							if(response.details ==null || response.details == undefined){
								response = JSON.parse(response);
							}
							this.employerSharedService.saveEmployerCompanyDetails(response.details[0]);
							this.router.navigate(['/employer/profile'])
						}, error => {
							this.toastrService.error('Something went wrong', 'Failed')
						}
					)
				});
			}else{
				this.employerService.updateCompanyProfile(requestParams).subscribe(
					response => {
						if(response.details ==null || response.details == undefined){
							response = JSON.parse(response);
						}
						this.employerSharedService.saveEmployerCompanyDetails(response.details[0]);
						this.router.navigate(['/employer/profile'])
					}, error => {
						this.toastrService.error('Something went wrong', 'Failed')
					}
				)
			}
			
		}
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
	
	/**
	**	To Handle the address change
	**/
	
	handleAddressChange = (event) => {
		const address = this.sharedService.fromGooglePlace(event);
		if(event.geometry){
			this.createCompanyForm.patchValue({
				city: address.city ? address.city : event.formatted_address,
				state: address.state,
				country: address.country,
				latlng: {
					"lat": event.geometry.location.lat(),
					"lng": event.geometry.location.lng()
				}
			});
		}
	};

	/**
	**	To Convert the images
	**/
	
	convertToImage(imageString: string): string {
		return this.utilsHelperService.convertToImageUrl(imageString);
	}

	/**
	**	To Handle the File input 
	**/
	
	handleFileInput(event, CropImagePopUp) {
		let files: FileList = event.target.files;
		if (files && files.length > 0) {
			let fileToUpload = files.item(0);
			let allowedExtensions = ["jpg", "jpeg", "png", "JPG", "JPEG"];
			let fileExtension = files
				.item(0)
				.name.split(".")
				.pop();
			if (!this.utilsHelperService.isInArray(allowedExtensions, fileExtension)) {
				this.toastrService.error('File format not supported(Allowed Format:jpg,jpeg,png)');
				return;
			}
			if (files.item(0).size > 3145728) {
				this.toastrService.error('Size Should be less than or equal to 3 MB');
				return;
			}
			this.open(CropImagePopUp);
			this.imageChangedEvent = event;
			let reader = new FileReader();
			reader.onload = this._handleReaderLoaded.bind(this);
			reader.readAsBinaryString(fileToUpload);
		}
	}

	/**
	**	To Handle the File input Reading
	**/
	
	_handleReaderLoaded(readerEvt) {
		var binaryString = readerEvt.target.result;
		let base64textString = btoa(binaryString);
		this.defaultProfilePic = base64textString;
	}

	/**
	**	To Open the Profile View
	**/
	
	open(content: any) {
		this.mbRef = this.modalService.open(content, {
			windowClass: 'insurance-modal-zindex',
			size: "lg",
			centered: true
		});
	}

	/**
	**	To Image Croping
	**/
	
	imageCropped(event: ImageCroppedEvent) {
		this.profilePicValue = event.base64.split(",")[1];
		let file = base64ToFile(event.base64);
		this.croppedFile = file;
		this.profilePicAsEvent = event;
	}

	/**
	**	To Load the Image
	**/
	
	imageLoaded() {
		// show cropper
	}

	/**
	**	To Load the Image Failed
	**/
	
	loadImageFailed(event: any) {
		this.toastrService.error('File format not supported(Allowed Format:jpg,jpeg,png)');
		this.mbRef.close();
	}

	/**
	**	To Image Crop
	**/
	
	onImageCropSave() {
		this.defaultProfilePic = this.profilePicValue;
		this.previousProfilePic = this.defaultProfilePic;
		this.dataService.setUserPhoto({ photoBlob: this.croppedFile, base64: this.defaultProfilePic })
		this.mbRef.close();
	}

	/**
	**	To Set the Profile Pic
	**/
	
	SetPreviousProfilePic() {
		this.defaultProfilePic = this.previousProfilePic;
		this.previousProfilePic = this.defaultProfilePic;
		this.companyImage.nativeElement.value = null;
		this.imageChangedEvent = null;
		this.mbRef.close();
	}

	/**
	**	To Checking the Profile Form
	**/
	
	validateOnCompanyProfile = 0;
	ngDoCheck(): void {
		if ((!this.utilsHelperService.isEmptyObj(this.companyProfileInfo) && this.companyProfileInfo.social_media_link && Array.isArray(this.companyProfileInfo.social_media_link)) && this.validateOnCompanyProfile == 0) {
			this.createCompanyForm.patchValue({
				linkedin: this.onFindMediaLinks('linkedin', this.companyProfileInfo.social_media_link).url,
				github: this.onFindMediaLinks('github', this.companyProfileInfo.social_media_link).url,
				youtube: this.onFindMediaLinks('youtube', this.companyProfileInfo.social_media_link).url,
				blog: this.onFindMediaLinks('blog', this.companyProfileInfo.social_media_link).url,
				portfolio: this.onFindMediaLinks('portfolio', this.companyProfileInfo.social_media_link).url,
				linkedinBoolen: this.onFindMediaLinks('linkedin', this.companyProfileInfo.social_media_link).visibility,
				githubBoolen: this.onFindMediaLinks('github', this.companyProfileInfo.social_media_link).visibility,
				youtubeBoolen: this.onFindMediaLinks('youtube', this.companyProfileInfo.social_media_link).visibility,
				blogBoolen: this.onFindMediaLinks('blog', this.companyProfileInfo.social_media_link).visibility,
				portfolioBoolen: this.onFindMediaLinks('portfolio', this.companyProfileInfo.social_media_link).visibility
			})
			this.validateOnCompanyProfile++
		}
		if (this.createCompanyForm.value.linkedin || this.createCompanyForm.value.portfolio) {
			this.socialMediaLinks.map((val) => {
				if (val.media == 'linkedin') {
					val.url = this.createCompanyForm.value.linkedin
				}
				if (val.media == 'portfolio') {
					val.url = this.createCompanyForm.value.portfolio
				}
			});
		}
	}

	/**
	**	To Find the Media Links
	**/
	
	onFindMediaLinks = (mediaType: string, array: any[]) => {
		if (mediaType) {
			const link = array.find((val, index) => {
				return val.media == mediaType;
			});
			return link ? link : ''
		}
		return ''
	}

	/**
	**	on Set the Social Media Links
	**/
	
	onSetLinks = (fieldName, status) => {
		if(this.socialMediaLinks==null || undefined){
		  this.socialMediaLinks=[
        {
          "media": fieldName,
          "url": this.createCompanyForm.value[fieldName],
          "visibility": status
        }
      ];
	  }else if (this.socialMediaLinks.length == 0) {
			this.socialMediaLinks.push({
			  "media": fieldName,
			  "url": this.createCompanyForm.value[fieldName],
			  "visibility": status
			})
		} else {
			this.socialMediaLinks = this.socialMediaLinks.filter((v,i,a)=>a.findIndex(t=>(t.media === v.media))===i)
			let findInex = this.socialMediaLinks.findIndex(val => ((val.media == fieldName)))
			if (findInex > -1) {
				this.socialMediaLinks[findInex].visibility = status;
			} else {
				this.socialMediaLinks.push({
					"media": fieldName,
					"url": this.createCompanyForm.value[fieldName],
					"visibility": status
				})
			}
		}
		this.createCompanyForm.patchValue({
			social_media_link: this.socialMediaLinks
		})

	}

}
