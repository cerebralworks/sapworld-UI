import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component,ViewEncapsulation,OnChanges, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tabInfo } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-other-preference',
  templateUrl: './other-preference.component.html',
  styleUrls: ['./other-preference.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class OtherPreferenceComponent implements OnInit, OnChanges {

	/**
	**	Variable Declaration
	**/
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	certification = [ ];
	public mbRef: NgbModalRef;
	public criteriaModalRef: NgbModalRef;
	public isOpenCriteriaModal: boolean;
	@Input() currentTabInfo: tabInfo;
	@Input('postedJobsDetails')
	set postedJobsDetails(inFo: JobPosting) {
		this.getPostedJobsDetails = inFo;
	}
	public getPostedJobsDetails: JobPosting;
	public childForm;
	public isLoading: boolean;
	public jobId: string;
	public languageSource: any=[];
	@ViewChild(NgSelectComponent)
    ngSelect: NgSelectComponent;
    @ViewChild('myselect') myselect;
    optionsSelect:Array<any>;

	constructor(
		private parentF: FormGroupDirective,
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private employerService: EmployerService,
		private route: ActivatedRoute,
		private sharedService: SharedService,
		private dataService: DataService,
		public utilsHelperService: UtilsHelperService
	) { }
	
	add(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.certification.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.certification.push(value);
			this.childForm.patchValue({
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
			this.childForm.patchValue({
			  otherPref: {
				['certification']: this.certification,
			  }
			});
		}
	}
	/**
	**	When the intial component calls
	** 	Create form
	**/
	
	ngOnInit(): void {
		
		this.jobId = this.route.snapshot.queryParamMap.get('id');
		this.dataService.getLanguageDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
				this.languageSource = response;
			}
		});
		this.createForm();
	}
	
	/**
	**	Assign the values for the otherPreference Form
	** 	
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
		setTimeout( async () => {
			 if(this.childForm && this.getPostedJobsDetails) {
				if (this.getPostedJobsDetails.certification != null) {
					this.certification = this.childForm.value.otherPref.certification;
				}
			 }else{
				 if (this.childForm.value.otherPref.certification != null) {
					this.certification = this.childForm.value.otherPref.certification;
				}
			 }
		});
	}

	/**
	**	Create a new form arrtibutes
	**/
	
	createForm() {
		this.childForm = this.parentF.form;
		this.childForm.addControl('otherPref', new FormGroup({
			facing_role: new FormControl(null),
			training_experience: new FormControl(null),
			certification: new FormControl(null),
			others_data: new FormControl(null),
			language: new FormControl(null, Validators.required),
			extra_criteria: new FormArray([this.formBuilder.group({
				title: [null],
				value: [null]
			})]),
			others: new FormArray([]),
			temp_extra_criteria: new FormArray([])
		}));
		if(!this.route.snapshot.queryParamMap.get('id')){
			if(this.childForm.value.otherPref.others.length == 0){
				this.resetForm();				
			}
		}
		
	}
	
	resetForm(){
		 for(let i=0;i<=this.childForm.controls.otherPref['controls']['others'].value.length;i++){
			this.childForm.controls.otherPref['controls']['others'].removeAt(0);
			i=0;
		}
		this.childForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
			id: [1],
			title: ['Should have done client facing role'],
			value: [null]
		}));
		this.childForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
			id: [2],
			title: ['Should have experience in training'],
			value: [null]
		}));
		this.childForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
			id: [3],
			title: ['Should have experience in design, build & configure applications'],
			value: [null]
		}));
		this.childForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
			id: [4],
			title: ['Should have experience in data intergation'],
			value: [null]
		}));
		this.childForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
			id: [5],
			title: ['Should have experience in data migration'],
			value: [null]
		}));
	}
	get f() {
		return this.childForm.controls.otherPref.controls;
	}
	
	  get t() {
		return this.f.extra_criteria as FormArray;
	  }
	  
	  get others() {
		return this.f.others as FormArray;
	  }
	  
	get tEX() {
		return this.f.temp_extra_criteria as FormArray;
	}

	/**
	**	create a new hands_on_experience
	**/
	
	onDuplicate = (index) => {
		if(this.t.value[index]['title']== null ||this.t.value[index]['title']== '' || this.t.value[index]['value']== null ||this.t.value[index]['value']== '' ){
		  
	  }else{
		this.t.push(this.formBuilder.group({
			title: [null, Validators.required],
			value: [null, Validators.required]
		}));
	  }
	}
	
	/**
	**	Remove the hands_on_experience
	**/
	
	onRemove = (index) => {
		if(index == 0 &&this.t.value.length==1) {
			this.t.reset();
			this.t.controls[index]['controls']['title'].setValidators(null);
			this.t.controls[index]['controls']['value'].updateValueAndValidity();
		}else {
			this.t.removeAt(index);
		}
	}
	
	
	/**
	**	create a new hands_on_experience
	**/
	
	onDuplicateOthers = () => {
		var value = this.childForm.value.otherPref.others_data;
		
		if(value !=null && value !=undefined && value !=''){
			var len =this.others.value.length+1;
			this.others.push(this.formBuilder.group({
				id: [len, Validators.required],
				title: [value, Validators.required],
				value: [true, Validators.required]
			}));
			this.childForm.patchValue({
				otherPref : {
					others_data :null
				}
			});
		}
		
	}
	
	/**
	**	Remove the hands_on_experience
	**/
	
	onRemoveOthers = (index) => {
		if(index == 0 &&this.others.value.length==1) {
			this.others.removeAt(index);
		}else {
			this.others.removeAt(index);
		}
	}


	/**
	**	To handle match select
	**/
	
	changeStatus(id,event){
		if(event.target.checked == true){
			id = id-1;
			this.others['controls'][id]['controls']['value'].setValue(true);
			this.others['controls'][id]['controls']['value'].updateValueAndValidity();
			
		}else{
			id = id-1;
			this.others['controls'][id]['controls']['value'].setValue(null);
			this.others['controls'][id]['controls']['value'].updateValueAndValidity();
		}
	}
	
}
