import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';

@Component({
  selector: 'app-employer-setting',
  templateUrl: './employer-setting.component.html',
  styleUrls: ['./employer-setting.component.css']
})
export class EmployerSettingComponent implements OnInit {
	public tab1 : boolean = true;
	public tab2 : boolean = false;
	public notificationSettings :any[] = [];
	public employerDetails: any;
	public privacyProtection: any;
	constructor(	
		private router: Router,
		private employerSharedService :EmployerSharedService,
		private  employerService : EmployerService
	) { }

	/**
	**	Initially the Component loads
	**/
	
	ngOnInit(): void {
		this.notificationSettings = [
		  {field: 'new_match', label: 'New User Matches'},
		  {field: 'new_candidate_applied', label: 'New Candidate Applied'},
		  {field: 'matching_canditate_respond', label: 'Matching Candidate Responded'}  	 
		];
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
					this.employerDetails = details;
					this.privacyProtection = details.privacy_protection;					
					if(this.privacyProtection==null || this.privacyProtection ==undefined){
						this.privacyProtection={
						  'new_match':false,
						  'new_candidate_applied':false,
						  'matching_canditate_respond':false
						  
						}
					}
			}
		)
		

	}
	
	OnNotification(){
	this.tab1= false;
	this.tab2= true;
	}
	OnAccount(){
	this.tab1= true;
	this.tab2= false;
	}
	 onSetSettings = (item: any, eventValue: boolean) => {
		this.privacyProtection[item.field] = eventValue;
		this.setPrivacy(this.privacyProtection);
		
	}
	setPrivacy(privacyProtection) {
		
			let requestParams = {...this.employerDetails};
			requestParams.privacy_protection = privacyProtection;
			this.employerService.update(requestParams).subscribe(
				response => {		
				})
	}
}
