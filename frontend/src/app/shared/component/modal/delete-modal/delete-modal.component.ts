import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  /**
  **	Variable declaration
  **/
  @Input() currentRecordInfo: any;
  @Input() typeOfModel: string;
  @Input() showRecordName: string;
  @Input() toggleDeleteModal: any;
  @Output() onTriggerDeleteAction = new EventEmitter<boolean>();

  @ViewChild('deleteModal', { static: false }) deleteModal: TemplateRef<any>;

  public mbRef: NgbModalRef;

  constructor(
    private modelService: NgbModal
  ) { }

  ngOnInit() {
  }

  /**
  **	To open the delete model popup
  **/
  ngAfterViewInit(): void {
    if (this.toggleDeleteModal) {
      this.mbRef = this.modelService.open(this.deleteModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  onModelSubmitted = () => {
    this.onTriggerDeleteAction.emit(true);
    this.mbRef.close();
  }

  onModelClosed = () => {
    this.mbRef.close();
    this.onTriggerDeleteAction.emit(false);
  }

}
