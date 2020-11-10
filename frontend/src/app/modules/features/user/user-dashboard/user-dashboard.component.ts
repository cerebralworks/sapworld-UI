import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  public currentTabInfo: tabInfo = {
    tabName: 'Profile',
    tabNumber: 1
  };

  constructor() { }

  ngOnInit(): void {
  }

  onTabChange = (tabInfo: tabInfo) => {
    this.currentTabInfo = tabInfo;
  }

}
