import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public isOpenedSendMailModal: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const activeTab = this.route.snapshot.queryParamMap.get('activeTab');
    if(activeTab) {
      switch (activeTab) {
        case 'postedJobs':
          this.onTabChange({tabName: 'Posted Jobs', tabNumber: 1})
          break;
        case 'matches':
          this.onTabChange({tabName: 'Matches', tabNumber: 2})
          break;
        case 'applicants':
          this.onTabChange({tabName: 'Applicants', tabNumber: 3})
          break;
        default:
          break;
      }
    }
  }

  onTabChange = (tabInfo: tabInfo) => {
    this.currentTabInfo = tabInfo;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
