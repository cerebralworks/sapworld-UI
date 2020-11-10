import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-send-mail-job-preview',
  templateUrl: './send-mail-job-preview.component.html',
  styleUrls: ['./send-mail-job-preview.component.css']
})
export class SendMailJobPreviewComponent implements OnInit {


  @Input() toggleSendMailModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public sendMailModalSub: Subscription;

  @ViewChild("sendMailModal", { static: false }) sendMailModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router
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

}
