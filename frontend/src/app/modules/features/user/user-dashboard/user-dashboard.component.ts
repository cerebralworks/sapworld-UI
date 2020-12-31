import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    const activeTab = this.route.snapshot.queryParamMap.get('activeTab');
    if(activeTab) {
      switch (activeTab) {
        case 'profile':
          this.onTabChange({tabName: 'profile', tabNumber: 1})
          break;
        case 'matches':
          this.onTabChange({tabName: 'matches', tabNumber: 2})
          break;
        case 'visaSponsored':
          this.onTabChange({tabName: 'visaSponsored', tabNumber: 3})
          break;
        case 'applied':
        this.onTabChange({tabName: 'applied', tabNumber: 4})
        break;
      case 'shortlisted':
        this.onTabChange({tabName: 'shortlisted', tabNumber: 5})
        break;
      case 'resume':
        this.onTabChange({tabName: 'resume', tabNumber: 6})
        break;
        default:
          break;
      }
    }
  }

  onTabChange = (tabInfo: tabInfo) => {
    this.currentTabInfo = tabInfo;
    const navigationExtras: NavigationExtras = {
      queryParams: {activeTab: tabInfo.tabName}
    };

    this.router.navigate([], navigationExtras);
  }

}
