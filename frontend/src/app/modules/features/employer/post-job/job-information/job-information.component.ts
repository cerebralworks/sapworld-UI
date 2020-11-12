import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-job-information',
  templateUrl: './job-information.component.html',
  styleUrls: ['./job-information.component.css']
})
export class JobInformationComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Input() postJobForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  get f() {
    return this.postJobForm.controls;
  }

}
