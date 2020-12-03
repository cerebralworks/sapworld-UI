import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tabInfo, tabProgressor } from '@data/schema/create-candidate';

@Component({
  selector: 'app-create-candidate-footer',
  templateUrl: './create-candidate-footer.component.html',
  styleUrls: ['./create-candidate-footer.component.css']
})
export class CreateCandidateFooterComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();

  public btnType: string;
  isOpenedRegisterReviewModal: any;

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

  onToggleRegisterReview = (status) => {
    this.isOpenedRegisterReviewModal = status;
  }


}