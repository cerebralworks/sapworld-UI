import { Component, ElementRef, OnInit,Input, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import { environment as env } from '@env';

@Component({
  selector: 'app-user-resume',
  templateUrl: './user-resume.component.html',
  styleUrls: ['./user-resume.component.css']
})
export class UserResumeComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	@Input()screenWidth:any;
	public userSelectedResume: File;
	public userSelectedCover: File;
	public userProfileInfo: any;
	public isOpenedResumeModal: boolean;
	public isOpenedCoverModal: boolean;
	public selectedResumeUrl: any;
	public selectedCoverUrl: any;
	public mbRef: NgbModalRef;
	public fileExtension:any;
	@ViewChild("resumeTitleModal", { static: false }) resumeTitleModal: TemplateRef<any>;
	@ViewChild("coverTitleModal", { static: false }) coverTitleModal: TemplateRef<any>;
	@ViewChild('userResume', { static: false }) userResume: ElementRef;
	@ViewChild('userCover', { static: false }) userCover: ElementRef;

	public currentResumeDetails: any;
	public currentCoverDetails: any;
	public isDeleteModalOpened: boolean;
	public isDeleteModalOpenedCover: boolean;
	public resumeForm: UntypedFormGroup;
	public coverForm: UntypedFormGroup;
	
	constructor(
		private userService: UserService,
		private utilsHelperService: UtilsHelperService,
		private toastrService: ToastrService,
		private userSharedService: UserSharedService,
		private modalService: NgbModal,
		private formBuilder: UntypedFormBuilder
	) { }
	
	
	/**
	**	To Initialize the page Function triggers
	**/
	
	  ngOnInit(): void {
		this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				this.userProfileInfo = response;
			}
		)
		this.buildForm();
	}

	/**
	**	To Build a resume upload Form and the cover upload form
	**/
	
	private buildForm(): void {
		this.resumeForm = this.formBuilder.group({
			title: new UntypedFormControl('', [Validators.required])
		});
		this.coverForm = this.formBuilder.group({
			title: new UntypedFormControl('', [Validators.required])
		});
	}

	/**
	**	To validate the uploaded files
	**/
	
	handleFileInput(event,data) {
		let files: FileList = event.target.files;
		if (files && files.length > 0) {
			let allowedExtensions = ["doc", "docx", "pdf"];
			this.fileExtension = files
			.item(0)
			.name.split(".")
			.pop();
			if (!this.utilsHelperService.isInArray(allowedExtensions, this.fileExtension)) {
				this.toastrService.error('File format not supported(Allowed Format:doc,pdf,docx)');
				return;
			}
			if (files.item(0).size > 10485760) {
				this.toastrService.error('Size Should be less than or equal to 10 MB');
				return;
			}
			if(data=="cover"){
				this.userSelectedCover = files[0];
				this.onOpenCoverTitleModal();
			}else{
				this.userSelectedResume = files[0];
				this.onOpenResumeTitleModal();
			}
		}
	}

	/**
	**	To Save the resume
	**/
	
	onSaveResume = () => {
		if(this.resumeForm.valid) {
			this.onUserResumeUpdate();
		}
	}

	/**
	**	To Save the cover letter
	**/
	
	onSaveCover = () => {
		if(this.coverForm.valid) {
			this.onUserCoverUpdate();
		}
	}

	/**
	**	To assign the resumeForm controls to f
	**/
	
	get f() {
		return this.resumeForm.controls;
	}

	/**
	**	To Upload the user resume data's
	**/
	
	onUserResumeUpdate = () => {
		const formData = new FormData();
		formData.append('doc_resume', this.userSelectedResume, this.userSelectedResume.name);
		formData.append('title', this.resumeForm.value.title);
		formData.append('extension', this.fileExtension);
		this.userService.resumeUpdate(formData).subscribe(
			response => {
				this.modalService.dismissAll();
				this.onGetUserProfile(true);
				this.resumeForm.reset();
				this.userResume.nativeElement.value = null;
			}, error => {
			}
		)
	}

	/**
	**	To Upload the cover letter
	**/
	
	onUserCoverUpdate = () => {
		const formData = new FormData();
		formData.append('doc_cover', this.userSelectedCover, this.userSelectedCover.name);
		formData.append('title', this.coverForm.value.title);
		formData.append('extension', this.fileExtension);
		this.userService.coverUpdate(formData).subscribe(
			response => {
				this.modalService.dismissAll();
				this.onGetUserProfile(true);
				this.coverForm.reset();
				this.userCover.nativeElement.value = null;
			}, error => {
			}
		)
	}
	
	/**
	**	To delete the cover letter popup status
	**/

	onDeleteCoverConfirm = (item, index) => {
		this.currentCoverDetails = item;
		this.isDeleteModalOpenedCover = true;
	}

	/**
	**	To delete the cover letter popup open
	**/
	
	onDeleteCoverConfirmed = (status) => {
		if (status == true) {
			this.onDeleteUserCover();
		} else {
			this.isDeleteModalOpenedCover = false;
		}
	}

	/**
	**	To delete the cover letter 
	**/
	
	onDeleteUserCover = () => {
		const formData = new FormData();
		formData.append('file_key', this.currentCoverDetails.file);
		this.userService.deleteCover(formData).subscribe(
			response => {
				this.isDeleteModalOpenedCover = false;
				this.onGetUserProfile(true);
			}, error => {
			}
		)
	}

	/**
	**	To delete the resume popup open
	**/
	
	onDeleteJobConfirm = (item, index) => {
		this.currentResumeDetails = item;
		this.isDeleteModalOpened = true;
	}

	/**
	**	To delete the resume Function validate
	**/
	
	onDeleteJobConfirmed = (status) => {
		if (status == true) {
			this.onDeleteUserResume();
		} else {
			this.isDeleteModalOpened = false;
		}
	}

	/**
	**	To delete the resume
	**/
	
	onDeleteUserResume = () => {
		const formData = new FormData();
		formData.append('file_key', this.currentResumeDetails.file);
		this.userService.deleteResume(formData).subscribe(
			response => {
				this.isDeleteModalOpened = false;
				this.onGetUserProfile(true);
			}, error => {
			}
		)
	}

	/**
	**	To Check the array fields to select resume
	**/
	
	onCheck = (array: any[], fields) => {
		if (array && Array.isArray(array) && array.length) {
			return array.every(i => {
				return (i[fields] == 0 || i[fields] == '0')
			});
		}
		return false
	}

	/**
	**	To select resume default
	**/
	
	onChooseDefaultResume = (item, eventValue?, isNonDefault: boolean = false) => {
		const formData = new FormData();
		if (isNonDefault) {
			const defaultVal = eventValue ? '1' : '0';
			formData.append('remove_all_default', defaultVal);
		} else {
			formData.append('file_key', item.file);
		}
		this.userService.chooseDefaultResume(formData).subscribe(
			response => {
				this.onGetUserProfile();
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
				let userProfileInfo = response;
				this.userProfileInfo = { ...userProfileInfo.details, meta: userProfileInfo.meta };
				if(isRequiredDefault && !this.utilsHelperService.isEmptyObj(this.userProfileInfo) && this.userProfileInfo.doc_resume && Array.isArray(this.userProfileInfo.doc_resume) && this.userProfileInfo.doc_resume.length == 1) {
					this.onChooseDefaultResume(this.userProfileInfo.doc_resume[0])
				}
				this.modalService.dismissAll();
			}, error => {
				this.modalService.dismissAll();
			}
		)
	}

	/**
	**	To Open the resume title popup
	**/
	
	onToggleResumeForm = (status, selectedResumeUrl?) => {
		if (selectedResumeUrl) {
			this.selectedResumeUrl = `${env.apiUrl}/documents/resume/${selectedResumeUrl}`;
		}
		this.isOpenedResumeModal = status;
	}

	/**
	**	To open the cover letter title popup
	**/
	
	onToggleCoverForm = (status, selectedCoverUrl?) => {
		if (selectedCoverUrl) {
			this.selectedCoverUrl = `${env.apiUrl}/documents/cover/${selectedCoverUrl}`;
		}
		this.isOpenedCoverModal = status;
	}

	/**
	**	To open the resume title popup view
	**/
	
	onOpenResumeTitleModal = () => {
		this.mbRef = this.modalService.open(this.resumeTitleModal, {
			windowClass: 'modal-holder',
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
	}
	
  	/**
	**	To open the Cover title popup view
	**/
	
	onOpenCoverTitleModal = () => {
		this.mbRef = this.modalService.open(this.coverTitleModal, {
			windowClass: 'modal-holder',
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
	}

}
