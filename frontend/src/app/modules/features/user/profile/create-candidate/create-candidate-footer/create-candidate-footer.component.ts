import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
	@Input() createCandidateForm: FormGroup;
	public savedUserDetails: any;
	public nextBtnValidate: boolean =false ;
	public userInfo: any;

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
		private dataService: DataService
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
	**	click the next section
	**/
	
	onNext = () => {
		this.btnType = 'next';
		this.onTabChange();
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
		if(this.checValue()){
			if(this.createCandidateForm.value.jobPref.availability !='null' && this.createCandidateForm.value.jobPref.travel !='null' && this.createCandidateForm.valid && this.createCandidateForm.value.educationExp.experience >=this.createCandidateForm.value.educationExp.sap_experience ) {
				
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
				
			}
		}
	}
	
	/**
	**	To check the optional fields
	**/
	
	checValue(){
		if(this.createCandidateForm.value.personalDetails['entry']==false){
			if( !this.createCandidateForm.value.personalDetails['clients_worked'] || !this.createCandidateForm.value.personalDetails['clients_worked']['length']|| this.createCandidateForm.value.personalDetails['clients_worked']['length']==0){
				return false;
			}if( !this.createCandidateForm.value.educationExp['domains_worked'] || !this.createCandidateForm.value.educationExp['domains_worked']['length']|| this.createCandidateForm.value.educationExp['domains_worked']['length']==0){
				return false;
			}if( !this.createCandidateForm.value.educationExp['current_employer_role'] || this.createCandidateForm.value.educationExp['current_employer_role']==''){
				return false;
			}if( !this.createCandidateForm.value.educationExp['sap_experience'] || this.createCandidateForm.value.educationExp['sap_experience']==''){
				return false;
			}if( !this.createCandidateForm.value.educationExp['experience'] || this.createCandidateForm.value.educationExp['experience']==''){
				return false;
			}if( !this.createCandidateForm.value.educationExp['current_employer'] || this.createCandidateForm.value.educationExp['current_employer']==''){
				return false;
			}if( !this.createCandidateForm.value.skillSet['programming_skills'] || !this.createCandidateForm.value.skillSet['programming_skills']['length']|| this.createCandidateForm.value.skillSet['programming_skills']['length']==0){
				return false;
			}if( !this.createCandidateForm.value.skillSet['other_skills'] || !this.createCandidateForm.value.skillSet['other_skills']['length']|| this.createCandidateForm.value.skillSet['other_skills']['length']==0){
				return false;
			}
		}
		return true;
	}
	
	/**
	**	To get the errors of the form
	**/
	
	getErrors = (formGroup: FormGroup, errors: any = {}) => {
		Object.keys(formGroup.controls).forEach(field => {
		  const control = formGroup.get(field);
		  if (control instanceof FormControl) {
			errors[field] = control.errors;
		  } else if (control instanceof FormGroup) {
			errors[field] = this.getErrors(control);
		  }
		});
		return errors;
	}


}
