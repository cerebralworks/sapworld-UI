import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-employer-dashboard',
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.css']
})
export class EmployerDashboardComponent implements OnInit {

  public currentTabInfo: tabInfo = {
    tabName: 'Profile',
    tabNumber: 1
  };
  isOpenedSendMailModal: any;

  constructor() { }

  ngOnInit(): void {
  }

  onTabChange = (tabInfo: tabInfo) => {
    this.currentTabInfo = tabInfo;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
