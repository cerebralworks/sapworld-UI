import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-resume',
  templateUrl: './user-resume.component.html',
  styleUrls: ['./user-resume.component.css']
})
export class UserResumeComponent implements OnInit {

  public userSelectedResume: File;
  public userSelectedCover: File;
  public userProfileInfo: any;
  public isOpenedResumeModal: boolean;
  public selectedResumeUrl: any;
  public mbRef: NgbModalRef;

  @ViewChild("resumeTitleModal", { static: false }) resumeTitleModal: TemplateRef<any>;
  @ViewChild("coverTitleModal", { static: false }) coverTitleModal: TemplateRef<any>;
  @ViewChild('userResume', { static: false }) userResume: ElementRef;
  @ViewChild('userCover', { static: false }) userCover: ElementRef;

  public currentResumeDetails: any;
  public currentCoverDetails: any;
  public isDeleteModalOpened: boolean;
  public isDeleteModalOpenedCover: boolean;
  public resumeForm: FormGroup;
  public coverForm: FormGroup;

  constructor(
    private userService: UserService,
    private utilsHelperService: UtilsHelperService,
    private toastrService: ToastrService,
    private userSharedService: UserSharedService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userProfileInfo = response;

      }
    )

    this.buildForm();
  }

  private buildForm(): void {
    this.resumeForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required])
    });
    this.coverForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required])
    });
  }

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
	  if(data=="cover"){
		  this.userSelectedCover = files[0];
		  this.onOpenCoverTitleModal();
	  }else{
		this.userSelectedResume = files[0];
		  this.onOpenResumeTitleModal();
	  }
      
    }

  }

  onSaveResume = () => {
    if(this.resumeForm.valid) {
      this.onUserResumeUpdate();
    }
  }

  onSaveCover = () => {
    if(this.coverForm.valid) {
      this.onUserCoverUpdate();
    }
  }

  get f() {
    return this.resumeForm.controls;
  }

  onUserResumeUpdate = () => {
    const formData = new FormData();

    formData.append('doc_resume', this.userSelectedResume, this.userSelectedResume.name);
    formData.append('title', this.resumeForm.value.title);
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

  onUserCoverUpdate = () => {
    const formData = new FormData();

    formData.append('doc_cover', this.userSelectedCover, this.userSelectedCover.name);
    formData.append('title', this.coverForm.value.title);
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

  onDeleteCoverConfirm = (item, index) => {
    this.currentCoverDetails = item;
    this.isDeleteModalOpenedCover = true;
  }

  onDeleteCoverConfirmed = (status) => {
    if (status == true) {
      this.onDeleteUserCover();
    } else {
      this.isDeleteModalOpenedCover = false;
    }
  }

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

  onDeleteJobConfirm = (item, index) => {
    this.currentResumeDetails = item;
    this.isDeleteModalOpened = true;
  }

  onDeleteJobConfirmed = (status) => {
    if (status == true) {
      this.onDeleteUserResume();
    } else {
      this.isDeleteModalOpened = false;
    }
  }

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

  onCheck = (array: any[], fields) => {
    if (array && Array.isArray(array) && array.length) {
      return array.every(i => {
        return (i[fields] == 0 || i[fields] == '0')
      });
    }
    return false
  }

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

  onToggleResumeForm = (status, selectedResumeUrl?) => {
    if (selectedResumeUrl) {
      this.selectedResumeUrl = selectedResumeUrl;
    }

    this.isOpenedResumeModal = status;
  }

  onOpenResumeTitleModal = () => {
    this.mbRef = this.modalService.open(this.resumeTitleModal, {
      windowClass: 'modal-holder',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }
  
  onOpenCoverTitleModal = () => {
    this.mbRef = this.modalService.open(this.coverTitleModal, {
      windowClass: 'modal-holder',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

}
