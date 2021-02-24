import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';

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
  public accountUserSubscription: Subscription;
  public loggedUserInfo: any;


  constructor(
    private modalService: NgbModal,
    public router: Router,
    private utilsHelperService: UtilsHelperService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountUserSubscription = this.accountService
    .isCurrentUser()
    .subscribe(response => {
      this.loggedUserInfo = response;
    });
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
    this.accountUserSubscription && this.accountUserSubscription.unsubscribe();
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

  censorWord = (str) => {
    if(str && str.length) {
      return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
    }

  }

 censorEmail = (email) => {
   if(email && email.length) {
    let arr = email.split("@");
      return this.censorWord(arr[0]) + "@" + this.censorWord(arr[1]);
   }
   return "";
 }

 censorPhoneNumber = (str: string) => {
  if(str && str.length) {
    return str.slice(0, 2) + str.slice(2).replace(/.(?=...)/g, '*');
  }
  return "";
 }

 censorEmployer = (str: string) => {
  if(str && str.length) {
    return str.slice(0, 1) + str.slice(1).replace(/.(?=...)/g, '*');
  }
  return "";
 }

}
