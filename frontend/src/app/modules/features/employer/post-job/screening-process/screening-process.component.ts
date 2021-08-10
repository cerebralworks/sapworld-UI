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
  selector: 'app-screening-process',
  templateUrl: './screening-process.component.html',
  styleUrls: ['./screening-process.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class ScreeningProcessComponent implements OnInit, OnChanges {

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
	@Input() screeningProcess :any;
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
				if (this.getPostedJobsDetails.screening_process != null) {
					for(let i=0;i<=this.t.value.length;i++){
						this.t.removeAt(0);
						i=0;
					}
					if(this.getPostedJobsDetails.screening_process.length==0){
						this.t.push(this.formBuilder.group({
							title: [null]
						}));
					}else{
					this.getPostedJobsDetails.screening_process.map((value, index) => {
						this.t.push(this.formBuilder.group({
							title: [null]
						}));
					});
					}
				}
				this.childForm.patchValue({
					screeningProcess : {
						...this.getPostedJobsDetails
					}
				});
			}
		});
	}

	/**
	**	Create a new form arrtibutes
	**/
	
	createForm() {
		this.childForm = this.parentF.form;
		this.childForm.addControl('screeningProcess', new FormGroup({
			screening_process: new FormArray([]),
			temp_screening_process: new FormControl(null),
		}));

	}

	get f() {
		return this.childForm.controls.screeningProcess.controls;
	}
	
	  get t() {
		return this.f.screening_process as FormArray;
	  }
	  
	

	/**
	**	create a new hands_on_experience
	**/
	
	onDuplicate = () => {
		var value = this.childForm.value.screeningProcess.temp_screening_process;
		
		if(value !=null && value !=undefined && value !=''){
			this.t.push(this.formBuilder.group({
				title: [value, Validators.required]
			}));
			this.childForm.patchValue({
				screeningProcess : {
					temp_screening_process :null
				}
			});
		}
		
	}
	
	/**
	**	Remove the hands_on_experience
	**/
	
	onRemove = (index) => {
		if(index == 0 &&this.t.value.length==1) {
			this.t.removeAt(index);
		}else {
			this.t.removeAt(index);
		}
	}
	
	/**	
	**		To handle the selected screening process
	**/
	
	handleChange(event,index){
		if(index !=null && index !=undefined ){
			if(this.screeningProcess[index]){
				var checkData = this.screeningProcess[index]['screening_process'];
				if(checkData && checkData.length){
					for(let i=0;i<checkData.length;i++){
						var value=checkData[i]['title'];
						this.t.push(this.formBuilder.group({
							title: [value]
						}));
					}
				}
			}
		}
	}


}
