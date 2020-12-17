import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {

  @Input() toggleContactInfoModal: boolean;
  @Input() userInfo: any;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;

  @ViewChild("contactInfoModal", { static: false }) contactInfoModal: TemplateRef<any>;


  constructor(
    private modalService: NgbModal,
    public router: Router,
    private utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.toggleContactInfoModal) {
      this.mbRef = this.modalService.open(this.contactInfoModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

  convertToImage(imageString: string): string {
    return this.utilsHelperService.convertToImageUrl(imageString);
  }

}
