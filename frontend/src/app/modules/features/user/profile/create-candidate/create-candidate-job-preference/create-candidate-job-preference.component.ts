import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component,ViewChild,ElementRef, Input, OnInit, SimpleChanges} from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import {MatChipInputEvent} from '@angular/material/chips';

declare let google: any;

@Component({
	selector: 'app-create-candidate-job-preference',
	templateUrl: './create-candidate-job-preference.component.html',
	styleUrls: ['./create-candidate-job-preference.component.css'],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})

export class CreateCandidateJobPreferenceComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	address = [ ];
	@ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
	@Input() currentTabInfo: tabInfo;
	public childForm;
	public validationType:any;
	private autocomplete: any;
	public availabilityArray: { id: number; text: string; }[];
	public travelArray: { id: number; text: string; }[];
	public userInfo: any;
	public job_type_error: boolean = false;
	public IsShow: boolean = false;
	public savedUserDetails: any;
	public tabInfos: tabInfo[];
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}
	public othercountry: any[] = [];
	public requestParams: any;	 
	options  = {
		componentRestrictions: { country:[] }
	};

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
	}
	
	/**
	**	To get chip add event
	**/
	
	add(event: MatChipInputEvent): void {
		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the address
	**/
	
	remove(data): void {
		
		const index = this.address.indexOf(data);

		if (index >= 0) {
			this.address.splice(index, 1);
		}
	}
	
	/**
	   To validate field by tab change
	**/ 
	
    valJobPrefTab(){
	this.validationType = {
        'job_role': [Validators.required],
        'job_type': [Validators.required],
		'willing_to_relocate': [Validators.required],
		'travel': [Validators.required],
		'availability': [Validators.required],
		}
		
	    this.addValidators(<FormGroup>this.childForm.controls['jobPref']);
	
	}
	
	public addValidators(form: FormGroup) {
		if(form && form.controls) {
			for (const key in form.controls) {
				form.get(key).setValidators(this.validationType[key]);
				form.get(key).updateValueAndValidity();
			}		
		}
	}
	
	
	
	/**
	**	When the module after loading the contents the ngOnChanges calls
	**  To validate the form and inserting the form data
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
		setTimeout(async () => {
			this.valJobPrefTab();
			if (this.childForm && this.savedUserDetails) {
				if(this.savedUserDetails.work_authorization==0){
					
					var temps =this.savedUserDetails.authorized_country;
					var temps1 =this.savedUserDetails.authorized_country_select;
					var tempCoun =[];
					if(!temps){
						temps =[];
					}
					if(!temps || temps.length==0){
						temps =[this.savedUserDetails.nationality];
					}else{
						temps[temps.length]=this.childForm.value.personalDetails.nationality;
					}
					if(temps.length){
						for(let i=0;i<temps.length;i++){
							var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps[i])});
							if(vali.length==1){
								if(parseInt(vali[0]['id'])==parseInt("254")){
									var EUCountry =["AT","LI","BE","LT",
										"LU","DK","MT","EE","FI","NO","CZ",
										"FR","PL","DE","PT","GR","SK","HU","NL",
										"SI","IS","ES","IT","SE","LV","CH","IE"
										]
										for(let j=0;j<EUCountry.length;j++){
											tempCoun.push(EUCountry[j]);
										}
								}else{
									if(vali[0]['iso']!=null && vali[0]['iso']!='' && vali[0]['iso']!=undefined){
										tempCoun.push(vali[0]['iso']);
									}
								}
								
							}
							

						}
					}
					if(temps1){
						temps1 =[];
					}
					if(!temps1 || temps1.length==0){
						temps1 =[this.savedUserDetails.nationality];
					}else{
						temps1[temps1.length]=this.childForm.value.personalDetails.nationality;
					}
					if(temps1.length){
						for(let i=0;i<temps1.length;i++){
							var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps1[i])});
							if(vali.length==1){
								if(parseInt(vali[0]['id'])==parseInt("254")){
									var EUCountry =["AT","LI","BE","LT",
										"LU","DK","MT","EE","FI","NO","CZ",
										"FR","PL","DE","PT","GR","SK","HU","NL",
										"SI","IS","ES","IT","SE","LV","CH","IE"
										]
										for(let j=0;j<EUCountry.length;j++){
											tempCoun.push(EUCountry[j]);
										}
								}else{
									if(vali[0]['iso']!=null && vali[0]['iso']!='' && vali[0]['iso']!=undefined){
										tempCoun.push(vali[0]['iso']);
									}
								}
								
							}
							

						}
					}
					
					if(tempCoun.length==0){
						
						this.options.componentRestrictions['country'] = [];
						
					}else{
						
						this.options.componentRestrictions['country'] = tempCoun;
					}
					
				}else if(this.savedUserDetails.work_authorization==1){
					var temps =this.childForm.value.personalDetails.nationality;
					var tempCoun =[];
					if(temps){
						var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps)});
						if(vali.length==1){
							if(parseInt(vali[0]['id'])==parseInt("254")){
								var EUCountry =["AT","LI","BE","LT",
									"LU","DK","MT","EE","FI","NO","CZ",
									"FR","PL","DE","PT","GR","SK","HU","NL",
									"SI","IS","ES","IT","SE","LV","CH","IE"
									]
									for(let j=0;j<EUCountry.length;j++){
										tempCoun.push(EUCountry[j]);
									}
							}else{
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
				}else{
					var temps =this.childForm.value.personalDetails.nationality;
					var tempCoun =[];
					if(temps){
						var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps)});
						if(vali.length==1){
							if(parseInt(vali[0]['id'])==parseInt("254")){
								var EUCountry =["AT","LI","BE","LT",
									"LU","DK","MT","EE","FI","NO","CZ",
									"FR","PL","DE","PT","GR","SK","HU","NL",
									"SI","IS","ES","IT","SE","LV","CH","IE"
									]
									for(let j=0;j<EUCountry.length;j++){
										tempCoun.push(EUCountry[j]);
									}
							}else{
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
				}
				this.IsShow = true;
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
					// this.t.removeAt(0);
					 /*this.savedUserDetails.preferred_locations.map((value, index) => {
						this.t.push(this.formBuilder.group({
							city: [''],
							state: [''],
							stateShort: [''],
							country: ['']
						  }));
					  });*/
					}
					var tempData =[];
				if(this.t.value){
						 tempData = this.childForm.controls.jobPref.value.preferred_locations.filter(function(a,b){ return a.city!=''||a.country!=''});
						 if(tempData.length ==0 && this.savedUserDetails.preferred_locations && this.savedUserDetails.preferred_locations.length != 0){
							this.childForm.patchValue({
								jobPref: {
									preferred_locations: this.childForm.controls.jobPref.value.preferred_locations,
								},
							});
							tempData = this.childForm.controls.jobPref.value.preferred_locations.filter(function(a,b){ return a.city!=''||a.country!=''});
						}
						 tempData = tempData.map(function(a,b){ 
				a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
				return a.city+'-'+a.stateShort });
					}
				this.address=tempData;
				}
				if(this.childForm.controls.personalDetails.value.work_authorization==0){
					var temps =this.childForm.controls.personalDetails.value.authorized_country;
					var temps1 =this.childForm.controls.personalDetails.value.authorized_country_select;
					var tempCoun =[];
					if(!temps){
						temps =[];
					}
					if(!temps || temps.length==0){
						temps =[this.childForm.controls.personalDetails.value.nationality];
					}else{
						temps[temps.length]=this.childForm.value.personalDetails.nationality;
					}
					if(temps.length){
						for(let i=0;i<temps.length;i++){
							var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps[i])});
							if(vali.length==1){
								if(parseInt(vali[0]['id'])==parseInt("254")){
								var EUCountry =["AT","LI","BE","LT",
									"LU","DK","MT","EE","FI","NO","CZ",
									"FR","PL","DE","PT","GR","SK","HU","NL",
									"SI","IS","ES","IT","SE","LV","CH","IE"
									]
									for(let j=0;j<EUCountry.length;j++){
										tempCoun.push(EUCountry[j]);
									}
							}else{
								if(vali[0]['iso']!=null && vali[0]['iso']!='' && vali[0]['iso']!=undefined){
									tempCoun.push(vali[0]['iso']);
								}
							}
								
							}
							

						}
					}
					if(!temps1 ){
						temps1 =[];
					}
					if(temps1.length){
						for(let i=0;i<temps1.length;i++){
							var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps1[i])});
							if(vali.length==1){
								if(parseInt(vali[0]['id'])==parseInt("254")){
									var EUCountry =["AT","LI","BE","LT",
										"LU","DK","MT","EE","FI","NO","CZ",
										"FR","PL","DE","PT","GR","SK","HU","NL",
										"SI","IS","ES","IT","SE","LV","CH","IE"
										]
										for(let j=0;j<EUCountry.length;j++){
											tempCoun.push(EUCountry[j]);
										}
								}else{
									if(vali[0]['iso']!=null && vali[0]['iso']!='' && vali[0]['iso']!=undefined){
										tempCoun.push(vali[0]['iso']);
									}
								}
								
							}
							

						}
					}
					
					if(tempCoun.length==0){
						
						this.options.componentRestrictions['country'] = [];
						
					}else{
						
						this.options.componentRestrictions['country'] = tempCoun;
					}
					
				}else if(this.childForm.controls.personalDetails.value.work_authorization==1){
					var temps =this.childForm.controls.personalDetails.value.nationality;
					var tempCoun =[];
					if(temps){
						var vali =this.othercountry.filter(function(a,b){ return a.id==parseInt(temps)});
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
				if(this.childForm.controls.jobPref.value.preferred_locations!=null){
					if(this.childForm.controls.jobPref.value.preferred_locations.length == 0){
						this.t.removeAt(0);
						this.t.push(this.formBuilder.group({
							city: [''],
							state: [''],
							stateShort: [''],
							country: ['']
						  }));
						  this.address=[];
					}else if ((this.childForm.controls.jobPref.value.preferred_locations.length == 1) || (this.t && this.t.length) !== (this.childForm.controls.jobPref.value.preferred_locations && this.childForm.controls.jobPref.value.preferred_locations.length)) {
					 //this.t.removeAt(0);
					  this.childForm.controls.jobPref.value.preferred_locations.map((value, index) => {
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
						 tempData = this.childForm.controls.jobPref.value.preferred_locations.filter(function(a,b){ return a.city!=''||a.country!=''});
						 tempData = tempData.map(function(a,b){ 
				a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
				return a.city+'-'+a.stateShort });
					}
				  
				this.address=tempData;
				}
				/*if(this.savedUserDetails.job_type!=null){		  
					if(this.savedUserDetails.job_type.length !=0){
						for(let i=0;i<this.savedUserDetails.job_type.length;i++){
							for(let j=0;j<document.getElementsByClassName('jobtype').length;j++){
								if(document.getElementsByClassName('jobtype').item(j)['id'] == this.savedUserDetails.job_type[i]){
									document.getElementsByClassName('jobtype').item(j)['className'] = document.getElementsByClassName('jobtype').item(j)['className'] +' btn-fltr-active';
								}
							}
						}
					}else{
						
					}
					console.log(this.childForm.controls.jobPref.value.job_type);
				}else */if(this.childForm.controls.jobPref.value.job_type!=null){		
					if(this.childForm.controls.jobPref.value.job_type.length !=0){
						for(let i=0;i<this.childForm.controls.jobPref.value.job_type.length;i++){
							for(let j=0;j<document.getElementsByClassName('jobtype').length;j++){
								if(document.getElementsByClassName('jobtype').item(j)['id'] == this.childForm.controls.jobPref.value.job_type[i]){
									document.getElementsByClassName('jobtype').item(j)['className'] = document.getElementsByClassName('jobtype').item(j)['className'] +' btn-fltr-active';
								}
							}
						}
					}else{
						
					}
				}
				
			}
			if (this.childForm && this.savedUserDetails && (this.userInfo && this.userInfo.profile_completed == true)) {
				if(this.tabInfos && this.tabInfos.length) {
					let educationExpIndex = this.tabInfos.findIndex(val => val.tabNumber == 2);
					if(educationExpIndex == -1) {
						
						var idVals = this.childForm.value.personalDetails.nationality;
						//this.savedUserDetails.preferred_countries = [idVals];
						
						if(!this.childForm.controls.educationExp || this.childForm.controls.educationExp ==undefined || this.childForm.controls.educationExp.status =="INVALID"){	
							this.childForm.patchValue({
									educationExp : {
										...this.savedUserDetails
									},
								});
							}
					}
						
					let skillSetIndex = this.tabInfos.findIndex(val => val.tabNumber == 3);
					if(skillSetIndex == -1) {
						
						if(!this.childForm.controls.skillSet || this.childForm.controls.skillSet == undefined || this.childForm.controls.skillSet.status =="INVALID"){
							this.childForm.patchValue({
								skillSet : {
									...this.savedUserDetails
								},
							});
						}
					}
				}
		  
				this.childForm.patchValue({
					jobPref: {
						//...this.childForm.controls.jobPref.value
					},
				});
				
			}
		},300);
	}

	/**
	**	creating the job preference Form
	**/
	
	createForm() {
		this.childForm = this.parentF.form;

		this.childForm.addControl('jobPref', new FormGroup({
			job_type: new FormControl(null, Validators.required),
			job_role: new FormControl(''),
			willing_to_relocate: new FormControl(null, Validators.required),
			preferred_location: new FormControl(null),
			availability : new FormControl('', Validators.required),
			travel: new FormControl(null, Validators.required),
			//preferred_countries: new FormControl(null, Validators.required),
			preferred_locations : new FormArray([this.formBuilder.group({
				city: [''],
				state: [''],
				stateShort: [''],
				country: ['']
			  })]),
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
	
	/**
	**	To check job type value
	**/
	
	onChangeJobType = (value) => {
		if (value == 6 || value == '6') {
		
		} else {
		
		}
	}
	
	/**
	**	To check the click event
	**/
	
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
	
	/* countryClick(value,clr){
		var temp = clr.target.className.split(' ');
		if(temp[temp.length-1]=='btn-fltr-active'){
			this.childForm.value.jobPref.preferred_countries.pop(clr.target.id);
			clr.target.className = clr.target.className.replace('btn-fltr-active','');
		}else{
			clr.target.className = clr.target.className+' btn-fltr-active';
			if(this.childForm.value.jobPref.preferred_countries==null){
				value =[clr.target.id];
				this.childForm.patchValue({ 
					jobPref: { 
						preferred_countries: value 
					} 
				})
			}else{
				this.childForm.value.jobPref.preferred_countries.push(clr.target.id);
			}
		}
	} */
	
	/** 
	** Job Onclick with pathching the form values
	**/
	
	jobClick(value,clr){
	  var temp = clr.target.className.split(' ');
	  var a:HTMLElement=document.getElementById('errjobtype');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		 if(this.childForm.value.jobPref.job_type){
				this.childForm.value.jobPref.job_type.pop(clr.target.id);
				if(this.childForm.value.jobPref.job_type.length==0){
					this.job_type_error = true;			
				}
		 }else{
			 this.job_type_error = true;
			 a.style.display = "block";
		 }
		 clr.target.className = clr.target.className.replace('btn-fltr-active','');
	  }else{
			clr.target.className = clr.target.className+' btn-fltr-active';
			if(this.childForm.value.jobPref.job_type==null){
				/* value =[clr.target.id];
				this.childForm.patchValue({ 
					jobPref: { 
						job_type: value 
					} 
				}) */
			
			}else{
				//this.childForm.value.jobPref.job_type.push(clr.target.id);
			}
			 a.style.display = "none";
			this.job_type_error = false;
		}
		var CalVal =document.getElementsByClassName('btn-fltr-active');
			var tempCal=[];
			for(let i=0;i<CalVal.length;i++){
				if(CalVal[i]['id']){
					tempCal.push(CalVal[i]['id']);
				}
			}
			this.childForm.patchValue({ 
					jobPref: { 
						job_type: tempCal 
					} 
				})
	}
	
	get t() {
		return this.f.preferred_locations as FormArray;
	}
  
	/**
	**	To add the preferred_location
	**/
	onDuplicate = () => {
      this.t.push(this.formBuilder.group({
        city: [''],
        state: [''],
        stateShort: [''],
        country: ['']
      }));
	}
	
	/**
	**	To remove the preferred_location
	**/
	
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
	
	/**
	**	handle the address change
	**/
	
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
			if(address['city'] !=null &&address['state'] !=null &&address['stateShort'] !=null &&address['country'] !=null &&
				address['city'] !=undefined &&address['state'] !=undefined &&address['stateShort'] !=undefined  &&address['country'] !=undefined ){ 
				if(tempData.filter(function(a,b){ return a.city == datas.city && a.state ==datas.state && a.country ==datas.country }).length==0){
					this.onDuplicate();
					tempData.push(datas);
					this.t.patchValue(tempData);
					tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
					return a.city+'-'+a.stateShort });
					this.address=tempData;
				}
			}
		}
	};

}
