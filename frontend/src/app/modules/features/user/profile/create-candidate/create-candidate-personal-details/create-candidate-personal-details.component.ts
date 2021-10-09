import {COMMA, ENTER} from '@angular/cdk/keycodes';

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
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env';
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
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	visa_types = [ ];
	employers = [ ];  
	@Input() currentTabInfo: tabInfo;
	public childForm;
	public show: boolean = false;
	public hideEmployee: boolean = false;
	public showAuthorization : boolean = true;
	public invalidMobile: boolean = false;
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
	workAuthDetails : any;
	filterVisatype : any[] = [];
	@ViewChild('visaType') visaType: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;
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
	public requestParams: any;		 
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
		private formBuilder: FormBuilder,
		private http : HttpClient
	) { }
	
	getvisa(e){
		this.filterVisatype = this.workAuthDetails.filter(a=>{
			if(a.visa.includes(e.toLowerCase()) && e!=''){
				return a;
			}
		})
	}
	
	selSug(e){
		if(e!= ''){
		var VT = this.visa_types.map(a=>{return a.toLowerCase()})
		if(!VT.includes(e.toLowerCase())){
		this.visa_types.pop();
		this.visa_types.push(e.trim());
		this.visaType.nativeElement.value = '';
		}
		}
	}
	/**
	**	To add the visa type
	**/
	
	add(event: MatChipInputEvent): void {
		//console.log(this.matAutocomplete)
		const value = (event.value || '').trim();

		if (value) {
			const index = this.visa_types.indexOf(value);
			if (index >= 0) {
				
			}else{
			var VT = this.visa_types.map(a=>{return a.toLowerCase()})
			/*VT.map(a=>{
				if(value.toLowerCase()!=a){
				return this.visa_types.push(value);
				}
			})*/
			if(!VT.includes(value.toLowerCase())){
			this.visa_types.push(value);
			}
			this.childForm.patchValue({
			  personalDetails: {
				['visa_type']: this.visa_types,
			  }
			});}
			
		}
		
		// Clear the input value
		event.chipInput!.clear();
		}
	
	/**
	**	To remove the visa type
	**/
	remove(visa): void {
		
		const index = this.visa_types.indexOf(visa);

		if (index >= 0) {
			this.visa_types.splice(index, 1);
			this.childForm.patchValue({
			  personalDetails: {
				['visa_type']: this.visa_types,
			  }
			});
		}
	}
	
	/**
	**	To add the company
	**/
	addEmplyee(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.employers.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.employers.push(value);
			this.childForm.patchValue({
			  personalDetails: {
				['clients_worked']: this.employers,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the company
	**/
	removeEmplyee(employer): void {
		
		const index = this.employers.indexOf(employer);

		if (index >= 0) {
			this.employers.splice(index, 1);
			this.childForm.patchValue({
			  personalDetails: {
				['clients_worked']: this.employers,
			  }
			});
		}
	}
	
	/**
	**	When the page loads initally function calls
	**/
	
	ngOnInit(): void {
		     this.http.get(
          `${env.serverUrl}`+'/api/workauthorization/list?limit=1000').subscribe(response=>{
			  this.workAuthDetails = response['items']
		  })
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
        if (response && Array.isArray(response) && response.length) {
          this.nationality = response;
		  if(this.childForm.controls.personalDetails.status =="VALID"){
				this.childForm.patchValue({
					personalDetails: {
						nationality: this.childForm.value.personalDetails.nationality,
					}
				});
			}
			this.othercountry =  response.filter(function(a,b){
				return a.id !="226"&&a.id !="254"&&a.id !="225"&&a.id !="13"&&a.id !="153"&&a.id !="192"&&a.id !="38"
			});
			
        }
      }
    );
	this.dataService.getLanguageDataSource().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.languageSource = response;
        }
      }
    );
	
  }
	/**
	**	To check the form details and assign the data's
	**/
  ngOnChanges(changes: SimpleChanges): void {
	 
	  setTimeout(async () => {
				if(this.childForm.controls.personalDetails.status =="INVALID"){
    if(this.childForm && this.savedUserDetails) {
		if(this.childForm.value.personalDetails.country){
			this.savedUserDetails.first_name=this.childForm.value.personalDetails.first_name;
			this.savedUserDetails.last_name= this.childForm.value.personalDetails.last_name;
			if(this.childForm.value.personalDetails.phone){
			if(this.childForm.value.personalDetails.phone.number){
			  this.savedUserDetails.phone= this.childForm.value.personalDetails.phone.number;
			}}
			 this.savedUserDetails.city= this.childForm.value.personalDetails.city;
			  this.savedUserDetails.state=this.childForm.value.personalDetails.state;
			  this.savedUserDetails.country= this.childForm.value.personalDetails.country;
			  this.savedUserDetails.zipcode=this.childForm.value.personalDetails.zipcode;
			  this.savedUserDetails.nationality= this.childForm.value.personalDetails.nationality;
			  if(this.childForm.value.personalDetails.visa_type){
				  var splits =this.childForm.value.personalDetails.visa_type;
				  this.savedUserDetails.visa_type=splits;
				  this.visa_types = splits;
			  }
			  if(this.childForm.value.personalDetails.clients_worked){
				  var splits =this.childForm.value.personalDetails.clients_worked;
				  this.savedUserDetails.clients_worked=splits;
				  this.employers = splits;
			  }
			  this.savedUserDetails.work_authorization= this.childForm.value.personalDetails.work_authorization;
			  if(this.childForm.value.personalDetails.authorized_country){
				this.savedUserDetails.authorized_country= this.childForm.value.personalDetails.authorized_country;
			  }
			  if(this.childForm.value.personalDetails.authorized_country_select){
				var selected_authorized_country_select = this.childForm.value.personalDetails.authorized_country_select;
				for(let i=0;i<selected_authorized_country_select.length;i++){
					var id=selected_authorized_country_select[i];
					this.savedUserDetails.authorized_country.push(id);
				}
			  }
			  this.savedUserDetails.language_known=this.childForm.value.personalDetails.language_known;
			  this.savedUserDetails.reference=this.childForm.value.personalDetails.reference;
				
				if(this.savedUserDetails.social_media_link){
					this.savedUserDetails.social_media_link = this.savedUserDetails.social_media_link.filter((v,i,a)=>a.findIndex(t=>(t.media === v.media))===i)
				}
				this.socialMediaLinks = this.savedUserDetails.social_media_link;
		}else{
			if(this.savedUserDetails.visa_type){
				  this.visa_types =this.savedUserDetails.visa_type;
			  }
			if(this.savedUserDetails.clients_worked){
				  this.employers =this.savedUserDetails.clients_worked;
			  }
			  if(this.savedUserDetails.social_media_link){
					this.savedUserDetails.social_media_link = this.savedUserDetails.social_media_link.filter((v,i,a)=>a.findIndex(t=>(t.media === v.media))===i)
				}
			  this.socialMediaLinks = this.savedUserDetails.social_media_link;
		}
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
	  this.childForm.patchValue({
        personalDetails: {
			  phone: this.savedUserDetails.phone,
        }
      });
	  }
	   
      this.childForm.patchValue({
        personalDetails: {
			first_name:this.savedUserDetails.first_name,
			  last_name: this.savedUserDetails.last_name,
			  email: this.savedUserDetails.email,
			  phone: this.savedUserDetails.phone,
			  entry: this.savedUserDetails.entry,
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
		if(this.savedUserDetails.work_authorization==0){
			this.showAuthorization =true;
			this.childForm.get('personalDetails').controls['visa_type'].setValidators([Validators.required])
		  this.childForm.get('personalDetails').controls['visa_type'].updateValueAndValidity();
			this.childForm.patchValue({
			  personalDetails: {
				['work_authorization']: this.savedUserDetails.work_authorization,
			  }
			});
		}else{
			this.showAuthorization = false;
			
			this.childForm.get('personalDetails').controls['visa_type'].setValidators(null)
			this.childForm.get('personalDetails').controls['visa_type'].updateValueAndValidity();
			this.childForm.patchValue({
			  personalDetails: {
				['work_authorization']: this.savedUserDetails.work_authorization,
				['visa_type']: null,
			  }
			});
		}
		
		if(this.savedUserDetails.work_authorization == null){
			this.showAuthorization =false;
			this.childForm.patchValue({
			  personalDetails: {
				['work_authorization']: null,
				['visa_type']: null,
			  }
			});
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
		
	  if(this.savedUserDetails.authorized_country!=null){		  
		if(this.savedUserDetails.authorized_country.length){
			for(let i=0;i<this.savedUserDetails.authorized_country.length;i++){
				var id = this.savedUserDetails.authorized_country[i]
				if(document.getElementById(id)){
					document.getElementById(id)['className'] ='btn btn-fltr btn-fltr-active';
				}
			}
			var value = this.savedUserDetails.authorized_country;
			var temp = value.filter(function(a,b){
				return a =="226" ||a =="254" || a =="225" || a =="13" || a =="153" || a =="192" || a =="38" 
			});
			var tempData = value.filter(function(a,b){
				return a !="226" ||a !="254" || a !="225" || a !="13" || a =="153" || a =="192" || a =="38" 
			});
			this.savedUserDetails.authorized_country = tempData;
			this.childForm.patchValue({
				personalDetails: {
					authorized_country_select : temp,
					authorized_country : tempData
				}
			});
		}
		
	  }
			
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
		this.childForm.patchValue({
        personalDetails: {
			  phone: this.savedUserDetails.phone,
        }
      });
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
				}else{
					
					this.childForm.patchValue({
						personalDetails: {
							nationality: this.childForm.value.personalDetails.nationality,
						}
						});
	  
					if(this.childForm.value.personalDetails.work_authorization==0){
						this.showAuthorization =true;
					}else{
						this.showAuthorization = false;
					}
		
					if(this.childForm.value.personalDetails.visa_type){
				  var splits =this.childForm.value.personalDetails.visa_type;
				  this.savedUserDetails.visa_type=splits;
				  this.visa_types = splits;
			  }
			  if(this.childForm.value.personalDetails.clients_worked){
				  var splits =this.childForm.value.personalDetails.clients_worked;
				  this.savedUserDetails.clients_worked=splits;
				  this.employers = splits;
			  }
			  this.savedUserDetails.work_authorization= this.childForm.value.personalDetails.work_authorization;
			  if(this.childForm.value.personalDetails.authorized_country){
				this.savedUserDetails.authorized_country= this.childForm.value.personalDetails.authorized_country;
			  }
			  if(this.childForm.value.personalDetails.authorized_country_select){
				var selected_authorized_country_select = this.childForm.value.personalDetails.authorized_country_select;
				for(let i=0;i<selected_authorized_country_select.length;i++){
					var id=selected_authorized_country_select[i];
					this.savedUserDetails.authorized_country.push(id);
				}
			  }
			  
			  if(this.savedUserDetails.authorized_country!=null){		  
		if(this.savedUserDetails.authorized_country.length){
			for(let i=0;i<this.savedUserDetails.authorized_country.length;i++){
				var id = this.savedUserDetails.authorized_country[i]
				if(document.getElementById(id)){
					document.getElementById(id)['className'] ='btn btn-fltr btn-fltr-active';
				}
			}
			var value = this.savedUserDetails.authorized_country;
			var temp = value.filter(function(a,b){
				return a =="226" ||a =="254" || a =="225" || a =="13" || a =="153" || a =="192" || a =="38" 
			});
			var tempData = value.filter(function(a,b){
				return a !="226" ||a !="254" || a !="225" || a !="13" || a =="153" || a =="192" || a =="38" 
			});
			this.savedUserDetails.authorized_country = tempData;
			this.childForm.patchValue({
				personalDetails: {
					authorized_country_select : temp,
					authorized_country : tempData
				}
			});
		}
		
	  }
				}
		this.onChangeData();

	  }); 
  }
	
	
	onChangeData(){
		if(this.childForm.value.personalDetails.entry == true){
			this.childForm.get('personalDetails').controls['clients_worked'].setValidators(null)
			this.childForm.get('personalDetails').controls['clients_worked'].updateValueAndValidity();	
			this.hideEmployee = true;
		}else{
			this.childForm.get('personalDetails').controls['clients_worked'].setValidators(Validators.required)
			this.childForm.get('personalDetails').controls['clients_worked'].updateValueAndValidity();
			this.hideEmployee = false;
		}
	}
	
	/**
	**	To check the mobile number
	**/
	
	checkNumber(){
		
		if(this.childForm.controls.personalDetails.controls.phone.status=="INVALID"){
			if (this.childForm.controls.personalDetails.controls.phone.errors.required) {
				this.invalidMobile = false;
			}
			if (this.childForm.controls.personalDetails.controls.phone.errors.validatePhoneNumber) {
				if (this.childForm.controls.personalDetails.controls.phone.errors.validatePhoneNumber.valid == false ) {
					this.invalidMobile = true;
				}
				if (this.childForm.controls.personalDetails.controls.phone.errors.validatePhoneNumber.valid == true ) {
					this.invalidMobile = false;
				}
			}
		}else{
			this.invalidMobile = false;
		}
	}
	
	/**
	**	To handle match select
	**/
	
	handleChange(event,val){
		if(val ==0){
			if(this.childForm.value.personalDetails.work_authorization == 0 ){
				this.childForm.controls.personalDetails['controls']['work_authorization'].setValue(null);
				this.childForm.controls.personalDetails['controls']['work_authorization'].updateValueAndValidity();
				this.showAuthorization = false;
				this.visa_types =[];
				this.childForm.get('personalDetails').controls['visa_type'].setValidators(null)
				this.childForm.get('personalDetails').controls['visa_type'].updateValueAndValidity();
				
				this.onChangeCountry(this.childForm.value.personalDetails.nationality);
				this.childForm.patchValue({
				  personalDetails: {
					['visa_type']: null,
				  }
				});
			}else{
				this.onChangeFieldValue(event,val);
			}
		}else if(val ==1){
			if(this.childForm.value.personalDetails.work_authorization == 1 ){
				this.childForm.controls.personalDetails['controls']['work_authorization'].setValue(null);
				this.childForm.controls.personalDetails['controls']['work_authorization'].updateValueAndValidity();
				this.showAuthorization = false;
				this.visa_types =[];
				this.childForm.get('personalDetails').controls['visa_type'].setValidators(null)
				this.childForm.get('personalDetails').controls['visa_type'].updateValueAndValidity();
				
				this.onChangeCountry(this.childForm.value.personalDetails.nationality);
				this.childForm.patchValue({
				  personalDetails: {
					['visa_type']: null,
				  }
				});
			}else{
				this.onChangeFieldValue(event,val);
				
			}
		}
	}
	
	/**
	**	To check the authorized_country
	**/
	
	onChangeCountry(a){
		if(a!='-1'){
			if(a =="226" ||a =="254" || a =="225" || a =="13" || a =="153" || a =="192" || a =="38" ){
				if(document.getElementById(a)){
					document.getElementById(a).className = 'btn btn-fltr btn-fltr-active';
					if(this.childForm.value.personalDetails.authorized_country_select==null){
						var value =[a];
						this.childForm.patchValue({ 
								personalDetails: { 
									authorized_country_select: value 
								} 
							})

					}else{
						this.childForm.value.personalDetails.authorized_country_select.push(a);
					}
				}
			}else{
				var tempCountryVal = this.childForm.value.personalDetails.authorized_country;
				if(tempCountryVal){
					if(tempCountryVal.length){
						//tempCountryVal.push(a);
					}else{
						//tempCountryVal=[a];
					}
				}else{
					//tempCountryVal=[a];
				}
				if(tempCountryVal){
					if(tempCountryVal.length){
						tempCountryVal = tempCountryVal.filter((a, b) => tempCountryVal.indexOf(a) === b);
					}
					this.childForm.patchValue({personalDetails: {authorized_country:[],}});
					this.childForm.patchValue({personalDetails: {authorized_country: tempCountryVal,}});
			
				}
				
				
			}
		}
	}
	
	/**
	**	To remove the authorized country
	**/
	
	onRemoveCountryEvent(id){
		if(this.childForm.value.personalDetails.nationality == id){
			this.onChangeCountry(id);
		}
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
  
	/**
	**	To create a personal-details form
	**/
	
	createForm() {
		this.childForm = this.parentF.form;
		this.childForm.addControl('personalDetails', new FormGroup({
		  first_name: new FormControl('', Validators.required),
		  last_name: new FormControl('', Validators.required),
		  email: new FormControl(''),
		  entry: new FormControl(false),
		  phone: new FormControl(''),
		  city: new FormControl('', Validators.required),
		  state: new FormControl('', Validators.required),
		  latlng: new FormControl({}, Validators.required),
		  country: new FormControl('', Validators.required),
		  zipcode: new FormControl(null, Validators.required),
		  clients_worked: new FormControl(null, Validators.required),
		  authorized_country: new FormControl(null),
		  authorized_country_select: new FormControl(null),
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
	
	/**
	**	To detectChanges in address 
	**/
	
	handleAddressChange = (event) => {
		const address = this.sharedService.fromGooglePlace(event);
		if(event.geometry){
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
		}
	};
  
	/**
	**	To set the socialMediaLinks
	**/
	
	onSetLinks = (fieldName, status) => {
		if(this.socialMediaLinks==null || undefined){
			  this.socialMediaLinks=[
			{
			  "media": fieldName,
			  "url": this.childForm.value.personalDetails[fieldName],
			  "visibility": status
			}
		  ];
		  }else if(this.socialMediaLinks.length == 0) {
			
		  this.socialMediaLinks.push(
			{
			  "media": fieldName,
			  "url": this.childForm.value.personalDetails[fieldName],
			  "visibility": status
			}
		  )
		}else {
			this.socialMediaLinks = this.socialMediaLinks.filter((v,i,a)=>a.findIndex(t=>(t.media === v.media))===i)
		  let findInex = this.socialMediaLinks.findIndex(val => ((val.media == fieldName) ))
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
	/**
	**	To upload the profile image
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

	_handleReaderLoaded(readerEvt) {
		var binaryString = readerEvt.target.result;
		let base64textString = btoa(binaryString);
		this.defaultProfilePic = base64textString;
	}
	
	/**
	**	To open the image crop popup
	**/
	
	open(content: any) {
		this.mbRef = this.modalService.open(content, {
		  windowClass: 'insurance-modal-zindex',
		  size: "lg",
		  centered: true
		});
	}
  
	/**
	**	To crop the image
	**/
	
	imageCropped(event: ImageCroppedEvent) {
		this.profilePicValue = event.base64.split(",")[1];
		let file = base64ToFile(event.base64);
		this.croppedFile = file;
		this.profilePicAsEvent = event;
	}

	imageLoaded() {
    // show cropper
	}
	
	/**
	**	To handle the image uploded error
	**/
	
	loadImageFailed(event: any) {
		this.toastrService.error('File format not supported(Allowed Format:jpg,jpeg,png)');
		this.mbRef.close();
	}
	
	/**
	**	To crop the image and save
	**/
	
	onImageCropSave() {
		this.defaultProfilePic = this.profilePicValue;
		this.previousProfilePic = this.defaultProfilePic;
		this.dataService.setUserPhoto({ photoBlob: this.croppedFile, base64: this.defaultProfilePic })
		this.mbRef.close();
	}
	
	/**
	**	To set the previous profile picture
	**/
	
	SetPreviousProfilePic() {
		this.defaultProfilePic = this.previousProfilePic;
		this.previousProfilePic = this.defaultProfilePic;
		this.userImage.nativeElement.value = null;
		this.imageChangedEvent = null;
		this.mbRef.close();
	}
  
	/**
	**	To convert url to image
	**/
	
	convertToImage(imageString: string): string {
		return this.utilsHelperService.convertToImageUrl(imageString);
	}

	onCountryChange = (event) => {
    
	}
  
	/**
	**	To detect the language details control
	**/
	
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
	
	/**
	**	To check the reference controls
	**/
	
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
  
	/**
	**	To change the optional fields
	**/
 
	onChangeFieldValue = (fieldName, value) => {
		if(value==0){
			this.visa_types =[];
			this.showAuthorization =true;
			this.childForm.get('personalDetails').controls['visa_type'].setValidators([Validators.required])
		  this.childForm.get('personalDetails').controls['visa_type'].updateValueAndValidity();
			this.onChangeCountry(this.childForm.value.personalDetails.nationality);
			this.childForm.patchValue({
			  personalDetails: {
				[fieldName]: value,
			  }
			});
		}else{
			this.showAuthorization = false;
			this.visa_types =[];
			this.childForm.get('personalDetails').controls['visa_type'].setValidators(null)
			this.childForm.get('personalDetails').controls['visa_type'].updateValueAndValidity();
			
			this.onChangeCountry(this.childForm.value.personalDetails.nationality);
			this.childForm.patchValue({
			  personalDetails: {
				[fieldName]: value,
				['visa_type']: null,
			  }
			});
		}
		
	}
	
	get t() {
		return this.f.language_known as FormArray;
	}
  
	/**
	**	To add a new language 
	**/
	
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
  
	/**
	**	To remove a language
	**/
	
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
  
	/**
	**	To create a new reference
	**/
	
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
  
	/**
	**	To remove the data
	**/
	
	onRemoveR = (index) => {
		if (index == 0  && this.r.value.length==1) {
			this.r.reset();
		}else{
			this.r.removeAt(index);
		}
	}
  
	/**
	**	To click the country info active or not
	**/
	
	countryClick(value,clr){
	  var temp = clr.target.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		 
		this.childForm.value.personalDetails.authorized_country_select.pop(clr.target.id);
		this.childForm.value.personalDetails.authorized_country.pop(clr.target.id);
		  clr.target.className = clr.target.className.replace('btn-fltr-active','');
	  }else{
		  clr.target.className = clr.target.className+' btn-fltr-active';

		if(this.childForm.value.personalDetails.authorized_country_select==null){
			value =[clr.target.id];
			this.childForm.patchValue({ 
				personalDetails: { 
					authorized_country_select: value 
				} 
			})

		}else{
			this.childForm.value.personalDetails.authorized_country_select.push(clr.target.id);
		}
		if(this.childForm.value.personalDetails.authorized_country==null){
			value =[clr.target.id];
			this.childForm.patchValue({ 
				personalDetails: { 
					authorized_country: value 
				} 
			})

		}else{
			this.childForm.value.personalDetails.authorized_country.push(clr.target.id);
		}
	  }
	  console.log(value);
	}
  
	/**
	**	To filter the index values
	**/
	
	indexOfFilter(hasIndex) {
      
	  if(this.t.value.filter(function(a,b){ return a.language == hasIndex }).length !=0 ){
		  return false;
	  }else{
		 return true;
	  }
       
	}
}
