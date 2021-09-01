import { Component, DoCheck, OnDestroy, OnInit, TemplateRef, ViewChild,ViewChildren,QueryList  } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {PageEvent} from '@angular/material/paginator';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { ChartOptions,ChartType,BorderWidth,ChartTooltipItem,ChartData } from 'chart.js';
import { MultiDataSet, Label,Color ,BaseChartDirective } from 'ng2-charts';

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
		@ViewChildren(BaseChartDirective) chart: QueryList<BaseChartDirective>;
		@ViewChild(BaseChartDirective) chartVisa: BaseChartDirective;
		@ViewChild(BaseChartDirective) chartType: BaseChartDirective;
		@ViewChild(BaseChartDirective) chartAvailability: BaseChartDirective;
		@ViewChild(BaseChartDirective) chartApplied: BaseChartDirective;

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
		
		public MatchesTotal:any[]=[];
		public AppliedTotal:any[]=[];
		public AppliedAvailability:any[]=[];
		public AppliedType:any[]=[];
		public AppliedVisa:any[]=[];
		
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
		public showData :boolean = false;
		
		
	/**	
	**	To implement the package section constructor
	**/
	
	constructor(
		private userService: UserService,
		private modelService: NgbModal,
		private employerService : EmployerService,
		private userSharedService: UserSharedService
	) { 
		
	}

	/**
	**		When the page loads the OnInitCalls 
	**/
	
	ngOnInit(): void {
      this.userSharedService.getUserProfileDetails().subscribe(
        details => {
          if(details) {
			  
            this.currentUserDetails = details;
			if(this.showData ==false && this.currentUserDetails.email ){
				this.onGetMatchesDetails();
				this.onGetVisaDetails();
				this.onGetAvailabilityDetails('');
				this.onGetTypeDetails('');		
				this.onGetAppliedJobs('');
				this.showData = true;
			}
          }
        }
      )
		this.onGetMatchesDetails();
		this.onGetVisaDetails();
		this.onGetAvailabilityDetails('');
		this.onGetTypeDetails('');		
		this.onGetAppliedJobs('');
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
				this.MatchesTotal = response.data;
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
	
	onGetAppliedJobs = (country) => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'applied';
      requestParams.country = country;
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				this.AppliedTotal = response.data;
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
	onGetAvailabilityDetails = (country) => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'availability';
      requestParams.country = country;
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				this.AppliedAvailability = response.data;
				for(let i=0;i<this.AppliedAvailability.length;i++){
					if(this.AppliedAvailability[i].availability =='0'){
						this.AppliedAvailability[i].availability = 'Immediate'
					}else{
						this.AppliedAvailability[i].availability = this.AppliedAvailability[i].availability+' Days'
					}
				}
				var filterData = this.AppliedAvailability.map(function(a,b){ return a.availability  });
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
	
	onGetTypeDetails = (country) => {
      let requestParams: any = {};
      requestParams.id = this.currentUserDetails['id'];
      requestParams.view = 'type';
      requestParams.country = country;
      this.userService.getUserDashboard(requestParams).subscribe(
        response => {
			if(response.count !=0 && response.count>=1){
				this.AppliedType = response.data;
				for(let i=0;i<this.AppliedType.length;i++){
					var a= this.AppliedType[i]
					if(a.type =='1000'){
						this.AppliedType[i].type = 'Full Time';
					}if(a.type =='1001'){
						this.AppliedType[i].type = 'Part Time'
					}if(a.type =='1002'){
						this.AppliedType[i].type = 'Contract'
					}if(a.type =='1003'){
						this.AppliedType[i].type = 'Freelance'
					}if(a.type =='1004'){
						this.AppliedType[i].type = 'Internship'
					}
				}
				var filterData = this.AppliedType.map(function(a,b){ return a.type });
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
				this.AppliedVisa =response.data;
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
	
	chartClickEvent(event,index){
		this.checkTotalChart();
		this.graphClickEvent();		
  }
  
	checkTotalChart(){
		//CheckMatchesTotal
		setTimeout(()=>{
			var Check = this.chart['first']['chart']['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = this.chart['first']['chart']['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.MatchesTotal.filter((f) => {
				  return Check.some((el) => {
					return f.country.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalMatches = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalMatches = 0;
				}
			}else{
				this.totalMatches = this.MatchesTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}
	
	
	checkTotalChartApplied(event){
		//CheckMatchesTotal
		setTimeout(()=>{
			var CheckVal = this.chart['_results'][1];			
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.AppliedTotal.filter((f) => {
				  return Check.some((el) => {
					return f.country.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalApplied = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalApplied = 0;
				}
			}else{
				this.totalApplied = this.AppliedTotal.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}
	
	checkTotalChartAvailability(event){
		//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;
			if(this.showApplied ==true ){
				temp++;
			}
			var CheckVal = this.chart['_results'][temp];	
			
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.AppliedAvailability.filter((f) => {
				  return Check.some((el) => {
					return f.availability.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalAvailability = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalAvailability = 0;
				}
			}else{
				this.totalAvailability = this.AppliedAvailability.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}
	
	
	checkTotalChartType(event){
		//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;
			if(this.showApplied ==true ){
				temp++;
			}
			if(this.showAvailiability ==true ){
				temp++;
			}
			var CheckVal = this.chart['_results'][temp];	
			
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.AppliedType.filter((f) => {
				  return Check.some((el) => {
					return f.type.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalType = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalType = 0;
				}
			}else{
				this.totalType = this.AppliedType.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}
	
	
	checkTotalChartVisa(event){
		//CheckMatchesTotal
		setTimeout(()=>{
			var temp = 1;
			if(this.showApplied ==true ){
				temp++;
			}
			if(this.showAvailiability ==true ){
				temp++;
			}
			if(this.showType ==true ){
				temp++;
			}
			var CheckVal = this.chart['_results'][temp];	
			
			var Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
			Check = Check.map(function(a,b){ return a.text.toLowerCase() });
			if(Check.length !=0){
				Check = CheckVal.chart['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
				Check = Check.map(function(a,b){ return a.text.toLowerCase() });
				Check = this.AppliedVisa.filter((f) => {
				  return Check.some((el) => {
					return f.country.toLowerCase() === el.toLowerCase()
				  });
				});
				if(Check.length !=0){
					this.totalVisa = Check.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
				}else{
					this.totalVisa = 0;
				}
			}else{
				this.totalVisa = this.AppliedVisa.map(function(a,b){ return a.count }).reduce((a, b) => parseInt(a) + parseInt(b) );
			}
		},600);
	}
	
	
	  graphClickEvent(){
		setTimeout(()=>{
				if(this.chart['first']['chart']['legend']['legendItems']){
					var Check = this.chart['first']['chart']['legend']['legendItems'].filter(function(a,b){ return a.hidden==false});
					if(Check.length !=0){
						Check = Check.map(function(a,b){ return a.text.toLowerCase() });
						this.onGetVisaDetails();
						this.onGetAvailabilityDetails(Check);
						this.onGetTypeDetails(Check);		
						this.onGetAppliedJobs(Check);
						this.showApplied= false;
						this.showAvailiability= false;
						this.showType= false;
					}else{
						Check = this.chart['first']['chart']['legend']['legendItems'].filter(function(a,b){ return a.hidden==true});
						if(Check.length == this.chart['first']['chart']['legend']['legendItems']['length']){
							Check =['SAP'];
							this.onGetVisaDetails();
							this.onGetAvailabilityDetails(Check);
							this.onGetTypeDetails(Check);		
							this.onGetAppliedJobs(Check);
							this.showApplied= false;
							this.showAvailiability= false;
							this.showType= false;
						}else{
							this.onGetVisaDetails();
							this.onGetAvailabilityDetails('');
							this.onGetTypeDetails('');		
							this.onGetAppliedJobs('');
							this.showApplied= false;
							this.showAvailiability= false;
							this.showType= false;
						}
					}
				}
			},500);
	}
}
