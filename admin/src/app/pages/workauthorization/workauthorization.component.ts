import { Component, OnInit,ChangeDetectorRef,OnDestroy, HostListener,ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env';
import { DataTableDirective } from 'angular-datatables';
import { Options } from 'selenium-webdriver';



class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-workauthorization',
  templateUrl: './workauthorization.component.html',
  styleUrls: ['./workauthorization.component.scss']
})
export class WorkAuthorizationComponent implements OnInit {
country : any[] =[];
addWA : FormGroup;
submitted : boolean = false;
show : boolean=false;
show1 : boolean=false;
show2 : boolean=false;
empty : boolean=false;
storage : any ="";
requestParams : any ={};
pages : number = 1;
sorting : string = 'ASC'
column : string = 'id'
limit : number = 10;
valDel : any = "";
valUpd : any = "";
ipVal : any = "";
ipVal1 : any = "";
err : any = "";
dup : boolean = false;
countryId : any = "";
updcountryId : any = "";
countryName : any = "";
dtOption : DataTables.Settings = {};
@ViewChild(DataTableDirective, {static: false})
dtElement:  DataTableDirective;
  constructor(private es : EmployerService,
		private ref: ChangeDetectorRef,
    private fb : FormBuilder,
    private http : HttpClient) { 
      this.addWA = this.fb.group({
        name : new FormControl("",Validators.required),
        visa : new FormControl("",Validators.required)

      })
    }
/**
 * To get all workautherization value when page loading using GET method
 * To set page limit and pagination
 */

