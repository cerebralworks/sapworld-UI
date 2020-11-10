import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate-review-modal',
  templateUrl: './candidate-review-modal.component.html',
  styleUrls: ['./candidate-review-modal.component.css']
})
export class CandidateReviewModalComponent implements OnInit {

  @Input() toggleRegisterReviewModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public registerReviewModalSub: Subscription;

  @ViewChild("registerReviewModal", { static: false }) registerReviewModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.toggleRegisterReviewModal) {
      this.mbRef = this.modalService.open(this.registerReviewModal, {
        windowClass: 'modal-holder',
        size: 'lg',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.registerReviewModalSub && this.registerReviewModalSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

  onRedirect = () => {
    this.router.navigate(['/user/dashboard']);
  }

}
