import { Component, EventEmitter, ElementRef,Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-resume-select',
  templateUrl: './resume-select.component.html',
  styleUrls: ['./resume-select.component.css']
})
export class ResumeSelectComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	public userSelectedResume: File;
	public selectedResumeUrl: any;
	public resumeForm: FormGroup;
	public isOpenedResumeModal: boolean;
	public isShowData: boolean = false;
	public isShowUpload: boolean = true;
	@Input() toggleResumeSelectModal: boolean;
	@Input() userAccept: boolean = false;
	@Input() currentJobDetails: JobPosting;
	@Output() onEvent = new EventEmitter<boolean>();

	public mbRef: NgbModalRef;
	public mbRefs: NgbModalRef;
	public mbRefss: NgbModalRef;
	public userInfo: any;

	@ViewChild("resumeSelectModal", { static: false }) resumeSelectModal: TemplateRef<any>;
	@ViewChild("resumeTitleModal", { static: false }) resumeTitleModal: TemplateRef<any>;
	@ViewChild("openSuccessPopup", { static: false }) openSuccessModal: TemplateRef<any>;
	@ViewChild('userResume', { static: false }) userResume: ElementRef;
	public resumeSelectForm: FormGroup;
	public resumeSelected: any;

	constructor(
		private formBuilder: FormBuilder,
		private modalService: NgbModal,
		public router: Router,
		private userSharedService: UserSharedService,
		private utilsHelperService: UtilsHelperService,
		private toastrService: ToastrService,
		private userService: UserService
	) { }
	
	/**
	**	When the page loads the Function calls
	**/
	
	ngOnInit(): void {
		this.userSharedService.getUserProfileDetails().subscribe(
		response => {
			this.userInfo = response;
			if(this.userInfo && this.userInfo.doc_resume && Array.isArray(this.userInfo.doc_resume)) {
				this.resumeSelected = this.onGetFilteredValue(this.userInfo.doc_resume, 'default');
				if(this.userInfo.doc_resume.length!=0){
					this.isShowData = true;
					this.isShowUpload = false;
				}
			}
		}
		)
	}

	/**
	**	To filter the resume array data's
	**/
	
	onGetFilteredValue = (array: any[], fields) => {
		if (array && Array.isArray(array) && array.length) {
			return array.find(i => {
				return (i[fields] == 1 || i[fields] == '1')
			});
		}
		return []
	}

	/**
	**	To open the resume in popup view for select
	**/
	
	ngAfterViewInit(): void {
		if (this.toggleResumeSelectModal) {
			this.mbRef = this.modalService.open(this.resumeSelectModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
			this.buildForm();
		}
	}
	
	/**
	**	To leave the page destroy Function triggers
	**/
	
	ngOnDestroy(): void {
		this.onClickCloseBtn(false);
	}

	/**
	**	To Apply for the new jobs
	**/	

	onApplyJob = () => {
		if (this.resumeSelected && this.resumeSelected.file) {
			let requestParams: any = {};
			requestParams.job_posting = this.currentJobDetails.id;
			requestParams.user_resume = this.resumeSelected.file;
			if(this.userAccept ==true ){
				//requestParams.status =  8 ;
			}
			this.userService.jobApply(requestParams).subscribe(
				response => {
					//this.onClickCloseBtn(false);
					this.mbRef.close()
					this.onOpenStatusModal();
				}, error => {
					//this.onClickCloseBtn(false);
					this.mbRef.close()
					this.onOpenStatusModal();
				}
			)
		}
	}
	
	/**
	**	To Select the resume in choose Option
	**/
	
	onItemChange = (value) => {
		this.resumeSelected = value;
	}
	
	/**
	**	To Build a apply Form and the select form
	**/
	
	private buildForm(): void {
		this.resumeSelectForm = this.formBuilder.group({
			title: ['', [Validators.required]]
		});
		this.resumeForm = this.formBuilder.group({
			title: new FormControl('', [Validators.required])
		});
	}

	/**
	**	To change the resume controls in f Function
	**/
	
	get f() {
		return this.resumeSelectForm.controls;
	}

	/**
	**	To Close the popup and output the status
	**/
	
	onClickCloseBtn(status) {
		this.onEvent.emit(status);
		if (status == false) {
			this.mbRef.close()
		}
	}
	
	/**
	**	To Close button status in the popup
	**/
	
	onClickCloseBtnStatus(status) {
		this.onEvent.emit(true);
		this.mbRefss.close();
		if (status == false) {
			this.mbRefss.close();
		}
	}
  
	/**
	**	To navigate the matches View
	**/
	
	navigateMatches(){
		this.mbRefss.close();
		this.router.navigate(['/user/dashboard'], {queryParams: {activeTab: 'matches'}})
	}  
	
	/**
	**	To upload the selected files for the resume validation
	**/
	
	handleFileInput(event,data) {
		let files: FileList = event.target.files;
		if (files && files.length > 0) {
			let allowedExtensions = ["doc", "docx", "pdf"];
			let fileExtension = files
			.item(0)
			.name.split(".")
			.pop();
			if (!this.utilsHelperService.isInArray(allowedExtensions, fileExtension)) {
				this.toastrService.error('File format not supported(Allowed Format:doc,pdf,docx)');
				return;
			}
			if (files.item(0).size > 3145728) {
				this.toastrService.error('Size Should be less than or equal to 3 MB');
				return;
			}	  
			this.userSelectedResume = files[0];
			this.onOpenResumeTitleModal();
		}
	}
  
	/**
	**	To Open the resume upload title popup
	**/
	
	onOpenResumeTitleModal = () => {
		this.mbRefs = this.modalService.open(this.resumeTitleModal, {
			windowClass: 'modal-holder',
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
	}
  
	/**
	**	To Open the status view in the popup
	**/
	
	onOpenStatusModal = () => {
		this.mbRefss = this.modalService.open(this.openSuccessModal, {
			windowClass: 'modal-holder',
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
	}
      
	/**
	**	To Get the toogle form select Urls and open the resume model
	**/
	
	onToggleResumeForm = (status, selectedResumeUrl?) => {
		if (selectedResumeUrl) {
			this.selectedResumeUrl = selectedResumeUrl;
		}
		this.isOpenedResumeModal = status;
	}
	
	/**
	**	To save the resume
	**/
	
    onSaveResume = () => {
		if(this.resumeForm.valid) {
			this.onUserResumeUpdate();
		}
	  }
	  
	/**
	**	To get the resumeForm controls get Function
	**/
	
	get fs() {
		return this.resumeForm.controls;
	}
	
	
	/**
	**	To upload the selected files for the resume
	**/
	
	onUserResumeUpdate = () => {
		const formData = new FormData();
		formData.append('doc_resume', this.userSelectedResume, this.userSelectedResume.name);
		formData.append('title', this.resumeForm.value.title);
		this.userService.resumeUpdate(formData).subscribe(
			response => {
				//this.modalService.dismissAll();
				this.onGetUserProfile(true);
				this.mbRefs?.close();
				this.resumeForm.reset();
				//this.userResume.nativeElement.value = null;
			}, error => {
			}
		)
	}
  
	/**
	**	To Get the user profile details
	**/
	
	onGetUserProfile(isRequiredDefault : boolean = false) {
		this.userService.profile().subscribe(
		response => {
			if(response['details']){
				this.userSharedService.saveUserProfileDetails(response['details']);
			}
		}, error => {
			//this.modalService.dismissAll();
		})
	}
  
}
