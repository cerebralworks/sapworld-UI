import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { DataService } from '@shared/service/data.service';

@Component({
  selector: 'app-create-candidate-header',
  templateUrl: './create-candidate-header.component.html',
  styleUrls: ['./create-candidate-header.component.css']
})
export class CreateCandidateHeaderComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
  public tabInfos: any[] = [];
  public tabTempArray: any[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.tabTempArray.push(this.currentTabInfo);
    this.dataService.setTabInfo(this.tabTempArray);
    this.dataService.getTabInfo().subscribe(
      response => {
        if(response && Array.isArray(response) && response.length) {
          this.tabInfos = response;
        }
      }
    )
  }

  onTabChange = (currentTabInfo: tabInfo) => {
    this.currentTabInfo = currentTabInfo;
    this.onTabChangeEvent.emit(currentTabInfo);
    if(this.tabInfos.length == 0) {
      this.tabTempArray.push(currentTabInfo);
    }else {
      let index = this.tabInfos.findIndex(val => val.tabNumber == currentTabInfo.tabNumber);
      if(index == -1) {
        this.tabTempArray.push(currentTabInfo);
      }
    }
    console.log(this.tabTempArray);

    this.dataService.setTabInfo(this.tabTempArray);
  }

}
