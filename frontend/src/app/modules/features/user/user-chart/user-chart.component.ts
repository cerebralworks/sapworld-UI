import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {PageEvent} from '@angular/material/paginator';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { ChartOptions,ChartType,BorderWidth } from 'chart.js';
import { MultiDataSet, Label,Color } from 'ng2-charts';

@Component({
  selector: 'app-user-chart',
  templateUrl: './user-chart.component.html',
  styleUrls: ['./user-chart.component.css']
})
export class UserChartComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
		public currentUserDetails:any ;
		
		// Doughnut
		
		public doughnutChartLabels: Label[] = [];
		public doughnutChartData: MultiDataSet = [];
		
		public doughnutChartLabelsApplied: Label[] = [];
		public doughnutChartDataApplied: MultiDataSet = [];
		
		public doughnutChartLabelsAvailability: Label[] = [];
		public doughnutChartDataAvailability: MultiDataSet = [];
		
		public doughnutChartLabelsType: Label[] = [];
		public doughnutChartDataType: MultiDataSet = [];
		
		public doughnutChartLabelsVisa: Label[] = [];
		public doughnutChartDataVisa: MultiDataSet = [];
		
		public doughnutChartType: ChartType = 'doughnut'; 
		public doughnutBorderWidth: BorderWidth = 0; 
		public doughnutChartColors: Color[] = [{
			backgroundColor: [
				"#f9863e",
				"#59c1dc",
				"#7db861",
				"#ffce45",
				"#07315c"
			]
		}]
		public doughnutOptions: ChartOptions ={
			cutoutPercentage: 66,
			responsive: true,
			legend: {
				display: true,
				position: 'left',
				labels: {
					fontSize: 12,
					usePointStyle: true  //<-- set this
				}
			}
		};
		
		public totalMatches :any =0;
		public totalApplied :any =0;
		public totalVisa :any =0;
		public totalAvailability :any =0;
		public totalType :any =0;
		public showMatches :boolean = false;
		public showApplied :boolean = false;
		public showAvailiability :boolean = false;
		public showType :boolean = false;
		public showVisa :boolean = false;
		
		
	/**	
	**	To implement the package section constructor
	**/
	
	constructor(
		private userService: UserService,
		private modelService: NgbModal,
		private employerService : EmployerService,
		private userSharedService: UserSharedService
	) { }

	/**
	**		When the page loads the OnInitCalls 
	**/
	
	ngOnInit(): void {
      this.userSharedService.getUserProfileDetails().subscribe(
        details => {
          if(details) {
            this.currentUserDetails = details;
			
          }
        }
      )
		this.onGetMatchesDetails();
		this.onGetAvailabilityDetails();
		this.onGetTypeDetails();
		this.onGetVisaDetails();
		this.onGetAppliedJobs();
	}

	/**
	**	To get the Applied Jobs Details API Calls
	**/

	onGetMatchesDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'matches';
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				var filterData = response.data.map(function(a,b){ return a.country.charAt(0).toUpperCase() + a.country.substr(1) });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabels = filterData;
				this.doughnutChartData = [filterValue];
				this.showMatches = true;
				this.totalMatches = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
			
        }, error => {
        }
      )
	}
	
	onGetAppliedJobs = () => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'applied';
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				var filterData = response.data.map(function(a,b){ return   a.country.charAt(0).toUpperCase() + a.country.substr(1) });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsApplied = filterData;
				this.doughnutChartDataApplied = [filterValue];
				this.showApplied = true;
				this.totalApplied = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
        }, error => {
        }
      )
	}
	onGetAvailabilityDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'availability';
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				var filterData = response.data.map(function(a,b){  if(a.availability =='0'){
					return 'Immediate'
				}else{ return a.availability+' Days' } });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsAvailability = filterData;
				this.doughnutChartDataAvailability = [filterValue];
				this.showAvailiability = true;
				this.totalAvailability = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
        }, error => {
        }
      )
	}
	onGetTypeDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'type';
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				var filterData = response.data.map(function(a,b){ 
				if(a.type =='1000'){
					return 'Full Time'
				}if(a.type =='1001'){
					return 'Part Time'
				}if(a.type =='1002'){
					return 'Contract'
				}if(a.type =='1003'){
					return 'Freelance'
				}if(a.type =='1004'){
					return 'Internship'
				}
				 });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsType = filterData;
				this.doughnutChartDataType = [filterValue];
				this.showType = true;
				this.totalType = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
        }, error => {
        }
      )
	}
	onGetVisaDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'visa';
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				var filterData = response.data.map(function(a,b){ return a.country.charAt(0).toUpperCase() + a.country.substr(1) });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsVisa = filterData;
				this.doughnutChartDataVisa = [filterValue];
				this.showVisa = true;
				this.totalVisa = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
        }, error => {
        }
      )
	}
}
