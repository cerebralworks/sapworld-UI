import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-resume-select',
  templateUrl: './resume-select.component.html',
  styleUrls: ['./resume-select.component.css']
})
export class ResumeSelectComponent implements OnInit {

  @Input() toggleResumeSelectModal: boolean;
  @Input() currentJobDetails: JobPosting;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public userInfo: any;

  @ViewChild("resumeSelectModal", { static: false }) resumeSelectModal: TemplateRef<any>;
  public resumeSelectForm: FormGroup;
  public resumeSelected: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router,
    private userSharedService: UserSharedService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
        if(this.userInfo && this.userInfo.doc_resume && Array.isArray(this.userInfo.doc_resume)) {
          this.resumeSelected = this.onGetFilteredValue(this.userInfo.doc_resume, 'default');
        }
      }
    )
  }

  onGetFilteredValue = (array: any[], fields) => {
    if (array && Array.isArray(array) && array.length) {
      return array.find(i => {
        return (i[fields] == 1 || i[fields] == '1')
      });
    }
    return []
  }

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

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
  }

  onApplyJob = () => {
    if (this.resumeSelected && this.resumeSelected.file) {
      let requestParams: any = {};
      requestParams.job_posting = this.currentJobDetails.id;
      requestParams.user_resume = this.resumeSelected.file;
      this.userService.jobApply(requestParams).subscribe(
        response => {
          this.onClickCloseBtn(false);
        }, error => {
          this.onClickCloseBtn(false);
        }
      )
    }
  }

  onItemChange = (value) => {
    this.resumeSelected = value;
  }

  private buildForm(): void {
    this.resumeSelectForm = this.formBuilder.group({
      title: ['', [Validators.required]]
    });
  }

  get f() {
    return this.resumeSelectForm.controls;
  }

  onClickCloseBtn(status) {
    this.onEvent.emit(status);
    if (status == false) {
      this.mbRef.close()
    }
  }

}
