import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LoggedIn } from '@data/schema/account';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { DataService } from '@shared/service/data.service';
//import {PageEvent} from '@angular/material/paginator';
import {
    PushNotificationsService
} from '@shared/service/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

	public loggedInResponse: LoggedIn;
	public notificationDetails:any =[];
	public notificationDetailsMeta:any ={};
	public page: number = 0;
	public limit: number = 1000;
	length = 0;
	public totalValue = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	
	constructor(
		private sharedApiService?: SharedApiService,
		private router?: Router,
		private accountService?: AccountService,
		private employerService?: EmployerService,
		private dataService?: DataService,
		private employerSharedService?: EmployerSharedService, 
		private _notificationService?: PushNotificationsService
	) { }

	ngOnInit(): void {
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
			  this.notificationDetails = response['details'];
			  this.notificationDetailsMeta = response['meta'];
			}
		  }, error => {
		  }
		);
		
	}

	/**
	**	To handle the pagination
	**/	
	
	/* handlePageEvent(event: PageEvent) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.getNotificationDetails();
	} */
}
