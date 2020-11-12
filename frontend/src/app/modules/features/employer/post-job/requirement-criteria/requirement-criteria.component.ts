import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-requirement-criteria',
  templateUrl: './requirement-criteria.component.html',
  styleUrls: ['./requirement-criteria.component.css']
})
export class RequirementCriteriaComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Input() postJobForm: FormGroup;

  public skillArray: any[] = [];

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
