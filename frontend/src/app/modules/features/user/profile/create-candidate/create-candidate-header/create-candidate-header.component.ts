import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { DataService } from '@shared/service/data.service';

@Component({
  selector: 'app-create-candidate-header',
  templateUrl: './create-candidate-header.component.html',
  styleUrls: ['./create-candidate-header.component.css']
})
export class CreateCandidateHeaderComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Input() createCandidateForm: FormGroup;
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
    this.dataService.setTabInfo(this.tabTempArray);

    // this.tabInfos.map((val: tabInfo, index) => {
    //   if(val.tabNumber > currentTabInfo.tabNumber) {
    //     if(val.tabNumber == 2) {
    //       this.createCandidateForm.removeControl('educationExp');
    //     }else if(val.tabNumber == 3) {
    //       this.createCandidateForm.removeControl('skillSet');
    //     }else if(val.tabNumber == 4) {
    //       this.createCandidateForm.removeControl('jobPref');
    //     }
    //   }
    // })
  }

}
