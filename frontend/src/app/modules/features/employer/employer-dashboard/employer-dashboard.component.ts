import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { tabInfo } from '@data/schema/create-candidate';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

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
  public queryParams: any = {};

  constructor(
    private route: ActivatedRoute,
     private router: Router,
     private utilsHelperService: UtilsHelperService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        this.queryParams = {...params}
      }
    });
  }

  ngOnInit(): void {
    const activeTab = this.route.snapshot.queryParamMap.get('activeTab');
    if(activeTab) {
      switch (activeTab) {
        case 'postedJobs':
          this.onTabChange({tabName: 'postedJobs', tabNumber: 1})
          break;
        case 'matches':
          this.onTabChange({tabName: 'matches', tabNumber: 2})
          break;
        case 'applicants':
          this.onTabChange({tabName: 'applicants', tabNumber: 3})
          break;
        case 'shortlisted':
          this.onTabChange({tabName: 'shortlisted', tabNumber: 4})
          break;
        case 'savedProfile':
          this.onTabChange({tabName: 'savedProfile', tabNumber: 5})
          break;
        default:
          break;
      }
    }
  }

  onTabChange = (tabInfo: tabInfo) => {
    this.currentTabInfo = tabInfo;

    const navigationExtras: NavigationExtras = {
      queryParams: {...this.queryParams, activeTab: tabInfo.tabName}
    };

    this.router.navigate([], navigationExtras);
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
