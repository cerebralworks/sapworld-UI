import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent implements OnInit, DoCheck, OnDestroy {

  @Input() userInfo: any;
  @Input() isEdit: boolean;
  @Input() isResume?: boolean;
  @Input() isMail?: boolean = false;
  @Input() isContactIcon?: boolean = true;

  public isOpenedContactInfoModal: boolean;
  public isOpenedResumeModal: boolean;
  public randomNum: number;
  public selectedResumeUrl: any;
  public selectedResume: any = {};
  public validateOnAPI: number = 0;

  constructor(
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
    this.randomNum = Math.random();
  }

  ngDoCheck(): void {
    if(this.userInfo && this.userInfo.doc_resume && Array.isArray(this.userInfo.doc_resume)) {
      this.selectedResume = this.utilsHelperService.onGetFilteredValue(this.userInfo.doc_resume, 'default', 1);
    }
  }

  ngOnDestroy(): void {
    this.validateOnAPI = null;
  }

  onToggleContactInfoModal = (status) => {
    this.isOpenedContactInfoModal = status;
  }

  onToggleResumeForm = (status, selectedResumeUrl?) => {
    if (selectedResumeUrl) {
      this.selectedResumeUrl = selectedResumeUrl;
    }
    this.isOpenedResumeModal = status;
  }

}
