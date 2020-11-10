import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-create-candidate-header',
  templateUrl: './create-candidate-header.component.html',
  styleUrls: ['./create-candidate-header.component.css']
})
export class CreateCandidateHeaderComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onTabChange = (currentTabInfo: tabInfo) => {
    this.currentTabInfo = currentTabInfo;
    this.onTabChangeEvent.emit(currentTabInfo);
  }

}
