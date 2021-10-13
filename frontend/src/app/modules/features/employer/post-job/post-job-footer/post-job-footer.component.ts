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
	@Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
	@Output() onEnableJobPreviewModal: EventEmitter<boolean> = new EventEmitter();
	@Output() postJob: EventEmitter<any> = new EventEmitter();
	@Input() postJobForm: FormGroup;

	public btnType: string;
	public isOpenedJobPreviewModal: any;

	constructor() { }

	ngOnInit(): void {
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
		this.btnType = 'next';
		this.onTabChange();
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
		if(this.btnType == 'next' && this.currentTabInfo.tabNumber==1&&this.postJobForm.controls.jobInfo.valid){
			let nextTabProgressor = {} as tabInfo;
			nextTabProgressor.tabNumber = this.currentTabInfo.tabNumber + 1;
			nextTabProgressor.tabName = this.onGetTabName(nextTabProgressor.tabNumber);
			this.onTabChangeEvent.emit(nextTabProgressor);
		}else if(this.btnType == 'next' && this.currentTabInfo.tabNumber==2&&this.postJobForm.controls.requirement.valid){
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
		if(this.postJobForm.valid || this.postJobForm.controls.otherPref.valid ) {
			this.onEnableJobPreviewModal.emit(status);
		}
	}

}
