import { Component, Input, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-create-candidate-skillset',
  templateUrl: './create-candidate-skillset.component.html',
  styleUrls: ['./create-candidate-skillset.component.css']
})
export class CreateCandidateSkillsetComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  skillArray: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onDuplicate = () => {
    this.skillArray.push({category : '', exp: ''})
  }

  onRemove = (index) => {
    this.skillArray.splice(index, 1)
  }

}
