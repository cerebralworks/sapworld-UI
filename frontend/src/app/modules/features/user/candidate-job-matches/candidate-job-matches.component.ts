import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate-job-matches',
  templateUrl: './candidate-job-matches.component.html',
  styleUrls: ['./candidate-job-matches.component.css']
})
export class CandidateJobMatchesComponent implements OnInit {

  public isOpenedJDModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

}
