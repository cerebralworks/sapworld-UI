import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate-multiple-job-matches',
  templateUrl: './candidate-multiple-job-matches.component.html',
  styleUrls: ['./candidate-multiple-job-matches.component.css']
})
export class CandidateMultipleJobMatchesComponent implements OnInit {

  public isOpenedJDModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

}
