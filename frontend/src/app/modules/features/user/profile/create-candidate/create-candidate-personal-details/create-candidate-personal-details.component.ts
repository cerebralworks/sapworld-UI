import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { trigger, style, animate, transition, state, group } from '@angular/animations';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SharedService } from '@shared/service/shared.service';
import { ValidationService } from '@shared/service/validation.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { UserService } from '@data/service/user.service';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
	selector: 'app-create-candidate-personal-details',
	templateUrl: './create-candidate-personal-details.component.html',
	styleUrls: ['./create-candidate-personal-details.component.css'],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
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

export class CreateCandidatePersonalDetailsComponent implements OnInit {
	
	//Variable Declaration
	
	@Input() currentTabInfo: tabInfo;
	public childForm;
	public show: boolean = false;
	public userInfo: any = {};
	public defaultProfilePic: string;
	public mbRef: any;
	public profilePicValue: any;
	public profilePicAsEvent: any;
	public previousProfilePic: string;
	public imageChangedEvent: FileList;
	public socialMediaLinks: any[] = [];
	public nationality: any[] = [];
	public othercountry: any[] = [];
	public languageSource: any[] = [];
	savedUserDetails: any;
	othercountryValue: any;
	randomNum: number;
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}
	public tabInfos: tabInfo[];
	public filteredValuesCountry: any[] = [];
	@ViewChild('userImage', { static: false }) userImage: ElementRef;
	croppedFile: any;
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	 
	constructor(
		private parentF: FormGroupDirective,
		public sharedService: SharedService,
		private dataService: DataService,
		private userSharedService: UserSharedService,
		private toastrService: ToastrService,
		private modalService: NgbModal,
		private utilsHelperService: UtilsHelperService,
		private userService: UserService,
		private SharedAPIService: SharedApiService,
		private formBuilder: FormBuilder
	) { }
	
	/**
	**	When the page loads initally function calls
	**/
	
	ngOnInit(): void {
		
		this.randomNum = Math.random();
		this.createForm();
		
		//To get the tab information
		
		this.dataService.getTabInfo().subscribe(response => {
			if (response && Array.isArray(response) && response.length) {
				this.tabInfos = response;
			}
		});
		
	this.dataService.getCountryDataSource().subscribe(
      response => {
		  console.log(response);
        if (response && Array.isArray(response) && response.length) {
          this.nationality = response;
			this.othercountry =  response.filter(function(a,b){
				return a.id !="226"&&a.id !="225"&&a.id !="13"&&a.id !="99"&&a.id !="192"&&a.id !="38"&&a.id !="107"&&a.id !="129"
			});
			
        }
      }
    );
	this.dataService.getLanguageDataSource().subscribe(
      response => {
		  console.log(response);
        if (response && Array.isArray(response) && response.length) {
          this.languageSource = response;
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
	  setTimeout(async () => {
    if(this.childForm && this.savedUserDetails) {
		if (this.savedUserDetails && this.savedUserDetails.language_known && Array.isArray(this.savedUserDetails.language_known)) {
        if ((this.savedUserDetails.language_known.length == 1) || (this.t && this.t.length) !== (this.savedUserDetails.language_known && this.savedUserDetails.language_known.length)) {
         this.t.removeAt(0);
          this.savedUserDetails.language_known.map((value, index) => {
            this.t.push(this.formBuilder.group({
				language: [null, Validators.required],
					read: [false],
					write: [false],
					speak: [false]
			}));
            this.onChangeLanguageValue(value.language, index);
          });
		  this.childForm.patchValue({
			personalDetails: {
				 language_known: this.savedUserDetails.language_known,
			}
		  });     
	  }}
    if(this.childForm && this.savedUserDetails) {
		if (this.savedUserDetails && this.savedUserDetails.reference && Array.isArray(this.savedUserDetails.reference)) {
        if ((this.savedUserDetails.reference.length == 1) || (this.r && this.r.length) !== (this.savedUserDetails.reference && this.savedUserDetails.reference.length)) {
         this.r.removeAt(0);
          this.savedUserDetails.reference.map((value, index) => {
            this.r.push(this.formBuilder.group({
				name: new FormControl(null),
				email: new FormControl(''),
				company_name: new FormControl(null)
			}));
            this.onChangeLanguageValueReference(value.name, index);
          });
		  this.childForm.patchValue({
			personalDetails: {
				 reference: this.savedUserDetails.reference,
			}
		  });
	  }}
	  }
      this.childForm.patchValue({
        personalDetails: {
			first_name:this.savedUserDetails.first_name,
			  last_name: this.savedUserDetails.last_name,
			  email: this.savedUserDetails.email,
			  phone: this.savedUserDetails.phone,
			  city: this.savedUserDetails.city,
			  state: this.savedUserDetails.state,
			  country: this.savedUserDetails.country,
			  zipcode: this.savedUserDetails.zipcode,
			  nationality: this.savedUserDetails.nationality,
			  clients_worked: this.savedUserDetails.clients_worked,
			  visa_type: this.savedUserDetails.visa_type,
			  work_authorization: this.savedUserDetails.work_authorization,
			  authorized_country: this.savedUserDetails.authorized_country,
        }
      });
	  if(this.savedUserDetails.authorized_country!=null){		  
		if(this.savedUserDetails.authorized_country.length){
			for(let i=0;i<this.savedUserDetails.authorized_country.length;i++){
				
				for(let j=0;j<document.getElementsByClassName('btn-fltr').length;j++){
					if(document.getElementsByClassName('btn-fltr').item(j)['id'] == this.savedUserDetails.authorized_country[i]){
						document.getElementsByClassName('btn-fltr').item(j)['className'] = document.getElementsByClassName('btn-fltr').item(j)['className'] +' btn-fltr-active';
					}
				}
			}
		}
	  }
	  
      if(this.savedUserDetails && this.savedUserDetails.social_media_link && this.savedUserDetails.social_media_link.length > 0) {
        this.childForm.patchValue({
          personalDetails: {
            linkedin: this.onFindMediaLinks('linkedin', this.savedUserDetails.social_media_link).url,
            github: this.onFindMediaLinks('github', this.savedUserDetails.social_media_link).url,
            youtube: this.onFindMediaLinks('youtube', this.savedUserDetails.social_media_link).url,
            blog: this.onFindMediaLinks('blog', this.savedUserDetails.social_media_link).url,
            portfolio: this.onFindMediaLinks('portfolio', this.savedUserDetails.social_media_link).url,
            linkedinBoolen: this.onFindMediaLinks('linkedin', this.savedUserDetails.social_media_link).visibility,
            githubBoolen: this.onFindMediaLinks('github', this.savedUserDetails.social_media_link).visibility,
            youtubeBoolen: this.onFindMediaLinks('youtube', this.savedUserDetails.social_media_link).visibility,
            blogBoolen: this.onFindMediaLinks('blog', this.savedUserDetails.social_media_link).visibility,
            portfolioBoolen: this.onFindMediaLinks('portfolio', this.savedUserDetails.social_media_link).visibility
          }
        })
      }
      this.childForm.get('personalDetails.email').disable();

      let latlngText: string = this.savedUserDetails.latlng_text;
      if (latlngText) {
        const splitedString: any[] = latlngText.split(',');
        if (splitedString && splitedString.length) {
          this.childForm.patchValue({
            personalDetails: {
              latlng: {
                lat: splitedString[0],
                lng: splitedString[1]
              }
            }
          })
        }
      }

      let phoneNumber: string = this.savedUserDetails.phone;
      if(phoneNumber) {
        // this.childForm.controls.personalDetails.controls.phone.setValue('+919898989898');
        // this.cd.detectChanges();
        let phoneComponents = {
          IDDCC: phoneNumber.substring(0, phoneNumber.length - 10),
          NN: phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length)
        };
        // this.childForm.patchValue({
        //   personalDetails: {
        //     phone: phoneComponents.NN,
        //     dialCode: phoneComponents.IDDCC
        //   }
        // })
      }
    }
	  }); 
  }

  onFindMediaLinks = (mediaType: string, array: any[]) => {
    if(mediaType) {
      const link = array.find((val, index) => {
        return val.media == mediaType;
      });
      return link ? link : ''
    }
    return ''
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('personalDetails', new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl(''),
      phone: new FormControl('', [Validators.required]),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      latlng: new FormControl({}, Validators.required),
      country: new FormControl('', Validators.required),
      zipcode: new FormControl(null, Validators.required),
      clients_worked: new FormControl(null, Validators.required),
      authorized_country: new FormControl(null),
      visa_type: new FormControl(null),
      nationality: new FormControl(null, Validators.required),
      social_media_link: new FormControl(null),
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
      work_authorization: new FormControl(null),
	  language_known: new FormArray([this.formBuilder.group({
        language: [null, Validators.required],
        read: new FormControl(false),
        write: new FormControl(false),
        speak: new FormControl(false)
      })]),
	  reference: new FormArray([this.formBuilder.group({
        name: new FormControl(null),
        email: new FormControl(''),
        company_name: new FormControl(null)
      })]),
    }));

  }

  get f() {
    return this.childForm.controls.personalDetails.controls;
  }

  handleAddressChange = (event) => {
    const address = this.sharedService.fromGooglePlace(event);
    this.childForm.patchValue({
      personalDetails: {
        city: address.city ? address.city : event.formatted_address,
        state: address.state,
        country: address.country,
        latlng: {
          "lat": event.geometry.location.lat(),
          "lng": event.geometry.location.lng()
        }
      }
    });
  };

  onSetLinks = (fieldName, status) => {
    if(this.socialMediaLinks.length == 0) {
      this.socialMediaLinks.push(
        {
          "media": fieldName,
          "url": this.childForm.value.personalDetails[fieldName],
          "visibility": status
        }
      )
    }else {
      let findInex = this.socialMediaLinks.findIndex(val => ((val.media == fieldName) && (val.visibility == true)))
      if(findInex > -1) {
        this.socialMediaLinks[findInex].visibility = status;
      }else {
        this.socialMediaLinks.push(
          {
            "media": fieldName,
            "url": this.childForm.value.personalDetails[fieldName],
            "visibility": status
          }
        )
      }
    }
    this.childForm.patchValue({
      personalDetails: {
        social_media_link: this.socialMediaLinks
      }
    })
  }

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

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    this.defaultProfilePic = base64textString;
  }

  open(content: any) {
    this.mbRef = this.modalService.open(content, {
      windowClass: 'insurance-modal-zindex',
      size: "lg",
      centered: true
    });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.profilePicValue = event.base64.split(",")[1];
    let file = base64ToFile(event.base64);
    this.croppedFile = file;
    this.profilePicAsEvent = event;

  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed(event: any) {
    this.toastrService.error('File format not supported(Allowed Format:jpg,jpeg,png)');
    this.mbRef.close();
  }

  onImageCropSave() {
    this.defaultProfilePic = this.profilePicValue;
    this.previousProfilePic = this.defaultProfilePic;
    this.dataService.setUserPhoto({ photoBlob: this.croppedFile, base64: this.defaultProfilePic })
    this.mbRef.close();
  }

  SetPreviousProfilePic() {
    this.defaultProfilePic = this.previousProfilePic;
    this.previousProfilePic = this.defaultProfilePic;
    this.userImage.nativeElement.value = null;
    this.imageChangedEvent = null;
    this.mbRef.close();
  }

  convertToImage(imageString: string): string {
    return this.utilsHelperService.convertToImageUrl(imageString);
  }

  onCountryChange = (event) => {
    // if(event && event.dialCode) {
    //   this.childForm.patchValue({
    //     personalDetails: {
    //       dialCode: '+' + event.dialCode
    //     }
    //   })
    // }
  }
	onChangeLanguageValue(value,index){
		if(value && index > -1) {
		  this.childForm.get('personalDetails.language_known').controls[index].controls['language'].setValidators([Validators.required])
		  this.childForm.get('personalDetails.language_known').controls[index].controls['language'].updateValueAndValidity();
		  this.childForm.get('personalDetails.language_known').controls[index].controls['read'].setValidators([Validators.required])
		  this.childForm.get('personalDetails.language_known').controls[index].controls['read'].updateValueAndValidity();
		  this.childForm.get('personalDetails.language_known').controls[index].controls['write'].setValidators([Validators.required])
		  this.childForm.get('personalDetails.language_known').controls[index].controls['write'].updateValueAndValidity();
		  this.childForm.get('personalDetails.language_known').controls[index].controls['speak'].setValidators([Validators.required])
		  this.childForm.get('personalDetails.language_known').controls[index].controls['speak'].updateValueAndValidity();
		}else {
		  this.childForm.get('personalDetails.language_known').controls[index].controls['language'].setValidators(null)
		  this.childForm.get('personalDetails.language_known').controls[index].controls['language'].updateValueAndValidity();
		  this.childForm.get('personalDetails.language_known').controls[index].controls['read'].setValidators(false)
		  this.childForm.get('personalDetails.language_known').controls[index].controls['read'].updateValueAndValidity();
		  this.childForm.get('personalDetails.language_known').controls[index].controls['write'].setValidators(false)
		  this.childForm.get('personalDetails.language_known').controls[index].controls['write'].updateValueAndValidity();
		  this.childForm.get('personalDetails.language_known').controls[index].controls['speak'].setValidators(false)
		  this.childForm.get('personalDetails.language_known').controls[index].controls['speak'].updateValueAndValidity();
		}
	}
	onChangeLanguageValueReference = (value, index) => {
    
    if(value && index > -1) {
      this.childForm.get('personalDetails.reference').controls[index].controls['name'].setValidators(null)
      this.childForm.get('personalDetails.reference').controls[index].controls['name'].updateValueAndValidity();
      this.childForm.get('personalDetails.reference').controls[index].controls['email'].setValidators('')
      this.childForm.get('personalDetails.reference').controls[index].controls['email'].updateValueAndValidity();
      this.childForm.get('personalDetails.reference').controls[index].controls['company_name'].setValidators(null)
      this.childForm.get('personalDetails.reference').controls[index].controls['company_name'].updateValueAndValidity();
    }else {
      this.childForm.get('personalDetails.reference').controls[index].controls['name'].setValidators(null)
      this.childForm.get('personalDetails.reference').controls[index].controls['name'].updateValueAndValidity();
      this.childForm.get('personalDetails.reference').controls[index].controls['email'].setValidators('')
      this.childForm.get('personalDetails.reference').controls[index].controls['email'].updateValueAndValidity();
      this.childForm.get('personalDetails.reference').controls[index].controls['company_name'].setValidators(null)
      this.childForm.get('personalDetails.reference').controls[index].controls['company_name'].updateValueAndValidity();
    }
  }
	  
	onChangeFieldValue = (fieldName, value) => {
		this.childForm.patchValue({
		  personalDetails: {
			[fieldName]: value,
			['visa_type']: null,
			['authorized_country']: null,
		  }
		});
		
	  }
	  
	
	 get t() {
    return this.f.language_known as FormArray;
  }

  onDuplicate = (index) => {
   
	 if(this.t.value[index]['language']=="" || this.t.value[index]['language']== null ){
		  
	  }else{
		 this.t.push(this.formBuilder.group({
			language: [null, Validators.required],
				read: [false],
				write: [false],
				speak: [false]
		}));
	  }
  }

  onRemove = (index) => {
    if (index == 0  && this.t.value.length==1) {
      this.t.reset();
    } else {
      this.t.removeAt(index);
    }
  }
	 get r() {
    return this.f.reference as FormArray;
  }

  onDuplicateR = (index) => {
	  if(this.r.value[index]['name']==null || this.r.value[index]['email'] =="" || this.r.value[index]['company_name'] == null ){
		  
	  }else{
		this.r.push(this.formBuilder.group({
			name: new FormControl(null),
			email: new FormControl(''),
			company_name: new FormControl(null)
		}));
	  }
  }

  onRemoveR = (index) => {
	  if (index == 0  && this.r.value.length==1) {
		this.r.reset();
	  }else{
		this.r.removeAt(index);
    }
  }
  countryClick(value,clr){
	  var temp = clr.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		 
		this.childForm.value.personalDetails.authorized_country.pop(clr.toElement.id);
		  clr.toElement.className = clr.toElement.className.replace('btn-fltr-active','');
	  }else{
		  clr.toElement.className = clr.toElement.className+' btn-fltr-active';

		if(this.childForm.value.personalDetails.authorized_country==null){
			this.childForm.value.personalDetails.authorized_country=[clr.toElement.id];
		}else{
			this.childForm.value.personalDetails.authorized_country.push(clr.toElement.id);
		}
	  }
	  console.log(value);
  }
	}
