import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { GetResponse } from '@data/schema/response';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-job-detail-view',
  templateUrl: './job-detail-view.component.html',
  styleUrls: ['./job-detail-view.component.css']
})
export class JobDetailViewComponent implements OnInit {

  public isOpenedJDModal: boolean = false;
  public postedJobsDetails: any = {};
  public skills: GetResponse;
  public industries: GetResponse;
  public loggedUserInfo: LoggedIn;
  public previousUrl: string;
  public postedJobs: any[] = [];
  public postedJobMeta: any = {};
  public limit: number = 25;
  public page: number = 1;
  public validateSubscribe: number = 0;

  constructor(
    public employerService: EmployerService,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private accountService: AccountService,
    private location: Location,
    public utilsHelperService: UtilsHelperService,
    private employerSharedService: EmployerSharedService
  ) {
  }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if(jobId) {
      this.onGetPostedJobDetails(jobId);
      this.onGetSkill();
      this.onGetIndustries();
    }

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          if((details && details.id) && this.validateSubscribe == 0) {
            // this.onGetPostedJob(details.id);
            this.validateSubscribe ++;
          }
        }
      }
    )

    this.accountService
      .isCurrentUser()
      .subscribe(response => {
        this.loggedUserInfo = response;
      });
  }

  onRedirectBack = () => {
    this.location.back();
  }

  onGetPostedJobDetails(jobId) {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = jobId;
    this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
        if(response && response.details) {
          this.postedJobsDetails = response.details;
        }
      }, error => {
      }
    )
  }

  onGetPostedJob(companyId) {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    requestParams.company = companyId;
    requestParams.sort = 'most_popular.desc';
    this.employerService.getPostedJob(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.postedJobs = [...this.postedJobs, ...response.items];
        }
        this.postedJobMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

  onFindSkillsFromID = (arrayValues: Array<any>) => {
    if(this.skills && this.skills.items && Array.isArray(this.skills.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
      const temp = this.skills.items.filter(r=> {
        return arrayValues.includes(r.id)
      });
      return this.onConvertArrayObjToString(temp, 'tag');
    }
    return '--';
  }

  onFindDomainFromID = (arrayValues: Array<any>) => {
    if(this.industries && this.industries.items && Array.isArray(this.industries.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
      const temp = this.industries.items.filter(r=> {
        return arrayValues.includes(r.id)
      });
      return this.onConvertArrayObjToString(temp, 'name');
    }
    return '--';
  }

  onFindSkillsFromSingleID = (value: any) => {
    if(value && this.skills && this.skills.items && Array.isArray(this.skills.items)) {
      const temp = this.skills.items.find(r=> {
        return value == r.id
      });
      return temp;
    }
    return '--';
  }

  onGetSkill() {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getSkill(requestParams).subscribe(
      response => {
        this.skills = response;
      }, error => {
      }
    )
  }

  onGetIndustries() {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getIndustries(requestParams).subscribe(
      response => {
        this.industries = response;
      }, error => {
      }
    )
  }

  onConvertArrayToString = (value: any[]) => {
    if (!Array.isArray(value)) return "--";
    return value.join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if ((!Array.isArray(value) || value.length==0)) return "--";
    return value.map(s => s[field]).join(", ");
  }

  onGetYesOrNoValue = (value: boolean) => {
    if (value == true) {
      return "Yes";
    } else {
      return "No"
    }
  }

  onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?:string) => {
    if (!Array.isArray(value) || value.length == 0) return "--";
    return value.map(s => {
      let element = this.onFindSkillsFromSingleID(s.domain);
      if(field && (element && element.tag)) {
        return element.tag + ' (' + s.experience + ' ' + s.experience_type + ')'
      }
    }).join(", ");
  }

  onSplitValueWithNewLine = (value: string) => {
    if (value == "" || value == "-") return "-";
    if (value) {
      let splitValue: any = value.split(",");
      splitValue = splitValue.join(", \n");
      return splitValue;
    }
  };

}
