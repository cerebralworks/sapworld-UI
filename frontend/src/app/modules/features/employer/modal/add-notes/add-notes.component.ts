import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployerService } from '@data/service/employer.service';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.css']
})
export class AddNotesComponent implements OnInit {

  @Input() toggleAddNotesModal: boolean;
  @Input() userInfo: any;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public description:any='';
  @ViewChild("addNotesModal", { static: false }) addNotesModal: TemplateRef<any>;

  constructor(
  private employerService: EmployerService,
    private toastrService: ToastrService,
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
	if(this.userInfo && this.userInfo['description']){
		this.description = this.userInfo['description'];
	}else{
		this.description =''
	}
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(true);
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == true) {
      this.mbRef.close()
    }
  }
  
  onSaveProfile = () => {
    if((this.userInfo && this.userInfo.id) && this.description) {
      let requestParams: any = {};
      requestParams.user_id = this.userInfo.id;
      requestParams.delete = 0
      requestParams.description = this.description;
      this.employerService.saveProfile(requestParams).subscribe(
        response => {
			this.onEvent.emit(false);
			this.mbRef.close()
        }, error => {
        }
      )
    }else {
      this.toastrService.error('Please Fill the description', 'Warning')
    }
  }
	
}
