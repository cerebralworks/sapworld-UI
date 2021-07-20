import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resume-modal',
  templateUrl: './resume-modal.component.html',
  styleUrls: ['./resume-modal.component.css']
})
export class ResumeModalComponent implements OnInit {

  /**
  **	Variable declaration
  **/
  @Input() toggleResumeModal: boolean;
  @Input() url: any;
  @Output() onEvent = new EventEmitter<boolean>();
  public mbRef: NgbModalRef;
  public resumeModalSub: Subscription;
  @ViewChild("resumeModal", { static: false }) resumeModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {

  }

  /**
  **	To open the resumeModal popup
  **/
  ngAfterViewInit(): void {
    if (this.toggleResumeModal) {
      this.mbRef = this.modalService.open(this.resumeModal, {
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
    this.resumeModalSub && this.resumeModalSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

  resumeLoaded (event,value)  {
    console.log(event);

  }

}
