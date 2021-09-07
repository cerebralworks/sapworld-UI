import { Component, OnInit } from '@angular/core';

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

	constructor(
	) { }

	updateUrl = (event) => {
		console.log(event);
	}
	
	/**
	**	To triggeres when the page loads
	**/
	
	ngOnInit(): void {
		this.profileSettings = [
		  {field: 'phone', label: 'Phone Numer'},
		  {field: 'email', label: 'Email ID'},
		  {field: 'open_jobs', label: 'Open Jobs'},
		  {field: 'emplyees', label: 'Employees'}
		];
		this.randomNum = Math.random();
		
	}
	

	
	

}
