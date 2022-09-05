import { Component, Input,ViewChild, OnInit,ElementRef, SimpleChanges ,ViewEncapsulation} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {  FormArray, FormBuilder } from '@angular/forms';

import { textEditorConfig } from '@config/rich-editor';
import { tabInfo } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SharedService } from '@shared/service/shared.service';
import { ValidationService } from '@shared/service/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Address as gAddress } from "ngx-google-places-autocomplete/objects/address";
import { Options} from "ngx-google-places-autocomplete/objects/options/options";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { ComponentRestrictions } from "ngx-google-places-autocomplete/objects/options/componentRestrictions";
import { AddressComponent as gAddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";
import {MatChipInputEvent} from '@angular/material/chips';
import { AmazingTimePickerService } from 'amazing-time-picker';

declare let google: any;
@Component({
  selector: 'app-job-information',
  templateUrl: './job-information.component.html',
  styleUrls: ['./job-information.component.css'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class JobInformationComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	@ViewChild('places') places: GooglePlaceDirective;
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	@ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
	address = [ ];
	@Input() currentTabInfo: tabInfo;
	@Input('postedJobsDetails')
	set postedJobsDetails(inFo: JobPosting) {
		this.getPostedJobsDetails = inFo;
	}
	options  = {
		//componentRestrictions: { country:'' }
	};
	public availabilityArray: { id: number; text: string; }[];
	public childForm;
	public getPostedJobsDetails: JobPosting;
	public currentCurrencyFormat: string = "en-US";
	public isContractDuration: boolean = false;
	public minError: boolean = false;
	public maxError: boolean = false;
	public mintimeError: boolean = false;
	public maxtimeError: boolean = false;
	public showRemoteOption: boolean = false;
	public min: any;
	public max: any;
	public editorConfig: AngularEditorConfig = textEditorConfig;
	public changeToMinutes : boolean =false;
	public filterJL:any[]=[];
	public checkJL : boolean =false;
	public errEuro : boolean =false;
	constructor(
		private parentF: FormGroupDirective,
		private formBuilder: FormBuilder,
		public sharedService: SharedService,
		private atp: AmazingTimePickerService,
		private route: ActivatedRoute,
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
	**	Assign the values for the jobInformation
	** 	
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
		setTimeout( async () => {
		    var EUCountry =["AT","LI","BE","LT",
							"LU","DK","MT","EE","FI","NO","CZ",
							"FR","PL","DE","PT","GR","SK","HU","NL",
							"SI","IS","ES","IT","SE","LV","CH","IE"
							];
			if(this.childForm && this.getPostedJobsDetails) {
			
			   if(this.getPostedJobsDetails.remote ==true){
			      this.showRemoteOption = true;
				  setTimeout(()=>{
				  if(this.getPostedJobsDetails['remote_option'] ==0){
				    document.getElementById("domestic").classList.add("btn-fltr-active");
				  }else if(this.getPostedJobsDetails['remote_option'] ==1){
				    document.getElementById("worldwide").classList.add("btn-fltr-active");
				  }
				  });
			   }else{
			      this.showRemoteOption = false;
			   }
			   var datCount;
			   if(this.getPostedJobsDetails.job_locations.length !==0){
			   if(EUCountry.includes(this.getPostedJobsDetails.job_locations[0]['countryshort'])){
			      datCount=[];
			   }else{
			      datCount=this.getPostedJobsDetails.job_locations[0]['countryshort'];
			   }
			        var tempCountry = {
						country: datCount
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountry);
					this.places['autocomplete']['componentRestrictions'] = tempCountry;
			   }
				if (this.childForm.value.jobInfo.job_locations) {
					var tempData = this.t.value.filter(function(a,b){ return a.city!='' && b.stateshort!=''});
					if(tempData.length !=0){
						//this.address = this.t.value;
						tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
						return a.city+'-'+a.stateshort });
						this.address=tempData;
					}else if(tempData.length ==0){ 
						if(this.getPostedJobsDetails.job_locations.length !=0){
							if(this.t && this.t.length ){
								for(let i=0;i<=this.t.value.length;i++){
									this.t.removeAt(0);
									i=0;
								}
							}
							/*if(this.getPostedJobsDetails.job_locations[0]['countryshort']){
								var tempCountry = {
									country: this.getPostedJobsDetails.job_locations[0]['countryshort']
								};
								//this.places['autocomplete']['setComponentRestrictions'](tempCountry);
								//this.places['autocomplete']['componentRestrictions'] = tempCountry;
							}*/
							var tempData = this.t.value.filter(function(a,b){ return a.city!='' && b.stateshort!=''});
							if(tempData.length ==0){
								this.getPostedJobsDetails.job_locations.map((value, index) => {
									this.t.push(this.formBuilder.group({
										city: ['', Validators.required],
										state: ['', Validators.required],
										stateshort: ['', Validators.required],
										countryshort: ['', Validators.required],
										zipcode: [''],
										country: ['', Validators.required]
									}));
								});
								var tempDatas = this.getPostedJobsDetails.job_locations.map(function(a,b){ 
								a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
								return a.city+'-'+a.stateshort });
								this.address=tempDatas;
							}
						}
					}
					
				}
				if (this.childForm.value.jobInfo.min) {
					this.getPostedJobsDetails.min = this.childForm.value.jobInfo.min;
					this.childForm.patchValue({
					jobInfo : {
						min:this.childForm.value.jobInfo.min
					}
					});
				}
				if (this.childForm.value.jobInfo.max) {
					this.getPostedJobsDetails.max = this.childForm.value.jobInfo.max;
					this.childForm.patchValue({
					jobInfo : {
						max:this.childForm.value.jobInfo.max
					}
					});
				}
				this.childForm.patchValue({
					jobInfo : {
						...this.getPostedJobsDetails,
						salary: this.getPostedJobsDetails.salary.toString(),
						salary_currency: this.getPostedJobsDetails.salary_currency.toLocaleUpperCase()
					}
				});   
				   this.childForm.patchValue({
					jobInfo : {
						remote_option:this.getPostedJobsDetails['remote_option']
					}
					});
				
				/* let latlngText: string = this.getPostedJobsDetails.latlng_text;
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
				} */
			}else if(this.childForm) {
			        tempCountry = {
						country: []
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountry);
					this.places['autocomplete']['componentRestrictions'] = tempCountry;
				if (this.childForm.value.jobInfo.job_locations) {
					var tempData = this.t.value.filter(function(a,b){ return a.city!='' && b.stateshort!=''});
					if(tempData.length !=0){
						//this.address = this.t.value;
						tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
						return a.city+'-'+a.stateshort });
						this.address=tempData;
					}
					
				}
				if (this.childForm.value.jobInfo.min) {
					this.childForm.patchValue({
					jobInfo : {
						min:this.childForm.value.jobInfo.min
					}
					});
				}
				if (this.childForm.value.jobInfo.max) {
					this.childForm.patchValue({
					jobInfo : {
						max:this.childForm.value.jobInfo.max
					}
					});
				}
				
				if(this.childForm.value.jobInfo.remote ==true){
			      this.showRemoteOption = true;
				  setTimeout(()=>{
				  if(this.childForm.value.jobInfo.remote_option ==0 || this.childForm.value.jobInfo.remote_option =='0'){
				    document.getElementById("domestic").classList.add("btn-fltr-active");
				  }else if(this.childForm.value.jobInfo.remote_option ==1 || this.childForm.value.jobInfo.remote_option =='1'){
				    document.getElementById("worldwide").classList.add("btn-fltr-active");
				  }
				  });
			   }else{
			      this.showRemoteOption = false;
			   }
			}
			
		});
	}

	/**
	**	Create a new form arrtibutes
	**/
	
	createForm() {
		
		this.childForm = this.parentF.form;

		this.childForm.addControl('jobInfo', new FormGroup({
			title: new FormControl('',[Validators.required,ValidationService.StartingEmptyStringValidator,Validators.minLength(3)]),
			employer_role_type: new FormControl(''),
			entry: new FormControl(false),
			negotiable: new FormControl(false),
			type: new FormControl('', Validators.required),
			contract_duration: new FormControl(''),
			salary_type: new FormControl('', Validators.required),
			salary_currency: new FormControl('USD', Validators.required),
			salary: new FormControl(null, Validators.required),
			//city: new FormControl(null, Validators.required),
			/*state: new FormControl('', Validators.required),
			latlng: new FormControl({}, Validators.required),
			country: new FormControl('', Validators.required),
			zipcode: new FormControl(null, Validators.required), */
			job_locations : new FormArray([this.formBuilder.group({
				city:['',Validators.required],
				state: [''],
				stateshort: ['', Validators.required],
				countryshort: ['', Validators.required],
				zipcode: [''],
				country: ['', Validators.required]
			})]),
			min: new FormControl(null),
			max: new FormControl(null),
			availability: new FormControl(null, Validators.required),
			remote: new FormControl(null, Validators.required),
			//willing_to_relocate: new FormControl(null, Validators.required),
			willing_to_relocate: new FormControl(null),
			health_wellness: new FormGroup({
			  dental: new FormControl(false),
			  //vision: new FormControl(false),
			 // health: new FormControl(false),
			  disability: new FormControl(false),
			  life: new FormControl(false)
			}),
			paid_off: new FormGroup({
			  vacation_policy: new FormControl(false),
			  paid_sick_leaves: new FormControl(false),
			  paid_parental_leave: new FormControl(false),
			  maternity: new FormControl(false)
			}),
			financial_benefits: new FormGroup({
			  tuition_reimbursement: new FormControl(false),
			  corporate_plan: new FormControl(false),
			  retirement_plan: new FormControl(false),
			  performance_bonus: new FormControl(false),
			  purchase_plan: new FormControl(false)
			}),
			office_perks: new FormGroup({
			  telecommuting: new FormControl(false),
			  free_food: new FormControl(false),
			  wellness_program: new FormControl(false),
			  social_outings: new FormControl(false),
			  office_space: new FormControl(false)
			}),
			remote_option : new FormControl(null),
			description: new FormControl('', [Validators.required,Validators.minLength(100)]),
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
		if( value == '1002'){
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
	
	/*getValue(event,data){
		this.minError = false;
		this.maxError = false;
		var maxCheck = this.childForm.value.jobInfo.max;
		var minCheck = this.childForm.value.jobInfo.min;

		if(minCheck && maxCheck){
			maxCheck= maxCheck.split(':');
			minCheck= minCheck.split(':');
			var maxCheck_1=parseInt(maxCheck[0]);
			var maxCheck_2=parseInt(maxCheck[1]);
			var minCheck_1= parseInt(minCheck[0]);
			var minCheck_2= parseInt(minCheck[1]);
			if(minCheck_1>maxCheck_1){
				this.minError = true;
			}else if(minCheck_2>maxCheck_2){
				this.maxError = true;
			}
			
		}
		
	}*/
	
	getValue(event,data){
		console.log('data',data)
		if(data == 'min'){
			var amazingTimePicker = this.atp.open({
				time : this.min, 
				changeToMinutes: true,
			});
		}if(data == 'max'){
			var amazingTimePicker = this.atp.open({
				time : this.max, 
				changeToMinutes: true,
			});
		}
		
        amazingTimePicker.afterClose().subscribe(time  => {
			var splitTime = time.split(':');
			if( time && data =='min' ){
			this.childForm.get('jobInfo.max').setValidators([Validators.required]);
			this.childForm.get('jobInfo.max').updateValueAndValidity();
				this.min=time;
				this.childForm.get('jobInfo').controls['min'].setValue(this.min) 
			}if(time && data =='max'){
				this.childForm.get('jobInfo.min').setValidators([Validators.required]);
				this.childForm.get('jobInfo.min').updateValueAndValidity();
				this.max=time;
				this.childForm.get('jobInfo').controls['max'].setValue(this.max)
			}

		this.minError = false;
		this.maxError = false;
		var maxCheck = this.childForm.value.jobInfo.max;
		var minCheck = this.childForm.value.jobInfo.min;
		if(minCheck !=null && maxCheck ==null){
			this.maxtimeError=true;
		}else if(maxCheck !=null && minCheck ==null){
			this.mintimeError=true;
		}else{
			this.mintimeError=false;
			this.maxtimeError=false;
		}
		
		if(minCheck && maxCheck){
			maxCheck= maxCheck.split(':');
			minCheck= minCheck.split(':');
			var maxCheck_1=parseInt(maxCheck[0]);
			var maxCheck_2=parseInt(maxCheck[1]);
			var minCheck_1= parseInt(minCheck[0]);
			var minCheck_2= parseInt(minCheck[1]);
			if(minCheck_1>12 && maxCheck_1>12){
				//minCheck_1=minCheck_1-12;
				if((minCheck_2>maxCheck_2) && (minCheck_1==maxCheck_1)){
				this.minError = true;
			}else if(minCheck_1>maxCheck_1){
				this.minError = true;
			}else if( (maxCheck_1==minCheck_1) && (maxCheck_2==minCheck_2) ){
					this.minError = true;
			}
			}else if((maxCheck_1==minCheck_1) && (maxCheck_2==minCheck_2) ){
				this.minError = true;
			}else{
			if(minCheck_1>maxCheck_1 && minCheck_1<12){
				this.minError = true;
			}else if((minCheck_2>maxCheck_2) && (minCheck_1==maxCheck_1)){
				this.maxError = true;

			}
			
		}
		}
	});
		
	}
	
		
	get t() {
		return this.f.job_locations as FormArray;
	}
  
	/**
	**	To add the preferred_location
	**/
	onDuplicate = () => {
      this.t.push(this.formBuilder.group({
        city: ['', Validators.required],
        state: [''],
        stateshort: ['', Validators.required],
        countryshort: ['', Validators.required],
        zipcode: [''],
        country: ['', Validators.required]
      }));
	}
	
	/**
	**	To remove the preferred_location
	**/
	
	onRemove = (index) => {
		let removedValue = this.t.value[index];
	   this.errEuro=false;
		if (index == 0 && this.t.length == 1) {
		  this.t.removeAt(0);
		  this.t.push(this.formBuilder.group({
			city: ['', Validators.required],
			state: [''],
			stateshort: ['', Validators.required],
			countryshort: ['', Validators.required],
			zipcode: [''],
			country: ['', Validators.required]
		  }));
		  this.address=[];
		  var tempCountry = {
			country: []
		};
		this.filterJL=[];
		//this.checkJL=false;
		this.places['autocomplete']['setComponentRestrictions'](tempCountry);
		this.places['autocomplete']['componentRestrictions'] = tempCountry;
		} else {
		  this.t.removeAt(index);
		  var tempData =[];
			if(this.t.value){
				 tempData = this.t.value.filter(function(a,b){ return a.city!=''||a.country!=''});
			}
		  tempData = tempData.map(function(a,b){ 
		a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
		return a.city+'-'+a.stateshort });
		this.address=tempData;
		}
	}
	
	/**
	**	handle the address change
	**/
	
	/**
	**	handle the address change
	**/
	
	handleAddressChange = (event) => {
	   var EUCountry =["AT","LI","BE","LT",
							"LU","DK","MT","EE","FI","NO","CZ",
							"FR","PL","DE","PT","GR","SK","HU","NL",
							"SI","IS","ES","IT","SE","LV","CH","IE"
							];
		var valLen=this.places['autocomplete']['componentRestrictions']['country'].length;
		
		const address = this.sharedService.fromGooglePlace(event);
		if(event.geometry){
			var tempData =[];
			if(this.t.value){
				 tempData = this.t.value.filter(function(a,b){ return a.city!='' && b.stateshort!=''});
			}
			
			var datas:any = {
			city: address.city ? address.city : event.formatted_address,
			state: address.state,
			stateshort: address.stateShort,
			countryshort: address.countryShort,
			zipcode: address.zipcode,
			country: address.country
			};
			
			this.chipsInput.nativeElement.value='';
			if(address['city'] !=null &&address['stateShort'] !=null &&address['country'] !=null &&
				address['city'] !=undefined  &&address['stateShort'] !=undefined  &&address['country'] !=undefined ){
				var a:HTMLElement=document.getElementById('jobLocationsErroe');
				a.style.display = "none"; 
				if(tempData.filter(function(a,b){ return a.city == datas.city  && a.country ==datas.country }).length==0){
					if(tempData.length !=0){
					    
						this.onDuplicate();
					}
					
					if(this.route.snapshot.queryParamMap.get('id') !=null && valLen===0 && EUCountry.includes(datas.countryshort)){
					this.errEuro=false;
					tempData.push(datas);
					
					this.t.patchValue(tempData);
					tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
					return a.city+'-'+a.stateshort });
					this.address=tempData;
					var tempCountry = {
						country: []
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountry);
					this.places['autocomplete']['componentRestrictions'] = tempCountry;
					}else if(this.route.snapshot.queryParamMap.get('id') !=null && valLen !==0 && !EUCountry.includes(datas.countryshort)){
					this.errEuro=false;
					tempData.push(datas);
					
					this.t.patchValue(tempData);
					tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
					return a.city+'-'+a.stateshort });
					this.address=tempData;
					var tempCountry1 = {
						country: datas.countryshort
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountry1);
					this.places['autocomplete']['componentRestrictions'] = tempCountry1;
					}else if(this.route.snapshot.queryParamMap.get('id') !=null && valLen ==0 && !EUCountry.includes(datas.countryshort) && (tempData.length ==0 || tempData ==undefined)){
					this.errEuro=false;
					tempData.push(datas);
					
					this.t.patchValue(tempData);
					tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
					return a.city+'-'+a.stateshort });
					this.address=tempData;
					var tempCountry11 = {
						country: datas.countryshort
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountry11);
					this.places['autocomplete']['componentRestrictions'] = tempCountry11;
					}else if(this.route.snapshot.queryParamMap.get('id') ==null && valLen ==0 && EUCountry.includes(datas.countryshort)){
					this.errEuro=false;
					tempData.push(datas);
					
					this.t.patchValue(tempData);
					tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
					return a.city+'-'+a.stateshort });
					this.address=tempData;
					var tempCountry2 = {
						country: []
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountry2);
					this.places['autocomplete']['componentRestrictions'] = tempCountry2;
					}else if(this.route.snapshot.queryParamMap.get('id') ==null && valLen ==0 && !EUCountry.includes(datas.countryshort) && (tempData.length ==0 || tempData ==undefined)){
					this.errEuro=false;
					tempData.push(datas);
					
					this.t.patchValue(tempData);
					tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
					return a.city+'-'+a.stateshort });
					this.address=tempData;
					var tempCountr = {
						country: datas.countryshort
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountr);
					this.places['autocomplete']['componentRestrictions'] = tempCountr;
					}else if(this.route.snapshot.queryParamMap.get('id') ==null && valLen !=0){
					this.errEuro=false;
					tempData.push(datas);
					this.t.patchValue(tempData);
					tempData = tempData.map(function(a,b){ 
						a.city = a.city.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase();});
					return a.city+'-'+a.stateshort });
					this.address=tempData;
					var tempCountry3 = {
						country: datas.countryshort
					};
					this.places['autocomplete']['setComponentRestrictions'](tempCountry3);
					this.places['autocomplete']['componentRestrictions'] = tempCountry3;
					}else{
					this.t.removeAt(this.t.value.length-1);
					this.errEuro=true;
					
					}
				}
			}
		}
	};
	
	changeRemote(e){
	   if(e == 'yes'){
	    this.showRemoteOption = true;
		this.childForm.get('jobInfo.remote_option').setValidators([Validators.required]);
		 this.childForm.get('jobInfo.remote_option').updateValueAndValidity();
	   }else{
		   this.showRemoteOption = false;
		   this.childForm.get('jobInfo.remote_option').setValidators(null);
			this.childForm.get('jobInfo.remote_option').updateValueAndValidity();
		   this.childForm.patchValue({
			  jobInfo: {
				remote_option: null
			  }
			});
		 }
	
	}
	
	remoteOptions(value,e){

	 var temp = e.target.className.split(' ');
	 var tempID = e.target.id;

	     if(tempID=='domestic'){
	     e.target.className = e.target.className+' btn-fltr-active';
		 document.getElementById("worldwide").classList.remove("btn-fltr-active");
	     this.childForm.patchValue({
		  jobInfo: {
			remote_option: value
		  }
		});
		}else{
		 e.target.className = e.target.className+' btn-fltr-active';
		 document.getElementById("domestic").classList.remove("btn-fltr-active");
	     this.childForm.patchValue({
		  jobInfo: {
			remote_option: value
		  }
		});
		}
	}
}
