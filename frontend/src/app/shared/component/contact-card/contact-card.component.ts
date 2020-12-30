import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent implements OnInit {

  @Input() userInfo: any;
  @Input() isEdit: boolean;
  @Input() isResume?: boolean;
  @Input() isMail?: boolean = false;

  public isOpenedContactInfoModal: boolean;
  public isOpenedResumeModal: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleContactInfoModal = (status) => {
    this.isOpenedContactInfoModal = status;
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

}
