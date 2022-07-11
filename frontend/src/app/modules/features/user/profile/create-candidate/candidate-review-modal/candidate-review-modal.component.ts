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
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

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
	
	/**
	**	Variable Declaration
	**/
	
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	certification = [ ];
	address = [ ];
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	//TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	@Input() toggleRegisterReviewModal: boolean;
	@Output() onEvent = new EventEmitter<boolean>();
	public show: boolean = false;
	public invalidMobile: boolean = false;
	public isOpenCriteriaModal: boolean = false;
	public isCheckModel: boolean = false;
	public jobtype: boolean = false;
	public end_to_end_implementation: boolean = false;
	public certificationBoolean: boolean = false;
	public education: boolean = false;
	public job_role: boolean = false;
	public reference: boolean = false;
	public mobileNumber: boolean = false;
	public toggleresumeSelectModal: boolean = false;
	public preferredLocation: boolean = false;
	@Output() createCandidate: EventEmitter<any> = new EventEmitter();
	public savedUserDetails: any;
	public jobId: string;
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}
	public idValueGet='';
	public childForm;
	public mbRef: NgbModalRef;
	public criteriaModalRef: NgbModalRef;
	public checkModalRef: NgbModalRef;
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
	options  = {
		componentRestrictions: { country:[] }
	};
	
	public industryItems: any[] = [];
	public othercountry: any[] = [];
	public domains_worked: boolean = false;
	
	public skillItems: any[] = [];
	public skills: boolean = false;
	public programmingSkills: any[] = [];
	public programming_skills: boolean = false;
	public othersSkills: any[] = [];
	public other_skills: boolean = false;
	public employers: any[] = [];
	public clients_worked: boolean = false;
	
	@ViewChild("registerReviewModal", { static: false }) registerReviewModal: TemplateRef<any>;
	@ViewChild("criteriaModal", { static: false }) criteriaModal: TemplateRef<any>;
	@ViewChild("checkModal", { static: false }) checkModal: TemplateRef<any>;
	@ViewChild('chipsInput', { static: false })chipsInput: ElementRef; //chipsInput: ElementRef<HTMLInputElement>;
	
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
	
	/**
	**	Initialize the review popup
	** 	To get the country and language from the API
	**/
	
	ngOnInit(): void {
		
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
			  this.othercountry = response;
			}
		});
		this.dataService.getLanguageDataSource().subscribe(
		  response => {
			if (response && Array.isArray(response) && response.length) {
			  this.languageSource = response;
			}
		});
		
		this.dataService.getIndustriesDataSource().subscribe(
		  response => {
			if (response && response.items) {
			  this.industryItems = [...response.items];
			}
		  },
		  error => {
			this.industryItems = [];
		  }
		)
		
		this.dataService.getSkillDataSource().subscribe(
		  response => {
			if (response && response.items) {
			 for(let i=0;i<response.items.length;i++){
				  response['items'][i]['tags'] =response['items'][i]['tag']+' -- '+response['items'][i]['long_tag'];
			  } 
			  this.skillItems = [...response.items];
			}
		  },
		  error => {
			this.skillItems = [];
		  }
		)
		
	}
	
	/**
	**	To open the page in popup view
	**/
	
	ngAfterViewInit(): void {
		if (this.toggleRegisterReviewModal) {
			this.mbRef = this.modalService.open(this.registerReviewModal, {
				windowClass: 'modal-holder',
				size: 'lg',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
			if(this.childForm.value.skillSet &&this.childForm.value.skillSet.skills){
				this.childForm.controls.skillSet.value.skills = this.childForm.controls.skillSet.value.skills.filter(function(a,b){ return !Number.isNaN(a) });
				if(!this.childForm.value.skillSet.skills || !this.childForm.value.skillSet.skills.length || this.childForm.value.skillSet.skills.length ==0){
					var temFilter =this.childForm.value.skillSet.hands_on_experience.map(function(a,b){ return a.skill_id });
					temFilter = temFilter.filter(function(a,b){ return a !=null});
					temFilter = temFilter.filter(function(a,b){ return !Number.isNaN(a)});
					this.childForm.patchValue({
					  skillSet: {
						['skills']: temFilter,
					  }
					});
				}
			}else{
				this.childForm.controls.skillSet.value.skills = [] ;
			}
			this.checkPreferred();
		}
	}
	
	/**
	**	To check the preferredCountries
	**/
	
	checkPreferred(){
		
		var temps =this.childForm.value.personalDetails.authorized_country;
		var temps1 =this.childForm.value.personalDetails.authorized_country_select;
		var tempCountry =this.childForm.value.personalDetails.country;
		var tempCoun =[];
		if(!temps){
			temps =[];
		}
		if(!temps || temps.length==0){
			temps =[this.childForm.value.personalDetails.nationality];
		}else{
			temps[temps.length]=this.childForm.value.personalDetails.nationality;
		}
		if(temps.length){
			for(let i=0;i<temps.length;i++){
				var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps[i])});
				if(vali.length==1){
					if(parseInt(vali[0]['id'])==parseInt("254")){
						var EUCountry =["Austria","Belgium","Bulgaria","Croatia",
							"Republic of Cyprus","Czech Republic","Denmark",
							"Estonia","Finland","France","Germany",
							"Greece","Hungary","Ireland","Latvia","Italy",
							"Lithuania","Luxembourg","Malta",
							"Netherlands","Poland","Romania","Portugal",
							"Slovenia","Slovakia","Spain ","Sweden"
							]
							for(let j=0;j<EUCountry.length;j++){
								tempCoun.push(EUCountry[j]);
							}
					}else{
						if(vali[0]['nicename']!=null && vali[0]['nicename']!='' && vali[0]['nicename']!=undefined){
							tempCoun.push(vali[0]['nicename']);
						}
					}
					
				}
				

			}
		}
		if(temps1){
			temps1 =[];
		}
		if(!temps1 || temps1.length==0){
			temps1 =[this.childForm.value.personalDetails.nationality];
		}else{
			temps1[temps1.length]=this.childForm.value.personalDetails.nationality;
		}
		if(temps1.length){
			for(let i=0;i<temps1.length;i++){
				var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps1[i])});
				if(vali.length==1){
					if(parseInt(vali[0]['id'])==parseInt("254")){
						var EUCountry =["Austria","Belgium","Bulgaria","Croatia",
							"Republic of Cyprus","Czech Republic","Denmark",
							"Estonia","Finland","France","Germany",
							"Greece","Hungary","Ireland","Latvia","Italy",
							"Lithuania","Luxembourg","Malta",
							"Netherlands","Poland","Romania","Portugal",
							"Slovenia","Slovakia","Spain ","Sweden"
							]
							for(let j=0;j<EUCountry.length;j++){
								tempCoun.push(EUCountry[j]);
							}
					}else{
						if(vali[0]['nicename']!=null && vali[0]['nicename']!='' && vali[0]['nicename']!=undefined){
							tempCoun.push(vali[0]['nicename']);
						}
					}
					
				}
				

			}
		}
		var CheckPreferred = this.childForm.value.jobPref.preferred_locations;
		var tempPref=[];
		if(CheckPreferred && CheckPreferred.length && CheckPreferred.length !=0){
			for(let i=0;i<CheckPreferred.length;i++){
				var checkVal = CheckPreferred[i]['country'];
				var filterCoun = tempCoun.filter(function(a,b){ return a.toLowerCase() == checkVal.toLowerCase()}).length;
				if(filterCoun !=0){
					tempPref.push(CheckPreferred[i]);
				}
			}
		}
		this.childForm.patchValue({
			jobPref: {
				['preferred_locations']:tempPref,
			}
		});
		this.childForm.value.jobPref.preferred_locations = tempPref;
	}
	
	/**
	**	To destroy the popup view
	**/
	
	ngOnDestroy(): void {
		this.onClickCloseBtn(false);
		this.registerReviewModalSub && this.registerReviewModalSub.unsubscribe();
	}

	/**
	**	To close the review popup
	**/
	onClickCloseBtn(status){
		this.onEvent.emit(status);
		if(status == false) {
			this.mbRef.close()
		}
	}

	/**
	**	To redirect to dashboard
	**/
	
	onRedirectDashboard(status) {
		this.createCandidate.next(status);
	}

	/**
	**	To conert image to URL
	**/
	
	convertToImage(imageString: string): string {
		return this.utilsHelperService.convertToImageUrl(imageString);
	}
	
	/**
	**	To find the country id to string
	**/
	
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
	
	/**
	**	To find the education id to string
	**/
	
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
	
	/**
	**	To find language array to string
	**/
	
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
	
	/**
	**	To find country array to strin'
	**/
	
	findCountryArray(value){
		if(value){
			if(value.length !=0){
				value = value.map(function(a,b){ return parseInt(a) });
			}
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
	
	/**
	**	To find the preferredLocation in string
	**/
	
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
	
	/**
	**	To close the adding popup view
	**/
	
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
			
			
			for(let i=0;i<=this.ts.length;i++){
				this.ts.removeAt(0);
				i=0;
			}
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
		}else if(this.domains_worked == true){
			this.childForm.patchValue({
				educationExp: {
				  domains_worked:[]
				}
			  });
		}else if(this.skills == true){
			this.childForm.patchValue({
				skillSet: {
				  skills:[]
				}
			  });
		}else if(this.programming_skills == true){
			this.childForm.patchValue({
				skillSet: {
				  programming_skills:[]
				}
			  });
			  this.programmingSkills=[];
		}else if(this.other_skills == true){
			this.childForm.patchValue({
				skillSet: {
				  other_skills:[]
				}
			  });
			  this.othersSkills=[];
		}else if(this.clients_worked == true){
			this.childForm.patchValue({
				personalDetails: {
				  clients_worked:[]
				}
			  });
			  this.employers=[];
		}
		this.reference = false;
		this.preferredLocation = false;
		this.jobtype = false;
		this.job_role = false;
		this.end_to_end_implementation = false;
		this.education = false;
		this.show = true;
		this.mobileNumber = false;
		this.domains_worked = false;
		this.skills = false;
		this.programming_skills = false;
		this.other_skills = false;
		this.clients_worked = false;
		this.criteriaModalRef.close();
	}
	
	/**
	**	To close and save the add popup view
	**/
	
	closeSave(){
		
		this.jobtype = false;
		this.job_role = false;
		this.end_to_end_implementation = false;
		this.education = false;
		this.certificationBoolean = false;
		this.preferredLocation = false;
		this.reference = false;
		this.mobileNumber = false;
		this.skills = false;
		this.domains_worked = false;
		this.programming_skills = false;
		this.other_skills = false;
		this.clients_worked = false;
		this.criteriaModalRef.close();
		
	}
	
	
	/**
	**	To open the add popup view
	**/
	
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
		}else if(value=='domains_worked'){
			this.domains_worked = true;
		}else if(value=='skills'){
			this.skills = true;
		}else if(value=='programming_skills'){
			this.programming_skills = true;
		}else if(value=='other_skills'){
			this.other_skills = true;
		}else if(value=='clients_worked'){
			this.clients_worked = true;
		}else if(value=='preferredLocation'){
			this.preferredLocation = true;
			
			if(this.childForm.value.personalDetails.work_authorization==0){
				var temps =this.childForm.value.personalDetails.authorized_country;
				var tempCoun =[];
				if(temps.length){
					for(let i=0;i<temps.length;i++){
						var vali =this.nationality.filter(function(a,b){ return a.id==parseInt(temps[i])});
						if(vali.length==1){
							if(vali[0]['iso']!=null && vali[0]['iso']!='' && vali[0]['iso']!=undefined){
								tempCoun.push(vali[0]['iso']);
							}
							
						}
						

					}
				}
				
				if(tempCoun.length==0){
				
					this.options.componentRestrictions['country'] = [];
					
				}else{
					
					this.options.componentRestrictions['country'] = tempCoun;
				}
				
				}else if(this.childForm.value.personalDetails.work_authorization==1){
					var temps =this.childForm.value.personalDetails.nationality;
					var tempCoun =[];
					if(temps){
						var vali =this.nationality.filter(function(a,b){ return a.id==parseInt(temps)});
						if(vali.length==1){
							if(vali[0]['iso']!=null && vali[0]['iso']!='' && vali[0]['iso']!=undefined){
								tempCoun.push(vali[0]['iso']);
							}
								
						}
						
					}
					if(tempCoun.length==0){
						this.options.componentRestrictions['country'] = [];
					}else{
						this.options.componentRestrictions['country'] = tempCoun;
					}
				}else{
					var temps =this.childForm.value.personalDetails.nationality;
					var tempCoun =[];
					if(temps){
						var vali =this.nationality.filter(function(a,b){ return a.id==parseInt(temps)});
						if(vali.length==1){
							if(vali[0]['iso']!=null && vali[0]['iso']!='' && vali[0]['iso']!=undefined){
								tempCoun.push(vali[0]['iso']);
							}
								
						}
						
					}
					if(tempCoun.length==0){
						this.options.componentRestrictions['country'] = [];
					}else{
						this.options.componentRestrictions['country'] = tempCoun;
					}
				}
				
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
  
	/**
	**	To check the add popup data
	**/
	
	openCheckPopup(){
		this.isCheckModel = true;
		if(this.jobtype == true){
			if(this.childForm.value.employer_role_type=='' ||this.childForm.value.employer_role_type==null){
				this.closeAdd();
				this.isCheckModel = false;
			} 
		}else if(this.end_to_end_implementation == true){
			if( this.childForm.value.educationExp.end_to_end_implementation==''  || this.childForm.value.educationExp.end_to_end_implementation==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.education == true){
			if( this.childForm.value.educationExp.education_qualification==''  || this.childForm.value.educationExp.education_qualification==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.certificationBoolean == true){
			  if(this.certification.length==0){
				  this.closeAdd();
				this.isCheckModel = false;
			  }
		}else if(this.job_role == true){
			  if( this.childForm.value.jobPref.job_role==''  || this.childForm.value.jobPref.job_role==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.preferredLocation == true){
			  if(this.address.length==0){
				  this.closeAdd();
				this.isCheckModel = false;
			  }
		}else if(this.reference == true){
			  if(this.childForm.value.personalDetails.reference.length==0  || this.childForm.value.personalDetails.reference[0]['name']==null || this.childForm.value.personalDetails.reference[0]['name']==''){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.mobileNumber == true){
			  if( this.childForm.value.personalDetails.phone==''  || this.childForm.value.personalDetails.phone==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.domains_worked == true){
			  if(!this.childForm.value.educationExp.domains_worked ||this.childForm.value.educationExp.domains_worked.length==0 ){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.skills == true){
			  if(!this.childForm.value.skillSet.skills ||this.childForm.value.skillSet.skills.length==0 ){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.programming_skills == true){
			  if(!this.childForm.value.skillSet.programming_skills ||this.childForm.value.skillSet.programming_skills.length==0 ){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.other_skills == true){
			  if(!this.childForm.value.skillSet.other_skills ||this.childForm.value.skillSet.other_skills.length==0 ){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.clients_worked == true){
			  if(!this.childForm.value.personalDetails.clients_worked ||this.childForm.value.personalDetails.clients_worked.length==0 ){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}
		
		if (this.isCheckModel) {
		setTimeout(() => {
        this.checkModalRef = this.modalService.open(this.checkModal, {
          windowClass: 'modal-holder',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
      }, 300);
		}
	}
  
	/**
	**	To cancel the check model view
	**/
	
	cancelCheck(){
		this.checkModalRef.close(); 
	}
  
	/**
	**	To destroy the popup view
	**/
	
	closeSaveCheck(){
	  
		this.checkModalRef.close();
		this.closeSave();
	}
  
	/**
	**	To assign the education form controls to f
	**/
	
	get f() {
		return this.childForm.controls.educationExp.controls;
	}
	
	/**
	**	To assign the education_qualification form controls to t
	**/
	
	get t() {
    return this.f.education_qualification as FormArray;
	}
	
	/**
	**	To check the education array
	**/
	
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
	
	/**
	**	To detect any changes happens in the education_qualification
	**/
	
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
	
	/**
	**	To check the education qualification details
	**/
	
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
	
	/**
	**	To change the education qualification
	**/
	
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
	
	/**
	**	To add a new education data
	**/
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
	
	/**
	**	To removable add data in education
	**/
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
  
	/**
	**	To add the certification
	**/
	
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
	
	/**
	**	To remove the certification
	**/
	
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
	
	/**
	**	To check the add chip event
	**/
	
	add(event: MatChipInputEvent): void {
		// Clear the input value
		this.idValueGet = event.chipInput.id;
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the chips data
	**/
	
	remove(data): void {
		
		const index = this.address.indexOf(data);

		if (index >= 0) {
			this.address.splice(index, 1);
		}
	}
	
	/**
	**	To assign form controls to ts function
	**/
	
	get ts() {
		return this.childForm.controls.jobPref.controls.preferred_locations as FormArray;
	}
  
	/**
	**	To add the preferredLocation
	**/
	
	onDuplicates = () => {
      this.ts.push(this.formBuilder.group({
        city: [''],
        state: [''],
        stateShort: [''],
        country: ['']
      }));
	}
	
	/**
	**	To remove the preferredLocation by id
	**/
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
	
	/**
	**	To handle the address change event
	**/
	
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
		if(document.getElementById(this.idValueGet)){
		document.getElementById(this.idValueGet)['value']='';
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
	
	/**
	**	To add the preference
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
	**	To remove the preference
	**/
	
	onRemoveR = (index) => {
		if (index == 0  && this.r.value.length==1) {
			this.r.reset();
		}else{
			this.r.removeAt(index);
		}
	}
	
	/**
	**	To check the mobileNumber format
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
	onCountryChange = (event) => {
     
	}
	
	/**
	**	To open the resume model
	**/
	
	onToggleResumeSelectModal(status){
		if(status==true){
			
		}
		this.toggleresumeSelectModal = false;
	}
	OpenAddResume(){
	  this.toggleresumeSelectModal = true;
	}
	
	/**
	**	To add the programmingSkills data
	**/
	
	addProgram(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		if (value) {
			var values = value.replace(/\b\w/g, l => l.toUpperCase()); 
			const index = this.programmingSkills.indexOf(values);
			if (index >= 0) {
				
			}else{
			this.programmingSkills.push(values);
			this.childForm.patchValue({
			  skillSet: {
				['programming_skills']: this.programmingSkills,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the programmingSkills data
	**/
	removeProgram(data): void {
		
		const index = this.programmingSkills.indexOf(data);

		if (index >= 0) {
			this.programmingSkills.splice(index, 1);
			this.childForm.patchValue({
			  skillSet: {
				['programming_skills']: this.programmingSkills,
			  }
			});
		}
	}
	
	
	/**
	**	To add the other_skills data
	**/
	addOthersSkills(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.othersSkills.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.othersSkills.push(value);
			this.childForm.patchValue({
			  skillSet: {
				['other_skills']: this.othersSkills,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the other_skills data
	**/
	removeOthersSkills(data): void {
		
		const index = this.othersSkills.indexOf(data);

		if (index >= 0) {
			this.othersSkills.splice(index, 1);
			this.childForm.patchValue({
			  skillSet: {
				['other_skills']: this.othersSkills,
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
}
