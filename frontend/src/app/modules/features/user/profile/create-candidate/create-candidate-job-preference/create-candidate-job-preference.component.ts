import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component,ViewChild,ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
	selector: 'app-create-candidate-job-preference',
	templateUrl: './create-candidate-job-preference.component.html',
	styleUrls: ['./create-candidate-job-preference.component.css'],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CreateCandidateJobPreferenceComponent implements OnInit {

	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	address = [ ];
	
@ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
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
	
	/**
	**	When the module after loading the contents the ngOnChanges calls
	**  To validate the form and inserting the form data
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
		setTimeout(async () => {
			/* this.requestParams = {'Enter the ngOnChanges':'CreateCandidateJobPreferenceComponent','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
			if (this.childForm && this.savedUserDetails) {
				if(this.savedUserDetails.preferred_locations!=null){
					if(this.savedUserDetails.preferred_locations.length == 0){
						this.t.removeAt(0);
						this.t.push(this.formBuilder.group({
							city: [''],
							state: [''],
							stateShort: [''],
							country: ['']
						  }));
						  this.address=[];
					}else if ((this.savedUserDetails.preferred_locations.length == 1) || (this.t && this.t.length) !== (this.savedUserDetails.preferred_locations && this.savedUserDetails.preferred_locations.length)) {
					 this.t.removeAt(0);
					  this.savedUserDetails.preferred_locations.map((value, index) => {
						this.t.push(this.formBuilder.group({
							city: [''],
							state: [''],
							stateShort: [''],
							country: ['']
						  }));
					  });
					}
					var tempData =[];
				if(this.t.value){
						 tempData = this.savedUserDetails.preferred_locations.filter(function(a,b){ return a.city!=''||a.country!=''});
						 tempData = tempData.map(function(a,b){ 
				a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
				return a.city+'-'+a.stateShort });
					}
				  
				this.address=tempData;
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
								job_type: ["1001"] 
							} 
						})
						document.getElementById("1001")['className'] = document.getElementById("1001")['className'] +' btn-fltr-active';
					}
				}else{
					this.childForm.patchValue({ 
						jobPref: { 
							job_type: ["1001"] 
						} 
					});
					document.getElementById("1001")['className'] = document.getElementById("1001")['className'] +' btn-fltr-active';
				}
			}
			if (this.childForm && this.savedUserDetails && (this.userInfo && this.userInfo.profile_completed == true)) {
				if(this.tabInfos && this.tabInfos.length) {
					let educationExpIndex = this.tabInfos.findIndex(val => val.tabNumber == 2);
					if(educationExpIndex == -1) {
						
						var idVals = this.childForm.value.personalDetails.nationality;
						this.savedUserDetails.preferred_countries = [idVals];
							
						this.childForm.patchValue({
								educationExp : {
									...this.savedUserDetails
								},
							});
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
			preferred_countries: new FormControl(null, Validators.required),
			preferred_locations : new FormArray([this.formBuilder.group({
				city: [''],
				state: [''],
				stateShort: [''],
				country: ['']
			  })]),
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
		if(fieldName=='remote_only'){ 
			this.childForm.patchValue({
				jobPref: {
					travel: 0
				}
			});
			
		}
		if(fieldName=='willing_to_relocate'){ 
		if(value==false){
			for(let i=0;i<this.t.value.length;){
				this.t.removeAt(i);
			}
			this.t.push(this.formBuilder.group({
				city: [''],
				state: [''],
				stateShort: [''],
				country: ['']
			}));
			this.address=[];
		}
		}
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
	
  get t() {
    return this.f.preferred_locations as FormArray;
  }
  
  
  onDuplicate = () => {
      this.t.push(this.formBuilder.group({
        city: [''],
        state: [''],
        stateShort: [''],
        country: ['']
      }));
  }

  onRemove = (index) => {
    let removedValue = this.t.value[index];
 
    if (index == 0 && this.t.length == 1) {
      this.t.removeAt(0);
      this.t.push(this.formBuilder.group({
         city: [''],
        state: [''],
        stateShort: [''],
        country: ['']
      }));
	  this.address=[];
    } else {
      this.t.removeAt(index);
	  var tempData =[];
		if(this.t.value){
			 tempData = this.t.value.filter(function(a,b){ return a.city!=''||a.country!=''});
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
		if(this.t.value){
			 tempData = this.t.value.filter(function(a,b){ return a.city!='' && b.stateShort!=''});
		}
		
		var datas:any = {
        city: address.city ? address.city : event.formatted_address,
        state: address.state,
        stateShort: address.stateShort,
        country: address.country
    };
	this.chipsInput.nativeElement.value='';
	if(tempData.filter(function(a,b){ return a.city == datas.city && a.state ==datas.state && a.country ==datas.country }).length==0){
	this.onDuplicate();
	tempData.push(datas);
	this.t.patchValue(tempData);
	tempData = tempData.map(function(a,b){ 
	a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
	return a.city+'-'+a.stateShort });
	this.address=tempData;
	}}
  };
}
