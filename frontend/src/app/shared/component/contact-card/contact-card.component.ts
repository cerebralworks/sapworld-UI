import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { AccountService } from '@data/service/account.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

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
  @Input() jobInfo?: JobPosting;

  public isOpenedContactInfoModal: boolean;
  public isOpenedResumeModal: boolean;
  public isOpenedCoverModal: boolean;
  public randomNum: number;
  public selectedResumeUrl: any;
  public selectedCoverUrl: any;
  public selectedResume: any = {};
  public selectedCover: any = {};
  public validateOnAPI: number = 0;
  public currentUserInfo: CandidateProfile;
  public isOpenedSendMailModal: boolean;
  public accountUserSubscription: Subscription;
  public loggedUserInfo: any;

  constructor(
    public utilsHelperService: UtilsHelperService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.randomNum = Math.random();

    this.accountUserSubscription = this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
  }

  ngDoCheck(): void {
    if(this.userInfo && this.userInfo.doc_resume && Array.isArray(this.userInfo.doc_resume)) {
      this.selectedResume = this.utilsHelperService.onGetFilteredValue(this.userInfo.doc_resume, 'default', 1);
    }
    if(this.userInfo && this.userInfo.doc_cover && Array.isArray(this.userInfo.doc_cover)) {
      this.selectedCover = this.userInfo.doc_cover[0];
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

  onToggleCoverForm = (status, selectedCoverUrl?) => {
    if (selectedCoverUrl) {
      this.selectedCoverUrl = selectedCoverUrl;
    }
    this.isOpenedCoverModal = status;
  }

  onToggleSendMail = (status,item?) => {
    if(item && !this.utilsHelperService.isEmptyObj(item)) {
      this.currentUserInfo = item;
    }
    this.isOpenedSendMailModal = status;
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
    var first = str.substring(0, 1);
    var last = str.substring(str.length - 1);

    let mask = str.substring(1, str.length - 1).replace(/.(?=)/g, '*');

    return first + mask + last;
  }
  return "";
 }

  onTabChange(){
    const navigationExtras = {queryParams:{ activeTab: "matches"}}

    this.router.navigate([], navigationExtras);
  }

}
