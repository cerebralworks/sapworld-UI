import { Component, OnInit } from '@angular/core';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.css']
})
export class EmployerProfileComponent implements OnInit {

  public companyProfileInfo: any;
  public employerDetails: any;
  public profileSettings: any[] = [];
  public isLoading: boolean;
  public page: any = 1;
  public limit: number = 25;
  public postedJobs: any[] = [];
  public postedJobMeta: any = {};
  public validateSubscribe: number = 0;
  public randomNum: number;
  public privacyProtection: any;

  constructor(
    private employerService: EmployerService,
    private toastrService: ToastrService,
    private employerSharedService: EmployerSharedService,
    public utilsHelperService: UtilsHelperService
  ) { }

  updateUrl = (event) => {
    console.log(event);

  }

  ngOnInit(): void {
	  this.profileSettings = [
      {field: 'phone', label: 'Phone Numer'},
      {field: 'email', label: 'Email ID'},
      {field: 'open_jobs', label: 'Open Jobs'},
      {field: 'emplyees', label: 'Employees'}
    ];
    this.randomNum = Math.random();
    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if (!this.utilsHelperService.isEmptyObj(details) && this.validateSubscribe == 0) {
          this.employerDetails = details;
          this.privacyProtection = details.privacy_protection;
		  if(this.privacyProtection==null || this.privacyProtection ==undefined){
			  this.privacyProtection={
				  'phone':false,
				  'email':false,
				  'open_jobs':false,
				  'emplyees':false
			  }
		  }
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
  
    onSetSettings = (item: any, eventValue: boolean) => {
    this.privacyProtection[item.field] = eventValue;
    this.setPrivacy(this.privacyProtection);
  }

  setPrivacy(privacyProtection) {
    if(this.employerDetails && !this.utilsHelperService.isEmptyObj(this.employerDetails)) {
      this.isLoading = true;
      let requestParams = {...this.employerDetails};
      requestParams.privacy_protection = privacyProtection;

      this.employerService.update(requestParams).subscribe(
        response => {
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
          this.toastrService.error('Something went wrong', 'Failed');        }
      )
    }

  }

}
