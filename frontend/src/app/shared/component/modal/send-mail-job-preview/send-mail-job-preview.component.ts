import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-send-mail-job-preview',
  templateUrl: './send-mail-job-preview.component.html',
  styleUrls: ['./send-mail-job-preview.component.css']
})
export class SendMailJobPreviewComponent implements OnInit {


  @Input() toggleSendMailModal: boolean;
  @Input() jobInfo: JobPosting;
  @Input() userInfo: CandidateProfile;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public sendMailModalSub: Subscription;

  @ViewChild("sendMailModal", { static: false }) sendMailModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private employerService: EmployerService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.toggleSendMailModal) {
      this.mbRef = this.modalService.open(this.sendMailModal, {
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
    this.sendMailModalSub && this.sendMailModalSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.modalService.dismissAll()
    }
  }

  onShortListUser = () => {
    this.shortListUser(() => {
      this.onSendMail()
    });
  }

  shortListUser = (callBack = () => {}) => {
    if((this.jobInfo && this.jobInfo.id) && (this.userInfo && this.userInfo.id)) {
      let requestParams: any = {};
      requestParams.job_posting = this.jobInfo.id;
      requestParams.user = this.userInfo.id;
      requestParams.short_listed = true;

      this.employerService.shortListUser(requestParams).subscribe(
        response => {
          this.onClickCloseBtn(false);
          callBack();
        }, error => {
        }
      )
    }else {
      this.toastrService.error('Something went wrong', 'Failed')
    }
  }

  onSendMail = () => {
    if((this.jobInfo && this.jobInfo.id) && (this.userInfo && this.userInfo.email)) {
      let requestParams: any = {};
      requestParams.job_id = this.jobInfo.id;
      requestParams.email_id = this.userInfo.email;

      this.employerService.sendMail(requestParams).subscribe(
        response => {
          this.toastrService.success('Mail sent successfully', 'Success')
          this.onClickCloseBtn(false);
        }, error => {
          this.toastrService.error('Something went wrong', 'Failed')
        }
      )
    }else {
      this.toastrService.error('Something went wrong', 'Failed')
    }
  }

}
