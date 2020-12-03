import { Component, Input, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-create-candidate-job-preference',
  templateUrl: './create-candidate-job-preference.component.html',
  styleUrls: ['./create-candidate-job-preference.component.css']
})
export class CreateCandidateJobPreferenceComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
