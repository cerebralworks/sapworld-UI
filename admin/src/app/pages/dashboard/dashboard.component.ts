import { Component, OnInit,ChangeDetectorRef,OnDestroy, ViewChild} from '@angular/core';
import { EmployerService } from '@data/service/employer.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import { environment as env } from '@env';
import { HttpHeaders, HttpClient,HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy  {
	
	@ViewChild(DataTableDirective, {static: false})
	dtElement:  DataTableDirective;
	
	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject<any>();
	dtTriggerActive: Subject<any> = new Subject<any>();
	dtTriggerInActive: Subject<any> = new Subject<any>();
	dtTriggerNotOpen: Subject<any> = new Subject<any>();
	dtTriggerOpen: Subject<any> = new Subject<any>();
	dtTriggerAll: Subject<any> = new Subject<any>();
	totalEmployers:any[]= [];
	totalJobSeeker:any[]= [];
	public jobSeekerDetails:any ={
			'available': 0,
			'notavailable': 0,
			'total': 0
		};
	public employeeDetails:any ={
			'active': 0,
			'inactive': 0,
			'total': 0
		};
	public page: number = 1;
	public limit: number = 10;
	length = this.limit;
	pageIndex = 1;
	pageSizeOptions = [10, 25,50,100];
	public showData:boolean=false;
	public ShowEmployeeTotal:boolean=true;
	public ShowEmployeeInActive:boolean=false;
	public ShowEmployeeActive:boolean=false;
	public ShowJobTotal:boolean=false;
	public ShowJobAcive:boolean=false;
	public ShowJobInActive:boolean=false;
	public today:boolean=true;
	public seven:boolean=false;
	public fourteen:boolean=false;
	public thirty:boolean=false;
	public fourtyfive:boolean=false;
	public paramsEmployee ={};
	min: any = 0;
	max: any = 0;
	total: any = 0;

	constructor(
		private employerService: EmployerService,
		private ref: ChangeDetectorRef,
		private http: HttpClient
	) { }

	ngOnInit(): void {
		
		this.onGetEmployerDashBoardCount();
		
		this.paramsEmployee['limit'] = this.limit;
		this.paramsEmployee['page'] = 0;
		this.paramsEmployee['column'] ='created_at';
		this.paramsEmployee['sort'] ='DESC';
		this.paramsEmployee['view'] ='all';
		this.paramsEmployee['day'] =1;
		this.onGetEmployerData();
		
	}
  
  
	onGetEmployerDashBoardCount( ) {
    
		this.employerService.getEmployersCount().subscribe(
			response => {
				if(response){
					if(response['users'].length ==1){
						this.jobSeekerDetails = response['users'][0];
					}else{
						this.jobSeekerDetails ={
							'available': 0,
							'notavailable': 0,
							'total': 0
						}
					}
					if(response['employee'].length ==1){
						this.employeeDetails = response['employee'][0];
					}else{
						this.employeeDetails ={
							'active': 0,
							'inactive': 0,
							'total': 0
						}
					}				
					
				}else{
					this.employeeDetails ={
						'active': 0,
						'inactive': 0,
						'total': 0
					}
					this.jobSeekerDetails ={
						'available': 0,
						'notavailable': 0,
						'total': 0
					}
				}
				this.showData = true;
				this.ref.detectChanges();
        
			}, error => {
				this.employeeDetails ={
					'active': 0,
					'inactive': 0,
					'total': 0
				}
				this.jobSeekerDetails ={
					'available': 0,
					'notavailable': 0,
					'total': 0
				}
				this.showData = true;
				this.ref.detectChanges();
			}
		)
	}
	
	onGetEmployerData( ) {
		
		
		this.dtOptions ={};
		if($.fn.dataTable.isDataTable("#DataTable")){
			$('#DataTable').DataTable().clear().destroy();
			
		}
		if($.fn.dataTable.isDataTable("#DataTableInActive")){
			$('#DataTableInActive').DataTable().clear().destroy();
			
		}
		if($.fn.dataTable.isDataTable("#DataTableActive")){
			$('#DataTableActive').DataTable().clear().destroy();
			
		}
		if($.fn.dataTable.isDataTable("#DataTable")){
			$('#DataTable').DataTable().clear().destroy();
			
		}
		if($.fn.dataTable.isDataTable("#DataTableOpen")){
			$('#DataTableOpen').DataTable().clear().destroy();
			
		}
		if($.fn.dataTable.isDataTable("#DataTableNotOpen")){
			$('#DataTableNotOpen').DataTable().clear().destroy();
			
		}
		this.totalEmployers =[];		
		if(this.ShowJobTotal ==true || this.ShowJobAcive == true || this.ShowJobInActive == true){
			this.dtOptions = {
				pageLength: this.limit,
				processing: true,
				"searching": false,
				"info": false,
				serverSide: true,
				deferRender: true,
				"dom": '<"top"i>rt<"bottom"flp><"clear">',
				ajax:  (dataTablesParameters: any, callback) => {
					this.paramsEmployee['page'] = dataTablesParameters.start;
					this.paramsEmployee['limit'] = dataTablesParameters.length;
					var cloumns =dataTablesParameters.order[0].column;
					this.paramsEmployee['column'] = dataTablesParameters.columns[cloumns]["data"];
					this.paramsEmployee['sort'] = dataTablesParameters.order[0].dir;
					this.http.post<DataTablesResponse>(
						`${env.serverUrl}`+'/api/admin/dashboard/details',
						this.paramsEmployee,({  withCredentials: true })
					).subscribe(response => {
						if(response){
							
							this.totalEmployers =response['data'];
							this.total= response['Count'][0]['count'];
							this.ref.detectChanges();
						}
						callback({
								recordsTotal: response['Count'][0]['count'],
								recordsFiltered: response['Count'][0]['count'],
								data: response['data']
						});
							this.ref.detectChanges();
					});
				},
				'columnDefs': [{
				   'targets': 0,
				   'className': 'text-Capitalize',
				   'render': function (data, type, full, meta){
					   return full.first_name+' '+ full.last_name 
					}
				},{
				   'targets': 3,
				   'className': 'text-Capitalize',
				   'render': function (data, type, full, meta){
					   var year = new Date(data).getFullYear()
					   var date = new Date(data).getDate()
					   var month = new Date(data).toLocaleString('en-us', { month: "short" });
					   return month+' '+date+', '+year; 
					}
				},{
				   'targets': 1,
				   'className': 'text-Capitalize'
				},{
				   'targets': 2,
				   'className': 'text-Capitalize',
				   'render': function (data, type, full, meta){
					   if(!full.city){
						   full.city=''
					   }if(!full.country){
						   full.country=''
					   }
					   return full.city+', '+full.country;
					}
				}],
				columns: [
					{ data: 'first_name' },
					{ data: 'job_role' },
					{ data: 'city' },
					{ data: 'created_at' }
				]
			};
		}	else{
			this.dtOptions = {
				pageLength: this.limit,
				processing: true,
				"searching": false,
				"info": false,
				serverSide: true,
				deferRender: true,
				"dom": '<"top"i>rt<"bottom"flp><"clear">',
				ajax:  (dataTablesParameters: any, callback) => {
					this.paramsEmployee['page'] = dataTablesParameters.start;
					this.paramsEmployee['limit'] = dataTablesParameters.length;
					var cloumns =dataTablesParameters.order[0].column;
					this.paramsEmployee['column'] = dataTablesParameters.columns[cloumns]["data"];
					this.paramsEmployee['sort'] = dataTablesParameters.order[0].dir;
					
					this.http.post<DataTablesResponse>(
						`${env.serverUrl}`+'/api/admin/dashboard/details',
						this.paramsEmployee,({  withCredentials: true })
					).subscribe(response => {
						if(response){
							
							this.totalEmployers =response['data'];
							this.total= response['Count'][0]['count'];
							this.ref.detectChanges();
						}
						callback({
								recordsTotal: response['Count'][0]['count'],
								recordsFiltered: response['Count'][0]['count'],
							data: response['data']
						});
						this.ref.detectChanges();
					});
				},
				'columnDefs': [{
				   'targets': 0,
				   'className': 'text-Capitalize'
				},{
				   'targets': 1,
				   'className': 'text-Capitalize',
				   'render': function (data, type, full, meta){
					   return full.employer.first_name+' '+ full.employer.last_name 
					}
				},{
				   'targets': 2,
				   'className': 'text-center text-Capitalize',
				   'render': function (data, type, full, meta){
					   var year = new Date(data).getFullYear()
					   var date = new Date(data).getDate()
					   var month = new Date(data).toLocaleString('en-us', { month: "short" });
					   return month+' '+date+', '+year; 
					}
				},{
				   'targets': 3,
				   'className': 'text-center text-Capitalize',
				   'render': function (data, type, full, meta){
					   return data
					}
				},{
				   'targets': 4,
				   'className': 'text-center text-Capitalize',
				   'render': function (data, type, full, meta){
					   return data
					}
				},{
				   'targets': 5,
				   'className': 'text-center text-Capitalize',
				   'render': function (data, type, full, meta){
					   return data
					}
				}],
				columns: [
					{ data: 'title' },
					{ data: 'first_name' },
					{ data: 'created_at' },
					{ data: 'applicant' },
					{ data: 'hired' },
					{ data: 'rejected' }
				]
			};
		}
	}
		
		//$("#DataTable").dataTable().fnDestroy();
		/* this.employerService.getEmployersDetails(this.paramsEmployee).subscribe(
			response => {
				if(response){
					this.totalEmployers =response['data'];
					this.total= response['Count'][0]['count'];
				}
				this.ref.detectChanges();
				this.dtTrigger.closed=false;
				this.dtTrigger.thrownError=false;
				this.dtTrigger.isStopped=false;
				if(this.dtTrigger.observers ==null){
					this.dtTrigger.observers=[];
				}
				this.dtTrigger.next();     
				 
        
			}, error => {
				
				this.ref.detectChanges();
			}
		) */
	//}
	
	
    rerender(): void {
		if(this.dtElement){
			this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				// Destroy the table first
				//dtInstance.draw();
				//dtInstance.destroy();
				// Call the dtTrigger to rerender again
				//this.dtTrigger.next();
				//dtInstance.draw();
				dtInstance.ajax.reload();
				//this.onGetEmployerData();
			});
		}
    }   
		ngOnDestroy(): void {
			// Do not forget to unsubscribe the event
		this.dtTrigger.unsubscribe();
	  }
	  
	  clickTotal(){
			
			this.dtTrigger.closed=false;
			this.dtTrigger.thrownError=false;
			this.dtTrigger.isStopped=false;
			this.dtTrigger.observers=[];
			this.dtTrigger.next();
		  if(this.ShowEmployeeTotal ==true){

			  this.ShowEmployeeTotal = false;
		  }else{
			  
			  this.ShowEmployeeTotal = true;
  
		  this.ShowEmployeeActive = false;
		  this.ShowEmployeeInActive = false;
		  this.ShowJobTotal = false;
		  this.ShowJobAcive = false;
		  this.ShowJobInActive = false;
			this.paramsEmployee['limit'] = this.limit;
			this.paramsEmployee['page'] = 0;
			this.paramsEmployee['column'] ='created_at';
			this.paramsEmployee['sort'] ='DESC';
			this.paramsEmployee['view'] ='all';
			this.paramsEmployee['day'] =1;
			this.handlePageEvent('today');
		 }
		this.ref.detectChanges();
		
	  }
	  clickActive(){
			this.dtTrigger.closed=false;
			this.dtTrigger.thrownError=false;
			this.dtTrigger.isStopped=false;
			this.dtTrigger.observers=[];
			this.dtTrigger.next();
		  if(this.ShowEmployeeActive ==true){
			  this.ShowEmployeeActive = false;
		  }else{
			  this.ShowEmployeeActive = true;
		  
		  this.ShowEmployeeInActive = false;
	      this.ShowEmployeeTotal = false;
		  this.ShowJobTotal = false;
		  this.ShowJobAcive = false;
		  this.ShowJobInActive = false;
		  
		  this.paramsEmployee['limit'] = this.limit;
		this.paramsEmployee['page'] = 0;
		this.paramsEmployee['column'] ='created_at';
		this.paramsEmployee['sort'] ='DESC';
		this.paramsEmployee['view'] ='employer-inactive';
		this.paramsEmployee['day'] =1;
		this.handlePageEvent('today');
		 }
		 this.ref.detectChanges();
	  }
	  clickInActive(){
		  this.dtTrigger.closed=false;
			this.dtTrigger.thrownError=false;
			this.dtTrigger.isStopped=false;
			this.dtTrigger.observers=[];
				this.dtTrigger.next();
		  if(this.ShowEmployeeInActive ==true){
			  this.ShowEmployeeInActive = false;
		  }else{
			  this.ShowEmployeeInActive = true;
		  
		  this.ShowEmployeeActive = false;
		  this.ShowEmployeeTotal = false;
		  this.ShowJobTotal = false;
		  this.ShowJobAcive = false;
		  this.ShowJobInActive = false;
		  this.paramsEmployee['limit'] = this.limit;
			this.paramsEmployee['page'] = 0;
			this.paramsEmployee['column'] ='created_at';
			this.paramsEmployee['sort'] ='DESC';
			this.paramsEmployee['view'] ='employer-active';
			this.paramsEmployee['day'] =1;
			this.handlePageEvent('today');
			 }
			 this.ref.detectChanges();
	  }
	  clickTotalJobseeker(){
		  this.dtTrigger.closed=false;
			this.dtTrigger.thrownError=false;
			this.dtTrigger.isStopped=false;
			this.dtTrigger.observers=[];
			this.dtTrigger.next();
		  if(this.ShowJobTotal ==true){
			  this.ShowJobTotal = false;
		  }else{
			  this.ShowJobTotal = true;
		  
		  this.ShowEmployeeActive = false;
		  this.ShowEmployeeTotal = false;
		  this.ShowEmployeeInActive = false;
		  this.ShowJobAcive = false;
		  this.ShowJobInActive = false;
		  this.paramsEmployee['limit'] = this.limit;
			this.paramsEmployee['page'] = 0;
			this.paramsEmployee['column'] ='created_at';
			this.paramsEmployee['sort'] ='DESC';
			this.paramsEmployee['view'] ='user';
			this.paramsEmployee['day'] =1;
			this.handlePageEvent('today');
	   }
	   this.ref.detectChanges();
	  }
	  clickAvailableJobseeker(){
		  this.dtTrigger.closed=false;
			this.dtTrigger.thrownError=false;
			this.dtTrigger.isStopped=false;
			this.dtTrigger.observers=[];
				this.dtTrigger.next();
		  if(this.ShowJobAcive ==true){
			  this.ShowJobAcive = false;
		  }else{
			  this.ShowJobAcive = true;
		  
		  this.ShowEmployeeActive = false;
		  this.ShowEmployeeTotal = false;
		  this.ShowEmployeeInActive = false;
		  this.ShowJobTotal = false;
		  this.ShowJobInActive = false;
		  this.paramsEmployee['limit'] = this.limit;
			this.paramsEmployee['page'] = 0;
			this.paramsEmployee['column'] ='created_at';
			this.paramsEmployee['sort'] ='DESC';
			this.paramsEmployee['view'] ='user-available';
			this.paramsEmployee['day'] =1;
			this.handlePageEvent('today');
	   }
	   this.ref.detectChanges();
	  }
	  clickNotAvailableJobseeker(){
		  this.dtTrigger.closed=false;
			this.dtTrigger.thrownError=false;
			this.dtTrigger.isStopped=false;
			this.dtTrigger.observers=[];
				this.dtTrigger.next();
		  if(this.ShowJobInActive ==true){
			  this.ShowJobInActive = false;
		  }else{
			  this.ShowJobInActive = true;
		 
		  this.ShowEmployeeActive = false;
		  this.ShowEmployeeTotal = false;
		  this.ShowEmployeeInActive = false;
		  this.ShowJobTotal = false;
		  this.ShowJobAcive = false;
		  this.paramsEmployee['limit'] = this.limit;
			this.paramsEmployee['page'] = 0;
			this.paramsEmployee['column'] ='created_at';
			this.paramsEmployee['sort'] ='DESC';
			this.paramsEmployee['view'] ='user-notavailable';
			this.paramsEmployee['day'] =1;
			this.handlePageEvent('today');
	   }
	   this.ref.detectChanges();
	  }
	/**
	**	To triggers when the pagination 
	**/
	 	 
	handlePageEvent(data) {
		
		if(data=='today'){
			this.today=true;
			this.seven=false;
			this.fourteen=false;
			this.thirty=false;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =1;
		}if(data=='seven'){
			this.seven=true;
			this.today=false;
			this.fourteen=false;
			this.thirty=false;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =7;
		}if(data=='fourteen'){
			this.today=false;
			this.seven=false;
			this.fourteen=true;
			this.thirty=false;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =14;
		}if(data=='thirty'){
			this.today=false;
			this.seven=false;
			this.fourteen=false;
			this.thirty=true;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =30;
		}if(data=='fourtyfive'){
			this.today=false;
			this.seven=false;
			this.fourteen=false;
			this.thirty=false;
			this.fourtyfive=true;
			this.paramsEmployee['day'] =45;
		}
		if(this.ShowEmployeeActive==true){
			this.ShowEmployeeActive = false;
			this.ShowEmployeeActive = true;
			
		}
		if(this.ShowEmployeeInActive==true){
			this.ShowEmployeeInActive = false;
			this.ShowEmployeeInActive = true;
			
		}
		if(this.ShowEmployeeTotal==true){
			this.ShowEmployeeTotal = false;
			this.ShowEmployeeTotal = true;
			
		}
		if(this.ShowJobTotal==true){
			this.ShowJobTotal = false;
			this.ShowJobTotal = true;
			
		}
		if(this.ShowJobAcive==true){
			this.ShowJobAcive = false;
			this.ShowJobAcive = true;
			
		}
		if(this.ShowJobInActive==true){
			this.ShowJobInActive = false;
			this.ShowJobInActive = true;
			
		}
		
		if(document.getElementById('inputSearch')){
			document.getElementById('inputSearch')['value']='';
			this.paramsEmployee['search'] ='';
		}
		this.onGetEmployerData();
		this.ref.detectChanges();
	}
	
	ChangeDate(data){
		if(data=='today'){
			this.today=true;
			this.seven=false;
			this.fourteen=false;
			this.thirty=false;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =1;
		}if(data=='seven'){
			this.seven=true;
			this.today=false;
			this.fourteen=false;
			this.thirty=false;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =7;
		}if(data=='fourteen'){
			this.today=false;
			this.seven=false;
			this.fourteen=true;
			this.thirty=false;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =14;
		}if(data=='thirty'){
			this.today=false;
			this.seven=false;
			this.fourteen=false;
			this.thirty=true;
			this.fourtyfive=false;
			this.paramsEmployee['day'] =30;
		}if(data=='fourtyfive'){
			this.today=false;
			this.seven=false;
			this.fourteen=false;
			this.thirty=false;
			this.fourtyfive=true;
			this.paramsEmployee['day'] =45;
		}
		if(this.ShowEmployeeActive==true){
			this.ShowEmployeeActive = false;
			this.ShowEmployeeActive = true;
			
		}
		if(this.ShowEmployeeInActive==true){
			this.ShowEmployeeInActive = false;
			this.ShowEmployeeInActive = true;
			
		}
		if(this.ShowEmployeeTotal==true){
			this.ShowEmployeeTotal = false;
			this.ShowEmployeeTotal = true;
			
		}
		if(this.ShowJobTotal==true){
			this.ShowJobTotal = false;
			this.ShowJobTotal = true;
			
		}
		if(this.ShowJobAcive==true){
			this.ShowJobAcive = false;
			this.ShowJobAcive = true;
			
		}
		if(this.ShowJobInActive==true){
			this.ShowJobInActive = false;
			this.ShowJobInActive = true;
			
		}
		if(document.getElementById('inputSearch')){
			document.getElementById('inputSearch')['value']=''
			this.paramsEmployee['search'] ='';
		}
		
		this.rerender();
		this.ref.detectChanges();
		
	}
	
	onSearchChange(searchValue: string): void {  
		this.paramsEmployee['search'] =searchValue;
		this.rerender();
	}
}
