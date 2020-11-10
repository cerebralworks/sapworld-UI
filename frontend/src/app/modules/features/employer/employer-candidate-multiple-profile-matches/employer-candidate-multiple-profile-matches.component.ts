import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employer-candidate-multiple-profile-matches',
  templateUrl: './employer-candidate-multiple-profile-matches.component.html',
  styleUrls: ['./employer-candidate-multiple-profile-matches.component.css']
})
export class EmployerCandidateMultipleProfileMatchesComponent implements OnInit {

  public isOpenedJDModal: boolean = false;
  public isOpenedResumeModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

}
