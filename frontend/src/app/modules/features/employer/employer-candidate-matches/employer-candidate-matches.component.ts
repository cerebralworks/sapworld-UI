import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserService } from '@data/service/user.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-employer-candidate-matches',
  templateUrl: './employer-candidate-matches.component.html',
  styleUrls: ['./employer-candidate-matches.component.css']
})
export class EmployerCandidateMatchesComponent implements OnInit {

  public isOpenedResumeModal: boolean;
  public isOpenedSendMailModal: boolean;
  public page: number = 1;
  public limit: number = 25;
  public userList: any[] = [];
  public userMeta: any;
  userInfo: any;

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private userService: UserService,
    private employerSharedService: EmployerSharedService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.onGetCandidateList();
  }

  onGetCandidateList() {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.status = 1;
    if(requestParams.job_types && requestParams.job_types.length) {
      requestParams.job_types = requestParams.job_types.join(',')
    }


    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.userService.getUsers(removeEmpty).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.userList = [...this.userList, ...response.items];
        }
        this.userMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    this.onGetCandidateList();
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
