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
  @Input() isContactIcon?: boolean = true;

  public isOpenedContactInfoModal: boolean;
  public isOpenedResumeModal: boolean;
  public randomNum: number;

  constructor() { }

  ngOnInit(): void {
    this.randomNum = Math.random();

  }

  onToggleContactInfoModal = (status) => {
    this.isOpenedContactInfoModal = status;
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

}
