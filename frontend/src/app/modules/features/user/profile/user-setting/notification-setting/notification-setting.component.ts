import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { UserSharedService } from '@data/service/user-shared.service';
@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.css']
})
export class NotificationSettingComponent implements OnInit {
public notificationSettings :any[] = [];
public privacyProtection: any;
public currentProfileInfo: any;
  constructor(
			private userService :UserService,
			private userSharedService: UserSharedService
  ) {}


	/**
	**	To initialize the page loads
	**/
	
  ngOnInit(): void {
  this.notificationSettings = [
		  {field: 'new_match', label: 'New Job Matches'},
		  {field: 'employer_mail_send', label: 'Employer Send Mail'},
		  {field: 'profile_shortlisted', label: 'Profile Shortlisted'},
		  {field: 'profile_rejected', label: 'Profile Rejected'},
		  {field: 'interview_scheduled', label: 'Interview Scheduled'}		 
		];
	this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				this.currentProfileInfo = response;
				this.privacyProtection = response.privacy_protection;
				if(this.privacyProtection==null || this.privacyProtection ==undefined){
						this.privacyProtection={
						  'new_match':false,
						  'employer_mail_send':false,
						  'profile_shortlisted':false,
						  'profile_rejected':false,
						  'interview_scheduled':false
						  
						}
					}
				})

  }
  
  
	/**
	**	To notificationSettings button controls
	**/ 
	
 onNotificationSettings = (item: any, eventValue: boolean) => {
		this.privacyProtection[item.field] = eventValue;
		this.setPrivacy(this.privacyProtection);
	}
    setPrivacy(privacyProtection) {
			let requestParams = {...this.currentProfileInfo};
			requestParams.privacy_protection = privacyProtection;
			requestParams.privacy = 'privacy';
			this.userService.update(requestParams).subscribe(
				response => {}
			)	
	}

}
