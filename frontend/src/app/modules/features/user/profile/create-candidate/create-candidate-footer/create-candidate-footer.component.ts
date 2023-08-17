import { Component, EventEmitter, Input, OnInit, Output,ChangeDetectorRef} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup,Validators } from '@angular/forms';
import { tabInfo, tabProgressor } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';

@Component({
  selector: 'app-create-candidate-footer',
  templateUrl: './create-candidate-footer.component.html',
  styleUrls: ['./create-candidate-footer.component.css']
})
export class CreateCandidateFooterComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	@Input() currentTabInfo: tabInfo;
	@Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
	@Output() createCandidate: EventEmitter<any> = new EventEmitter();
	@Output() onEnableJobPreviewModal: EventEmitter<boolean> = new EventEmitter();
	@Input() createCandidateForm: UntypedFormGroup;
	public savedUserDetails: any;
	public nextBtnValidate: boolean =false ;
	public userInfo: any;
	public index:any;

	tabInfos: any[];
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}
	public btnType: string;
	isOpenedRegisterReviewModal: any;
	public requestParams: any;
	constructor(
		private userSharedService: UserSharedService,
		private SharedAPIService: SharedApiService,
		private dataService: DataService,
		private ref:ChangeDetectorRef
    ) { }
	
	/**
	**	Initialize the footer section
	**/
	
	validateInfo = 0;
	ngOnInit(): void {
		this.userSharedService.getUserProfileDetails().subscribe(
		  response => {
			this.userInfo = response;
			if(this.userInfo && this.userInfo.id && this.validateInfo == 0) {
			  this.validateInfo++;
			}
		  }
		)
		this.dataService.getTabInfo().subscribe(
		  response => {
			if (response && Array.isArray(response) && response.length) {
			  this.tabInfos = response;
			}
		  }
		)
	}
	
	/**
	**	click the previous section
	**/
	
	onPrevious = () => {
		this.btnType = 'prev';
		this.onTabChange();
	}
	
	/**
	To scroll to error
	**/
	scrollTo(el: Element): void {
	   if (el) {
		  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
	   }
    }

	
	/**
	**	click the next section
	**/
	
	onNext = () => {
	    this.createCandidateForm.markAllAsTouched();
		this.btnType = 'next';
		
		if(this.currentTabInfo.tabNumber == 1 ){
			for (const key of Object.keys(this.createCandidateForm.controls.personalDetails['controls'])) {
			  if(this.createCandidateForm.controls.personalDetails['controls'][key].invalid) {
				const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
				if(key==='clients_worked'){
				var a:HTMLElement = document.getElementById('clients_works');
				a.focus();
				}else if(key==='language_known'){
				var b:HTMLElement= document.querySelector('[formcontrolname="language"]');
				this.scrollTo(b);
				}else if(key==='visa_type'){
				  var v:HTMLElement = document.getElementById('visaType');
				  v.focus();
				}
				
				invalidControl.focus();
				break;
			 }
		  }
		  if(this.createCandidateForm.controls.personalDetails.valid || this.checkref() ===true){
		  this.onTabChange();
		  }
		}
		else if(this.currentTabInfo.tabNumber == 2){
		for (const key of Object.keys(this.createCandidateForm.controls.educationExp['controls'])) {
			  if(this.createCandidateForm.controls.educationExp['controls'][key].invalid) {
			  if(key==='domains_worked'){
			    var b:HTMLElement=document.querySelector('.ngx-select__search');
			    b.focus();
				}
				if(key==='education_qualification'){
			    var edu:HTMLElement=document.querySelector('[formcontrolname="degree"]');
			    edu.focus();
				}
			  
				const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
				invalidControl.focus();
				break;
			 }
		  }
		  if(this.createCandidateForm.controls.educationExp.valid && this.createCandidateForm.value.personalDetails.entry ===true){
		  this.onTabChange();
		  }else if(this.createCandidateForm.controls.educationExp.valid && this.createCandidateForm.value.personalDetails.entry ===false && (this.createCandidateForm.controls.educationExp.value.sap_experience <= this.createCandidateForm.controls.educationExp.value.experience) && this.createCandidateForm.controls.educationExp.value.experience !==0 && this.createCandidateForm.controls.educationExp.value.sap_experience !==0){
		  this.onTabChange();
		  }else if(this.createCandidateForm.value.personalDetails.entry ===false && (this.createCandidateForm.controls.educationExp.value.sap_experience > this.createCandidateForm.controls.educationExp.value.experience) || this.createCandidateForm.controls.educationExp.value.experience ===0 && this.createCandidateForm.controls.educationExp.value.sap_experience ===0){
		  var b:HTMLElement= document.querySelector('[formcontrolname="experience"]');
			   b.focus();
				this.scrollTo(b);
		  }
		}else if(this.currentTabInfo.tabNumber == 3){
		if(this.createCandidateForm.value.personalDetails['entry']==false){
			for(let i=0;i<this.createCandidateForm.value.skillSet['hands_on_experience']['length'];i++){	
			if((!this.createCandidateForm.value.skillSet['hands_on_experience'][i]['skill_id'] || !this.createCandidateForm.value.skillSet['hands_on_experience'][i]['experience'] || !this.createCandidateForm.value.skillSet['hands_on_experience'][i]['exp_type'])){	
		if( isNaN(this.createCandidateForm.value.skillSet['hands_on_experience'][i]['skill_id'])==true ){
		this.createCandidateForm.controls.skillSet['controls']['hands_on_experience'].controls[i].controls.skill_id.setValue('');
			}
			if(this.createCandidateForm.value.skillSet['new_skills']['length']==0){	
				this.createCandidateForm.controls.skillSet['controls']['hands_on_experience'].controls[i].controls.skill_id.setValidators(Validators.required);
				this.createCandidateForm.controls.skillSet['controls']['hands_on_experience'].controls[i].controls.skill_id.updateValueAndValidity();
				this.createCandidateForm.controls.skillSet['controls']['hands_on_experience'].controls[i].controls.experience.setValidators(Validators.required);
				this.createCandidateForm.controls.skillSet['controls']['hands_on_experience'].controls[i].controls.experience.updateValueAndValidity();
	       }
				}
			}
		}
		  for (const key of Object.keys(this.createCandidateForm.controls.skillSet['controls'])) {
			  if(this.createCandidateForm.controls.skillSet['controls'][key].invalid) {
			   console.log(key);
			    if(key==='programming_skills'){
				
				  var a:HTMLElement = document.getElementById('pskills');
				  a.focus();
				
				}else if(key==='hands_on_experience'){
				  var e:HTMLElement = document.querySelector('[formcontrolname="experience"]');
				  e.focus();
				}
				const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
				invalidControl.focus();
				break;
			 }
		  }
		  if(this.createCandidateForm.controls.skillSet.valid){
		  this.onTabChange();
		  }
		}
		//this.onTabChange();
	}
	
	/**
	**	to detect the chnages in the tabs change
	**/
	
	onTabChange = () => {
    if(this.btnType == 'next') {
		if(this.currentTabInfo.tabNumber == 1 ){
		if(this.createCandidateForm.value.personalDetails.authorized_country_select){
			if(this.createCandidateForm.value.personalDetails.authorized_country){
				var value = this.createCandidateForm.value.personalDetails.authorized_country_select
				for(let i=0;i<value.length;i++){
					var id = value[i];
					 this.createCandidateForm.value.personalDetails.authorized_country.push(id);
				}
				var val= this.createCandidateForm.value.personalDetails.authorized_country;
				val = val.filter((a, b) => val.indexOf(a) === b);
				this.createCandidateForm.patchValue({
					personalDetails:{
						authorized_country:val
					}
				})
				//this.createCandidateForm.value.personalDetails.authorized_country =val;
				
			}else{
				var value = this.createCandidateForm.value.personalDetails.authorized_country_select
				this.createCandidateForm.patchValue({
					personalDetails:{
						authorized_country:value
					}
				})

			}
		}
		if(this.createCandidateForm.value.jobPref !=null &&this.createCandidateForm.value.jobPref !=undefined  ){
			if(this.createCandidateForm.value.jobPref.preferred_countries){
			var intersection = this.createCandidateForm.value.personalDetails.authorized_country.filter(element => this.createCandidateForm.value.jobPref.preferred_countries.includes(element));
			this.createCandidateForm.patchValue({
				preferred_countries:{
						authorized_country:intersection
					}
				})
			}}}
		  let nextTabProgressor = {} as tabInfo;
		  nextTabProgressor.tabNumber = this.currentTabInfo.tabNumber + 1;
		  nextTabProgressor.tabName = this.onGetTabName(nextTabProgressor.tabNumber);
		  this.onTabChangeEvent.emit(nextTabProgressor);
		}
		if(this.btnType == 'prev') {
		  let prevTabProgressor = {} as tabInfo;
		  prevTabProgressor.tabNumber = this.currentTabInfo.tabNumber - 1;
		  prevTabProgressor.tabName = this.onGetTabName(prevTabProgressor.tabNumber);
		  this.onTabChangeEvent.emit(prevTabProgressor);
		}
	}
	
	/**
	**	Tabs section
	**/
	
	onGetTabName = (tabNumber: number) => {
		let tabName: string = 'Personal Detail';
		switch (tabNumber) {
		  case 1:
			tabName = 'Personal Detail';
			break;
		  case 2:
			tabName = 'Education Experience';
			break;
		  case 3:
			tabName = 'Skillsets';
			break;
		  case 4:
			tabName = 'Job Preference';
			break;
		  default:
			break;
		}
		return tabName;
	}
	
  	/**
	**	To open the review popup
	**/
	
	onToggleRegisterReview = (status) => {
	if(this.currentTabInfo.tabNumber == 4){
	    this.createCandidateForm.markAllAsTouched();
		var a:HTMLElement=document.getElementById('errjobtype');
		if(this.createCandidateForm.value.jobPref.job_type==null){
		  a.style.display = "block";
		  this.scrollTo(a);
		}else{
			a.style.display = "none";
		}
		for (const key of Object.keys(this.createCandidateForm.controls.jobPref['controls'])) {
			  if(this.createCandidateForm.controls.jobPref['controls'][key].invalid) {
				const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
				invalidControl.focus();
				break;
			 }
		  }
		}
		if(this.checValue()){
			if(this.createCandidateForm.value.jobPref.availability !='null' && this.createCandidateForm.value.jobPref.travel !='null' && this.createCandidateForm.valid && this.createCandidateForm.value.educationExp.experience >= this.createCandidateForm.value.educationExp.sap_experience ) {
				if(this.createCandidateForm.value.personalDetails.authorized_country_select){
				
					if(this.createCandidateForm.value.personalDetails.authorized_country){
						this.requestParams = {'Check Authorized Country Aftre':'footer','Check Before concat authorized_country':'footer','time':new Date().toLocaleString()};
						this.SharedAPIService.onSaveLogs(this.requestParams);
						var val= this.createCandidateForm.value.personalDetails.authorized_country.concat(this.createCandidateForm.value.personalDetails.authorized_country_select);
						val= [...new Set(val)];
						
						this.createCandidateForm.patchValue({personalDetails:{authorized_country:val}})
						
					}else{
						
						var value = this.createCandidateForm.value.personalDetails.authorized_country_select
						this.createCandidateForm.patchValue({personalDetails:{authorized_country:value}	})
						
					}
				}
				this.onEnableJobPreviewModal.emit(status);
				
			}else{console.log('errors')}
		}
	}
	
	/**
	**	To check the optional fields
	**/
	
	checValue(){
	   
		if(this.createCandidateForm.value.personalDetails['entry']==false){
			for(let i=0;i<this.createCandidateForm.value.skillSet['hands_on_experience']['length'];i++){
			this.index=i;
			
			if((!this.createCandidateForm.value.skillSet['hands_on_experience'][this.index]['skill_id'] || !this.createCandidateForm.value.skillSet['hands_on_experience'][this.index]['experience'] || !this.createCandidateForm.value.skillSet['hands_on_experience'][this.index]['exp_type']) && this.createCandidateForm.value.skillSet['new_skills'].length===0){
					return false;
			}
		}
		
			if( !this.createCandidateForm.value.personalDetails['clients_worked'] || !this.createCandidateForm.value.personalDetails['clients_worked']['length']|| this.createCandidateForm.value.personalDetails['clients_worked']['length']==0){
				return false;
			}if( !this.createCandidateForm.value.educationExp['domains_worked'] || !this.createCandidateForm.value.educationExp['domains_worked']['length']|| this.createCandidateForm.value.educationExp['domains_worked']['length']==0){
				return false;
			}if( !this.createCandidateForm.value.educationExp['current_employer_role'] || this.createCandidateForm.value.educationExp['current_employer_role'].trim()==''){
				return false;
			}if( !this.createCandidateForm.value.educationExp['sap_experience'] || this.createCandidateForm.value.educationExp['sap_experience']==''){
				return false;
			}if( !this.createCandidateForm.value.educationExp['experience'] || this.createCandidateForm.value.educationExp['experience']==''){
				return false;
			}if( !this.createCandidateForm.value.educationExp['current_employer'] || this.createCandidateForm.value.educationExp['current_employer'].trim()==''){
				return false;
			}/*if( !this.createCandidateForm.value.skillSet['programming_skills'] || !this.createCandidateForm.value.skillSet['programming_skills']['length']|| this.createCandidateForm.value.skillSet['programming_skills']['length']==0){
				return false;
			}*//*if( !this.createCandidateForm.value.skillSet['other_skills'] || !this.createCandidateForm.value.skillSet['other_skills']['length']|| this.createCandidateForm.value.skillSet['other_skills']['length']==0){
				return false;
			}*/
		}
		return true;
	}
	
	/**
	**	To get the errors of the form
	**/
	
	getErrors = (formGroup: UntypedFormGroup, errors: any = {}) => {
		Object.keys(formGroup.controls).forEach(field => {
		  const control = formGroup.get(field);
		  if (control instanceof UntypedFormControl) {
			errors[field] = control.errors;
		  } else if (control instanceof UntypedFormGroup) {
			errors[field] = this.getErrors(control);
		  }
		});
		return errors;
	}

/**
	**	To check reference email validation
	**/
	
	
checkref(){
	if(this.createCandidateForm.controls.personalDetails.value.reference[0].email == ''){
		return true;
	}
	else if(this.createCandidateForm.controls.personalDetails.value.reference[0].email !==null){
		var validRegex =/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		var em = this.createCandidateForm.controls.personalDetails.value.reference[0].email;
		if(!em.match(validRegex)){
			return false;
		}
		}
}

}
