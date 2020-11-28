import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.css']
})
export class JobDescriptionComponent implements OnInit {

  @Input() description: string;
  @Input() toggleJDModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public jdSub: Subscription;

  @ViewChild("jdModal", { static: false }) jdModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.toggleJDModal) {
      this.mbRef = this.modalService.open(this.jdModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        size: 'lg',
        keyboard: false
      });
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.jdSub && this.jdSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

}
