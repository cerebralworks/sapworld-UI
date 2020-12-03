import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.css']
})
export class AddNotesComponent implements OnInit {

  @Input() toggleAddNotesModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;

  @ViewChild("addNotesModal", { static: false }) addNotesModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.toggleAddNotesModal) {
      this.mbRef = this.modalService.open(this.addNotesModal, {
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

}
