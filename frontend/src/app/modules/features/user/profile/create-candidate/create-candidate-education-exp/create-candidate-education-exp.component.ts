import { Component, Input, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-create-candidate-education-exp',
  templateUrl: './create-candidate-education-exp.component.html',
  styleUrls: ['./create-candidate-education-exp.component.css']
})
export class CreateCandidateEducationExpComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;

  public eduArray: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onDuplicate = () => {
    this.eduArray.push({category : '', exp: ''})
  }

  onRemove = (index) => {
    this.eduArray.splice(index, 1)
  }

}
