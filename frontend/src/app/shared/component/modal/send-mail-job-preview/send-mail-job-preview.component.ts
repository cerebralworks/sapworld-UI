import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-send-mail-job-preview',
  templateUrl: './send-mail-job-preview.component.html',
  styleUrls: ['./send-mail-job-preview.component.css']
})
export class SendMailJobPreviewComponent implements OnInit {

  /**
  **	Variable declaration
  **/
  @Input() toggleSendMailModal: boolean;
  @Input() jobInfo: JobPosting;
  @Input() userInfo: CandidateProfile;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public sendMailModalSub: Subscription;
  public empID:any;
  @ViewChild("sendMailModal", { static: false }) sendMailModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    public route: ActivatedRoute,
    private employerService: EmployerService,
    private toastrService: ToastrService,
    public utilsHelperService: UtilsHelperService
  ) { 
    this.empID=this.route.snapshot.queryParamMap.get('empids')?this.route.snapshot.queryParamMap.get('empids'):this.route.snapshot.queryParamMap.get('employeeId');
  }

  ngOnInit(): void {
    
  }

  /**
  **	To open the preview popup
  **/
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
    //this.onClickCloseBtn(false);
    this.sendMailModalSub && this.sendMailModalSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.modalService.dismissAll()
    }
  }
  
  onClickCloseBtns(status){
    this.onEvent.emit(true);
    this.modalService.dismissAll()
  }
  
  /**
  **	To shortlist the user
  **/
  onShortListUser = () => {
    if(this.userInfo && !this.utilsHelperService.isEmptyObj(this.userInfo.job_application)) {
      this.onSendMail()
    }else {
      this.shortListUser(() => {
        this.onSendMail()
      });
    }

  }

  shortListUser = (callBack = () => {}) => {
    if((this.jobInfo && this.jobInfo.id) && (this.userInfo && this.userInfo.id)) {
      let requestParams: any = {};
      requestParams.job_posting = this.jobInfo.id;
      requestParams.user = this.userInfo.id;
	  requestParams.location_id = this.jobInfo['job_locations'][0]['id'];
      requestParams.status = 7;
      requestParams.short_listed = true;
		this.onClickCloseBtn(false);
          callBack();
      /* this.employerService.shortListUser(requestParams).subscribe(
        response => {
          this.onClickCloseBtn(false);
          callBack();
        }, error => {
        }
      )
    }else {
      this.toastrService.error('Something went wrong', 'Failed')
    } */
}}

  /**
  **	To send the email
  **/
  onSendMail = () => {
    if((this.jobInfo && this.jobInfo.id) && (this.userInfo && this.userInfo.email)) {
      let requestParams: any = {};
      requestParams.job_id = this.jobInfo.id;
      requestParams.location_id = this.jobInfo['job_locations'][0]['id'];
      requestParams.email_id = this.userInfo.email;
      requestParams.account = this.userInfo['account'];
      requestParams.id = this.userInfo.id;
      if(this.empID !=null){
	   requestParams.emp_id = this.empID;
	  }
      this.employerService.sendMail(requestParams).subscribe(
        response => {
          this.toastrService.success('Mail sent successfully','', {
		  timeOut: 2500
		})
          this.onClickCloseBtn(false);
        }, error => {
          this.toastrService.error('Something went wrong','', {
		  timeOut: 2500
		})
        }
      )
    }else {
      this.toastrService.error('Something went wrong','', {
		  timeOut: 2500
		})
    }
  }

}
