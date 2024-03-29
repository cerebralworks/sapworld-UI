import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewChild,ViewChildren,QueryList,HostListener   } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import { EmployerService } from '@data/service/employer.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';
//import { ChartOptions,ChartType,BorderWidth,ChartTooltipItem,ChartData, ChartDataSets } from 'chart.js';
//import { MultiDataSet, Label,Color ,BaseChartDirective } from 'ng2-charts';

//import { DaterangepickerComponent,DaterangepickerConfig   } from 'ng2-daterangepicker';

import * as moment from 'moment';

//import {  ChartOptions } from 'chart.js';

import { ChartDataset,Chart,TooltipItem, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-employee-chart',
  templateUrl: './employee-chart.component.html',
  styleUrls: ['./employee-chart.component.css']
})
export class EmployeeChartComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
		public currentUserDetails:any ;
		public currentEmployerDetails:any ;
		//@ViewChild(DaterangepickerComponent)
		//private picker: DaterangepickerComponent;
		
		// Doughnut
		//@ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;
		
		//Location Variables
        //public doughnutChartLabels: Label[] = [];
		//public doughnutChartData: MultiDataSet = [];		
		//public countryTotal:any[]=[];
		public totalCountry :any =0;
		//public showCountry :boolean = false;
		//Job Variable
		//public doughnutChartLabelsJobs: Label[] = [];
		//public doughnutChartDataJobs: MultiDataSet = [];		
		public jobsTotal:any[]=[];
		public totalPostedJobs :any =0;
		//public showPostedJob :boolean = false;
		//Matches Variable
		//public doughnutChartLabelsMatches: Label[] = [];
		//public doughnutChartDataMatches: MultiDataSet = [];		
		//public matchesTotal:any[]=[];
		public totalMatches :any =0;
		//public showMatches :boolean = false;
		//Applicants Variable
		//public doughnutChartLabelsApplicants: Label[] = [];
		//public doughnutChartDataApplicants: MultiDataSet = [];		
		//public applicantsTotal:any[]=[];
		public totalApplicants :any =0;
		//public showApplicants :boolean = false;
		//Shortlisted Variable
		//public doughnutChartLabelsShortlisted: Label[] = [];
		//public doughnutChartDataShortlisted: MultiDataSet = [];		
		//public shortlistedTotal:any[]=[];
		public totalShortlisted :any =0;
		//public showShortlisted :boolean = false;
		//Hired Variable
		//public doughnutChartLabelsHired: Label[] = [];
		//public doughnutChartDataHired: ChartDataSets[] = [];		
		//public hiredTotal:any[]=[];
		public totalHired :any =0;
		//public showHired :boolean = false;
	    public screenWidth: any;
		public totalRejected :any = 0;
		public totalAwaiting :any = 0;
		public totalAccepted :any = 0;
		public totalInterviewed :any = 0;
		public jobStatus:any;
		public chartDetails :any;
		@ViewChild(BaseChartDirective) chart?: BaseChartDirective;
		 public barChartType:ChartType = 'bar';
 public barChartData: ChartConfiguration['data'] = {  labels: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
    datasets: [] };
 public barChartLabels: any= [];
 public barChartColors:any = [];
 public barChartLegend = false;
 
 //Bar chart options
 public barChartOptions: ChartConfiguration['options'] = {
		responsive: true,
		scales: {
		 y: {
			display: true,
			min: 0,
			suggestedMax:5,
			ticks: {
			 stepSize: 1,
			 
			  callback: (value: any, index: any, data: any) => {
				return value;
			  }
			}
		  },
		},
		plugins: {
		legend: {
			   display: true,
                labels: {
				   filter: function(legendItem, chartData) {
					if (legendItem.text === '' || legendItem.strokeStyle === 'transparent') {
					  return false;
					}
					  return true;
				   }	   
               }
            },
			
		},
	  };
		public totalApplications:any[]=[];
		/*public borders:any[]= [
				"#7cd7ff",
				"#f68383",
				"#6bc182",
				"#ffc455",
				"#a37bda",
				"#936ec5",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b"
			]*/
		//public filterChart :any[]=[];
		//public doughnutChartType: ChartType = 'doughnut'; 
		//public doughnutBorderWidth: BorderWidth = 0; 
		
		/*public doughnutChartColors: Color[] = [{
			backgroundColor: [
				"#7cd7ff",
				"#f68383",
				"#6bc182",
				"#ffc455",
				"#a37bda",
				"#936ec5",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b",
				"#5259ad",
				"#7ae013",
				"#e56996",
				"#e7b512",
				"#6b6b6b"
			]
		}]
		public doughnutOption: ChartOptions ={
			cutoutPercentage: 66,
			responsive: true,
			legend: {
				display: true,
				position: 'left',
				labels: {
					fontSize: 12,
					usePointStyle: true  //<-- set this
				} /* ,
				onClick:(e, legendItem) =>{
					if (legendItem.hidden) {
						legendItem.hidden = false;
					} else {
						legendItem.hidden = true;
					}
				}  */
			//}
		//};

		/*public doughnutOptions: ChartOptions ={
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
		
		
		public doughnutBarType: ChartType = 'bar'; 
		public myBarChart: ChartOptions ={
			responsive: true,
			maintainAspectRatio: false,
			scales: {
			  yAxes: [{
				ticks: {
				 min: 0,
				 stepSize: 1
				}
			  }]
			}
		};
		
		public showData :boolean = false;
		
		public isActive:boolean = true;
		public isClosed:boolean = false;
		public isDeleted:boolean = false;
		public isPaused:boolean = false;
		
		public startDate:any;
		public endDate:any;*/
		
	   public showChart:boolean=false;
	/**	
	**	To implement the package section constructor
	**/
	
	constructor(
		private userService: UserService,
		private modelService: NgbModal,
		private employerService : EmployerService,
		private employerSharedService: EmployerSharedService,
		//private daterangepickerOptions: DaterangepickerConfig,
		private userSharedService: UserSharedService
	) { 
		/*this.daterangepickerOptions.settings = {
            locale: { format: 'MMMM D, YYYY' },
            alwaysShowCalendars: false,
			startDate: moment().subtract(29, 'days'),
			endDate:  moment(),
            maxDate: moment(),
			ranges: {
			   'Today': [moment(), moment()],
			   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			   'This Month': [moment().startOf('month'), moment().endOf('month')],
			   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			}
        };*/
		
	}

	/**
	**		When the page loads the OnInitCalls 
	**/
	
	ngOnInit(): void {
	  this.screenWidth = window.innerWidth;
      this.employerService.profile().subscribe(
        details => {
          if(details) {
            this.currentEmployerDetails = details['details'];
			if(this.currentEmployerDetails.email ){
				//this.getDataStatus('');
				//this.onGetJobsDetails();
				this.onGetHiredTrendDetails();
				this.onGetChartDetails();
				//this.showData = true;
			}
          }
        }
      )
		
	}
	
	
	/*public selectedDate(event) {
       // this.picker.datePicker.setStartDate('2017-03-27');
       // this.picker.datePicker.setEndDate('2017-04-08');
    }
	public calendarCanceled(event) {
       // this.picker.datePicker.setStartDate('2017-03-27');
       // this.picker.datePicker.setEndDate('2017-04-08');
    }
	public calendarApplied(event) {
      //this.getDataStatus('');
    }
	*/
	/**
	**	To get the status of the view
	**
	public getDataStatus(data){
		if(data=='active'){
			if(this.isActive==true){
				this.isActive = false;
			}else{
				this.isActive = true;
			}
			
		}
		if(data=='closed'){
			if(this.isClosed==true){
				this.isClosed = false;
			}else{
				this.isClosed = true;
			}
			
		}
		if(data=='paused'){
			if(this.isPaused==true){
				this.isPaused = false;
			}else{
				this.isPaused = true;
			}
			
		}
		if(data=='deleted'){
			if(this.isDeleted==true){
				this.isDeleted = false;
			}else{
				this.isDeleted = true;
			}
			
		}
		var start =this.picker.datePicker.startDate;
		var end = this.picker.datePicker.endDate;
		var tempStartDate = start.date();
		var tempStartMonth = start.month()+1;
		var tempStartYear = start.year();
		var tempEndDate = end.date();
		var tempEndMonth = end.month()+1;
		var tempEndYear = end.year();
		this.startDate = tempStartYear+'-'+tempStartMonth+'-'+tempStartDate+' 0:00:00';
		this.endDate = tempEndYear+'-'+tempEndMonth+'-'+tempEndDate+' 23:59:59';

		this.onGetCountryDetails();
		this.onGetJobsDetails();
		this.onGetJobsMatchesDetails();
		this.onGetHiredTrendDetails();
		
	}*/
	
	/**
	**	To get the Location Jobs Details API Calls
	**/

	/*onGetCountryDetails = () => {
	  this.showCountry = false;
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'location';
      requestParams.isActive = this.isActive;
      requestParams.isClosed =  this.isClosed;
      requestParams.isDeleted =  this.isDeleted;
      requestParams.isPaused =  this.isPaused;
      requestParams.startDate =  this.startDate;
      requestParams.endDate =  this.endDate;
      this.employerService.getEmployeeDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				for(let i=0;i<response.data.length;i++){
					var temp = response.data[i]['city'].length;
					if(temp<=25){
						for(let j=temp;j<25;j++){
							response.data[i]['city'] = response.data[i]['city']+' ';						
						}
					}
				}
				
				this.countryTotal = response.data;
				var filterData = response.data.map(function(a,b){ return a.city.charAt(0).toUpperCase() + a.city.substr(1) });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabels = filterData;
				this.doughnutChartData = [filterValue];
				this.showCountry = true;
				this.totalCountry = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}else{
				this.showCountry = false;
			}
			
        }, error => {
        }
      )
	}
    */

	/**
	**	To get the Matches Jobs Details API Calls
	**/

	/*onGetJobsMatchesDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'matches';
      requestParams.isActive = this.isActive;
      requestParams.isClosed =  this.isClosed;
      requestParams.isDeleted =  this.isDeleted;
      requestParams.isPaused =  this.isPaused;
      requestParams.startDate =  this.startDate;
      requestParams.endDate =  this.endDate;
      this.employerService.getEmployeeDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				for(let i=0;i<response.data.length;i++){
					var temp = response.data[i]['title'].length;
					if(temp<=25){
						for(let j=temp;j<25;j++){
							response.data[i]['title'] = response.data[i]['title']+' ';						
						}
					}
					response.data[i]['title'] = response.data[i]['title'].substring(0,5);
				}
				this.matchesTotal = response.data;
				var filterData = response.data.map(function(a,b){ return a.title.charAt(0).toUpperCase()+ a.title.substr(1)+' - '+a.countryshort  });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsMatches = filterData;
				this.doughnutChartDataMatches = [filterValue];
				this.showMatches = true;
				this.totalMatches = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				//console.log(filterData);
			}else{
				this.showMatches = false;
			}
			
        }, error => {
        }
      )
	}
*/
	/**
	**	To get the Hired Jobs Details API Calls
	**/

	onGetHiredTrendDetails = () => {
		//this.showHired = false;
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'hiringtrend';
      /*requestParams.isActive = this.isActive;
      requestParams.isClosed =  this.isClosed;
      requestParams.isDeleted =  this.isDeleted;
      requestParams.isPaused =  this.isPaused;
      requestParams.startDate =  this.startDate;
      requestParams.endDate =  this.endDate;*/
      this.employerService.getEmployeeDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
			//console.log(response.data);
				/*for(let i=0;i<response.data.length;i++){
					var temp = response.data[i]['title'].length;
					if(temp<=25){
						for(let j=temp;j<16;j++){
							response.data[i]['title'] = response.data[i]['title']+' ';						
						}
					}
					response.data[i]['title'] = response.data[i]['title'];
				}*/
				
				//this.hiredTotal = response.data;
				//var filterData = response.data.map(function(a,b){ return a.title.charAt(0).toUpperCase()+ a.title.substr(1)  });
				this.totalPostedJobs = response.count;
				this.jobStatus = response.data;
				var filterApplicant = response.data.map(function(a,b){ return a.applicant });
				this.totalApplicants= filterApplicant.reduce((a, b) => parseInt(a) + parseInt(b) );
				var filterHired = response.data.map(function(a,b){ return a.hired });
				this.totalHired= filterHired.reduce((a, b) => parseInt(a) + parseInt(b) );
				var filterShortlist = response.data.map(function(a,b){ return a.shortlist });
				this.totalShortlisted= filterShortlist.reduce((a, b) => parseInt(a) + parseInt(b) );
				var filterRejected = response.data.map(function(a,b){ return a.rejected });
				this.totalRejected= filterRejected.reduce((a, b) => parseInt(a) + parseInt(b) );
				var filterAwaiting = response.data.map(function(a,b){ return a.holdon });
				this.totalAwaiting= filterAwaiting.reduce((a, b) => parseInt(a) + parseInt(b) );
				var filterInterviewed = response.data.map(function(a,b){ return a.interviewed });
				this.totalInterviewed= filterInterviewed.reduce((a, b) => parseInt(a) + parseInt(b) );
				var filterAccepted = response.data.map(function(a,b){ return a.accepted });
				this.totalAccepted= filterAccepted.reduce((a, b) => parseInt(a) + parseInt(b) );
				/*this.doughnutChartLabelsHired = filterData;
				if(this.hiredTotal['length']<6){
					this.doughnutChartDataHired = [{
						label: "Applicants",	
						data: filterApplicant,
						backgroundColor: '#6bc182', 
						borderColor: '#6bc182', 
						hoverBackgroundColor: '#6bc182',
						hoverBorderColor: '#6bc182',
						barThickness: 40,
						borderWidth: 1
					  }, 
					  {
						label: "Shortlisted",
						data: filterShortlist,
						backgroundColor: '#ffc455', 
						borderColor: '#ffc455', 
						hoverBackgroundColor: '#ffc455',
						hoverBorderColor: '#ffc455',
						barThickness: 40,
						borderWidth: 1
					  }, 
					  {
						label: "Hired",
						data: filterHired,
						backgroundColor: '#936ec5',  
						borderColor: '#936ec5',  
						hoverBackgroundColor: '#936ec5',
						hoverBorderColor: '#936ec5',
						barThickness: 40,
						borderWidth: 1
					  }];
				}else{
					this.doughnutChartDataHired = [{
						label: "Applicants",	
						data: filterApplicant,
						backgroundColor: '#6bc182', 
						borderColor: '#6bc182', 
						hoverBackgroundColor: '#6bc182',
						hoverBorderColor: '#6bc182',
						//barThickness: 40,
						borderWidth: 2
					  }, 
					  {
						label: "Shortlisted",
						data: filterShortlist,
						backgroundColor: '#ffc455', 
						borderColor: '#ffc455', 
						hoverBackgroundColor: '#ffc455',
						hoverBorderColor: '#ffc455',
						//barThickness: 40,
						borderWidth: 2
					  }, 
					  {
						label: "Hired",
						data: filterHired,
						backgroundColor: '#936ec5',  
						borderColor: '#936ec5',  
						hoverBackgroundColor: '#936ec5',
						hoverBorderColor: '#936ec5',
						//barThickness: 40,
						borderWidth: 2
					  }];

				}
				this.showHired = true;
				this.totalHired = 0 ;
				//console.log(filterData);*/
			}else{
				//this.showHired = false;
				this.jobStatus=0;
			}
			
        }, error => {
        }
      )
	}
	
	/**
	**	To get the chart Details API Calls
	**/
	
	onGetChartDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'chartDetails';
     
      this.employerService.getEmployeeDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
			  this.chartDetails = response.data;
			  var TotalJan = response.data.map(function(a){ return a.jan }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalFeb = response.data.map(function(a){ return a.feb }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalMar = response.data.map(function(a){ return a.mar }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalApr = response.data.map(function(a){ return a.apr }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalMay = response.data.map(function(a){ return a.may }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalJun = response.data.map(function(a){ return a.jun }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalJul = response.data.map(function(a){ return a.jul }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalAug = response.data.map(function(a){ return a.aug }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalSep = response.data.map(function(a){ return a.sep }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalOct = response.data.map(function(a){ return a.oct }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalNov = response.data.map(function(a){ return a.nov }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  var TotalDec = response.data.map(function(a){ return a.dec }).reduce((a, b) => parseInt(a) + parseInt(b) );
			  this.totalApplications = [TotalJan,TotalFeb,TotalMar,TotalApr,TotalMay,TotalJun,TotalJul,TotalAug,TotalSep,TotalOct,TotalNov,TotalDec];
			  var patchchart1 ={
					  data: this.totalApplications,
					  label:"All Applications",
					  borderColor: '#007bff'
					};
			this.barChartData.datasets.push(patchchart1);
			this.showChart=true;
			}else{
				
			}
			
        }, error => {
        }
      )
	}
	
	
	/**
	**	To get the Jobs Details API Calls
	*

	onGetJobsDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'type';
     requestParams.isActive = this.isActive;
      requestParams.isClosed =  this.isClosed;
      requestParams.isDeleted =  this.isDeleted;
      requestParams.isPaused =  this.isPaused;
      requestParams.startDate =  this.startDate;
      requestParams.endDate =  this.endDate;
      this.employerService.getEmployeeDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				this.jobsTotal = response.data;
				for(let i=0;i<this.jobsTotal.length;i++){
					var a= this.jobsTotal[i]
					if(a.type =='1000'){
						this.jobsTotal[i].type = 'Full Time';
					}if(a.type =='1001'){
						this.jobsTotal[i].type = 'Part Time'
					}if(a.type =='1002'){
						this.jobsTotal[i].type = 'Contract '
					}if(a.type =='1003'){
						this.jobsTotal[i].type = 'Freelance'
					}if(a.type =='1004'){
						this.jobsTotal[i].type = 'Internship'
					}
				}
				var filterData = this.jobsTotal.map(function(a,b){ return a.type });
				var filterValue = response.data.map(function(a,b){ return a.count });
				//this.doughnutChartLabelsJobs = filterData;
				//this.doughnutChartDataJobs = [filterValue];
				//this.showPostedJob = true;
				//this.totalPostedJobs = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				
			}else{
				//this.showPostedJob = false;
			}
			
        }, error => {
        }
      )
	}*/
	
	/**
	**	To change the application chart view
	**/
	
	selectJob(e){
	 
	   if(e==0){
		var patchchart1 ={
				  data: this.totalApplications,
				  label:"All Applications",
				  borderColor: '#007bff'
				};
		this.barChartData.datasets=[patchchart1];
		this.chart?.update();
	   
	   }
	   else{
	    var a = JSON.parse(e); 
		var patchchart ={
				  data: [a.jan,a.feb,a.mar,a.apr,a.may,a.jun,a.jul,a.aug,a.sep,a.oct,a.nov,a.dec], 
			       label: a.title,
				  borderColor: '#007bff'
				};
		this.barChartData.datasets=[patchchart];
		this.chart?.update();
		}
	}
	
	
	/**
	**	To check the click view of the chart 
	**/
	/*chartClickEvent(event){
			
			//CheckMatchesTotal
		setTimeout(()=>{
			var Check = this.chart['first']['chart']['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = this.chart['first']['chart']['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.countryTotal.filter((f) => {
				  return Check.some((el) => {
					return f.city.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalCountry = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalCountry = 0;
				}
			}else{
				this.totalCountry = this.countryTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}*/
	
	/**
	**	To check the click event in the postedjob details
	**/
	/*chartClickEventPostedJob(event){
			//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;		
			var CheckVal = this.chart['_results'][temp];	
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.jobsTotal.filter((f) => {
				  return Check.some((el) => {
					return f.type.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalPostedJobs = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalPostedJobs = 0;
				}
			}else{
				this.totalPostedJobs = this.jobsTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}*/
	
	/**
	**	To check the click event in the matches 
	**/
	/*chartClickEventMatches(event){
			
			//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;	
			if(this.showPostedJob ==true){
				temp++;
			}
			var CheckVal = this.chart['_results'][temp];	
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				
				Check = this.matchesTotal.filter((f) => {
				  
				  return Check.some((el) => {
				      var a= f.title.substring(0,5)+' - '+f.countryshort;
					return a.toLowerCase() === el.toLowerCase()
				  });
				});
				console.log(Check);
				if(Check.length !=0){
					this.totalMatches = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalMatches = 0;
				}
			}else{
				this.totalMatches = this.matchesTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
		
	}*/
	
	/**
	**	To check the click event in the application
	**/
	
	/*chartClickEventApplicants(event){
			//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;	
			if(this.showPostedJob ==true){
				temp++;
			}
			if(this.showMatches ==true){
				temp++;
			}
			var CheckVal = this.chart['_results'][temp];	
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.applicantsTotal.filter((f) => {
				  return Check.some((el) => {
					return f.city.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalApplicants = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalApplicants = 0;
				}
			}else{
				this.totalApplicants = this.applicantsTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}
	*/
	/**
	**	To check the click event in the shortlisted details 
	**/
	/*chartClickEventShortlisted(event){
			//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;	
			if(this.showPostedJob ==true){
				temp++;
			}
			if(this.showMatches ==true){
				temp++;
			}
			if(this.showApplicants ==true){
				temp++;
			}
			var CheckVal = this.chart['_results'][temp];	
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.shortlistedTotal.filter((f) => {
				  return Check.some((el) => {
					return f.city.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalShortlisted = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalShortlisted = 0;
				}
			}else{
				this.totalShortlisted = this.shortlistedTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
		
	}*/
	
	/**
	**	To check the click event in the hired details
	**/
	
	/*chartClickEventHired(event){
			//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;	
			if(this.showPostedJob ==true){
				temp++;
			}
			if(this.showMatches ==true){
				temp++;
			}
			if(this.showApplicants ==true){
				temp++;
			}
			if(this.showShortlisted ==true){
				temp++;
			}
			var CheckVal = this.chart['_results'][temp];	
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.hiredTotal.filter((f) => {
				  return Check.some((el) => {
					return f.city.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalHired = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalHired = 0;
				}
			}else{
				this.totalHired = this.hiredTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}*/
	
	@HostListener('window:resize', ['$event'])  
	  onResize(event) {  
		this.screenWidth = window.innerWidth;  
	  }
  
}
