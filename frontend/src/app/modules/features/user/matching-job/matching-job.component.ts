import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matching-job',
  templateUrl: './matching-job.component.html',
  styleUrls: ['./matching-job.component.css']
})
export class MatchingJobComponent implements OnInit {

  public isOpenedResumeSelectModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleResumeSelectModal = (status) => {
    this.isOpenedResumeSelectModal = status;
  }

}
