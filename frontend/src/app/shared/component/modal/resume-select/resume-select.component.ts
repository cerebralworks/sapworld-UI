import { Component, EventEmitter, ElementRef,Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder,FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-resume-selects',
  templateUrl: './resume-select.component.html',
  styleUrls: ['./resume-select.component.css']
})
export class ResumeSelectComponent implements OnInit {

  /**
  **	Variable declaration
  **/
  public userSelectedCover: File;
  public selectedCoverUrl: any;
  public isOpenedCoverModal: boolean;
  public isShowData: boolean = false;
  public isShowUpload: boolean = true;
  public fileExtension:any;
  @Input() toggleresumeSelectModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public mbRefs: NgbModalRef;
  public userInfo: any;

  @ViewChild("coverSelectModal", { static: false }) coverSelectModal: TemplateRef<any>;
  @ViewChild("resumeTitleModal", { static: false }) resumeTitleModal: TemplateRef<any>;
  public resumeForm: UntypedFormGroup;
  public resumeSelected: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    public router: Router,
    private userSharedService: UserSharedService,
    private utilsHelperService: UtilsHelperService,
    private toastrService: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    
  }

  onGetFilteredValue = (array: any[], fields) => {
    if (array && Array.isArray(array) && array.length) {
      return array.find(i => {
        return (i[fields] == 1 || i[fields] == '1')
      });
    }
    return []
  }

  /**
  **	To open select popup section
  **/
  ngAfterViewInit(): void {
    if (this.toggleresumeSelectModal) {
      this.mbRefs = this.modalService.open(this.coverSelectModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
  }


  onItemChange = (value) => {
    this.resumeSelected = value;
  }

  private buildForm(): void {
    this.resumeForm = this.formBuilder.group({
      title: ['', [Validators.required]]
    });
  }

  get f() {
    return this.resumeForm.controls;
  }

  onClickCloseBtn(status) {
    this.onEvent.emit(status);
    if (status == false) {
      this.mbRefs.close()
    }
  }
  
  /**
  **	To validate the file format
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
        this.toastrService.error('File format not supported(Allowed Format:doc,pdf,docx)','', {
		  timeOut: 2500
		});
        return;
      }
      if (files.item(0).size > 10485760) {
        this.toastrService.error('Size Should be less than or equal to 10 MB','', {
		  timeOut: 2500
		});
        return;
      }
	  
		this.userSelectedCover = files[0];
		this.onOpenresumeTitleModal();
      
    }

  }
  
  /**
  **	To open the title of the resumeForm
  **/
  onOpenresumeTitleModal = () => {
    this.mbRef = this.modalService.open(this.resumeTitleModal, {
      windowClass: 'modal-holder',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }
   
 onToggleresumeForm = (status, selectedCoverUrl?) => {
    if (selectedCoverUrl) {
      this.selectedCoverUrl = selectedCoverUrl;
    }

    this.isOpenedCoverModal = status;
  }
  
    onSaveResume = () => {
    if(this.resumeForm.valid) {
      this.onUserCoverUpdate();
    }
  }

  /**
  **	To upload the resume user data
  **/
   onUserCoverUpdate = () => {
    const formData = new FormData();

    formData.append('doc_resume', this.userSelectedCover, this.userSelectedCover.name);
    formData.append('title', this.resumeForm.value.title);
	formData.append('extension', this.fileExtension);
    this.userService.resumeUpdate(formData).subscribe(
      response => {
       
         //this.modalService.dismissAll();
		 this.mbRef.close();
		 this.mbRefs.close();
		  this.onClickCloseBtn(true);
        this.resumeForm.reset();
        //this.userCover.nativeElement.value = null;
      }, error => {
      }
    )
  }
  
  /**
  **	To get user data
  **/
  onGetUserProfile(isRequiredDefault : boolean = false) {
    this.userService.profile().subscribe(
      response => {
		  
        if(response['details']){
			this.userSharedService.saveUserProfileDetails(response['details']);
		}
      }, error => {
        //this.modalService.dismissAll();
      }
    )
  }
  
}
