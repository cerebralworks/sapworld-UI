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
  @ViewChild("criteriaModal", { static: false }) criteriaModal: TemplateRef<any>;

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
					this.certification = this.getPostedJobsDetails.certification;
				}
				this.childForm.patchValue({
					otherPref : {
						...this.getPostedJobsDetails
					}
				});
				this.setCriteriaValue(this.getPostedJobsDetails.extra_criteria)
			}
		});
	}

	/**
	**	Create a new form arrtibutes
	**/
	
	createForm() {
		this.childForm = this.parentF.form;
		this.childForm.addControl('otherPref', new FormGroup({
			facing_role: new FormControl('0', Validators.required),
			training_experience: new FormControl('0', Validators.required),
			certification: new FormControl(null),
			language: new FormControl(null, Validators.required),
			extra_criteria: new FormArray([]),
			temp_extra_criteria: new FormArray([]),
		}));

	}

	get f() {
		return this.childForm.controls.otherPref.controls;
	}

  onCloseCriteriaModal() {
    this.clearFormArray(this.childForm.get('otherPref.temp_extra_criteria'));
    this.criteriaModalRef.close();
    this.isOpenCriteriaModal = false;
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  onOpenCriteriaModal = () => {
    this.isOpenCriteriaModal = true;
    if (this.isOpenCriteriaModal) {
      setTimeout(() => {
        this.criteriaModalRef = this.modalService.open(this.criteriaModal, {
          windowClass: 'modal-holder',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
        this.onCreateExtraCriteriaField();
      }, 300);
    }
  }

  onCreateExtraCriteriaField = () => {
    this.t.push(this.formBuilder.group({
      title: ['', Validators.required],
      value: ['', [Validators.required]]
    }));
  }
  
  get t() {
    return this.f.temp_extra_criteria as FormArray;
  }

  get tEX() {
    return this.f.extra_criteria as FormArray;
  }
  
  
  setCriteriaValue(items: any[] = []) {
    items.forEach((element, index) => {
      this.tEX.push(this.formBuilder.group({
      title: [element.title],
      value: [element.value]
      }));
    });
  }

  onAddExtraCriteria = () => {
    const otherPref = this.childForm.value.otherPref.temp_extra_criteria;
    if(otherPref && Array.isArray(otherPref) && otherPref.length > 0) {
      this.tEX.push(this.formBuilder.group({
        title: [otherPref[0].title],
        value: [otherPref[0].value]
      }));
      this.onCloseCriteriaModal();
    }
  }

  onConvertArrayToString = (value: any[]) => {
    if (!Array.isArray(value)) return "--";
    return value.join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if (!Array.isArray(value)) return "--";
    return value.map(s => s[field]).join(', ');
  }
  onRemove = (index) => {
    let removedValue = this.t.value[index];
      this.tEX.removeAt(index);

  }
}
