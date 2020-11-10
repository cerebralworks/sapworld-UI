import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-saved-profile',
  templateUrl: './saved-profile.component.html',
  styleUrls: ['./saved-profile.component.css']
})
export class SavedProfileComponent implements OnInit {

  public isOpenedResumeModal: boolean = false;
  public isOpenedAddNotesModal: boolean = false;
  public isOpenedNotesViewModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleAddNotesModal = (status) => {
    this.isOpenedAddNotesModal = status;
  }

  onToggleNotesViewModal = (status) => {
    this.isOpenedNotesViewModal = status;
  }

}
