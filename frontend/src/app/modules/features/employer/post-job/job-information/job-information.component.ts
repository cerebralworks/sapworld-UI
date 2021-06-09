import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { textEditorConfig } from '@config/rich-editor';
import { tabInfo } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SharedService } from '@shared/service/shared.service';
import { ValidationService } from '@shared/service/validation.service';

import { Address as gAddress } from "ngx-google-places-autocomplete/objects/address";
import { AddressComponent as gAddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";

@Component({
  selector: 'app-job-information',
  templateUrl: './job-information.component.html',
  styleUrls: ['./job-information.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class JobInformationComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	@Input() currentTabInfo: tabInfo;
	@Input('postedJobsDetails')
	set postedJobsDetails(inFo: JobPosting) {
		this.getPostedJobsDetails = inFo;
	}

	public availabilityArray: { id: number; text: string; }[];
	public childForm;
	public getPostedJobsDetails: JobPosting;
	public currentCurrencyFormat: string = "en-US";
	public isContractDuration: boolean = false;
	public editorConfig: AngularEditorConfig = textEditorConfig;

	constructor(
		private parentF: FormGroupDirective,
		public sharedService: SharedService
	) { }

	/**
	**	When the intial component calls
	** 	Create form
	**/
	
	ngOnInit(): void {
		this.createForm();

		this.availabilityArray = [
			{ id: 0, text: 'Immediate' },
			{ id: 15, text: '15 Days' },
			{ id: 30, text: '30 Days' },
			{ id: 45, text: '45 Days' },
			{ id: 60, text: '60 Days' },
		];
	}

	/**
	**	Assign the values for the jobInformation
	** 	
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
   
		if(this.childForm && this.getPostedJobsDetails) {
			
			this.childForm.patchValue({
				jobInfo : {
					...this.getPostedJobsDetails,
					salary: this.getPostedJobsDetails.salary.toString(),
					salary_currency: this.getPostedJobsDetails.salary_currency.toLocaleUpperCase()
				}
			});
			let latlngText: string = this.getPostedJobsDetails.latlng_text;
			if (latlngText) {
				const splitedString: any[] = latlngText.split(',');
				if (splitedString && splitedString.length) {
					this.childForm.patchValue({
						jobInfo: {
							latlng: {
								lat: splitedString[0],
								lng: splitedString[1]
							}
						}
					})
				}
			}
		}
	}

	/**
	**	Create a new form arrtibutes
	**/
	
	createForm() {
		
		this.childForm = this.parentF.form;

		this.childForm.addControl('jobInfo', new FormGroup({
			title: new FormControl('', Validators.required),
			employer_role_type: new FormControl(''),
			type: new FormControl('', Validators.required),
			contract_duration: new FormControl(''),
			description: new FormControl('', Validators.compose([Validators.required, Validators.minLength(100)])),
			salary_type: new FormControl('', Validators.required),
			salary_currency: new FormControl('USD', Validators.required),
			salary: new FormControl(null, Validators.required),
			city: new FormControl('', Validators.required),
			state: new FormControl('', Validators.required),
			latlng: new FormControl({}, Validators.required),
			country: new FormControl('', Validators.required),
			zipcode: new FormControl(null, Validators.required),
			availability: new FormControl(null, Validators.required),
			remote: new FormControl(null, Validators.required),
			health_wellness: new FormGroup({
			  dental: new FormControl(false),
			  vision: new FormControl(false),
			  health: new FormControl(false),
			  life: new FormControl(false)
			}),
			paid_off: new FormGroup({
			  vacation_policy: new FormControl(false),
			  paid_holidays: new FormControl(false),
			  maternity: new FormControl(false)
			}),
			financial_benefits: new FormGroup({
			  retirement_plan: new FormControl(false),
			  performance_bonus: new FormControl(false),
			  tuition_reimbursement: new FormControl(false),
			  purchase_plan: new FormControl(false)
			}),
			office_perks: new FormGroup({
			  free_food: new FormControl(false),
			  home_policy: new FormControl(false),
			  pet_friendly: new FormControl(false),
			  social_outings: new FormControl(false),
			  office_space: new FormControl(false)
			}),
		}));
	}

	/**
	**	Assign the form controls to f
	**/
	
	get f() {
		return this.childForm.controls.jobInfo.controls;
	}

	/**
	**	Currencey format change Checking
	**/
	
	onChangeCurrentFormat  = (value, event) => {
		if(value == 0) {
		  this.currentCurrencyFormat = 'en-US';
		} else if(value == 1) {
		  this.currentCurrencyFormat = 'en-IN';
		} else if(value == 2) {
		  this.currentCurrencyFormat = 'de-DE';
		}
		this.childForm.patchValue({
		  jobInfo: {
			salary: null
		  }
		});
		this.childForm.markAsUntouched();
		this.childForm.markAsPristine();
		this.childForm.updateValueAndValidity();
	}

	/**
	**	When the jobtype Change
	**  reset the contract_duration
	**/
	
	onChangeJobType = (value) => {
		if( value == '03'){
		  this.isContractDuration = true;
		  this.childForm.get('jobInfo.contract_duration').setValidators([Validators.required]);
		  this.childForm.get('jobInfo.contract_duration').updateValueAndValidity();
		}else {
		  this.isContractDuration = false;
		  this.childForm.get('jobInfo.contract_duration').setValidators(null);
		  this.childForm.get('jobInfo.contract_duration').updateValueAndValidity();
		  this.childForm.patchValue({
			  jobInfo: {
				contract_duration:''
			  }
		  });
		}
	}

	/**
	**	When the Address Change
	**  assign lat&lng
	**/
	
	handleAddressChange = (event) => {
		const address = this.sharedService.fromGooglePlace(event);
		if(event.geometry){
			this.childForm.patchValue({
				jobInfo: {
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

}
