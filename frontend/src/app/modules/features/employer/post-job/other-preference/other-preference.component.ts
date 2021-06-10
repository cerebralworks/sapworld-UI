import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
			language: new FormControl(null, Validators.required)
		}));

	}

	get f() {
		return this.childForm.controls.otherPref.controls;
	}


}
