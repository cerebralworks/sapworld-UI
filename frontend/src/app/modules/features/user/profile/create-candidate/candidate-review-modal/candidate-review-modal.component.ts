import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component,ElementRef,ViewEncapsulation, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';
import { SharedApiService } from '@shared/service/shared-api.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { trigger, style, animate, transition, state, group } from '@angular/animations';
@Component({
  selector: 'app-candidate-review-modal',
  templateUrl: './candidate-review-modal.component.html',
  styleUrls: ['./candidate-review-modal.component.css'],
	encapsulation: ViewEncapsulation.None,
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
export class CandidateReviewModalComponent implements OnInit {
	
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	certification = [ ];
	address = [ ];
separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	
	@Input() toggleRegisterReviewModal: boolean;
	@Output() onEvent = new EventEmitter<boolean>();
	public show: boolean = false;
	public invalidMobile: boolean = false;
	public isOpenCriteriaModal: boolean = false;
	public jobtype: boolean = false;
	public end_to_end_implementation: boolean = false;
	public certificationBoolean: boolean = false;
	public education: boolean = false;
	public job_role: boolean = false;
	public reference: boolean = false;
	public mobileNumber: boolean = false;
	public preferredLocation: boolean = false;
	@Output() createCandidate: EventEmitter<any> = new EventEmitter();
	public savedUserDetails: any;
	public jobId: string;
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}

	public childForm;
	public mbRef: NgbModalRef;
	public criteriaModalRef: NgbModalRef;
	public registerReviewModalSub: Subscription;
	public userInfo: any = {};
	public userPhotoInfo: any;
	public nationality: any[] = [];
	public languageSource: any[] = [];
	public requestParams: any;
	public educations = [
      "high school",
      "bachelors",
      "diploma",
      "masters",
      "doctorate"
    ];
  public educationsSelectedArray: any[] = [];
  educationsSelectedValue: any;
	
	@ViewChild("registerReviewModal", { static: false }) registerReviewModal: TemplateRef<any>;
@ViewChild("criteriaModal", { static: false }) criteriaModal: TemplateRef<any>;
//@ViewChild('chipsInput', { static: false })chipsInput: ElementRef; //chipsInput: ElementRef<HTMLInputElement>;
	constructor(
		private modalService: NgbModal,
		public router: Router,
		private parentF: FormGroupDirective,
		private formBuilder: FormBuilder,
		private employerService: EmployerService,
		public sharedService: SharedService,
		public route: ActivatedRoute,
		public utilsHelperService: UtilsHelperService,
		private userSharedService: UserSharedService,
		private SharedAPIService: SharedApiService,
		private dataService: DataService
	) { }

	ngOnInit(): void {
		/* this.requestParams = {'Entering the onInit':'ReviewComponent'};
	 this.SharedAPIService.onSaveLogs(this.requestParams);
	  console.log(this.requestParams); */
		this.childForm = this.parentF.form;
		this.jobId = this.route.snapshot.queryParamMap.get('id');
		this.userSharedService.getUserProfileDetails().subscribe(
		response => {
			this.userInfo = response;
		});
		this.dataService.getUserPhoto().subscribe(
		response => {
			this.userPhotoInfo = response;
		})
		this.dataService.getCountryDataSource().subscribe(
		response => {
			if (response && Array.isArray(response) && response.length) {
			  this.nationality = response;
			}
		});
		this.dataService.getLanguageDataSource().subscribe(
		  response => {
			if (response && Array.isArray(response) && response.length) {
			  this.languageSource = response;
			}
		});
		/* this.requestParams = {'Exist the onInit':'ReviewComponent'};
	 this.SharedAPIService.onSaveLogs(this.requestParams);
	  console.log(this.requestParams); */
	}

	ngAfterViewInit(): void {
		if (this.toggleRegisterReviewModal) {
			/* this.requestParams = {'Entering the toggleRegisterReviewModal':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
			this.mbRef = this.modalService.open(this.registerReviewModal, {
				windowClass: 'modal-holder',
				size: 'lg',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
			/* this.requestParams = {'Exist the toggleRegisterReviewModal':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
		}
	}

	ngOnDestroy(): void {
		/* this.requestParams = {'Enter the ngOnDestroy':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
		this.onClickCloseBtn(false);
		this.registerReviewModalSub && this.registerReviewModalSub.unsubscribe();
		/* this.requestParams = {'Exist the ngOnDestroy':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
	}

	onClickCloseBtn(status){
		this.onEvent.emit(status);
		if(status == false) {
			this.mbRef.close()
		}
	}

	onRedirectDashboard(status) {
		this.createCandidate.next();
	}

	convertToImage(imageString: string): string {
		return this.utilsHelperService.convertToImageUrl(imageString);
	}
	
	findCountry(value){
		if(value){
			if(this.nationality){
				var temp = this.nationality.filter(function(a,b){
					return a.id == value;
				})
				if(temp.length !=0){
					return temp[0]['nicename'];
				}
			}
		}
		
		return '--';
	}
	
	findEducation(value){
		if(value){
		if(value.length!=0 && value.length!=null && value.length!=undefined){
			return this.utilsHelperService.onConvertArrayToString(value.map(function(a,b){return a.degree}));
		}else{
			return '--';
		}
		
		}
		return '--';
		
	}
	
	findLanguageArray(value){
		if(value){
			value = value.map(function(a,b){
				return a.language 
			})
			if(this.languageSource){
				var array = this.languageSource.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['name'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			}
		}
		return '--';
	}
	
	findCountryArray(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			}
		}
		return '--';
	}
	
	filterPrefered(value){
		if(value){
			if(value.length !=0){
				var temp = value.map(function(a,b){
					if(a['stateShort']){
						return a['city']+' '+a['stateShort'];
					}else{
						return a['city'];
					}
				})
				if(temp.length !=0){
					temp =temp.filter(function(item, pos, self) {
						return self.indexOf(item) == pos;
					})
					return this.utilsHelperService.onConvertArrayToString(temp);
				}
			}
		}
		return '--';
	}
	
	closeAdd(){
		if(this.jobtype == true){
			this.childForm.patchValue({
				educationExp: {
				  employer_role_type:''
				}
			  })
		}else if(this.end_to_end_implementation == true){
			this.childForm.patchValue({
				educationExp: {
				  end_to_end_implementation:null
				}
			  })
		}else if(this.education == true){
			this.childForm.patchValue({
				educationExp: {
				  education_qualification:null
				}
			  })
		}else if(this.certificationBoolean == true){
			this.childForm.patchValue({
				skillSet: {
				  certification:[]
				}
			  });
			  this.certification =[];
		}else if(this.job_role == true){
			this.childForm.patchValue({
				jobPref: {
				  job_role:null
				}
			  });
		}else if(this.preferredLocation == true){
			this.childForm.patchValue({
				jobPref: {
				  preferred_locations:[]
				}
			  });
			  this.address=[];
		}else if(this.reference == true){
			this.childForm.patchValue({
				personalDetails: {
				  reference:[]
				}
			  });
			 for(let i=0;i<=this.r.length;i++){
				 this.r.removeAt(0);
				 i=0;
			 }
			  this.r.push(this.formBuilder.group({
				name: new FormControl(null),
				email: new FormControl(''),
				company_name: new FormControl(null)
			}));
		}else if(this.mobileNumber == true){
			this.childForm.patchValue({
				personalDetails: {
				  phone:null
				}
			  });
		}
		this.reference = false;
		this.jobtype = false;
		this.job_role = false;
		this.end_to_end_implementation = false;
		this.education = false;
		this.show = true;
		this.mobileNumber = false;
		this.criteriaModalRef.close();
	}
	
	closeSave(){
		
		this.jobtype = false;
		this.job_role = false;
		this.end_to_end_implementation = false;
		this.education = false;
		this.certificationBoolean = false;
		this.preferredLocation = false;
		this.reference = false;
		this.mobileNumber = false;
		this.criteriaModalRef.close();
		
	}
	onOpenCriteriaModal = (value) => {
		if(value=='jobtype'){
			this.jobtype = true;
		}else if(value=='end_to_end_implementation'){
			this.end_to_end_implementation = true;
		}else if(value=='education'){
			this.education = true;
		}else if(value=='certificationBoolean'){
			this.certificationBoolean = true;
		}else if(value=='job_role'){
			this.job_role = true;
		}else if(value=='preferredLocation'){
			this.preferredLocation = true;
		}else if(value=='reference'){
			this.reference = true;
		}else if(value=='mobileNumber'){
			this.mobileNumber = true;
		}
    this.isOpenCriteriaModal = true;
    if (this.isOpenCriteriaModal && this.reference == true || this.education == true) {
      setTimeout(() => {
        this.criteriaModalRef = this.modalService.open(this.criteriaModal, {
          windowClass: 'modal-holder',
		  size: 'lg',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
      }, 300);
    }else{
		setTimeout(() => {
        this.criteriaModalRef = this.modalService.open(this.criteriaModal, {
          windowClass: 'modal-holder',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
      }, 300);
	}
  }
  
  
  
  get f() {
    return this.childForm.controls.educationExp.controls;
  }

  get t() {
    return this.f.education_qualification as FormArray;
  }
	educationsSelectedArrayCheck(value,index){
		if(value==index['value']['degree']){
			return false;
		}else{
			if(this.t.value.filter(function(a,b){ return a.degree ==value}).length==0){
				return false;
			}else{
				return true;
			}
		}
	}
  onChangeDegreeValue = (value, index) => {
    this.educationsSelectedValue = value;
    if (!this.educationsSelectedArray.includes(this.educationsSelectedValue)) {
      this.educationsSelectedArray.push(this.educationsSelectedValue);
    }
    if(value && index > -1) {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }else {
		if(this.childForm.get('educationExp.education_qualification').controls[index] != undefined && this.childForm.get('educationExp.education_qualification').controls[index] != null){
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }
    }
  }

  onChangeStudyValue = (value, index) => {
    if(value && index > -1) {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }else {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }
  }

  onChangeCompletionValue = (value, index) => {
    if(value && index > -1) {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }else {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }
  }

  onDuplicate = (index) => {
	  if(this.t.value[index]['field_of_study']== null ||this.t.value[index]['degree']== '' ||this.t.value[index]['year_of_completion']== null  ){
		  
	  }else if (this.t.length < 5) {
      this.t.push(this.formBuilder.group({
        degree: [''],
        field_of_study: [null],
        year_of_completion: [null, [Validators.min(4)]]
      }));
    }
  }

  onRemove = (index) => {
    let removedValue = this.t.value[index];
    if (removedValue && removedValue.degree) {
      let indexDeg = this.educationsSelectedArray.indexOf(removedValue.degree);
      this.educationsSelectedArray.splice(indexDeg, 1);
    }

    if (index == 0 && this.t.length == 1) {
      this.t.removeAt(0);
      this.t.push(this.formBuilder.group({
        degree: [''],
        field_of_study: [null],
        year_of_completion: [null]
      }));
    } else {
      this.t.removeAt(index);

    }
  }
  
  
  
	addCertification(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.certification.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.certification.push(value);
			this.childForm.patchValue({
			  skillSet: {
				['certification']: this.certification,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}

	removeCertification(data): void {
		
		const index = this.certification.indexOf(data);

		if (index >= 0) {
			this.certification.splice(index, 1);
			this.childForm.patchValue({
			  skillSet: {
				['certification']: this.certification,
			  }
			});
		}
	}
	add(event: MatChipInputEvent): void {
		// Clear the input value
		event.chipInput!.clear();
	}

	remove(data): void {
		
		const index = this.address.indexOf(data);

		if (index >= 0) {
			this.address.splice(index, 1);
		}
	}
	  get ts() {
    return this.childForm.controls.jobPref.controls.preferred_locations as FormArray;
  }
  
  
  onDuplicates = () => {
      this.ts.push(this.formBuilder.group({
        city: [''],
        state: [''],
        stateShort: [''],
        country: ['']
      }));
  }

  onRemoves = (index) => {
    let removedValue = this.ts.value[index];
 
    if (index == 0 && this.ts.length == 1) {
      this.ts.removeAt(0);
      this.ts.push(this.formBuilder.group({
         city: [''],
        state: [''],
        stateShort: [''],
        country: ['']
      }));
	  this.address=[];
    } else {
      this.ts.removeAt(index);
	  var tempData =[];
		if(this.ts.value){
			 tempData = this.ts.value.filter(function(a,b){ return a.city!=''||a.country!=''});
		}
	  tempData = tempData.map(function(a,b){ 
	a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
	return a.city+'-'+a.stateShort });
	this.address=tempData;

    }
  }
  handleAddressChange = (event) => {
    const address = this.sharedService.fromGooglePlace(event);
	if(event.geometry){
		var tempData =[];
		if(this.ts.value){
			 tempData = this.ts.value.filter(function(a,b){ return a.city!='' && b.stateShort!=''});
		}
		
		var datas:any = {
        city: address.city ? address.city : event.formatted_address,
        state: address.state,
        stateShort: address.stateShort,
        country: address.country
    };
	//this.chipsInput.nativeElement.value='';
	if(document.getElementById('mat-chip-list-input-3')){
	document.getElementById('mat-chip-list-input-3')['value']='';
	}
	if(tempData.filter(function(a,b){ return a.city == datas.city && a.state ==datas.state && a.country ==datas.country }).length==0){
	this.onDuplicates();
	tempData.push(datas);
	this.ts.patchValue(tempData);
	tempData = tempData.map(function(a,b){ 
	a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
	return a.city+'-'+a.stateShort });
	this.address=tempData;
	}}
  };
  
  get r() {
    return this.childForm.controls.personalDetails.controls.reference as FormArray;
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
	onCountryChange = (event) => {
     }
}
