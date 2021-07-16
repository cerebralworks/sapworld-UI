import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-match-other-post',
  templateUrl: './match-other-post.component.html',
  styleUrls: ['./match-other-post.component.css']
})
export class MatchOtherPostComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	@Input() togglematchOtherPostModal: boolean;
	@Output() onEvent = new EventEmitter<boolean>();
	public mbRef: NgbModalRef;
	@ViewChild("matchOtherPostModal", { static: false }) matchOtherPostModal: TemplateRef<any>;

	constructor(
		private modalService: NgbModal,
		public router: Router
	) { }

	ngOnInit(): void {

	}
	
	/**
	**	To open the other post details view in popup
	**/
	
	ngAfterViewInit(): void {
		if (this.togglematchOtherPostModal) {
			this.mbRef = this.modalService.open(this.matchOtherPostModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				size: 'lg',
				keyboard: false
			});
		}
	}
	
	/**
	**	To leaves the popup
	**/
	 
	ngOnDestroy(): void {
		this.onClickCloseBtn(false);
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

}
