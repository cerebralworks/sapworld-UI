import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/services/utils-helper.service';
import { environment as env } from '@env';
@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
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
	public adminprofilepath:any;
	constructor(
		private employerService: EmployerService,
		private ref: ChangeDetectorRef,
		private employerSharedService: EmployerSharedService,
		public utilsHelperService: UtilsHelperService
	) { 
		this.onGetProfileInfo();
	}

	updateUrl = (event) => {
		console.log(event);
	}
	
	/**
	**	To triggeres when the page loads
	**/
	
	ngOnInit(): void {
		
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
					this.validateSubscribe ++;
				}
			}
		)
		this.ref.detectChanges();
		this.ref.detectChanges();
	}
	
	
	/**
	**	To get the profile information
	**/
	
	onGetProfileInfo() {
		let requestParams: any = {};
		this.employerService.getCompanyProfileInfo(requestParams).subscribe(
			(response: any) => {
				this.adminprofilepath = `${env.apiPath}/images/admin/${response.details.photo}`;
				this.companyProfileInfo = { ...response.details };
				this.companyProfileInfo['meta'] = response.meta;
				this.ref.detectChanges();
			}, error => {
				this.companyProfileInfo = {};
			}
		)
	}
	
}
