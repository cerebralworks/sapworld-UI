import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, DoCheck, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { SearchCountryField,  CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { UtilsHelperService } from '@shared/services/utils-helper.service';
import { ValidationService } from '@shared/services/validation.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { Address as gAddress } from "ngx-google-places-autocomplete/objects/address";
import { AddressComponent as gAddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";

@Component({
  selector: 'app-create-admin-profile',
  templateUrl: './create-admin-profile.component.html',
  styleUrls: ['./create-admin-profile.component.css'],
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
export class CreateAdminProfileComponent implements OnInit, DoCheck {
	
	/**	
	**	Variable Declaration
	**/
	
	public editorConfig: AngularEditorConfig =  {
  editable: true,
  spellcheck: true,
  // height: 'auto',
  // minHeight: '200px',
  // maxHeight: 'auto',
  // width: 'auto',
  // minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
 // uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [[
  'insertImage',
    'insertVideo'
  ] 
  ]
};

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
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
 
	constructor(
		private formBuilder: FormBuilder,
		private modalService: NgbModal,
		private utilsHelperService: UtilsHelperService,
		private employerSharedService: EmployerSharedService,
		private employerService: EmployerService,
		private router: Router
	) { }
	
	
	/**
	**	Initially the Component loads
	**/
	
	ngOnInit(): void {
		this.randomNum = Math.random();
		this.buildForm();
		
		this.employerService.profile().subscribe(
			details => {
				if (!this.utilsHelperService.isEmptyObj(details)) {
					this.employerDetails = details['details'];
					this.employerDetails['meta'] = details['meta'];
					this.createCompanyForm.patchValue({
						email: this.employerDetails.email,
						name: this.employerDetails.company,
						first_name: this.employerDetails.first_name,
						last_name: this.employerDetails.last_name,
					})
					this.createCompanyForm.get('email').disable();
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
			
			  this.employerSharedService.saveEmployerProfileDetails(response.details);
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
					this.createCompanyForm.get('email').disable();
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
				this.employerSharedService.clearEmployerProfileDetails();
			}
		)
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
			requestParams.email = this.employerDetails.email;
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
							this.employerSharedService.saveEmployerProfileDetails(response.details[0]);
							this.router.navigate(['/profile-view'])
							//window.location.reload();
						}, error => {
							//this.toastrService.error('Something went wrong', 'Failed')
						}
					) 
				});
			}else{
				this.employerService.updateCompanyProfile(requestParams).subscribe(
					response => {
						if(response.details ==null || response.details == undefined){
							response = JSON.parse(response);
						}
						this.employerSharedService.saveEmployerProfileDetails(response.details[0]);
						
						this.router.navigate(['/profile-view']);
						//window.location.reload();
					}, error => {
						//this.toastrService.error('Something went wrong', 'Failed')
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
			email: ['', [Validators.required, ValidationService.emailValidator]],
			name: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
			city: ['', Validators.required],
			first_name: ['', Validators.required],
			last_name: ['', Validators.required],
			state: ['', Validators.required],
			address: [''],
			country: ['', Validators.required],
			zipcode: [null, Validators.compose([Validators.minLength(5)])],
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
		const address = this.fromGooglePlace(event);
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
				return;
			}
			if (files.item(0).size > 3145728) {
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
		this.mbRef.close();
	}

	/**
	**	To Image Crop
	**/
	
	onImageCropSave() {
		this.defaultProfilePic = this.profilePicValue;
		this.previousProfilePic = this.defaultProfilePic;
		//this.dataService.setUserPhoto({ photoBlob: this.croppedFile, base64: this.defaultProfilePic })
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
	
	
	 public fromGooglePlace(addr: gAddress) {
  let address: any = {};
  let houseNumber = this.findTypeLongName(addr, "street_number");
  let street = this.findTypeLongName(addr, "route");

  address.street = street && houseNumber ? `${houseNumber} ${street}` : null;
  address.street = address.street ? address.street : street;

  address.city = this.findTypeLongName(addr, "locality");
  if(address.city==null){
	  if(addr.formatted_address){
		  var splits = addr.formatted_address.split(',');
		  if(splits[0]){
			  address.city =splits[0];
		  }
	  }
	  
  }
  address.state = this.findTypeLongName(addr, "administrative_area_level_1");
  address.stateShort = this.findTypeShortName(addr, "administrative_area_level_1");
  if(address.state ==null){
	address.state = this.findTypeLongName(addr, "neighborhood");
	  
  }
  if(address.stateShort ==null){
	address.stateShort = this.findTypeShortName(addr, "locality" );
	  
  }
  
  address.zipcode = this.findTypeLongName(addr, "postal_code");
  address.country = this.findTypeLongName(addr, "country");
	if(address.city==address.country){
	  if(addr.formatted_address){
		  var splits = addr.formatted_address.split(',');
		  if(splits[0]){
			  address.city =splits[0];
		  }
	  }
	  
  }
  address.validated = houseNumber != null && street != null && address.city != null && address.state != null && address.zipcode != null;

  return address;
}

private findTypeLongName(addr: gAddress, type: string): string {
	if(addr.address_components){
  let comp: gAddressComponent = addr.address_components.find((item: gAddressComponent) => item.types.indexOf(type) >= 0);
	 return comp ? comp.long_name : null;
	}else{
		return null;
	}

}

private findTypeShortName(addr: gAddress, type: string): string {
	if(addr.address_components){
  let comp: gAddressComponent = addr.address_components.find((item: gAddressComponent) => item.types.indexOf(type) >= 0);
  return comp ? comp.short_name : null;
	}else{
		return null;
	}
}

}
