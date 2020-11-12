import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-post-job-footer',
  templateUrl: './post-job-footer.component.html',
  styleUrls: ['./post-job-footer.component.css']
})
export class PostJobFooterComponent implements OnInit {


  @Input() currentTabInfo: tabInfo;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
  @Output() onEnableJobPreviewModal: EventEmitter<boolean> = new EventEmitter();
  @Input() postJobForm: FormGroup;

  public btnType: string;
  public isOpenedJobPreviewModal: any;

  constructor() { }

  ngOnInit(): void {
  }

  onPrevious = () => {
    this.btnType = 'prev';
    this.onTabChange();
  }

  onNext = () => {
    this.btnType = 'next';
    this.onTabChange();
  }

  onTabChange = () => {
    if(this.btnType == 'next') {
      let nextTabProgressor = {} as tabInfo;
      nextTabProgressor.tabNumber = this.currentTabInfo.tabNumber + 1;
      nextTabProgressor.tabName = this.onGetTabName(nextTabProgressor.tabNumber);
      this.onTabChangeEvent.emit(nextTabProgressor);
    }
    if(this.btnType == 'prev') {
      let prevTabProgressor = {} as tabInfo;
      prevTabProgressor.tabNumber = this.currentTabInfo.tabNumber - 1;
      prevTabProgressor.tabName = this.onGetTabName(prevTabProgressor.tabNumber);
      this.onTabChangeEvent.emit(prevTabProgressor);
    }
  }

  onGetTabName = (tabNumber: number) => {
    let tabName: string = 'Personal Detail';
    switch (tabNumber) {
      case 1:
        tabName = 'Personal Detail';
        break;
      case 2:
        tabName = 'Education Experience';
        break;
      case 3:
        tabName = 'Skillsets';
        break;
      case 4:
        tabName = 'Job Preference';
        break;
      default:
        break;
    }
    return tabName;
  }

  onToggleJobPreviewModal = (status) => {
    this.onEnableJobPreviewModal.emit(status);
  }

}
