import { Component, OnInit } from '@angular/core';
import { tabInfo, tabProgressor } from '@data/schema/create-candidate';

import { trigger, transition, query, style, animate, group } from '@angular/animations';

const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
      optional: true,
    }),
  ]),
];


@Component({
  selector: 'app-create-candidate-layout',
  templateUrl: './create-candidate-layout.component.html',
  styleUrls: ['./create-candidate-layout.component.css'],
  animations: [
    trigger('animSlider', [
      transition(':increment', right),
      transition(':decrement', left),
    ]),
  ],
})
export class CreateCandidateLayoutComponent implements OnInit {

  public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'Personal Detail'};
  public currentProgessor: tabProgressor;
  public slidingCounter: number = 0;
  public slindingList: Array<number> = [1, 2, 3, 4];
  isOpenedRegisterReviewModal: any;

  constructor() { }

  ngOnInit(): void {
  }

  onNext() {
    if (this.slidingCounter != this.slindingList.length - 1) {
      this.slidingCounter++;
    }
  }

  onPrevious() {
    if (this.slidingCounter > 0) {
      this.slidingCounter--;
    }
  }

  onHeaderTabChange = (currentTabInfo: tabInfo) => {
    // if(currentTabInfo.tabNumber == 2) {
    //   // this.slidingCounter = 1;
    //   this.slindingList.push(2);
    // }

    // if(currentTabInfo.tabNumber == 3) {
    //   if(!this.slindingList.includes(2)) {
    //     this.slindingList.push(2);
    //   }
    //   if(!this.slindingList.includes(3)) {
    //     this.slindingList.push(3);
    //   }
    //   // this.slidingCounter = 2;
    // }

    // if(currentTabInfo.tabNumber == 4) {
    //   if(!this.slindingList.includes(2)) {
    //     this.slindingList.push(2);
    //   }
    //   if(!this.slindingList.includes(3)) {
    //     this.slindingList.push(3);
    //   }
    //   if(!this.slindingList.includes(4)) {
    //     this.slindingList.push(4);
    //   }
    //   // this.slidingCounter = 3;
    // }

    // if(!this.slindingList.includes(currentTabInfo.tabNumber)) {
    //   this.slindingList = [...this.slindingList, currentTabInfo.tabNumber];
    // }else {
    //   const index = this.slindingList.indexOf(currentTabInfo.tabNumber);
    //   this.slindingList.splice(index, 1)
    // }
    // if(currentTabInfo.tabNumber > this.currentTabInfo.tabNumber) {
    //   this.onNext()
    // }
    // if(currentTabInfo.tabNumber < this.currentTabInfo.tabNumber) {
    //   this.onPrevious();
    // }
    this.currentTabInfo = { ...currentTabInfo};
  }

  onFooterTabChange = (currentTabInfo: tabInfo) => {
    // if(!this.slindingList.includes(currentTabInfo.tabNumber)) {
    //   this.slindingList = [...this.slindingList, currentTabInfo.tabNumber];
    // }else {
    //   const index = this.slindingList.indexOf(currentTabInfo.tabNumber);
    //   this.slindingList.splice(index, 1)
    // }


    if(currentTabInfo.tabNumber > this.currentTabInfo.tabNumber) {
      this.onNext()
    }
    if(currentTabInfo.tabNumber < this.currentTabInfo.tabNumber) {
      this.onPrevious();
    }

    this.currentTabInfo = { ...currentTabInfo};
  }

  // onFooterTabChange = (currentTabInfo: tabProgressor) => {
  //   if(!this.slindingList.includes(currentTabInfo.nextTab)) {
  //     this.slindingList = [...this.slindingList, currentTabInfo.nextTab];
  //   }else {
  //     const index = this.slindingList.indexOf(currentTabInfo.currentTab);
  //     this.slindingList.splice(index, 1)
  //   }

  //   this.currentProgessor = currentTabInfo;
  //   this.currentTabInfo = { tabNumber: currentTabInfo.nextTab, tabName: currentTabInfo.nextTabName};
  //   console.log('this.currentTabInfo', this.slindingList);

  //   if(currentTabInfo.currentTab < currentTabInfo.nextTab) {
  //     this.onNext()
  //   }
  //   if(currentTabInfo.currentTab > currentTabInfo.nextTab) {
  //     this.onPrevious();
  //   }
  // }

  onToggleRegisterReview = (status) => {
    this.isOpenedRegisterReviewModal = status;
  }

}
