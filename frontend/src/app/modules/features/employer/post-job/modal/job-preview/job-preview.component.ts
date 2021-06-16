import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component,ViewEncapsulation, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
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
	
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	certification = [ ];
	public educationItems = [
			{  text: 'Bachelors' },
			{  text: 'Diploma' },
			{  text: 'Masters' },
			{ text: 'Doctorate' }
		];
  @Input() toggleJobPreviewModal: boolean;
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
  public isOpenCriteriaModal: boolean;
  public jdSub: Subscription;
  public childForm;
  public industries: any;
  public profileInfo: any;
  public isShow: boolean=false;
  public mustMacthArray: any[] = [];
  public getPostedJobsDetails: JobPosting;
  public industriesItems: any[] = [];
  public skillItems: any[] = [];
  public languageSource: any[] = [];
  public nationality: any[] = [];
  public authorized_country: any[] = [];

  @ViewChild("jobPreviewModal", { static: false }) jobPreviewModal: TemplateRef<any>;
  @ViewChild("criteriaModal", { static: false }) criteriaModal: TemplateRef<any>;
  public mustMacthObj: any = {};
  public MacthObj: any = {};
  public jobId:string;
  
  public jobtype: boolean =false;
  public education: boolean =false;
  public clientfacing: boolean =false;
  public training: boolean =false;
  public certificationBoolean: boolean =false;
  public authorized_to_work: boolean =false;

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
  ) { }

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
    this.onGetProfile();
    this.onGetIndustries();
    this.onGetSkill()
  }

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
	
	checkValidator(){
		if(!this.postJobForm?.value?.otherPref?.training_experience || this.postJobForm?.value?.otherPref?.training_experience==''){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['training_experience'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['training_experience'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['training_experience'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['training_experience'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['training_experience'].updateValueAndValidity();
		
		}
		if(!this.postJobForm?.value?.requirement?.education || this.postJobForm?.value?.requirement?.education=='' ){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].updateValueAndValidity();
		
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].updateValueAndValidity();
		
		
		}
		if(!this.postJobForm?.value?.requirement?.authorized_to_work || this.postJobForm?.value?.requirement?.authorized_to_work=='' ){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['authorized_to_work'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['authorized_to_work'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['authorized_to_work'].updateValueAndValidity();
		
		}else{
			if(this.postJobForm?.value?.requirement?.authorized_to_work.length==0){
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['authorized_to_work'].setValidators(null);
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['authorized_to_work'].setValue('');
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['authorized_to_work'].updateValueAndValidity();
			
			}else{
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['education'].setValidators(null);
				this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['authorized_to_work'].updateValueAndValidity();
			
			}
		}
		if(!this.postJobForm?.value?.otherPref?.facing_role || this.postJobForm?.value?.otherPref?.facing_role=='' ){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['facing_role'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['facing_role'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['facing_role'].updateValueAndValidity();
		
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['facing_role'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['facing_role'].updateValueAndValidity();
		}
		if(!this.postJobForm?.value?.jobInfo?.employer_role_type || this.postJobForm?.value?.jobInfo?.employer_role_type==''){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].updateValueAndValidity();
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['employer_role_type'].updateValueAndValidity();
		}
		if(!this.postJobForm?.value?.otherPref?.employer_role_type || this.postJobForm?.value?.otherPref?.employer_role_type==''){
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].setValue('');
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].updateValueAndValidity();
		
		}else{
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].setValidators(null);
			this.postJobForm.controls.jobPrev['controls']['match_select']['controls']['certification'].updateValueAndValidity();
		
		
		}
	}
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout( async () => {
      if(this.childForm && this.getPostedJobsDetails) {
        this.childForm.patchValue({
          jobPrev : {
            ...this.getPostedJobsDetails
          }
        });
		
		if(this.postJobForm.value.otherPref.extra_criteria){
			var extra = this.postJobForm.value.otherPref.extra_criteria.filter(function(a,b){ return a.title!=null&&a.title!=''&&a.value!=null&&a.value!=''});
			for(let i=0;i<extra.length;i++){
				this.postJobForm.controls.jobPrev['controls']['match_select']['addControl'](extra[i]['title'],new FormControl('0', Validators.required));
			}
			this.isShow =true;
			if(extra.length==0){
				this.isShow =false;
			}
			
		}
	  this.checkValidator();
		
      }
    });
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.jdSub && this.jdSub.unsubscribe();
  }

  onClickCloseBtn(status) {
    this.childForm.get('jobPrev.number_of_positions').setValidators(null);
    this.childForm.get('jobPrev.number_of_positions').updateValueAndValidity();
    if (status == false) {
      this.modalService.dismissAll()
    }
    this.onEvent.emit(status);
  }

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

  onRedirectDashboard(status) {
    this.postJob.next();
  }

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
      authorized_to_work: new FormControl(''),
      optinal_skills: new FormControl(''),
      certification: new FormControl(''),
      type: new FormControl('0', Validators.required),
      employer_role_type: new FormControl(''),
      availability: new FormControl('0', Validators.required),
      work_authorization: new FormControl('0', Validators.required),
      facing_role: new FormControl(''),
      training_experience: new FormControl(''),
      end_to_end_implementation: new FormControl(''),
      education: new FormControl(''),
      travel_opportunity: new FormControl(''),
      remote: new FormControl(''),
      willing_to_relocate: new FormControl(''),
      language: new FormControl(''),
    }

    this.childForm.addControl('jobPrev', new FormGroup({
      number_of_positions: new FormControl(null, Validators.required),
      must_match: new FormControl(this.mustMacthObj),
	  match_select: new FormGroup(this.MacthObj),
    }));
	this.checkValidator();

  }

  get f() {
    return this.childForm.controls.jobPrev.controls;
  }


  onAddOrRemoveMustMatch = (checked, fieldName) => {
    this.mustMacthObj = { ...this.mustMacthObj, [fieldName]: checked };

    // if (this.mustMacthArray.length == 0) {
    //   this.mustMacthArray.push({ [fieldName]: event.target.checked })
    // } else {
    //   let index = this.mustMacthArray.findIndex((x, i) => {
    //     return x[fieldName] === true
    //   });

    //   if (index == -1) {
    //     this.mustMacthArray.push({ [fieldName]: event.target.checked });
    //   }
    //   else {
    //     this.mustMacthArray.splice(index, 1);
    //   }
    // }

    if(this.allMustMatchValue(this.mustMacthObj)) {

    }


    this.childForm.patchValue({
      jobPrev: {
        must_match: this.mustMacthObj,
      }
    });

  }

  allMustMatchValue = (obj) => {
    for(var o in obj)
        if(obj[o]) return false;

    return true;
  }

  read_prop(obj, prop) {
    return obj[prop];
  }


  onGetProfile() {
    this.employerService.profile().subscribe(
      response => {
        this.profileInfo = response;
      }, error => {
      }
    )
  }

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

  onConvertArrayToString = (value: any[]) => {
    if (!Array.isArray(value)) return "--";
    return value.join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if (!Array.isArray(value)) return "--";
    return value.map(s => s[field]).join(', ');
  }

  onGetYesOrNoValue = (value: boolean) => {
    if (value == true) {
      return "Yes";
    } else {
      return "No"
    }
  }

  onSplitValueWithNewLine = (value: string) => {
    if (value == "" || value == "-") return "-";
    if (value) {
      let splitValue: any = value.split(",");
      splitValue = splitValue.join(", \n");
      return splitValue;
    }
  };

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

  onFindSkillsFromSingleID = (value: any) => {
    if(value && this.skillItems && this.skillItems && Array.isArray(this.skillItems)) {
      const temp = this.skillItems.find(r=> {
        return value == r.id
      });
      return temp;
    }
    return '--';
  }


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

  onGetSkill(searchString: string = "") {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getSkill(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.skillItems = [...response.items];
        }
      }, error => {
      }
    )
  }
  
  handleChange(event){
	  if(event.target.value=='0'){
		  
	  }else if(event.target.value=='1'){
		  
	  }else if(event.target.value=='2'){
		  
	  }
  }
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
		}else if(this.authorized_to_work==true){
			this.postJobForm.patchValue({
			  requirement : {
				authorized_to_work:''
			  }
			});
		}
		this.jobtype==false;
		this.certificationBoolean==false;
		this.training==false;
		this.clientfacing==false;
		this.education==false;
		this.authorized_to_work==false;
	}
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
		}else if(this.authorized_to_work==true){
			
			this.authorized_to_work=false;
		}
	}
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
		}else if(value == 'authorized_to_work'){
			this.authorized_to_work=true;
		}
    this.isOpenCriteriaModal = true;
    if (this.isOpenCriteriaModal) {
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
}
