import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '@data/service/account.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile-setting',
  templateUrl: './user-profile-setting.component.html',
  styleUrls: ['./user-profile-setting.component.css']
})
export class UserProfileSettingComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	@Input() isDashboard: boolean = false;
	public profileSettings: any[] = [];
	public isLoading: boolean;
	public currentProfileInfo: any;
	public privacyProtection: any;

	constructor(
		private userService: UserService,
		private toastrService: ToastrService,
		private userSharedService: UserSharedService,
		private utilsHelperService: UtilsHelperService
	) { }

	/**
	**	To initialize the page loads
	**/	
	  
	ngOnInit(): void {
		this.profileSettings = [
		  {field: 'photo', label: 'Profile Image'},
		  {field: 'phone', label: 'Phone Numer'},
		  {field: 'email', label: 'Email ID'},
		  {field: 'current_employer', label: 'Current Employer'},
		  {field: 'reference', label: 'Reference'},
		  {field: 'available_for_opportunity', label: 'Open to Opportunity'}
		];

		this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				this.currentProfileInfo = response;
				if(this.currentProfileInfo && this.currentProfileInfo.privacy_protection) {
					this.privacyProtection = {...this.currentProfileInfo.privacy_protection}
				}
				if (this.currentProfileInfo && this.currentProfileInfo.latlng_text) {
					const splitedString: any[] = this.currentProfileInfo.latlng_text.split(',');
					if (splitedString && splitedString.length) {
						this.currentProfileInfo.latlng =  {
							lat: splitedString[0],
							lng: splitedString[1]
						}
					}
				}
			}
		)
	}

	/**
	**	To Check the privacy data's
	**/	
	  
	onSetSettings = (item: any, eventValue: boolean) => {
		this.privacyProtection[item.field] = eventValue;
		this.setPrivacy(this.privacyProtection);
	}

	/**
	**	To Set the privacy details Changes
	**/	
	  
	setPrivacy(privacyProtection) {
		if(this.currentProfileInfo && !this.utilsHelperService.isEmptyObj(this.currentProfileInfo)) {
			this.isLoading = true;
			let requestParams = {...this.currentProfileInfo};
			requestParams.privacy_protection = privacyProtection;
			requestParams.privacy = 'privacy';
			this.userService.update(requestParams).subscribe(
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
