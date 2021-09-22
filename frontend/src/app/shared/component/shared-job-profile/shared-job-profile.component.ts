import { Component,ViewEncapsulation,OnChanges, Input, OnInit } from '@angular/core';
import { JobPosting } from '@data/schema/post-job';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';

@Component({
  selector: 'app-shared-job-profile',
  templateUrl: './shared-job-profile.component.html',
  styleUrls: ['./shared-job-profile.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class SharedJobProfileComponent implements OnInit,OnChanges {

	/**
	**	Variable declaration
	**/
	@Input() jobInfo: JobPosting;
	@Input() isDescrition: boolean = false;
	@Input() isMultipleMatches: boolean = false;
	@Input() isShownRequiements: boolean = false;
	@Input() isHideData: boolean = false;
	@Input() fieldsExclude: JobPosting;
	public languageSource=[];
	public nationality=[];
	public isOtherRequired: boolean = false;
	public isOtherOptional: boolean = false;
	public isOtherNice: boolean = false;
	public isOtherDesired: boolean = false;
	public required: boolean = false;
	public desired: boolean = false;
	public optional: boolean = false;
	public nice: boolean = false;
	public IsShown: boolean = false;
  constructor(private dataService: DataService,
    public sharedService: SharedService,
    private sharedApiService: SharedApiService,
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
	  //this.onGetCountry('');
	  //this.onGetLanguage('');
	  this.dataService.getCountryDataSource().subscribe(
		response => {
        if (response && Array.isArray(response) && response.length) {
          this.nationality = response;
	
        }
      }
    );
	  this.dataService.getLanguageDataSource().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.languageSource = response;
        }
		var arr = [];
		  if(this.jobInfo){
			  if(this.jobInfo.match_select){
				  this.jobInfo.match_select['remote']="false";
				  this.jobInfo.match_select['willing_to_relocate']="false";
				  if(!this.jobInfo.certification){
					this.jobInfo.match_select['certification']="false";
					  
				  }else if(this.jobInfo.certification.length==0){
					this.jobInfo.match_select['certification']="false";
					  
				  }if(!this.jobInfo['education'] ){
					this.jobInfo.match_select['education']="false";
					  
				  }if(!this.jobInfo.employer_role_type || this.jobInfo.employer_role_type=='' || this.jobInfo.employer_role_type==undefined){
					this.jobInfo.match_select['employer_role_type']="false";
					  
				  }if(!this.jobInfo.facing_role || this.jobInfo.facing_role=='' || this.jobInfo.facing_role==undefined){
					this.jobInfo.match_select['facing_role']="false";
					  
				  }else{
					  this.jobInfo.match_select['facing_role']="false";
				  }if(!this.jobInfo.training_experience || this.jobInfo.training_experience=='' || this.jobInfo.training_experience==undefined){
					this.jobInfo.match_select['training_experience']="false";
					  
				  }else{
					  this.jobInfo.match_select['training_experience']="false";
				  }if(this.jobInfo['skills'] ==null || this.jobInfo['skills']['length'] ==0 || this.jobInfo['skills'] ==undefined){
					this.jobInfo.match_select['skills']="false";
					  
				  }if(this.jobInfo['work_authorization'] ==null || this.jobInfo.match_select['work_authorization'] =='' || this.jobInfo['work_authorization'] ==undefined){
					this.jobInfo.match_select['work_authorization']="false";
					  
				  }
				  if(this.jobInfo['programming_skills'] ==null || this.jobInfo['programming_skills'] ==undefined || this.jobInfo['programming_skills']['length'] ==0){
					this.jobInfo.match_select['programming_skills']="false";
					  
				  } 
				  if(this.jobInfo['optinal_skills'] ==null || this.jobInfo['optinal_skills'] ==undefined || this.jobInfo['optinal_skills']['length'] ==0){
					this.jobInfo.match_select['optinal_skills']="false";
					  
				  } 
				  if(this.jobInfo['domain'] ==null || this.jobInfo['domain'] ==undefined || this.jobInfo['domain']['length'] ==0){
					this.jobInfo.match_select['domain']="false";
					  
				  } 
				  this.isShownRequiements = false;
				  if(this.jobInfo.others && this.jobInfo.others.length){
					  for(let i=0;i<this.jobInfo.others.length;i++){
						  var id = this.jobInfo.others[i]['id'];
						  if(this.isShownRequiements == false){
							  if(this.jobInfo.match_select[id] =='0'){
								  this.isOtherRequired = true;
							  }if(this.jobInfo.match_select[id] =='2'){
								  this.isOtherNice = true;
							  }if(this.jobInfo.match_select[id] =='1'){
								  this.isOtherDesired = true;
							  }if(this.jobInfo.match_select[id] ==''){
								  this.isOtherOptional = true;
							  }
						  }else{
							  this.jobInfo.match_select[id] ='false';
						  }
					  }
				  }
				Object.keys(this.jobInfo.match_select).forEach(key => {
					arr.push(this.jobInfo.match_select[key]) 
				});
				var requiredFilter = arr.filter(function(a,b){return a=='0'});
				var desiredFilter = arr.filter(function(a,b){return a=='1'});
				var niceFilter = arr.filter(function(a,b){return a=='2' });
				var optionalFilter = arr.filter(function(a,b){return a=='' });
				if(requiredFilter.length>0){
					this.required =true;
				}else{
					this.required =false;
				}if(desiredFilter.length>0){
					this.desired=true;
				}else{
					this.desired =false;
				}if(niceFilter.length>0){
					this.nice =true;
				}else{
					this.nice =false;
				}if(optionalFilter.length>0){
					this.optional =true;
				}else{
					this.optional =false;
				}
				
			  }
			  if(this.jobInfo.health_wellness && this.jobInfo.paid_off && this.jobInfo.office_perks){
			  if(this.jobInfo.health_wellness['life'] == true || this.jobInfo.health_wellness['health']  == true 
			  || this.jobInfo.health_wellness['vision'] == true || this.jobInfo.health_wellness['dental'] == true
			  || this.jobInfo.paid_off['maternity'] == true ||  this.jobInfo.paid_off['paid_holidays'] == true 
			  || this.jobInfo.paid_off['vacation_policy'] == true || this.jobInfo.financial_benefits['purchase_plan'] == true 
			  || this.jobInfo.financial_benefits['tuition_reimbursement'] == true || this.jobInfo.financial_benefits['performance_bonus'] == true 
			  || this.jobInfo.financial_benefits['retirement_plan'] == true || this.jobInfo.office_perks['office_space'] == true || 
			  this.jobInfo.office_perks['social_outings'] == true || this.jobInfo.office_perks['pet_friendly'] == true || 
			  this.jobInfo.office_perks['home_policy'] == true || this.jobInfo.office_perks['free_food'] == true){
				  this.IsShown=true;
			  }}
		  }
      }
    );
  }
  
	/**
	**	detect the chnages and validate the required,desired and optional section
	**/
  ngOnChanges(changes): void {
    setTimeout( async () => {
		var arr = [];
		if(this.jobInfo){
			  if(this.jobInfo.match_select){
				   this.jobInfo.match_select['remote']="false";
				  this.jobInfo.match_select['willing_to_relocate']="false";
				  if(!this.jobInfo.certification){
					this.jobInfo.match_select['certification']="false";
					  
				  }else if(this.jobInfo.certification.length==0){
					this.jobInfo.match_select['certification']="false";
					  
				  }if(!this.jobInfo['education'] ){
					this.jobInfo.match_select['education']="false";
					  
				  }if(!this.jobInfo.employer_role_type || this.jobInfo.employer_role_type=='' || this.jobInfo.employer_role_type==undefined){
					this.jobInfo.match_select['employer_role_type']="false";
					  
				  }if(!this.jobInfo.facing_role || this.jobInfo.facing_role=='' || this.jobInfo.facing_role==undefined){
					this.jobInfo.match_select['facing_role']="false";
					  
				  }else{
					  this.jobInfo.match_select['facing_role']="false";
				  }if(!this.jobInfo.training_experience || this.jobInfo.training_experience=='' || this.jobInfo.training_experience==undefined){
					this.jobInfo.match_select['training_experience']="false";
					  
				  }else{
					  this.jobInfo.match_select['training_experience']="false";
				  }if(this.jobInfo['skills'] ==null || this.jobInfo['skills']['length'] ==0 || this.jobInfo['skills'] ==undefined){
					this.jobInfo.match_select['skills']="false";
					  
				  }if(this.jobInfo['work_authorization'] ==null || this.jobInfo.match_select['work_authorization'] =='' || this.jobInfo['work_authorization'] ==undefined){
					this.jobInfo.match_select['work_authorization']="false";
					  
				  } 
				  if(this.jobInfo['programming_skills'] ==null || this.jobInfo['programming_skills'] ==undefined || this.jobInfo['programming_skills']['length'] ==0){
					this.jobInfo.match_select['programming_skills']="false";
					  
				  } 
				  if(this.jobInfo['optinal_skills'] ==null || this.jobInfo['optinal_skills'] ==undefined || this.jobInfo['optinal_skills']['length'] ==0){
					this.jobInfo.match_select['optinal_skills']="false";
					  
				  } 
				  if(this.jobInfo['domain'] ==null || this.jobInfo['domain'] ==undefined || this.jobInfo['domain']['length'] ==0){
					this.jobInfo.match_select['domain']="false";
					  
				  } 
				  this.isShownRequiements = false;
				  if(this.jobInfo.others && this.jobInfo.others.length){
					  for(let i=0;i<this.jobInfo.others.length;i++){
						  var id = this.jobInfo.others[i]['id'];
						  if(this.isShownRequiements == false){
							  if(this.jobInfo.match_select[id] =='0'){
								  this.isOtherRequired = true;
							  }if(this.jobInfo.match_select[id] =='2'){
								  this.isOtherNice = true;
							  }if(this.jobInfo.match_select[id] =='1'){
								  this.isOtherDesired = true;
							  }if(this.jobInfo.match_select[id] ==''){
								  this.isOtherOptional = true;
							  }
						  }else{
							  this.jobInfo.match_select[id] ='false';
						  }
					  }
				  }
				Object.keys(this.jobInfo.match_select).forEach(key => {
					arr.push(this.jobInfo.match_select[key]) 
				});
				var requiredFilter = arr.filter(function(a,b){return a=='0'});
				var desiredFilter = arr.filter(function(a,b){return a=='1'});
				var niceFilter = arr.filter(function(a,b){return a=='2' });
				var optionalFilter = arr.filter(function(a,b){return a=='' });
				if(requiredFilter.length>0){
					this.required =true;
				}if(desiredFilter.length>0){
					this.desired=true;
				}if(niceFilter.length>0){
					this.nice =true;
				}if(optionalFilter.length>0){
					this.optional =true;
				}
				
			  }
			  if(this.jobInfo.health_wellness && this.jobInfo.paid_off && this.jobInfo.office_perks){
			  if(this.jobInfo.health_wellness['life'] == true || this.jobInfo.health_wellness['health']  == true 
			  || this.jobInfo.health_wellness['vision'] == true || this.jobInfo.health_wellness['dental'] == true
			  || this.jobInfo.paid_off['maternity'] == true ||  this.jobInfo.paid_off['paid_holidays'] == true 
			  || this.jobInfo.paid_off['vacation_policy'] == true || this.jobInfo.financial_benefits['purchase_plan'] == true 
			  || this.jobInfo.financial_benefits['tuition_reimbursement'] == true || this.jobInfo.financial_benefits['performance_bonus'] == true 
			  || this.jobInfo.financial_benefits['retirement_plan'] == true || this.jobInfo.office_perks['office_space'] == true || 
			  this.jobInfo.office_perks['social_outings'] == true || this.jobInfo.office_perks['pet_friendly'] == true || 
			  this.jobInfo.office_perks['home_policy'] == true || this.jobInfo.office_perks['free_food'] == true){
				  this.IsShown=true;
			  }}
		  }
		
	}, 0);
	  
  }
  
	/**
	**	To filter array to String
	**/
	findLanguageArray(value){
		if(value){
			value = value.map(function(a,b){
				return a 
			})
			if(this.languageSource){
				var array = this.languageSource.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['name'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			
			}
			
		}
		
		return '--';
	}
	findCountry(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			
			}
			
		}
		
		return '--';
	}
	
	CheckExtraId(value,data){
		if(value){
			var val = false;
			var vales = '';
			var arrayVal =Object.entries(this.jobInfo.match_select);
			for(let i=0;i<arrayVal.length;i++){
				if(arrayVal[i][0].toLocaleLowerCase() == value.toLocaleLowerCase()){
					vales = arrayVal[i][1] ;
					if(vales == data){
						return true;
					}
					
				}
			}
		}
		return false;
	}
onGetCountry(query) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.status = 1;
		requestParams.search = query;

		this.sharedApiService.onGetCountry(requestParams);
		 
	  }
	  
	  onGetLanguage(query) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.status = 1;
		requestParams.search = query;

		this.sharedApiService.onGetLanguage(requestParams);
	  }
	  
	  checkDataOthers(data,value){
		  if(data == value){
			  return true;
		  }else{
			return false;  
		  }
	  }
}
