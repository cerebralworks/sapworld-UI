import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public isOpenedContactInfoModal: boolean = false;
  public isOpenedResumeModal: boolean = false;

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
