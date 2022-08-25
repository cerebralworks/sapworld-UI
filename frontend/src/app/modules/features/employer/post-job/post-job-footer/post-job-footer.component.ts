import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-post-job-footer',
  templateUrl: './post-job-footer.component.html',
  styleUrls: ['./post-job-footer.component.css']
})
export class PostJobFooterComponent implements OnInit {


	@Input() currentTabInfo: tabInfo;
	@Input() isEdit : any;
	@Input() isCopy : any;
	@Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
	@Output() onEnableJobPreviewModal: EventEmitter<boolean> = new EventEmitter();
	@Output() postJob: EventEmitter<any> = new EventEmitter();
	@Input() postJobForm: FormGroup;

	public btnType: string;
	public isOpenedJobPreviewModal: any;
	public timeError: boolean = false;
	public sapExpError: boolean = false;
	public formgroup : FormGroup;

	constructor() { }

	ngOnInit(): void {
	
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
	**	To click the sapExprience value
	**/
	checksapExprience(){
	this.sapExpError=false;
		var maxExp = this.postJobForm.controls.requirement.value.experience;
		var minExp = this.postJobForm.controls.requirement.value.sap_experience;
		var entryJob= this.postJobForm.controls.jobInfo.value.entry;
		if( ((maxExp < minExp) || (maxExp==0 || minExp==0)) && entryJob == false){
			this.sapExpError=true;
			
		}
	}
	
	/**
	**	To click the Timpicker value
	**/
	
	checkWrkTime(){
	this.timeError=false;
		var maxCheck = this.postJobForm.controls.jobInfo.value.max;
		var minCheck = this.postJobForm.controls.jobInfo.value.min;
		if(minCheck !=null && maxCheck !=null){
			maxCheck= maxCheck.split(':');
			minCheck= minCheck.split(':');
			var maxCheck_1=parseInt(maxCheck[0]);
			var maxCheck_2=parseInt(maxCheck[1]);
			var minCheck_1= parseInt(minCheck[0]);
			var minCheck_2= parseInt(minCheck[1]);
			if(minCheck_1>12 && maxCheck_1>12){
				if((minCheck_2>maxCheck_2) && (minCheck_1==maxCheck_1)){
				this.timeError=true;
			}else if(minCheck_1>maxCheck_1){
				this.timeError = true;
			}else if( (maxCheck_1==minCheck_1) && (maxCheck_2==minCheck_2) ){
					this.timeError = true;
			}
			}else if( (maxCheck_1==minCheck_1) && (maxCheck_2==minCheck_2) ){
				this.timeError = true;
			}else{
			if(minCheck_1>maxCheck_1 && minCheck_1<12){
				this.timeError = true;
			}else if((minCheck_2>maxCheck_2) && (minCheck_1==maxCheck_1)){
				this.timeError = true;

			}
			
		}
	}
	
	
	}
	/**
	**	To click the pervoius Button
	**/
	
	onPrevious = () => {
		
		this.btnType = 'prev';
		this.onTabChange();
	}
	
	/**
	**	To click the next Button
	**/
	
	onNext = () => {
	if(this.currentTabInfo.tabNumber==1){
	this.checkWrkTime();
		if(this.postJobForm.controls.jobInfo.invalid === true && this.timeError ===false){
			this.postJobForm.controls.jobInfo.markAllAsTouched();
			var a:HTMLElement=document.getElementById('jobLocationsErroe');
			a.style.display = "block";
			if( !this.postJobForm.controls.jobInfo['controls']['job_locations'].valid == true){
				a.style.display = "block";
			}else{
				a.style.display = "none";
			}
			this.formgroup = this.postJobForm.get('jobInfo') as FormGroup;
			for (const key of Object.keys(this.formgroup.controls) ){
				  if (this.formgroup.controls[key].invalid){
					  if(key =='job_locations'){
							const invalidControl: HTMLElement = document.querySelector('[id="preferredLocation"]');
							this.scrollTo(invalidControl);
							invalidControl.focus();
							break;
						}else if(key =='min' || key =='max'){
							const invalidControl:HTMLElement=document.getElementById('timeError');
							this.scrollTo(invalidControl);
							const invalidControlTime: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
							invalidControlTime.focus();
						}else{
							const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
							this.scrollTo(invalidControl);
							invalidControl.focus();
							break;
							}
					}
				}
		}else if(this.timeError === true){
			//const invalidControl: HTMLElement = document.querySelector('[formcontrolname="min"]');
			const invalidControl:HTMLElement=document.getElementById('timeError');
			this.scrollTo(invalidControl);
			invalidControl.focus();
		}else{
			this.btnType = 'next';
			this.onTabChange();
		}
	}else if(this.currentTabInfo.tabNumber==2){
	this.checksapExprience();
		if(this.postJobForm.controls.requirement.invalid === true && this.sapExpError === false){
			this.postJobForm.controls.requirement.markAllAsTouched();
			this.formgroup = this.postJobForm.get('requirement') as FormGroup;
			for (const key of Object.keys(this.formgroup.controls) ){
				  if (this.formgroup.controls[key].invalid){
				  if(key =='optinal_skills'){
						const invalidControl: HTMLElement = document.querySelector('[id="optinal_skills"]');
						this.scrollTo(invalidControl);
						invalidControl.focus();
						break;
					}else if(key =='domain'){
						const invalidControl: HTMLElement = document.querySelector('[class="ngx-select__search form-control ng-star-inserted"]');
						this.scrollTo(invalidControl);
						invalidControl.focus();
						break;
					}else if(key =='hands_on_experience'){
						const invalidControl: HTMLElement = document.querySelector('[class="form-control ng-pristine ng-invalid ng-touched"]');
						this.scrollTo(invalidControl);
						invalidControl.focus();
						break;
					}else{
						const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
						this.scrollTo(invalidControl);
						invalidControl.focus();
						break;
						}
					}
				}
		}else if(this.sapExpError === true){
			const invalidControl: HTMLElement = document.querySelector('[formcontrolname="experience"]');
			this.scrollTo(invalidControl);
			invalidControl.focus();
		}else{
			this.btnType = 'next';
			this.onTabChange();
		}
	}else if(this.currentTabInfo.tabNumber==3){
		if(this.postJobForm.controls.otherPref.invalid === true){
			this.postJobForm.controls.otherPref.markAllAsTouched();
			this.formgroup = this.postJobForm.get('otherPref') as FormGroup;
			for (const key of Object.keys(this.formgroup.controls) ){
				  if (this.formgroup.controls[key].invalid){
						const invalidControl: HTMLElement = document.querySelector('[class="ngx-select__search form-control ng-star-inserted"]');
						this.scrollTo(invalidControl);
						invalidControl.focus();
						break;
					}
				}
		}else{
			this.btnType = 'next';
			this.onTabChange();
		}
	}
	}

    // this function removes single error
	removeError(control: AbstractControl, error: string) {
		const err = control.errors; // get control errors
		if (err) {
			delete err[error]; // delete your own error
			if (!Object.keys(err).length) { // if no errors left
				control.setErrors(null); // set control errors to null making it VALID
				control.updateValueAndValidity();
			} else {
				control.setErrors(err); // controls got other errors so set them back
				control.updateValueAndValidity();
			}
		}
	}

	// this function adds a single error
	addError(control: AbstractControl, error: string) {
		let errorToSet = {};
		errorToSet[error] = true;
		control.setErrors({...control.errors, ...errorToSet});
	}
	
	/**
	**	To check the table information
	**/
	onTabChange = () => {

		if( this.timeError === false && this.btnType == 'next' && this.currentTabInfo.tabNumber==1&&this.postJobForm.controls.jobInfo.valid ){
			let nextTabProgressor = {} as tabInfo;
			nextTabProgressor.tabNumber = this.currentTabInfo.tabNumber + 1;
			nextTabProgressor.tabName = this.onGetTabName(nextTabProgressor.tabNumber);
			this.onTabChangeEvent.emit(nextTabProgressor);
		}else if(this.sapExpError == false && this.btnType == 'next' && this.currentTabInfo.tabNumber==2&&this.postJobForm.controls.requirement.valid){
			let nextTabProgressor = {} as tabInfo;
			nextTabProgressor.tabNumber = this.currentTabInfo.tabNumber + 1;
			nextTabProgressor.tabName = this.onGetTabName(nextTabProgressor.tabNumber);
			this.onTabChangeEvent.emit(nextTabProgressor);
		}
		if(this.btnType == 'next' && this.postJobForm.valid) {
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
	**	To get the error details
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
	
	/**
	**	To get the tab name 
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
	**	To enable the job preview model view
	**/
	
	onToggleJobPreviewModal = (status) => {
	var a:HTMLElement=document.getElementById('errorScreeningProcess');
	if(this.postJobForm.value.screeningProcess.screening_process.length == 0){
		a.style.display = "block";
		 this.scrollTo(a);
	}
		if( (this.postJobForm.valid || this.postJobForm.controls.otherPref.valid) &&
		this.postJobForm.value.screeningProcess.screening_process.length != 0 ){
			this.onEnableJobPreviewModal.emit(status);
		}
	}

}