  ngOnInit(): void {
    this.load();
    this.requestParams = {};
		this.requestParams.page = 0;
		this.requestParams.limit = this.limit;
    this.requestParams.column = this.column;
    this.requestParams.sort = this.sorting;
		this.requestParams.status = 1;
		this.requestParams.search = '';
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
					//this.pages = dataTablesParameters.start;
					//dataTablesParameters.start = this.pages;
				}else{
				    this.pages = dataTablesParameters.start;
					//this.pages = parseInt(dataTablesParameters.start)/dataTablesParameters.length;
					//this.pages++;
				}
					this.limit = dataTablesParameters.length;
					var cloumns =dataTablesParameters.order[0].column;
					this.column = dataTablesParameters.columns[cloumns]["data"];
					this.sorting = dataTablesParameters.order[0].dir;
          var temp = this.column+' '+this.sorting
          this.http.get<DataTablesResponse>(
          `${env.serverUrl}`+'/api/workauthorization/list'+'?page='+this.pages+'&limit='+this.limit+'&sort='+temp+'&search='+this.requestParams.search).subscribe(response=>{
          this.storage = response
          for(var i=0;i<=response['items'].length-1;i++){
            if(response['items'][i].id===this.valUpd){
            response['items'][i]['edit']=true;
            response['items'][i]['options']=this.country;
            }
            else{
              response['items'][i]['edit']=false
            }
          }
          callback({
            recordsTotal: parseInt(response['meta'].total),
            recordsFiltered: parseInt(response['meta'].total),
            data: response['items']
          })

          this.ref.detectChanges()
        })
      },
    'columnDefs':[
      {
        'targets': 2,
        'orderable':false,
        'className': "text-center",
        'render': function (data, type, full, meta){
          if(full.edit===true){
            
            return '<div><a id="update_'+data+'" class="btn btn-outline-primary btn-xs mr-2"><i id="update_btn_'+data+'" class="fas fa-check"></i></a><a id="cancel_'+data+'" class="btn btn-outline-danger btn-xs"><i id="cancel_btn_'+data+'" class="fas fa-times"></i></a></div>';
          }
          else{
            return '<div><a id="edit_'+data+'"  class="btn btn-outline-primary btn-xs mr-2"><i id="edit_btn_'+data+'" class="ri-pencil-fill"></i></a><a id="delete_'+data+'" class="btn btn-outline-danger btn-xs"><i id="delete_btn_'+data+'" class="ri-delete-bin-fill"></i></a></div>'
          }
        }
    },
    {
      'targets': 0,
      'render': function (data, type, full, meta){
        if(full.edit===true){
          var optionData='<option disabled> Select</option>'
            if(full.options){
                for(let i=0;i<full.options.length;i++){
                  if(full.country === full.options[i]['id']){
                    optionData +='<option selected value="'+full.options[i]['id']+'">'+full.options[i]['nicename']+'</option>'
                  }else{
                    optionData +='<option value="'+full.options[i]['id']+'">'+full.options[i]['nicename']+'</option>'
                  }
                  
                }
            }
          return '<select id="input_'+full.id+'">"'+optionData+'"</select>'
        }
        else{
          return data
        }
      }
    },
    {
      'targets': 1,
      'render': function (data, type, full, meta){
        if(full.edit===true){
          
          return '<input type="text" id="input_v_'+full.id+'" value="'+data+'">'
        }
        else{
          return data
        }
      }
    }
      ],
      columns : [
        {data : "name"},
        {data : "visa"},
        {data : "id"}
      ]
 }
}
/**
   * Getting id for icons using click event
*/
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
    
    //console.log(this.updcountryId)  
    if(this.valUpd){
      this.ipVal="input_"+this.valUpd;
      this.ipVal1="input_v_"+this.valUpd
      var name=document.getElementById(this.ipVal)['value'];
      this.country.filter((a)=>{
        if(a.id== parseInt(name)){
          name = a.nicename;
          return this.updcountryId = a.id;
        }
      })
      var visa=document.getElementById(this.ipVal1)['value']
      var datas ={
        name : name,
        visa : visa,
        country :this.updcountryId,
        id : this.valUpd
      }
     if(this.ipVal && this.ipVal1){
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
   * To delete the workautherization by using Delete method
*/
remove(id : any){
  this.es.deleteWrkauth(id).subscribe(data=>{
    this.ref.detectChanges();
    this.rerender();
  })
}
/**
   * To update the workautherization by using POST method
*/
update(id : any,datas : any){
  this.es.updateWrkauth(id,datas).subscribe(data=>{
    this.storage=data;
    this.show2=true;
			setTimeout(() => {
				this.show2=false;
				this.ref.detectChanges();
			}, 2000);
    this.ref.detectChanges();
    this.rerender();
  },error=>{
    var err1 = error['error'].meesage;
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

    onSearchChange(searchValue: string): void {  
		this.requestParams['search'] =searchValue;
		this.rerender();
	}
	
/**
 * Getting country list by using GET api to display in country name box
 */
load(){
    this.es.getCountry().subscribe(data=>{
      var tempCountry = data['items'];
      this.country= tempCountry;
      //console.log(this.country)
      this.ref.detectChanges();
    })
  }

/*
  To assign the form controls to get method of controls
  To validate the fields
*/
get f(){
    return this.addWA.controls;
}

/**
 *  Getting country id
 */
counid(id : any){
this.countryId =id.split('_')[0];
this.countryName = id.split('_')[1];
}

/**
   * To add workautherization details using POST method
*/
submit(){
this.submitted = true;
if(this.addWA.invalid){return}
var val = this.addWA.value.visa;    
    if(val.trim()<=0){
     this.empty=true
     setTimeout(() => {
      this.empty = false
      this.ref.detectChanges();
      }, 2000);
    }
else{
  var arraryval ={
  name : this.countryName,
  visa : this.addWA.value.visa,
  country : this.countryId,
}
this.es.postWorkauth(arraryval).subscribe(data=>{
  this.storage = data;
  this.show = true;
  this.submitted=false;
  this.addWA.reset();
  this.ref.detectChanges();
  this.rerender()
  setTimeout(() => {
  this.show = false;
  this.ref.detectChanges()
}, 1000);
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
this.submitted=false;
setTimeout(() => {
  this.show = false;
  this.ref.detectChanges()
}, 1000);
}
}

}
