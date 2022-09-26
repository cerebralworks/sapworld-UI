import { Component, OnInit,ChangeDetectorRef,OnDestroy, ViewChild,TemplateRef,HostListener} from '@angular/core';
import { EmployerService } from '@data/service/employer.service';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import { environment as env } from '@env';
import { HttpHeaders, HttpClient,HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '@shared/services/validation.service';
import { AccountService } from '@data/service/account.service';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.scss']
})
export class EmployersComponent implements OnInit,OnDestroy {
	
	SlideOptions = { items: 5, dots: false, nav: true };  
	CarouselOptions = { dots: false, nav: true }; 

	dtOptionss: DataTables.Settings = {};
	totalEmployers:any=[];
	totalEmployersCountry:any=[];
	public paramsEmployee ={};	
	public page: number = 1;
	public limit: number = 10;
	length = this.limit;
	pageIndex = 1;
	pageSizeOptions = [10, 25,50,100];
	isShow:boolean = false;
	@ViewChild('registerModal', { static: false }) registerModal: TemplateRef<any>;
	public openregister:boolean =false;
	public mbRef: NgbModalRef;
	public registerForm : FormGroup;
	@ViewChild('emailModal', { static: false }) emailModal: TemplateRef<any>;
	public openmail:boolean =false;
	public mbRefs: NgbModalRef;
	public emailform : FormGroup;
	public userId:any;
	formError: any[] = [];
	constructor(
		private employerService: EmployerService,
		private ref: ChangeDetectorRef,
		private http: HttpClient,
		private modelService: NgbModal,
		private formBuilder: FormBuilder,
		private accountService:AccountService
		
	) { }
 
	ngOnInit(): void {
	    this.buildForm();
	    this.buildForm1();
		this.paramsEmployee['limit'] = this.limit;
		this.paramsEmployee['page'] = 0;
		this.paramsEmployee['column'] ='id';
		this.paramsEmployee['sort'] ='DESC';
		this.paramsEmployee['view'] ='all';
		this.dtOptionss = {
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
					`${env.serverUrl}`+'/api/admin/employeers/details',
					this.paramsEmployee,({  withCredentials: true })
				).subscribe(response => {
					if(response){
						
						this.totalEmployers =response['employee'];
						this.totalEmployersCountry =response['country'];
						this.isShow = true;
					}
					callback({
							recordsTotal: response['Count'][0]['count'],
							recordsFiltered: response['Count'][0]['count'],
						data: response['employee']
					});
					this.ref.detectChanges();
				});
			},
			'columnDefs': [{
			   'targets': 0,
			   'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				   return data;
				}
			},{
			   'targets': 1,
			   'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				   return '<a class="text-primary" href="'+`${env.subPath}`+'/#/employers/view/'+full.id+'" >'+full.first_name+' '+ full.last_name +'</a>'
				}
			},{
			   'targets': 2,
                'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				   if(data){
				   return data;
				   }else{
				   return '--';
				   }
				}
			},{
			   'targets': 4,
                'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
			       if(parseInt(data)==0){
				   return '<a style="cursor:no-drop">'+data+'</a>';
				   }else{
				   return '<a href="'+`${env.subPath}`+'/#/posted-job/'+full.id+'">'+data+'</a>';
				   }
				}
			},{
			   'targets': 5,
			   'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				   if(data){
					   var year = new Date(data).getFullYear()
					   var date = new Date(data).getDate()
					   var month = new Date(data).toLocaleString('en-us', { month: "short" });
					   return month+' '+date+', '+year; 
				   }else{
					   var temp ='--';
					   return temp;
				   }
				}
			},{
			   'targets': 6,
			    'orderable':false,
                'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				  /* return '<a href="http://localhost:4200/#/admin/post-job"><i style="color:#385edf" class="ri-draft-fill"></i></a>';*/
				   return '<a href="'+`${env.subPath}`+'/#/post-job/'+full.id+'"><i style="color:#385edf" class="ri-draft-fill"></i></a>';
				}
			},{
			   'targets': 7,
			   'orderable':false,
                'className': 'text-Capitalize',
			   'render': function (data, type, full, meta){
				   if(full.verified ===true){
				   return '<a style="cursor:no-drop"><i style="color:#385edf" class="ri-mail-fill"></i></a>'
				   }else{
				   return '<a id="mail_'+data+'" (click)="sendemail('+data+')"><i id="mailbtn_'+data+'" style="color:#385edf" class="ri-mail-fill"></i></a>'
				   
				   }
				}
			}],
			columns: [
			    { data: 'company' },
				{ data: 'first_name' },
				{ data: 'phone' },
				{ data: 'email' },
				{ data: 'jobposting' },
				{ data: 'last_post' },
				{ data: 'id' },
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
	  
	  
	naigateEmployerDetails(id){
		console.log(id);
	}
		
		
	 /**
	  ** To build the meting form
	  **/
	  private buildForm(): void {
		this.registerForm = this.formBuilder.group({
		  company: ['',Validators.required],
		  first_name: ['',Validators.required],
		  last_name: ['',Validators.required],
		  email: ['',[Validators.required,ValidationService.emailValidator]],
		  phone: ['']
		});
	  }
		
	/**
	**	Assign the form controls to f
	**/
	
	get f() {
		return this.registerForm.controls;
	}
	
	
	/** To open the popup**/
    openReg(){
	this.openregister = true;
		setTimeout(() => {
			this.mbRef = this.modelService.open(this.registerModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
		});
	
	}

   
	/**To close the model**/
	closemodel(){
	    this.mbRef.close();
		this.openregister=false;
		this.registerForm.reset();
		
	}
	
	/**To submit the register */
	submitregister(){
	   let reqParams:any ={};
	   reqParams.first_name=this.registerForm.value.first_name;
	   reqParams.last_name=this.registerForm.value.last_name;
	   reqParams.company=this.registerForm.value.company;
	   reqParams.phone=this.registerForm.value.phone;
	   reqParams.email=this.registerForm.value.email.toLowerCase();
	   reqParams.password=Array(8).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
	   this.accountService.addEmployer(reqParams).subscribe(
      response => {
        this.closemodel();
      }, error => {
        this.formError = error.error.errors;
      })
	}
	
	/**
  **	To build the mail form
  **/
  private buildForm1(): void {
    this.emailform = this.formBuilder.group({
	  subject: ['',Validators.required],
      message: ['',Validators.required]
    });
  }
  
  //Getting ID using click event
	@HostListener("click", ["$event.target.id"]) onClick(id : any) {
	   var arr = id.split('_')		
		if(arr[0]==="mail" || arr[0]==="mailbtn"){
			var val1 = arr[arr.length-1]
			 this.sendemail(val1)    
		}
	}
	
	/** To open mail send popup**/
	
	sendemail(val){
	    this.userId=val;
		this.openmail = true;
		setTimeout(() => {
			this.mbRefs = this.modelService.open(this.emailModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
		});
	}
	
	submitmail(){
		var data={
		  id:this.userId,
		  message:this.emailform.value.message,
		  subject:this.emailform.value.subject
		}
	   this.employerService.sendMailEmployer(data).subscribe(datas=>{
	      this.closemodelmail();
	   })
	
	}
	
	/**To close the model**/
	
	closemodelmail(){
		this.openmail=false;
		this.emailform.reset();
		this.mbRefs.close();
	}
	
}
