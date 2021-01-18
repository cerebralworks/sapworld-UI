import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  public resumeTitle: string = ""
  public resumeDefault: boolean = false;
  public userProfileInfo: any;
  public isOpenedResumeModal: boolean;
  public selectedResumeUrl: any;
  public mbRef: NgbModalRef;

  @ViewChild("resumeTitleModal", { static: false }) resumeTitleModal: TemplateRef<any>;
  currentResumeDetails: any;
  isDeleteModalOpened: boolean;

  constructor(
    private userService: UserService,
    private utilsHelperService: UtilsHelperService,
    private toastrService: ToastrService,
    private userSharedService: UserSharedService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userProfileInfo = response;

      }
    )
  }

  handleFileInput(event) {
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

  onSaveResume = () => {
    this.onUserResumeUpdate()
  }

  onUserResumeUpdate = () => {
    const formData = new FormData();

    formData.append('doc_resume', this.userSelectedResume, this.userSelectedResume.name);
    formData.append('default', this.resumeDefault.toString());
    formData.append('title', this.resumeTitle);
    this.userService.resumeUpdate(formData).subscribe(
      response => {
        this.onGetUserProfile();
      }, error => {
      }
    )
  }

  onDeleteJobConfirm = (item, index) => {
    this.currentResumeDetails = item;
    this.isDeleteModalOpened = true;
  }

  onDeleteJobConfirmed = (status) => {
    if(status == true) {
      this.onDeleteUserResume();
    }else {
      this.isDeleteModalOpened = false;
    }
  }

  onDeleteUserResume = () => {
    const formData = new FormData();

    formData.append('file_key', this.currentResumeDetails.file);
    this.userService.deleteResume(formData).subscribe(
      response => {
        this.isDeleteModalOpened = false;
        this.onGetUserProfile();
      }, error => {
      }
    )
  }

  onGetUserProfile() {
    this.userService.profile().subscribe(
      response => {
        let userProfileInfo = response;
        this.userProfileInfo = {...userProfileInfo.details, meta: userProfileInfo.meta};
      }, error => {
        this.modalService.dismissAll();
      }
    )
  }

  onToggleResumeForm = (status, selectedResumeUrl?) => {
    if(selectedResumeUrl) {
      this.selectedResumeUrl = selectedResumeUrl;
      console.log(this.selectedResumeUrl);

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

}
