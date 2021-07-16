import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employer-subscription',
  templateUrl: './employer-subscription.component.html',
  styleUrls: ['./employer-subscription.component.css']
})
export class EmployerSubscriptionComponent implements OnInit {
	
	/**
	**	 variable declaration
	**/
	
	@Input() toggleSubscriptionModal: boolean;
	@Output() onEvent = new EventEmitter<boolean>();

	public mbRef: NgbModalRef;

	@ViewChild("subscriptionModal", { static: false }) subscriptionModal: TemplateRef<any>;

	constructor(
		private modalService: NgbModal,
		public router: Router
	) { }

	ngOnInit(): void {

	}
	
	/**
	**	To open the subscription popup view
	**/
	 
	ngAfterViewInit(): void {
		if (this.toggleSubscriptionModal) {
			this.mbRef = this.modalService.open(this.subscriptionModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				size: 'lg',
				keyboard: false
			});
		}
	}
	
	/**
	**	To triggers the page leaves
	**/
	 
	ngOnDestroy(): void {
		this.onClickCloseBtn(false);
	}
	
	/**
	**	To close the popup and return the status
	**/
	 
	onClickCloseBtn(status){
		this.onEvent.emit(status);
		if(status == false) {
			this.mbRef.close()
		}
	}

}
