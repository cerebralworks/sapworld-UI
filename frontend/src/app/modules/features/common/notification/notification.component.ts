import { Component, OnInit,HostListener } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { DataService } from '@shared/service/data.service';
import {PageEvent} from '@angular/material/paginator';
import {
    PushNotificationsService
} from '@shared/service/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

	public screenWidth: any;
	public loggedInResponse: LoggedIn;
	public notificationDetails:any =[];
	public notificationDetailsMeta:any ={};
	public page: number = 0;
	public limit: number = 20;
	length = 0;
	public totalValue = 0;
	pageIndex = 1;
	pageSizeOptions = [ 20, 50,100,200];
	
	constructor(
		private sharedApiService?: SharedApiService,
		private router?: Router,
		private accountService?: AccountService,
		private employerService?: EmployerService,
		private dataService?: DataService,
		private employerSharedService?: EmployerSharedService, 
		private _notificationService?: PushNotificationsService
	) { }
	
	/**
	**	To intialize the component 
	**/
	ngOnInit(): void {
	  this.screenWidth = window.innerWidth;	
		this.checkUserLoggedIn();
		this.dataService.getNotificationDataSource().subscribe(
		  response => {
			if(response && response['total']) {
				if(response['total'] ==true ){
					this.getNotificationDetails();
				}
			}
		  }, error => {
		  });
			  
	}
	
	/**
	**	To check the user is login or not
	**/
	checkUserLoggedIn = () => {
		this.accountService.checkUserloggedIn().subscribe(
		  response => {
			this.loggedInResponse = response;
			
			this.getNotificationDetails();
		  },
		  error => {
		  }
		);
	};
	
	/**
	**	To get the notification details
	**/
	getNotificationDetails(){
		
		let requestParams:any ={};
		if(this.loggedInResponse && this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(1))){
		  requestParams.view = 'employee';
		  
		}else if(this.loggedInResponse && this.loggedInResponse.isLoggedIn && (this.loggedInResponse && this.loggedInResponse.role && this.loggedInResponse.role.includes(0))) {
		  requestParams.view = 'user';
		}
		requestParams.limit = this.limit;
		requestParams.page = this.page;
		this.employerService.onGetNotificationDetails(requestParams).subscribe(
		  response => {
			if(response && response['details']) {
				response['details'].forEach(item => {
				    var temp = item.message.split('//');
					if(item.title=='New User Matches'){
						item['path'] = temp[0];
						item['country'] = temp[1];
						item['message'] = '';
					} 
					if(item.title=='New Application Request'){
						 item['message'] = temp[0];
						item['path'] = temp[1];
						item['country'] = temp[2];
					} 
					if(item.title =='Multiple User Matches'){
						item['path2'] = temp[0];
						item['message'] = temp[1];
						item['path'] = temp[2];
					}
					if(item.title =='Multiple Job Matches'){
						item['message'] = temp[0];
						item['path4'] = temp[1];
						
					}
					if(item.title=='Application Under Review'|| item.title=='New Job Matches' || item.title=='Application Shortlisted' || item.title=='Event scheduled'){
						 item['message'] = temp[0];
						item['path1'] = temp[1];
					}
					if(item.title=='Job Invitation' || item.title=='New Meeting Link' || item.title=='New Invite Link' || item.title=='New schedule status'){
						 item['message'] = temp[0];
						item['path1'] = temp[1];
						item['message1'] = temp[2];
					}
				});
			  this.notificationDetails = response['details'];
			  this.notificationDetailsMeta = response['meta'];
			  this.length = this.notificationDetailsMeta['total'];
			  console.log(this.notificationDetails);
			}
		  }, error => {
		  }
		);
		
	}

	/**
	**	To handle the pagination
	**/	
	
	handlePageEvent(event: PageEvent) {
		this.limit = event.pageSize;
		this.page = event.pageIndex;
		this.getNotificationDetails();
	}
	
	@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
}
