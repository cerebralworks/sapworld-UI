import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { SharedApiService } from '@shared/service/shared-api.service';

@Component({
	selector: 'app-create-candidate-job-preference',
	templateUrl: './create-candidate-job-preference.component.html',
	styleUrls: ['./create-candidate-job-preference.component.css'],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CreateCandidateJobPreferenceComponent implements OnInit {

	@Input() currentTabInfo: tabInfo;
	public childForm;
	public availabilityArray: { id: number; text: string; }[];
	public travelArray: { id: number; text: string; }[];
	public userInfo: any;
	public job_type_error: boolean = false;
	public savedUserDetails: any;
	public tabInfos: tabInfo[];
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}
	public othercountry: any[] = [];
 	public requestParams: any;	 
	constructor(
		private parentF: FormGroupDirective,
		public sharedService: SharedService,
		private formBuilder: FormBuilder,
		private userSharedService: UserSharedService,
		private SharedAPIService: SharedApiService,
		private dataService: DataService
	) { }
	
	/**
	**	When the module initally loads
	**/
	
	ngOnInit(): void {
		/* this.requestParams = {'Enter the ngOnInit':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
		this.createForm();

		this.availabilityArray = [
			{ id: 0, text: 'Immediate' },
			{ id: 15, text: '15 Days' },
			{ id: 30, text: '30 Days' },
			{ id: 45, text: '45 Days' },
			{ id: 60, text: '60 Days' },
		];

		this.travelArray = [
			{ id: 0, text: 'No' },
			{ id: 25, text: '25%' },
			{ id: 50, text: '50%' },
			{ id: 75, text: '75%' },
			{ id: 100, text: '100%' },
		];

		this.userSharedService.getUserProfileDetails().subscribe(
		response => {
				this.userInfo = response;
		});
		
		this.dataService.getTabInfo().subscribe(
		response => {
			if (response && Array.isArray(response) && response.length) {
				this.tabInfos = response;
			}
		})
	
		this.dataService.getCountryDataSource().subscribe(
		response => {
			if (response && Array.isArray(response) && response.length) {
				this.othercountry =  response;
			}
		});
		/* this.requestParams = {'Exist the ngOnInit':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
	}
	
	/**
	**	When the module after loading the contents the ngOnChanges calls
	**  To validate the form and inserting the form data
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
		setTimeout(async () => {
			/* this.requestParams = {'Enter the ngOnChanges':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
			if (this.childForm && this.savedUserDetails) {
				if(this.childForm.value.personalDetails.authorized_country){
					if(this.childForm.value.personalDetails.authorized_country.length !=0){
						var id = this.childForm.value.personalDetails.authorized_country;
						var idVals = this.childForm.value.personalDetails.nationality
						id.push(idVals);
						this.othercountry = this.othercountry.filter(t=>{return id.includes(t.id)})
						if(document.getElementById(idVals)){
								//document.getElementById(idVals).className='btn btn-fltr country btn-fltr-active';
							}
					}else{
						this.othercountry =[];
					}
				}
				if(this.savedUserDetails.job_type!=null){		  
					if(this.savedUserDetails.job_type.length !=0){
						for(let i=0;i<this.savedUserDetails.job_type.length;i++){
							for(let j=0;j<document.getElementsByClassName('jobtype').length;j++){
								if(document.getElementsByClassName('jobtype').item(j)['id'] == this.savedUserDetails.job_type[i]){
									document.getElementsByClassName('jobtype').item(j)['className'] = document.getElementsByClassName('jobtype').item(j)['className'] +' btn-fltr-active';
								}
							}
						}
					}else{
						this.childForm.patchValue({ 
							jobPref: { 
								job_type: ["01"] 
							} 
						})
						document.getElementById("01")['className'] = document.getElementById("01")['className'] +' btn-fltr-active';
					}
				}else{
					this.childForm.patchValue({ 
						jobPref: { 
							job_type: ["01"] 
						} 
					});
					document.getElementById("01")['className'] = document.getElementById("01")['className'] +' btn-fltr-active';
				}
			}
			if (this.childForm && this.savedUserDetails && (this.userInfo && this.userInfo.profile_completed == true)) {
				if(this.tabInfos && this.tabInfos.length) {
					let educationExpIndex = this.tabInfos.findIndex(val => val.tabNumber == 2);
					if(educationExpIndex == -1) {
						if(this.childForm.value.jobPref.preferred_countries){
							var intersection = this.childForm.value.personalDetails.authorized_country.filter(element => this.childForm.value.jobPref.preferred_countries.includes(element));
							var idVals = this.childForm.value.personalDetails.nationality;
							intersection.push(idVals) ;
							this.savedUserDetails.preferred_countries = intersection;
							if(document.getElementById(idVals)){
								document.getElementById(idVals).className='btn btn-fltr country btn-fltr-active';
							}
						}
						if(this.savedUserDetails.preferred_countries!=null || this.savedUserDetails.preferred_countries !=undefined){
							var idVals = this.childForm.value.personalDetails.nationality;
							this.savedUserDetails.preferred_countries = [idVals];
							if(document.getElementById(idVals)){
								document.getElementById(idVals).className='btn btn-fltr country btn-fltr-active';
							}
						} 
						this.childForm.patchValue({
								educationExp : {
									...this.savedUserDetails
								},
							});
						}
						if(this.savedUserDetails.preferred_countries!=null){		  
							if(this.savedUserDetails.preferred_countries.length){
								for(let i=0;i<this.savedUserDetails.preferred_countries.length;i++){
									for(let j=0;j<document.getElementsByClassName('country').length;j++){
										if(document.getElementsByClassName('country').item(j)['id'] == this.savedUserDetails.preferred_countries[i]){
											document.getElementsByClassName('country').item(j)['className'] = 'btn btn-fltr country btn-fltr-active';
										}else{
											//document.getElementsByClassName('country').item(j)['className'] = 'btn btn-fltr country';
										}
									}
								}
							}
						}
						
					let skillSetIndex = this.tabInfos.findIndex(val => val.tabNumber == 3);
					if(skillSetIndex == -1) {
						this.childForm.patchValue({
							skillSet : {
								...this.savedUserDetails
							},
						});
					}
				}
		  
				this.childForm.patchValue({
					jobPref: {
						...this.savedUserDetails
					},
				});
				this.childForm.patchValue({
					jobPref: {
						visa_sponsered: this.savedUserDetails.visa_sponsered,
						remote_only: this.savedUserDetails.remote_only,
					},
				});
			}
			/* this.requestParams = {'Exist the ngOnChanges':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
		});
	}

	/**
	**	creating the job preference Form
	**/
	
	createForm() {
	  /* this.requestParams = {'Enter the createForm':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
		this.childForm = this.parentF.form;

		this.childForm.addControl('jobPref', new FormGroup({
			job_type: new FormControl(null),
			job_role: new FormControl(''),
			willing_to_relocate: new FormControl(null, Validators.required),
			preferred_location: new FormControl(null),
			travel: new FormControl(null, Validators.required),
			preferred_countries : new FormControl(null, Validators.required),
			availability : new FormControl(''),
			remote_only: new FormControl(false, Validators.required),
			visa_sponsered: new FormControl(false, Validators.required),
		}));
		 this.requestParams = {'Exist the createForm':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams);
	}

	get f() {
		return this.childForm.controls.jobPref.controls;
	}

	onSetValue = (event) => {

	}

	onChangeJobType = (value) => {
		if (value == 6 || value == '6') {
		
		} else {
		
		}
	}

	onChangeFieldValue = (fieldName, value) => {
		this.childForm.patchValue({
			jobPref: {
				[fieldName]: value,
			}
		});
	}
	
	/** 
	** Country Onclick with pathching the form values
	**/
	
	countryClick(value,clr){
		 //this.requestParams = {'Enter the countryClick':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				//this.SharedAPIService.onSaveLogs(this.requestParams);
		var temp = clr.toElement.className.split(' ');
		if(temp[temp.length-1]=='btn-fltr-active'){
			this.childForm.value.jobPref.preferred_countries.pop(clr.toElement.id);
			clr.toElement.className = clr.toElement.className.replace('btn-fltr-active','');
		}else{
			clr.toElement.className = clr.toElement.className+' btn-fltr-active';
			if(this.childForm.value.jobPref.preferred_countries==null){
				value =[clr.toElement.id];
				this.childForm.patchValue({ 
					jobPref: { 
						preferred_countries: value 
					} 
				})
			}else{
				this.childForm.value.jobPref.preferred_countries.push(clr.toElement.id);
			}
		}
		 //this.requestParams = {'Exist the countryClick':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				//this.SharedAPIService.onSaveLogs(this.requestParams);
	}
	
	/** 
	** Job Onclick with pathching the form values
	**/
	
	jobClick(value,clr){
		 //this.requestParams = {'Enter the jobClick':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				//this.SharedAPIService.onSaveLogs(this.requestParams);
	  var temp = clr.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		 if(this.childForm.value.jobPref.job_type){
				this.childForm.value.jobPref.job_type.pop(clr.toElement.id);
				if(this.childForm.value.jobPref.job_type.length==0){
					this.job_type_error = true;					
				}
		 }else{
			 this.job_type_error = true;
		 }
		 clr.toElement.className = clr.toElement.className.replace('btn-fltr-active','');
	  }else{
			clr.toElement.className = clr.toElement.className+' btn-fltr-active';
			if(this.childForm.value.jobPref.job_type==null){
				value =[clr.toElement.id];
				this.childForm.patchValue({ 
					jobPref: { 
						job_type: value 
					} 
				})
			
			}else{
				this.childForm.value.jobPref.job_type.push(clr.toElement.id);
			}
			this.job_type_error = false;
		}
		// this.requestParams = {'Exist the jobClick':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				//this.SharedAPIService.onSaveLogs(this.requestParams);
	}
	
}
