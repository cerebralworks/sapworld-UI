import { Component, OnInit,ChangeDetectorRef,OnDestroy, HostListener,ViewChild} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env';
import { DataTableDirective } from 'angular-datatables';
import { ajax, data, event } from 'jquery';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
	addskills : FormGroup;
	submitted : boolean = false;
	storage : any = "";
	limit : number = 10;
	show : boolean = false;
	show1 : boolean = false;
	show2 : boolean = false;
	pages : number = 1;
	sorting : string = 'ASC'
	column : string = 'id'
	public requestParams : any = {};
	dtOption : DataTables.Settings = {}
	valDel : any = "";
	valUpd : any = "";
	check : boolean ;
	arrval : any ="" ;
	tempText : any ="";
	tempVal : any ="";
	err : any ="";
	dup : boolean = false;
	empty : boolean = false;
	empty1 : boolean = false;
	@ViewChild(DataTableDirective, {static: false})
	dtElement:  DataTableDirective;
	
	constructor( private fb : FormBuilder ,
	private ref: ChangeDetectorRef,
	private es : EmployerService,
	private http : HttpClient) 
	{
		this.addskills = this.fb.group({
			long_tag : new FormControl("",Validators.required),
			tag : new FormControl("",Validators.required)
		})
	}
	
	/**
	* when the page loaded, skill data will display
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
				if(this.valUpd && dataTablesParameters.start == 0 ){
					this.pages = this.pages;
					dataTablesParameters.start = this.pages;
				}else{
					this.pages = parseInt(dataTablesParameters.start)/dataTablesParameters.length;
					this.pages++;
				}
				this.limit = dataTablesParameters.length;
				var cloumns =dataTablesParameters.order[0].column;
				this.column = dataTablesParameters.columns[cloumns]["data"];
				this.sorting = dataTablesParameters.order[0].dir;
				var temp = this.column+' '+this.sorting
				this.http.get<DataTablesResponse>(`${env.serverUrl}`+'/api/skill-tags/list'+'?page='+this.pages+'&limit='+this.limit+'&sorting='+temp).subscribe(response=>{
					this.storage = response
					for(var i = 0; i<=response['items'].length-1; i++){
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
				'targets': 2,
				'orderable':false,
				'render': function (data, type, full, meta){
					if(full.edit==true){
						return '<div><a id="update_'+data+'" class="btn btn-outline-primary btn-xs mr-2"><i id="update_btn_'+data+'" class="fas fa-check"></i></a><a id="cancel_'+data+'" class="btn btn-outline-danger btn-xs"><i id="cancel_btn_'+data+'" class="fas fa-times"></i></a></div>';
					}else{
						return '<div><a id="edit_'+data+'" class="btn btn-outline-primary btn-xs mr-2"><i id="edit_btn_'+data+'" class="ri-pencil-fill"></i></a><a id="delete_'+data+'" (click)="remove('+data+')" class="btn btn-outline-danger btn-xs"><i id="delete_btn_'+data+'" class="ri-delete-bin-fill"></i></a></div>'
					}
				}
			},{
				'targets': 0,
				'render': function (data, type, full, meta){
					if(full.edit==true){      
						return '<input type="text" id="input_text_'+full.id+'"  value="'+data+'" >';
					}else{
						return data;
					}
				}
			},{
				'targets': 1,
				'render': function (data, type, full, meta){
					if(full.edit==true){
						return '<input type="text" id="input_value_'+full.id+'"  value="'+data+'">';
					}else{
						return data;
					}
				}
			}],
			columns: [
				{ data: 'tag' },
				{ data: 'long_tag' },
				{ data: 'id' }
			],        
		}    
	}
	
	//reload the page data
	rerender(): void {
		if(this.dtElement){
			this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.ajax.reload();
			});
		}
    } 
	
	//Getting ID using click event
	@HostListener("click", ["$event.target.id"]) onClick(id : any) {
   
		var arr = id.split('_')
		
		//Delete 
		if(arr[0]==="delete"){
			this.valDel = arr[arr.length-1]
			if(this.valDel){
				this.valUpd=''
				this.remove(this.valDel)    
			}
		}
		
		//Edit
		if(arr[0]==="edit"){
			this.valUpd =parseInt(arr[arr.length-1])
			if(this.valUpd){
				this.rerender();
				console.log(this.valUpd)
			}
		}
		
		//cancel
		if(arr[0]==="cancel"){
			this.valUpd =parseInt(arr[arr.length-1])
			if(this.valUpd){
				this.valUpd='';
				this.rerender();
			}
		}
		
		//Update
		if(arr[0]==="update"){
			this.arrval =parseInt(arr[arr.length-1])  
			if(this.arrval){
				this.tempText ="input_text_"+this.arrval;
				this.tempVal="input_value_"+this.arrval;
				var tag= document.getElementById(this.tempText)
				var longtag= document.getElementById(this.tempVal)
				if(this.tempText&&this.tempVal){
					var datas ={
						tag : tag['value'],
						long_tag : longtag['value'],
						id : this.arrval
					}
					this.update(this.arrval,datas)
					if(this.valUpd){
						this.valUpd='';
		
					}
				}
			}
		}
	}

 
	/**
	* get access of form controll
	*/
	
	get f(){
		return this.addskills.controls
	}
	
	//To close the alert box
	close(){
		this.show=false
	}
	
	/**
	* Deleting the skill using api
	*/
	remove(id: any){

		this.es.deleteskill(id).subscribe(()=>{
			this.ref.detectChanges()
			this.rerender();
		})
	}
	
	/**
	* To update skills using api
	*/
	update(id:any,datas : any){
		this.es.updateskill(id,datas).subscribe(data=>{
			//this.storage=data;
			this.tempText='';
			this.tempVal ='';
			this.show2=true;
			setTimeout(() => {
				this.show2=false;
				this.ref.detectChanges();
			}, 2000);
			this.rerender();
			this.ref.detectChanges()
		},error=>{
			//this.storage=data;
			var err1 = error['error'].meesage
			this.tempText='';
			this.tempVal ='';
			if(err1==="already exist"){
				this.show1=true;
				setTimeout(() => {
					this.show1=false;
					this.ref.detectChanges();
				}, 2000);
			}
			this.ref.detectChanges()
		})
	}
	
	/**
	* To add the skills
	*/
	
	submit(){
		this.submitted = true;
		if(this.addskills.invalid){return}
		var val = this.addskills.value.long_tag;
		var val1 = this.addskills.value.tag;      
    	if(val.trim()<=0 ||val1.trim()<=0 ){
     	this.empty=true
     	setTimeout(() => {
    	 this.empty = false
      	 this.ref.detectChanges();
      	}, 2000);
    	}
		else{
		this.es.createSkills(this.addskills.value).subscribe(data=>{
			this.storage = data;
			this.show=true;
			this.submitted= false;
			this.addskills.reset()
			this.rerender();
			this.ref.detectChanges();
		},error=>{
			this.err = error['error'].meesage;
			//console.log(this.err)
			if(this.err==="already exist"){
				this.show=false;
				this.dup = true;
				this.submitted= false
          		this.ref.detectChanges();
          		setTimeout(() => {
            	this.dup=false;
            	this.ref.detectChanges()
          		},2000);
         }			
		})
		//this.show = true
		setTimeout(() => {
			this.show = false
			this.ref.detectChanges();
		}, 2000);
	}
}
}
