import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import { environment as env } from '@env';
@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.css']
})
export class EmployerProfileComponent implements OnInit {
	
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
	public employerprofilepath: any;
	constructor(
		private employerService: EmployerService,
		private toastrService: ToastrService,
		private employerSharedService: EmployerSharedService,
		private ref: ChangeDetectorRef,
		public utilsHelperService: UtilsHelperService
	) { }

	updateUrl = (event) => {
		console.log(event);
	}
	
	/**
	**	To triggeres when the page loads
	**/
	
	ngOnInit(): void {
		this.profileSettings = [
		  {field: 'phone', label: 'profileSettings.phone'},
		  {field: 'email', label: 'profileSettings.email'},
		  {field: 'open_jobs', label: 'profileSettings.openJobs'},
		  {field: 'emplyees', label: 'profileSettings.employees'}
		];
		this.randomNum = Math.random();
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				if (!this.utilsHelperService.isEmptyObj(details) && this.validateSubscribe ==0 ) {
					this.employerDetails = details;
					this.employerprofilepath = `${env.apiUrl}/images/employer/${details.photo}`;
					this.privacyProtection = details.privacy_protection;					
					if(this.privacyProtection==null || this.privacyProtection ==undefined){
						this.privacyProtection={
						  'phone':false,
						  'email':false,
						  'open_jobs':false,
						  'emplyees':false,
						  'invite_url':false
						}
					}
					this.onGetPostedJob(this.employerDetails.id);
					this.validateSubscribe ++;
				}
			}
		)
		this.onGetProfileInfo();
	}
	
	/**
	**	To get the posted job details
	**/
	
	onGetPostedJob(companyId) {
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				this.postedJobs=[];
				this.postedJobMeta ={};
				if(response && response.items && response.items.length > 0) {
					this.postedJobs = [...this.postedJobs, ...response.items];
				}
				this.postedJobMeta = { ...response.meta };
			}, error => {
			}
		)
	}
	
	/**
	**	To get the profile information
	**/
	
	onGetProfileInfo() {
		let requestParams: any = {};
		this.employerService.getCompanyProfileInfo(requestParams).subscribe(
			(response: any) => {
				this.companyProfileInfo = { ...response.details };
			}, error => {
				this.companyProfileInfo = {};
			}
		);
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
			   this.employerprofilepath = `${env.apiUrl}/images/employer/${details.photo}`;
			});
	}
	
	/**
	**	To loads more job details
	**/
	
	onLoadMoreJob = () => {
		this.page = this.page + 1;
		if(this.employerDetails.id) {
			this.onGetPostedJob(this.employerDetails.id);
		}
	}
	
	/**
	**	To set the privacy production status 
	**/
	
    onSetSettings = (item: any, eventValue: boolean) => {
		this.privacyProtection[item.field] = eventValue;
		this.setPrivacy(this.privacyProtection);
		
	}
	
	/**
	**	To update the privacy status
	**/
	
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
					this.toastrService.error('Something went wrong', 'Failed');      
				}
			)
		}
		
	}
	
	

}
