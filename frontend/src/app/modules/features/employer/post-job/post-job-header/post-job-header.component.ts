import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-post-job-header',
  templateUrl: './post-job-header.component.html',
  styleUrls: ['./post-job-header.component.css']
})
export class PostJobHeaderComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onTabChange = (currentTabInfo: tabInfo) => {
    //this.currentTabInfo = currentTabInfo;
   // this.onTabChangeEvent.emit(currentTabInfo);
  }

}
