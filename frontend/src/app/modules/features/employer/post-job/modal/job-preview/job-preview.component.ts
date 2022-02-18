import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component,ViewEncapsulation, EventEmitter,ElementRef, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';
import { DataService } from '@shared/service/data.service';
import { DomSanitizer } from '@angular/platform-browser';

import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-job-preview',
  templateUrl: './job-preview.component.html',
  styleUrls: ['./job-preview.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
	encapsulation: ViewEncapsulation.None
})
export class JobPreviewComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/	
	
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	certification = [ ];
	public educationItems = [
		{  text: 'High School' },
		{  text: 'Bachelors' },
		{  text: 'Diploma' },
		{  text: 'Masters' },
		{ text: 'Doctorate' }
	];
	@Input() toggleJobPreviewModal: boolean;
	@Input() isCopy: boolean = false;
	@Output() onEvent = new EventEmitter<boolean>();
	@Input() postJobForm: FormGroup;
	@Output() postJob: EventEmitter<any> = new EventEmitter();
	@Input('postedJobsDetails')
	set postedJobsDetails(inFo: JobPosting) {
		this.getPostedJobsDetails = inFo;
	}
	public mbRef: NgbModalRef;
	public jobPreviewModalRef: NgbModalRef;
	public criteriaModalRef: NgbModalRef;
	public checkModalRef: NgbModalRef;
	public isOpenCriteriaModal: boolean;
	public isCheckModel: boolean;
	public jdSub: Subscription;
	public childForm;
	public industries: any;
	public profileInfo: any;
	public isShow: boolean=false;
	public mustMacthArray: any[] = [];
	public getPostedJobsDetails: JobPosting;
	public industriesItems: any[] = [];
	public skillItems: any[] = [];
	public skillsItems: any[] = [];
	public languageSource: any[] = [];
	public nationality: any[] = [];
	public authorized_country: any[] = [];
	public commonSkills: any[] = [];
	@ViewChild("jobPreviewModal", { static: false }) jobPreviewModal: TemplateRef<any>;
	@ViewChild("criteriaModal", { static: false }) criteriaModal: TemplateRef<any>;
	@ViewChild("checkModal", { static: false }) checkModal: TemplateRef<any>;
	public mustMacthObj: any = {};
	public MacthObj: any = {};
	public jobId:string;
	public isShowOthers: any ='';
	public pageShow: boolean =false;
	public jobtype: boolean =false;
	public skills: boolean =false;
	public education: boolean =false;
	public clientfacing: boolean =false;
	public training: boolean =false;
	public certificationBoolean: boolean =false;
	public work_authorization: boolean =false;
	public programming_skills: boolean =false;
	public optinal_skill: boolean =false;
	public domain: boolean =false;
	public end_to_end_implementation: boolean =false;
	public ShowData: boolean =false;
	public programItems: any[] = [];
	programming_skillss = [ ];
	optinal_skills = [ ];

    @ViewChild('myselect') myselect;
    optionsSelect:Array<any>;
	
	constructor(private dataService: DataService,
		private modalService: NgbModal,
		private sanitizer: DomSanitizer,
		public router: Router,
		private parentF: FormGroupDirective,
		private formBuilder: FormBuilder,
		private employerService: EmployerService,
		public sharedService: SharedService,
		public route: ActivatedRoute,
		public utilsHelperService: UtilsHelperService
	) { 
	
	}	
	
	
	  
	/**
	**	To triggers when the page loads
	**/
	
	ngOnInit(): void {
		this.jobId = this.route.snapshot.queryParamMap.get('id');
		this.dataService.getLanguageDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
					this.languageSource = response;
				}
			}
		);
		this.dataService.getCountryDataSource().subscribe(
			response => {
			if (response && Array.isArray(response) && response.length) {
				this.nationality = response;
					this.authorized_country = response;
				}
			}
		);
		
		this.dataService.getProgramDataSource().subscribe(
		  response => {
			if (response && response.items) {
			 
			  this.programItems = [...response.items];
			}
		  },
		  error => {
			this.programItems = [];
		  }
		);
		
		this.onGetProfile();
		this.onGetIndustries();
		this.onGetSkill()
	}
	
	/**
	**	To open the job preview model in popup
	**/
	
	ngAfterViewInit(): void {
		if (this.toggleJobPreviewModal) {
			this.jobPreviewModalRef = this.modalService.open(this.jobPreviewModal, {
				windowClass: 'modal-holder',
				centered: true,
				size: 'xl',
				backdrop: 'static',
				keyboard: false
			});
			this.createForm();
		}
	}
	
	/**
	**	To check status of the optional data's
	**/
	
	checkValidator(){
		if(!this.postJobForm?.value?.requirement?.education || this.postJobForm?.value?.requirement?.education=='' ){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].updateValueAndValidity();
		}
		if(this.postJobForm?.value?.requirement?.work_authorization==null || this.postJobForm?.value?.requirement?.work_authorization==undefined  || ( this.postJobForm?.value?.requirement?.work_authorization=='' && this.postJobForm?.value?.requirement?.work_authorization !=0) ){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['work_authorization'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['work_authorization'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['work_authorization'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['work_authorization'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['work_authorization'].setValue('0');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['work_authorization'].updateValueAndValidity();
		}
		if(!this.postJobForm?.value?.jobInfo?.employer_role_type || this.postJobForm?.value?.jobInfo?.employer_role_type==''){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].updateValueAndValidity();
		}
		if(!this.postJobForm?.value?.otherPref?.certification || !this.postJobForm?.value?.otherPref?.certification.length ||  this.postJobForm?.value?.otherPref?.certification.length == 0){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].updateValueAndValidity();
		}
		if( !this.postJobForm.value.requirement.skills || !this.postJobForm.value.requirement.skills.length || this.utilsHelperService.differenceByPropValArray(this.postJobForm.value.requirement.skills, this.postJobForm.value.requirement.hands_on_experience, 'skill_id').length==0){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['skills'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['skills'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['skills'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['skills'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['skills'].updateValueAndValidity();
		}
		if( !this.postJobForm.value.requirement.programming_skills || !this.postJobForm.value.requirement.programming_skills.length || this.postJobForm.value.requirement.programming_skills.length ==0){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['programming_skills'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['programming_skills'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['programming_skills'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['programming_skills'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['programming_skills'].updateValueAndValidity();
		}
		if( !this.postJobForm.value.requirement.optinal_skills || !this.postJobForm.value.requirement.optinal_skills.length || this.postJobForm.value.requirement.optinal_skills.length ==0){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['optinal_skills'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['optinal_skills'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['optinal_skills'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['optinal_skills'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['optinal_skills'].updateValueAndValidity();
		}
		if( !this.postJobForm.value.requirement.domain || !this.postJobForm.value.requirement.domain.length || this.postJobForm.value.requirement.domain.length ==0){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['domain'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['domain'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['domain'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['domain'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['domain'].updateValueAndValidity();
		}
	}
	
	
	/**
	**	To triggers when changes ocures in the popup view
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
		setTimeout( async () => {
			
			/* if(this.childForm.value.otherPref.extra_criteria){
				var extra = this.childForm.value.otherPref.extra_criteria.filter(function(a,b){ return a.title!=null&&a.title!=''&&a.value!=null&&a.value!=''});
				for(let i=0;i<extra.length;i++){
						var tempTitle = extra[i]['title'];
					if(this.postJobForm.controls.jobPrev['value']['match_select'][tempTitle] ==undefined || this.postJobForm.controls.jobPrev['value']['match_select'][tempTitle] ==null || this.postJobForm.controls.jobPrev['value']['match_select'][tempTitle] =="" ){
						this.postJobForm.controls.jobPrev['controls']['match_select']['addControl'](extra[i]['title'],new FormControl(""));
					}
				}
				this.isShow =true;
				if(extra.length==0){
					this.isShow =false;
				}
		
			} */
			
			if(this.childForm.value.otherPref.others){
				var extra = this.childForm.value.otherPref.others.filter(function(a,b){ return a.value==true&&a.title!=null&&a.title!=''&&a.id!=null&&a.id!=''});
				for(let i=0;i<extra.length;i++){
					var tempTitle = extra[i]['id'];
					if(i==0){
						this.isShowOthers = tempTitle;
					}
						
					if(this.postJobForm.controls.jobPrev['value']['match_select'][tempTitle] ==undefined || this.postJobForm.controls.jobPrev['value']['match_select'][tempTitle] ==null || this.postJobForm.controls.jobPrev['value']['match_select'][tempTitle] =="" ){
						this.postJobForm.controls.jobPrev['controls']['match_select']['addControl'](extra[i]['id'],new FormControl(""));
					}
				}		
			}
			this.pageShow = true;
			if(this.childForm && this.getPostedJobsDetails) {
				this.childForm.patchValue({
					jobPrev : {
						...this.getPostedJobsDetails
					}
				});	
			}
			this.checkValidator();
			if(this.postJobForm.value.requirement.work_authorization ==''){
				this.ShowData = true;
			}else{
				this.ShowData = false;
			}
		});
	}

	/**
	**	To triggers when popup close
	**/
	
	ngOnDestroy(): void {
		this.onClickCloseBtn(false);
		this.jdSub && this.jdSub.unsubscribe();
	}

	/**
	**	To close the popup job-preview
	**/
	
	onClickCloseBtn(status) {
		this.childForm.get('jobPrev.number_of_positions').setValidators(null);
		this.childForm.get('jobPrev.number_of_positions').updateValueAndValidity();
		if (status == false) {
			this.modalService.dismissAll()
		}
		this.onEvent.emit(status);
	}

	/**
	**	To get the errors in the form data's
	**/
	
	getErrors = (formGroup: FormGroup, errors: any = {}) => {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				errors[field] = control.errors;
			} else if (control instanceof FormGroup) {
				errors[field] = this.getErrors(control);
			}
		});
		return errors;
	}

	/**
	**	To redirect the path status
	**/
	
	onRedirectDashboard(status) {
		this.postJob.next();
	}

	/**
	**	To find the country value by id 
	**/
	
	findCountry(value){
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

	/**
	**	To build a form
	**/
	
	createForm() {
		this.childForm = this.parentF.form;
		this.mustMacthObj = {
		  experience: true,
		  sap_experience: true,
		  domain: true,
		  hands_on_experience: true,
		  skills: true,
		  programming_skills: true,
		  optinal_skills: true,
		  certification: true,
		  end_to_end_implementation: true,
		  type: true,
		  remote: true,
		  availability: true,
		  travel_opportunity: true,
		  work_authorization: true,
		  visa_sponsorship: true
		}
		this.MacthObj = {
		  experience: new FormControl('0', Validators.required),
		  sap_experience: new FormControl('0', Validators.required),
		  domain: new FormControl(''),
		  hands_on_experience: new FormControl('0', Validators.required),
		  skills: new FormControl(''),
		  programming_skills: new FormControl(''),
		  optinal_skills: new FormControl(''),
		  certification: new FormControl(''),
		  type: new FormControl('0', Validators.required),
		  employer_role_type: new FormControl(''),
		  availability: new FormControl('0', Validators.required),
		  work_authorization: new FormControl(''),
		  //facing_role: new FormControl(''),
		  //training_experience: new FormControl(''),
		  end_to_end_implementation: new FormControl(''),
		  education: new FormControl(''),
		  travel_opportunity: new FormControl(''),
		  need_reference: new FormControl(''),
		  //remote: new FormControl(''),
		 // willing_to_relocate: new FormControl(''),
		  language: new FormControl(''),
		}

		this.childForm.addControl('jobPrev', new FormGroup({
			number_of_positions: new FormControl(null, Validators.required),
			must_match: new FormControl(this.mustMacthObj),
			match_select: new FormGroup(this.MacthObj),
		}));
		this.checkValidator();
	}
	
	/**
	**	To assign the jobPrev controls to f
	**/
	
	get f() {
		return this.childForm.controls.jobPrev.controls;
	}

	/**
	**	To add the mustMacthObj
	**/
	
	onAddOrRemoveMustMatch = (checked, fieldName) => {
		this.mustMacthObj = { ...this.mustMacthObj, [fieldName]: checked };
		if(this.allMustMatchValue(this.mustMacthObj)) {
		
		}
		this.childForm.patchValue({
			jobPrev: {
				must_match: this.mustMacthObj,
			}
		});
	}

	/**
	**	To Check the must match 
	**/
	
	allMustMatchValue = (obj) => {
		for(var o in obj)
		if(obj[o]) return false;
		return true;
	}

	/**
	**	To split the object to data
	**/
	
	read_prop(obj, prop) {
		return obj[prop];
	}

	/**
	**	To get the employer profile details
	**/
	
	onGetProfile() {
		this.employerService.profile().subscribe(
			response => {
				this.profileInfo = response;
			}, error => {
			}
		)
	}

	/**
	**	To convert array to string
	**/
	
	onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?:string) => {
		if (!Array.isArray(value)) return "--";
		return value.map(s => {
			if(field && field2) {
				return s[field][field2] + ' (' + s.experience + ' ' + s.experience_type + ')'
			}
			if(field && !field2) {
				return s[field] + ' (' + s.experience + ' ' + s.experience_type + ')'
			}
		}).toString();
	}

	/**
	**	To convert array to string
	**/
	
	onConvertArrayToString = (value: any[]) => {
		if (!Array.isArray(value)) return "--";
		return value.join(", ");
	}

	/**
	**	To convert arrayObject to string
	**/
	
	onConvertArrayObjToString = (value: any[], field: string = 'name') => {
		if (!Array.isArray(value)) return "--";
		return value.map(s => s[field]).join(', ');
	}

	/**
	**	To get the boolean to string
	**/
	
	onGetYesOrNoValue = (value: boolean) => {
		if (value == true) {
			return "Yes";
		} else {
			return "No"
		}
	}

	/**
	**	To split with the new line
	**/
	
	onSplitValueWithNewLine = (value: string) => {
		if (value == "" || value == "-") return "-";
		if (value) {
			let splitValue: any = value.split(",");
			splitValue = splitValue.join(", \n");
			return splitValue;
		}
	};

	/**
	**	To find the skills from the id
	**/
	
	onFindSkillsFromID = (arrayValues: Array<any>, returnVal: string = 'string') => {
		if(this.skillItems && this.skillItems && Array.isArray(this.skillItems) && Array.isArray(arrayValues) && arrayValues.length > 0) {
			const temp = this.skillItems.filter(r=> {
				return arrayValues.includes(r.id)
			});
			if(returnVal == 'obj') {
				return temp;
			}
			return this.onConvertArrayObjToString(temp, 'tag');
		}
		if(returnVal == 'obj') {
			return [];
		}
		return '--';
	}

	/**
	**	To find the domain details from the id
	**/
	
	onFindDomainFromID = (arrayValues: Array<any>, returnVal: string = 'string') => {
		if(this.industriesItems && Array.isArray(this.industriesItems) && Array.isArray(arrayValues) && arrayValues.length > 0) {
			const temp = this.industriesItems.filter(r=> {
				return arrayValues.includes(r.id)
			});
			if(returnVal == 'obj') {
				return temp;
			}
			return this.onConvertArrayObjToString(temp, 'name');
		}
		return '--';
	}

	/**
	**	To find skills array to string
	**/
	
	onFindSkillsFromSingleID = (value: any) => {
		if(value && this.skillItems && this.skillItems && Array.isArray(this.skillItems)) {
			const temp = this.skillItems.find(r=> {
				return value == r.id
		});
		return temp;
		}
		return '--';
	}

	/**
	**	To get the industries details
	**/
	
	onGetIndustries(searchString: string = '') {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		this.employerService.getIndustries(requestParams).subscribe(
		response => {
			if(response && response.items) {
				this.industriesItems = [...response.items];
			}
		}, error => {
		}
		)
	}

	/**
	**	To get the skills details
	**/
	
	onGetSkill(searchString: string = "") {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		this.employerService.getSkill(requestParams).subscribe(
			response => {
				if(response && response.items) {
					this.skillItems = [...response.items];
					for(let i=0;i<response.items.length;i++){
					  response['items'][i]['tags'] =response['items'][i]['tag']+' -- '+response['items'][i]['long_tag'];
					} 
					this.skillsItems = [...response.items];
					this.commonSkills = [...response.items];
				}
			}, error => {
			}
		)
	}
  
	/**
	**	To handle match select
	**/
	
	handleChange(event){
		if(event.target.name){
			if(this.childForm.value.jobPrev.match_select[event.target.name] == event.target.value){
				var name = event.target.name;
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls'][name].setValue('');
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls'][name].updateValueAndValidity();
			}
		}
	}
	
	/**
	**	To handle match select
	**/
	
	handleChanges(event){
		if(event.target.id){
			var name = event.target.id.substring(0, event.target.id.length - 1);
			if(this.childForm.value.jobPrev.match_select[name] == event.target.value){
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls'][name].setValue('');
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls'][name].updateValueAndValidity();
			}
		}
	}
	
	/**
	**	To find the language array to string
	**/
	
	findLanguageArray(value){
		if(value){
			value = value.map(function(a,b){
				return a 
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
	**	To add the chip inputs
	**/
		
	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		if (value) {
			const index = this.certification.indexOf(value);
			if (index >= 0) {
			}else{
			this.certification.push(value);
			this.postJobForm.patchValue({
			  otherPref: {
				['certification']: this.certification,
			  }
			});}
		}
		// Clear the input value
		event.chipInput!.clear();
	}

	/**
	**	To remove the certification details
	**/
	
	remove(visa): void {
		const index = this.certification.indexOf(visa);
		if (index >= 0) {
			this.certification.splice(index, 1);
			this.postJobForm.patchValue({
			  otherPref: {
				['certification']: this.certification,
			  }
			});
		}
	}

	/**
	**	To add the chip inputs
	**/

	adds(event: MatChipInputEvent): void {
		//if (!this.matAutocomplete.isOpen) {
			const value = (event.value || '').trim();

			if (value) {
				const index = this.programming_skillss.indexOf(value);
				if (index >= 0) {
					
				}else{
				this.programming_skillss.push(value);
				this.postJobForm.patchValue({
				  requirement: {
					['programming_skills']: this.programming_skillss,
				  }
				});}
				
			}

			// Clear the input value
			event.chipInput!.clear();
		//}
	}
	
	/**
	**	To remove the programming_skills details
	**/
	
	removes(data): void {
		
		const index = this.programming_skillss.indexOf(data);

		if (index >= 0) {
			this.programming_skillss.splice(index, 1);
			this.postJobForm.patchValue({
			  requirement: {
				['programming_skills']: this.programming_skillss,
			  }
			});
		}
	}
	
	/**
	**	To check the chip event
	**/

	addOptional(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.optinal_skills.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.optinal_skills.push(value);
			this.postJobForm.patchValue({
			  requirement: {
				['optinal_skills']: this.optinal_skills,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the optional skills
	**/
	
	removeOptional(employer): void {
		
		const index = this.optinal_skills.indexOf(employer);

		if (index >= 0) {
			this.optinal_skills.splice(index, 1);
			this.postJobForm.patchValue({
			  requirement: {
				['optinal_skills']: this.optinal_skills,
			  }
			});
		}
	}
	
	
	/**
	**	To close after the add popup close
	**/
	
	closeAdd(){
		this.criteriaModalRef.close();
		if(this.jobtype==true){
			this.postJobForm.patchValue({
			  jobInfo : {
				employer_role_type:''
			  }
			});
		}else if(this.education==true){
			this.postJobForm.patchValue({
			  requirement : {
				education:''
			  }
			});
		}else if(this.clientfacing==true){
			this.postJobForm.patchValue({
			  otherPref : {
				facing_role:''
			  }
			});
		}else if(this.training==true){
			this.postJobForm.patchValue({
			  otherPref : {
				training_experience:''
			  }
			});
		}else if(this.certificationBoolean==true){
			this.postJobForm.patchValue({
			  otherPref : {
				certification:''
			  }
			});
			this.certification=[];
		}else if(this.work_authorization==true){
			this.postJobForm.patchValue({
			  requirement : {
				work_authorization:null
			  }
			});
		}else if(this.skills==true){
			var temp = this.postJobForm.value.requirement.hands_on_experience.map(function(a,b){ return a.skill_id});
			this.postJobForm.patchValue({
			  requirement : {
				skills:temp
			  }
			});
		}else if(this.programming_skills==true){
			var temp = null;
			this.postJobForm.patchValue({
			  requirement : {
				programming_skills:[]
			  }
			});
			this.programming_skillss = [];
		}else if(this.optinal_skill==true){
			var temp = null;
			this.postJobForm.patchValue({
			  requirement : {
				optinal_skills:[]
			  }
			});
			this.optinal_skills = [];
		}else if(this.domain==true){
			var temp = null;
			this.postJobForm.patchValue({
			  requirement : {
				domain:[]
			  }
			});
		}else if(this.end_to_end_implementation==true){
			var temp = null;
			this.postJobForm.patchValue({
			  requirement : {
				end_to_end_implementation:null
			  }
			});
		}
		this.jobtype=false;
		this.certificationBoolean=false;
		this.training=false;
		this.clientfacing=false;
		this.education=false;
		this.work_authorization=false;
		this.skills=false;
		this.programming_skills=false;
		this.optinal_skill=false;
		this.domain=false;
		this.end_to_end_implementation=false;
	}
	
	/**
	**	To close after the save popup
	**/
	
	closeSave(){
		this.checkValidator();
		this.criteriaModalRef.close();
		if(this.jobtype==true){
			
			this.jobtype=false;
		}else if(this.education==true){
			
			this.education=false;
		}else if(this.clientfacing==true){
			
			this.clientfacing=false;
		}else if(this.training==true){
			
			this.training=false;
		}else if(this.certificationBoolean==true){
			
			this.certificationBoolean=false;
		}else if(this.work_authorization==true){
			
			this.work_authorization=false;
		}else if(this.skills==true){
			
			this.skills=false;
		}else if(this.programming_skills==true){
			
			this.programming_skills=false;
		}else if(this.optinal_skill==true){
			
			this.optinal_skill=false;
		}else if(this.domain==true){
			
			this.domain=false;
		}else if(this.end_to_end_implementation==true){
			
			this.end_to_end_implementation=false;
		}
	}
	
	/**
	**	To open model for adding new details in jobs
	**/
	
	onOpenCriteriaModal = (value) => {
		if(value == 'jobtype'){
			this.jobtype=true;
		}else if(value == 'education'){
			this.education=true;
		}else if(value == 'clientfacing'){
			this.clientfacing=true;
		}else if(value == 'training'){
			this.training=true;
		}else if(value == 'certification'){
			this.certificationBoolean=true;
		}else if(value == 'work_authorization'){
			this.work_authorization=true;
		}else if(value == 'skills'){
			this.skills=true;
		}else if(value == 'programming_skills'){
			this.programming_skills=true;
		}else if(value == 'optinal_skill'){
			this.optinal_skill=true;
		}else if(value == 'domain'){
			this.domain=true;
		}else if(value == 'end_to_end_implementation'){
			this.end_to_end_implementation=true;
		}
		this.isOpenCriteriaModal = true;
		if (this.isOpenCriteriaModal && this.work_authorization == true) {
			setTimeout(() => {
			this.criteriaModalRef = this.modalService.open(this.criteriaModal, {
				windowClass: 'modal-holder',
				size: 'lg',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
			}, 10);
		}else if (this.isOpenCriteriaModal) {
			setTimeout(() => {
				this.criteriaModalRef = this.modalService.open(this.criteriaModal, {
					windowClass: 'modal-holder',
					centered: true,
					backdrop: 'static',
					keyboard: false
				});
			}, 10);
		}
	}
  
	/**
	**	To Open the popup details for the add section
	**/
	
  openCheckPopup(){
		this.isCheckModel = true;
		if(this.jobtype==true){
			if(this.postJobForm.value.jobInfo.employer_role_type=='' || this.postJobForm.value.jobInfo.employer_role_type==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.education==true){
			if(this.postJobForm.value.requirement.education=='' || this.postJobForm.value.requirement.education==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.clientfacing==true){
			
			if(this.postJobForm.value.otherPref.facing_role=='' || this.postJobForm.value.otherPref.facing_role==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.training==true){
			
			if(this.postJobForm.value.otherPref.training_experience=='' || this.postJobForm.value.otherPref.training_experience==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.certificationBoolean==true){
			if(this.certification.length==0){
				this.closeAdd();
				this.isCheckModel = false;
			}
		}else if(this.work_authorization==true){
			if(this.postJobForm.value.requirement.work_authorization=='' || this.postJobForm.value.requirement.work_authorization==null){
				this.closeAdd();
				this.isCheckModel = false;
			}
			 
		}else if(this.skills==true){
			if( !this.postJobForm.value.requirement.skills || !this.postJobForm.value.requirement.skills.length || this.utilsHelperService.differenceByPropValArray(this.postJobForm.value.requirement.skills, this.postJobForm.value.requirement.hands_on_experience, 'skill_id').length==0){
				this.closeAdd();
				this.isCheckModel = false;
			}
			 
		}else if(this.programming_skills==true){
			if( !this.postJobForm.value.requirement.programming_skills || !this.postJobForm.value.requirement.programming_skills.length || this.postJobForm.value.requirement.programming_skills.length ==0){
				this.closeAdd();
				this.isCheckModel = false;
			}
			 
		}else if(this.optinal_skill==true){
			if( !this.postJobForm.value.requirement.optinal_skills || !this.postJobForm.value.requirement.optinal_skills.length || this.postJobForm.value.requirement.optinal_skills.length ==0){
				this.closeAdd();
				this.isCheckModel = false;
			}
			 
		}else if(this.domain==true){
			if( !this.postJobForm.value.requirement.domain || !this.postJobForm.value.requirement.domain.length || this.postJobForm.value.requirement.domain.length ==0){
				this.closeAdd();
				this.isCheckModel = false;
			}
			 
		}else if(this.end_to_end_implementation==true){
			if( !this.postJobForm.value.requirement.end_to_end_implementation || !this.postJobForm.value.requirement.end_to_end_implementation.length || this.postJobForm.value.requirement.end_to_end_implementation.length ==0){
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
	**	To cancel the check buton event
	**/
	
	cancelCheck(){
		this.checkModalRef.close();
		//this.closeAdd(); 
	}
  
	closeSaveCheck(){
		this.checkModalRef.close();
		this.closeSave();
	}
  
	/**
	**	To change the fields type value
	**/
	
	onChangeFieldValue = (fieldName, value) => {
		
		this.postJobForm.patchValue({
			requirement: {
				fieldName: value,
			}
		});
	}
	
	/**
	**	To set the work authorization details
	**/
	
	onChangeFieldValuesAuth(event,value){
		if(this.postJobForm.value.requirement.work_authorization == value){
			this.postJobForm.controls.requirement['controls']['work_authorization'].setValue(null);
			this.postJobForm.controls.requirement['controls']['work_authorization'].updateValueAndValidity();
		}else{
			this.postJobForm.patchValue({
				requirement: {
					'work_authorization': value,
				}
			});
		}
	}	
	
	/**
	**	To remove the skills details
	**/
	
	onRemoveSkillEvent = async (skillId) => {
		if(skillId) {
			var temp = this.commonSkills.filter(function(a,b){ return a.id == skillId });
			//this.skillItems.push(temp[0]);
		}
	}
	
	/**
	**	To select the skill event 
	**/
	
	onSelectSkillsEvent = async (skillId) => {
		if(skillId) {
			//this.skillItems = this.skillItems.filter(function(a,b){ return a.id != skillId });
		}
	}
	
	/*
	**	Check the if the object have true value
	**/
	
	allTrue(obj){
		for(var o in obj)
          if(obj[o]) return true;
        
      return false;
    }
  
}
