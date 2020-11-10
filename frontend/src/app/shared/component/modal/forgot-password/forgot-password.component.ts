import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  @Input() toggleForgotPassModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public fpSub: Subscription;

  public isMailSent: boolean = false;

  @ViewChild("fpModal", { static: false }) fpModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.toggleForgotPassModal) {
      this.mbRef = this.modalService.open(this.fpModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.fpSub && this.fpSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.isMailSent = false;
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

  onMailSuccess = () => {
    this.isMailSent = true;
  }

}
