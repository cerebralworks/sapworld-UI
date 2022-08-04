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
  selector: 'app-jobseeker',
  templateUrl: './jobseeker.component.html',
  styleUrls: ['./jobseeker.component.scss']
})
export class JobSeekerComponent implements OnInit {

	SlideOptions = { items: 5, dots: false, nav: true };  
	CarouselOptions = { dots: false, nav: true }; 

	dtOptionsss: DataTables.Settings = {};
	totalEmployers:any=[];
	totalEmployersCountry:any=[];
	public paramsEmployee ={};	
	public page: number = 1;
	public limit: number = 10;
	length = this.limit;
	pageIndex = 1;
	pageSizeOptions = [10, 25,50,100];
	isShow:boolean = false;
	
	constructor(
		private employerService: EmployerService,
		private ref: ChangeDetectorRef,
		private http: HttpClient
	) { }
 
	ngOnInit(): void {
	
		this.paramsEmployee['limit'] = this.limit;
		this.paramsEmployee['page'] = 0;
		this.paramsEmployee['column'] ='id';
		this.paramsEmployee['sort'] ='DESC';
		this.paramsEmployee['view'] ='all';
		this.dtOptionsss = {
			pageLength: this.limit,
			processing: false,
			"searching": false,
			"info": false,
			serverSide: true,
			ajax:  (dataTablesParameters: any, callback) => {
				this.paramsEmployee['page'] = dataTablesParameters.start;
				this.paramsEmployee['limit'] = dataTablesParameters.length;
				var cloumns =dataTablesParameters.order[0].column;
				this.paramsEmployee['column'] = dataTablesParameters.columns[cloumns]["data"];
				this.paramsEmployee['sort'] = dataTablesParameters.order[0].dir;
				this.http.post<DataTablesResponse>(
					`${env.serverUrl}`+'/api/admin/users/details',
					this.paramsEmployee,({  withCredentials: true })
				).subscribe(response => {
					if(response){
						
						this.totalEmployers =response['user'];
						this.totalEmployersCountry =response['country'];
						this.isShow = true;
					}
					callback({
							recordsTotal: response['Count'][0]['count'],
							recordsFiltered: response['Count'][0]['count'],
						data: response['user']
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
			   'targets': 2,
				'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				   if(!full.city){
					   full.city=''
				   }if(!full.country){
					   full.country=''
				   }
				   return full.city+' '+ full.country 
				}
			},{
			   'targets': 1,
				'className': 'text-Capitalize'
			},{
			   'targets': 3,
				'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				   var year = new Date(data).getFullYear()
				   var date = new Date(data).getDate()
				   var month = new Date(data).toLocaleString('en-us', { month: "short" });
				   return month+' '+date+', '+year; 
				}
			}],
			columns: [
				{ data: 'first_name' },
				{ data: 'job_role' },
				{ data: 'city' },
				{ data: 'created_at' }
			]
		};
	
	}
	onGetEmployerData() {
		
	}
	
	ngOnDestroy(): void {
			// Do not forget to unsubscribe the event
		//this.dtTrigger.unsubscribe();
	  }
		

}
