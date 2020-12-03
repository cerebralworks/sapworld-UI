import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employer-candidate-profile-view',
  templateUrl: './employer-candidate-profile-view.component.html',
  styleUrls: ['./employer-candidate-profile-view.component.css']
})
export class EmployerCandidateProfileViewComponent implements OnInit {

    public isOpenedResumeModal: boolean;
  public isOpenedSendMailModal: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
