import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-cover-modal',
  templateUrl: './cover-modal.component.html',
  styleUrls: ['./cover-modal.component.css']
})
export class CoverModalComponent implements OnInit {

  /**
  **	To upload the reset user data
  **/
  @Input() toggleCoverModal: boolean;
  @Input() url: any;
  @Output() onEvent = new EventEmitter<boolean>();
  public mbRef: NgbModalRef;
  public coverModalSub: Subscription;
  @ViewChild("coverModal", { static: false }) coverModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    public utilsHelperService: UtilsHelperService,
	private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {

  }

  /**
  **	To open the cover letter popup
  **/
  ngAfterViewInit(): void {
    if (this.toggleCoverModal) {
	  this.ngxLoader.start();
      this.mbRef = this.modalService.open(this.coverModal, {
        windowClass: 'modal-holder',
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  /**
  **	To destroy page leave
  **/
  
  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.coverModalSub && this.coverModalSub.unsubscribe();
  }

  /**
  **	To close the popup
  **/
  
  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

  resumeLoaded (event,value)  {
    this.ngxLoader.stop();
    console.log(event);

  }

}
