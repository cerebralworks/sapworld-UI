import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-preview-modal',
  templateUrl: './job-preview.component.html',
  styleUrls: ['./job-preview.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class JobPreviewModalComponent implements OnInit {
	
	/**
	**	To open the job preview model 
	**/
	
	@Input() toggleJobPreviewModal: boolean;
	@Input() jobInfo: any;
	@Output() onEvent = new EventEmitter<boolean>();

	public mbRef: NgbModalRef;
	public criteriaModalRef: NgbModalRef;
	public jobPreviewModalRef: NgbModalRef;
	public jdSub: Subscription;
	public industries: any;
	public profileInfo: any;
	public getPostedJobsDetails: JobPosting;
	public industriesItems: any[] = [];
	public skillItems: any[] = [];
	public jobId:string;

	@ViewChild("jobPreviewModal", { static: false }) jobPreviewModal: TemplateRef<any>;

	constructor(
		private modalService: NgbModal,
		public router: Router,
		private parentF: FormGroupDirective,
		private formBuilder: UntypedFormBuilder,
		private employerService: EmployerService,
		public sharedService: SharedService,
		public utilsHelperService: UtilsHelperService,
		public route: ActivatedRoute
	  ) { }
	
	/**
	**	To triggers the page loads
	**/
	 
	ngOnInit(): void {
		this.jobId = this.route.snapshot.queryParamMap.get('id');
		this.onGetProfile();
	}
	
	/**
	**	To open the job-preview component in popup view
	**/
	 
	ngAfterViewInit(): void {
		if (this.toggleJobPreviewModal) {
			this.jobPreviewModalRef = this.modalService.open(this.jobPreviewModal, {
				windowClass: 'modal-holder',
				centered: true,
				size: 'lg',
				backdrop: 'static',
				keyboard: false
			});
		}
	}
	
	/**
	**	To triggers page leaves
	**/
	 
	ngOnDestroy(): void {
		this.onClickCloseBtn(false);
		this.jdSub && this.jdSub.unsubscribe();
	}
	
	/**
	**	To close the popup view
	**/
	 
	onClickCloseBtn(status) {
		if (status == false) {
			this.modalService.dismissAll()
		}
		this.onEvent.emit(status);
	}
	
	/**
	**	To validate the errors in the job preview	
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
	**	To get the user details
	**/
	 
	onGetProfile() {
		this.employerService.profile().subscribe(
			response => {
				this.profileInfo = response;
			}, error => {
			}
		)
	}
	

}
