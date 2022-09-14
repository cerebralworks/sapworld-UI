import { Component, OnInit,ChangeDetectorRef,OnDestroy, ViewChild,HostListener,TemplateRef} from '@angular/core';
import { EmployerService } from '@data/service/employer.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import { environment as env } from '@env';
import { HttpHeaders, HttpClient,HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
	@ViewChild('emailModal', { static: false }) emailModal: TemplateRef<any>;
	public openmail:boolean =false;
	public mbRef: NgbModalRef;
	public userId:any;
	public emailform : FormGroup;
	constructor(
		private employerService: EmployerService,
		private ref: ChangeDetectorRef,
		private http: HttpClient,
		private modelService: NgbModal,
		private formBuilder: FormBuilder,
	) { }
 
	ngOnInit(): void {
	    this.buildForm();
		this.paramsEmployee['limit'] = this.limit;
		this.paramsEmployee['page'] = 0;
		this.paramsEmployee['column'] ='id';
		this.paramsEmployee['sort'] ='DESC';
		this.paramsEmployee['view'] ='all';
		this.dtOptionsss = {
			pageLength: this.limit,
			processing: true,
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
					   full.city='-'
				   }if(!full.country){
					   full.country='-'
				   }
				   return full.city+' '+ full.country 
				}
			},{
			   'targets': 1,
				'className': 'text-Capitalize',
				'render': function (data, type, full, meta){
				   if(!full.job_role){
				      return '--';
				   }else{
				      return data;
				   }
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
			   'targets': 4,
				'className': 'text-Capitalize',
				'render': function (data, type, full, meta){
				   if(full.city !=null && full.state !=null && full.zipcode !=null){
				   return '<a style="cursor:no-drop"><i style="color:#385edf" class="ri-mail-fill"></i></a>'
				   }else{
				   return '<a id="mail_'+data+'" (click)="sendemail('+data+')"><i id="mailbtn_'+data+'" style="color:#385edf" class="ri-mail-fill"></i></a>'
				   
				   }
				}
			}],
			columns: [
				{ data: 'first_name' },
				{ data: 'job_role' },
				{ data: 'city' },
				{ data: 'created_at' },
				{ data: 'id' }
			]
		};
	
	}
	onGetEmployerData() {
		
	}
	
	ngOnDestroy(): void {
			// Do not forget to unsubscribe the event
		//this.dtTrigger.unsubscribe();
	  }
	
	//Getting ID using click event
	@HostListener("click", ["$event.target.id"]) onClick(id : any) {
	   var arr = id.split('_')		
		if(arr[0]==="mail" || arr[0]==="mailbtn"){
			var val1 = arr[arr.length-1]
			 this.sendemail(val1)    
		}
	}
	
	/**
  **	To build the meting form
  **/
  private buildForm(): void {
    this.emailform = this.formBuilder.group({
	  subject: ['',Validators.required],
      message: ['',Validators.required]
    });
  }
  
  
	/** To open mail send popup**/
	
	sendemail(val){
	    this.userId=val;
		this.openmail = true;
		setTimeout(() => {
			this.mbRef = this.modelService.open(this.emailModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
		});
	}
	
	/** To send mail */
	submitmail(){
		var data={
		  id:this.userId,
		  message:this.emailform.value.message,
		  subject:this.emailform.value.subject
		}
	   this.employerService.sendMailUser(data).subscribe(datas=>{
	      this.closemodel();
	   })
	
	}
    
	/**To close the model**/
	
	closemodel(){
		this.openmail=false;
		this.emailform.reset();
		this.mbRef.close();
	}
}
