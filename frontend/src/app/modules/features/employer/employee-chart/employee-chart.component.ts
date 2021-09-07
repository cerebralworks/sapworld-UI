import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewChild,ViewChildren,QueryList  } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {PageEvent} from '@angular/material/paginator';
import { EmployerService } from '@data/service/employer.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { ChartOptions,ChartType,BorderWidth,ChartTooltipItem,ChartData } from 'chart.js';
import { MultiDataSet, Label,Color ,BaseChartDirective } from 'ng2-charts';

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
		
		// Doughnut
		@ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;
		
		//Location Variables
		public doughnutChartLabels: Label[] = [];
		public doughnutChartData: MultiDataSet = [];		
		public countryTotal:any[]=[];
		public totalCountry :any =0;
		public showCountry :boolean = false;
		//Job Variable
		public doughnutChartLabelsJobs: Label[] = [];
		public doughnutChartDataJobs: MultiDataSet = [];		
		public jobsTotal:any[]=[];
		public totalPostedJobs :any =0;
		public showPostedJob :boolean = false;
		//Matches Variable
		public doughnutChartLabelsMatches: Label[] = [];
		public doughnutChartDataMatches: MultiDataSet = [];		
		public matchesTotal:any[]=[];
		public totalMatches :any =0;
		public showMatches :boolean = false;
		//Applicants Variable
		public doughnutChartLabelsApplicants: Label[] = [];
		public doughnutChartDataApplicants: MultiDataSet = [];		
		public applicantsTotal:any[]=[];
		public totalApplicants :any =0;
		public showApplicants :boolean = false;
		//Shortlisted Variable
		public doughnutChartLabelsShortlisted: Label[] = [];
		public doughnutChartDataShortlisted: MultiDataSet = [];		
		public shortlistedTotal:any[]=[];
		public totalShortlisted :any =0;
		public showShortlisted :boolean = false;
		//Hired Variable
		public doughnutChartLabelsHired: Label[] = [];
		public doughnutChartDataHired: MultiDataSet = [];		
		public hiredTotal:any[]=[];
		public totalHired :any =0;
		public showHired :boolean = false;
		
		
		public doughnutChartType: ChartType = 'doughnut'; 
		public doughnutBorderWidth: BorderWidth = 0; 
		public doughnutChartColors: Color[] = [{
			backgroundColor: [
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
			}
		};

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
		
		public showData :boolean = false;
		
		
	/**	
	**	To implement the package section constructor
	**/
	
	constructor(
		private userService: UserService,
		private modelService: NgbModal,
		private employerService : EmployerService,
		private employerSharedService: EmployerSharedService,
		private userSharedService: UserSharedService
	) { 
		
	}

	/**
	**		When the page loads the OnInitCalls 
	**/
	
	ngOnInit(): void {
      this.employerSharedService.getEmployerProfileDetails().subscribe(
        details => {
          if(details) {
			  
            this.currentEmployerDetails = details;
			if(this.showData ==false && this.currentEmployerDetails.email ){
				this.onGetCountryDetails();
				this.onGetJobsDetails();
				this.onGetJobsMatchesDetails();
				this.onGetJobsApplicantsDetails();
				this.onGetShortlistedDetails();
				this.onGetHiredDetails();
				this.showData = true;
			}
          }
        }
      )
		
	}

	/**
	**	To get the Location Jobs Details API Calls
	**/

	onGetCountryDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'location';
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
			}
			
        }, error => {
        }
      )
	}


	/**
	**	To get the Matches Jobs Details API Calls
	**/

	onGetJobsMatchesDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'matches';
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
					response.data[i]['title'] = response.data[i]['title'].substring(0,25);
				}
				this.matchesTotal = response.data;
				var filterData = response.data.map(function(a,b){ return a.title.charAt(0).toUpperCase()+ a.title.substr(1)  });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsMatches = filterData;
				this.doughnutChartDataMatches = [filterValue];
				this.showMatches = true;
				this.totalMatches = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
			
        }, error => {
        }
      )
	}


	/**
	**	To get the Applicants Jobs Details API Calls
	**/

	onGetJobsApplicantsDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'applicant';
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
					response.data[i]['title'] = response.data[i]['title'].substring(0,25);
				}
				this.applicantsTotal = response.data;
				var filterData = response.data.map(function(a,b){ return a.title.charAt(0).toUpperCase()+ a.title.substr(1)  });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsApplicants = filterData;
				this.doughnutChartDataApplicants = [filterValue];
				this.showApplicants = true;
				this.totalApplicants = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
			
        }, error => {
        }
      )
	}


	/**
	**	To get the Shortlisted Jobs Details API Calls
	**/

	onGetShortlistedDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'shortlisted';
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
					response.data[i]['title'] = response.data[i]['title'].substring(0,25);
				}
				this.shortlistedTotal = response.data;
				var filterData = response.data.map(function(a,b){ return a.title.charAt(0).toUpperCase()+ a.title.substr(1)  });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsShortlisted = filterData;
				this.doughnutChartDataShortlisted = [filterValue];
				this.showShortlisted = true;
				this.totalShortlisted = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
			
        }, error => {
        }
      )
	}

	/**
	**	To get the Hired Jobs Details API Calls
	**/

	onGetHiredDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'hired';
      this.employerService.getEmployeeDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				for(let i=0;i<response.data.length;i++){
					var temp = response.data[i]['title'].length;
					if(temp<=25){
						for(let j=temp;j<16;j++){
							response.data[i]['title'] = response.data[i]['title']+' ';						
						}
					}
					response.data[i]['title'] = response.data[i]['title'].substring(0,25);
				}
				this.hiredTotal = response.data;
				var filterData = response.data.map(function(a,b){ return a.title.charAt(0).toUpperCase()+ a.title.substr(1)  });
				var filterValue = response.data.map(function(a,b){ return a.count });
				this.doughnutChartLabelsHired = filterData;
				this.doughnutChartDataHired = [filterValue];
				this.showHired = true;
				this.totalHired = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
			
        }, error => {
        }
      )
	}

	/**
	**	To get the Jobs Details API Calls
	**/

	onGetJobsDetails = () => {
      let requestParams: any = {};
      requestParams.id = this.currentEmployerDetails['id'];
      requestParams.view = 'type';
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
				this.doughnutChartLabelsJobs = filterData;
				this.doughnutChartDataJobs = [filterValue];
				this.showPostedJob = true;
				this.totalPostedJobs = filterValue.reduce((a, b) => parseInt(a) + parseInt(b) );
				console.log(filterData);
			}
			
        }, error => {
        }
      )
	}
	
	chartClickEvent(event){
			
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
	}
	
	
	chartClickEventPostedJob(event){
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
	}
	
	
	chartClickEventMatches(event){
			
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
					return f.title.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalMatches = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalMatches = 0;
				}
			}else{
				this.totalMatches = this.matchesTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
		
	}
	
	
	chartClickEventApplicants(event){
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
	
	
	chartClickEventShortlisted(event){
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
		
	}
	
	
	chartClickEventHired(event){
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
	}
}
