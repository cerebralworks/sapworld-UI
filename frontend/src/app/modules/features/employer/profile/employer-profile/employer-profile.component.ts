import { Component, OnInit } from '@angular/core';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.css']
})
export class EmployerProfileComponent implements OnInit {

  public companyProfileInfo: any;
  public employerDetails: any;
  public page: any = 1;
  public limit: number = 25;
  public postedJobs: any[] = [];
  public postedJobMeta: any = {};
  public validateSubscribe: number = 0;
  public randomNum: number;

  constructor(
    private employerService: EmployerService,
    private employerSharedService: EmployerSharedService,
    public utilsHelperService: UtilsHelperService
  ) { }

  updateUrl = (event) => {
    console.log(event);

  }

  ngOnInit(): void {
    this.randomNum = Math.random();
    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if (!this.utilsHelperService.isEmptyObj(details) && this.validateSubscribe == 0) {
          this.employerDetails = details;
          this.onGetPostedJob(this.employerDetails.id);
          this.validateSubscribe ++;
        }
      }
    )

    this.onGetProfileInfo();
  }

  onGetPostedJob(companyId) {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    requestParams.company = companyId;
    requestParams.sort = 'created_at.desc';
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

  onGetProfileInfo() {
    let requestParams: any = {};
    this.employerService.getCompanyProfileInfo(requestParams).subscribe(
      (response: any) => {
        this.companyProfileInfo = { ...response.details };
      }, error => {
        this.companyProfileInfo = {};
      }
    )
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    if(this.employerDetails.id) {
      this.onGetPostedJob(this.employerDetails.id);
    }
  }

}
