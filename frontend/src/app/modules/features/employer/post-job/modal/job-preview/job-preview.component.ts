import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-preview',
  templateUrl: './job-preview.component.html',
  styleUrls: ['./job-preview.component.css']
})
export class JobPreviewComponent implements OnInit {

  @Input() toggleJobPreviewModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public criteriaModalRef: NgbModalRef;
  public jobPreviewModalRef: NgbModalRef;
  public jdSub: Subscription;

  @ViewChild("jobPreviewModal", { static: false }) jobPreviewModal: TemplateRef<any>;
  @ViewChild("criteriaModal", { static: false }) criteriaModal: TemplateRef<any>;
  isOpenCriteriaModal: boolean;


  constructor(
    private modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit(): void {
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

  onClickCloseBtn(status){
    if(status == false) {
      this.modalService.dismissAll()
    }
    this.onEvent.emit(status);
  }

  onRedirectDashboard(status){
    if(status == false) {
      this.router.navigate(['/employer/dashboard']).then(() => {
        this.modalService.dismissAll();
      });
    }
    this.onEvent.emit(status);
  }

  onCloseCriteriaModal(){
    this.criteriaModalRef.close();
    this.isOpenCriteriaModal = false;
  }

  onOpenCriteriaModal = () => {
    this.isOpenCriteriaModal = true;
    if(this.isOpenCriteriaModal) {
      setTimeout(() => {
        this.criteriaModalRef = this.modalService.open(this.criteriaModal, {
          windowClass: 'modal-holder',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
      }, 300);
    }
  }
}
