import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
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
    private formBuilder: FormBuilder,
    private employerService: EmployerService,
    public sharedService: SharedService,
    public utilsHelperService: UtilsHelperService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.queryParamMap.get('id');

    this.onGetProfile();
  }

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

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.jdSub && this.jdSub.unsubscribe();
  }

  onClickCloseBtn(status) {
    if (status == false) {
      this.modalService.dismissAll()
    }
    this.onEvent.emit(status);
  }

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

  onGetProfile() {
    this.employerService.profile().subscribe(
      response => {
        this.profileInfo = response;
      }, error => {
      }
    )
  }

}
