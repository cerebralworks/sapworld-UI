import { Component, OnInit,ChangeDetectorRef,OnDestroy, HostListener,ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env';
import { DataTableDirective } from 'angular-datatables';
import { isEmpty } from 'rxjs/operators';
class DataTablesResponse {
	data: any[];
	draw: number;
	recordsFiltered: number;
	recordsTotal: number;
}

@Component({
	selector: 'app-industry',
	templateUrl: './industry.component.html',
	styleUrls: ['./industry.component.scss']
})

export class IndustryComponent implements OnInit {
	addindustry : UntypedFormGroup;
	submitted : boolean = false;
	storage : any ="";
	requestParams : any ={};
	pages : number = 1;
	sorting : string = 'ASC'
	column : string = 'id'
	limit : number = 10;
	show : boolean = false;
	empty : boolean = false;
	valDel : any ="";
	valUpd : any ="";
	ipVal : any ="";
	dup : boolean = false;
	err : any = "";
	dtOption : DataTables.Settings = {};
	@ViewChild(DataTableDirective, {static: false})
	dtElement:  DataTableDirective;
	
	constructor(private fb : UntypedFormBuilder ,
    private ref : ChangeDetectorRef,
    private http : HttpClient,
    private es : EmployerService) {
		this.addindustry = this.fb.group({
			name : new UntypedFormControl("",Validators.required)
		})
	}
	
	/**
	* To get all Industry value when page loading using GET method
	* To set page limit and pagination
	*/
	
	ngOnInit(): void {
		this.requestParams = {};
		this.requestParams.page = this.pages;
		this.requestParams.limit = this.limit;
		this.requestParams.column = this.column;
		this.requestParams.sort = this.sorting;
		this.requestParams.status = 1;
		this.dtOption = {
			"searching": false,
			processing : true,
			"info": false,
			serverSide: true,
			deferRender: true,
			pageLength: this.limit,
			"dom": '<"top"i>rt<"bottom"flp><"clear">',
			ajax:  (dataTablesParameters: any, callback) => {
				this.pages = parseInt(dataTablesParameters.start)/dataTablesParameters.length;
				this.pages++;
				this.limit = dataTablesParameters.length;
				var cloumns =dataTablesParameters.order[0].column;
				this.column = dataTablesParameters.columns[cloumns]["data"];
				this.sorting = dataTablesParameters.order[0].dir;
				var temp = this.column+' '+this.sorting
				this.http.get<DataTablesResponse>(`${env.serverUrl}`+'/api/industries/list'+'?page='+this.pages+'&limit='+this.limit+'&sorting='+temp).subscribe(response=>{
					this.storage = response
					for(var i=0;i<=response['items'].length-1;i++){
						if(response['items'][i].id===this.valUpd){
							response['items'][i]['edit']=true
						}else{
							response['items'][i]['edit']=false
						}
					}
					callback({
						recordsTotal: response['meta'].total,
						recordsFiltered: response['meta'].total,
						data: response['items']
					})
					this.ref.detectChanges()
				})
			},
			'columnDefs': [{
				'targets': 1,
				'className':'text-center' ,
				'orderable':false,
				'render': function (data, type, full, meta){
					if(full.edit===true){
						return '<div><a id="update_'+data+'" class="btn btn-outline-primary btn-xs mr-2"><i id="update_btn_'+data+'" class="fas fa-check"></i></a><a id="cancel_'+data+'" class="btn btn-outline-danger btn-xs"><i id="cancel_btn_'+data+'" class="fas fa-times"></i></a></div>';
					}else{
						return '<div><a id="edit_'+data+'"  class="btn btn-outline-primary btn-xs mr-2"><i id="edit_btn_'+data+'" class="ri-pencil-fill"></i></a><a id="delete_'+data+'" class="btn btn-outline-danger btn-xs"><i id="delete_btn_'+data+'" class="ri-delete-bin-fill"></i></a></div>'
					}
				}
			},{
				'targets': 0,
				'render': function (data, type, full, meta){
					if(full.edit===true){
						return '<input type="text" id="input_'+full.id+'" value="'+data+'">'
					}else{
						return data
					}
				}
			}],
			columns: [
				{ data: 'name' },
				{data : 'id'}
			]
		}
	}
	
	
	@HostListener('click' , ["$event.target.id"]) onClick(id : any){
		var arrId = id.split('_')
		if(arrId[0]=="delete"){
			this.valDel = arrId[arrId.length-1]
			if(this.valDel){
				this.remove(this.valDel)
			}
		}
		
		if(arrId[0]==="edit"){
			this.valUpd = parseInt(arrId[arrId.length-1])
			if(this.valUpd){
				this.rerender();
			}
		}
		
		if(arrId[0]==='cancel'){
			this.valUpd = parseInt(arrId[arrId.length-1])
			if(this.valUpd){
				this.valUpd='';
				this.rerender();
			}
		}
		
		if(arrId[0]==='update'){
			this.valUpd=parseInt(arrId[arrId.length-1])
			if(this.valUpd){
				this.ipVal="input_"+this.valUpd;
				var name=document.getElementById(this.ipVal)['value']
				var datas ={
					name : name,
					id : this.valUpd
				}
				if(this.ipVal){
					this.update(this.valUpd,datas)
					this.valUpd='';
				}
			}
		}
	}
	
	/**
	* To reload the data for every action using AJAX method
	*/
	
	rerender(): void {
		if(this.dtElement){
			this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {			
				dtInstance.ajax.reload();
			});
		}
	}
	
	/**
	To assign the form controls to get method of controls
	To validate the fields
	**/
	get f(){
		return this.addindustry.controls
	}
	
	/**
	* To delete the Industry by using Delete method
	*/
	
	remove(id : any){
		this.es.deleteIndustry(id).subscribe(data=>{
			this.ref.detectChanges();
			this.rerender();
		})
	}
	
	/**
	* To update the Industry by using POST method
	*/
	update(id : any,datas : any){
		this.es.updateIndustry(id,datas).subscribe(data=>{
			this.storage=data;
			this.ref.detectChanges();
			this.rerender();
		})
	}
	
	/**
	* To add industry name using POST method
	* To no space validation
	*/
	
	submit(){
		this.submitted = true;
		if(this.addindustry.invalid){return}
		var val = this.addindustry.value.name;
		if(val.trim()<=0){
			this.empty=true
			setTimeout(() => {
				this.empty = false
				this.ref.detectChanges();
			}, 2000);
		}else{
			this.es.postIndustries(this.addindustry.value).subscribe(data=>{
				this.storage=data;
				this.show = true;
				this.ref.detectChanges();
				this.rerender();
			}, error=>{
				this.err = error['error']['errors'][0].field;
				if(this.err==="name"){
				  this.dup = true;
				  this.submitted=false;
				  this.ref.detectChanges();
				  setTimeout(() => {
					this.dup=false;
					this.ref.detectChanges()
				  },2000);
				} 
			  })
			
			this.addindustry.reset()
			this.submitted= false
			setTimeout(() => {
				this.show = false
				this.ref.detectChanges();
			}, 2000);
		}
	}
	
}
