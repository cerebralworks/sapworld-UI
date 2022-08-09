import { Component,ViewEncapsulation,OnChanges, Input, OnInit } from '@angular/core';
import { JobPosting } from '@data/schema/post-job';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import * as lodash from 'lodash';

@Component({
  selector: 'app-shared-job-profile-multiple-matches',
  templateUrl: './shared-job-profile-multiple-matches.component.html',
  styleUrls: ['./shared-job-profile-multiple-matches.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class SharedJobProfileMultipleMatchesComponent implements OnInit,OnChanges {
	
	/**
	**	Variable declaration
	**/
	@Input() jobInfo: any;
	@Input() userInfo: any;
	@Input() isDescrition: boolean = false;
	@Input() isMultipleMatches: boolean = false;
	@Input() matchedElement: boolean = false;
	@Input() missingElement: boolean = false;
	@Input() moreElement: boolean = false;
	@Input() matchingJob: any;
	public languageSource=[];
	public nationality=[];
	public required: boolean = false;
	public desired: boolean = false;
	public optional: boolean = false;
	public nice: boolean = false;
	public IsShown: boolean = false;
	public isOtherRequired: boolean = false;
	public isOtherOptional: boolean = false;
	public isOtherNice: boolean = false;
	public isOtherDesired: boolean = false;
	
	public educationItems = [
		{  id:0, text: 'high school' },
		{  id:1, text: 'diploma' },
		{  id:2, text: 'bachelors' },
		{  id:3, text: 'masters' },
		{  id:4, text: 'doctorate' }
	];
	public roleItems = [
		{  id:1, text: 'Technical' },
		{  id:2, text: 'Functional' },
		{  id:3, text: 'Technofunctional' }
	];
  constructor(private dataService: DataService,
    public sharedService: SharedService,
    private sharedApiService: SharedApiService,
    public utilsHelperService: UtilsHelperService
  ) { }

  /**
	**	To initialize the user data
	**/
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
				  }if(this.jobInfo.work_authorization ==null || this.jobInfo.match_select['work_authorization']=='' || this.jobInfo.work_authorization==undefined){
					this.jobInfo.match_select.work_authorization="false";
					  
				  }if(this.jobInfo['skills'] ==null || this.jobInfo['skills']['length'] ==0 || this.jobInfo['skills'] ==undefined){
					this.jobInfo.match_select['skills']="false";
					  
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
				  if(this.jobInfo.need_reference ==false || !this.jobInfo.need_reference || this.jobInfo.need_reference =='false'){
					this.jobInfo.match_select['need_reference']="false";
					  
				  } 
				  if(this.jobInfo.extra_criteria && this.jobInfo.extra_criteria.length){
						for(let j=0;j<this.jobInfo.extra_criteria.length;j++){
							var value= this.jobInfo.extra_criteria[j]['title']
							var arrayVal =Object.entries(this.jobInfo.match_select);
							for(let i=0;i<arrayVal.length;i++){
								if(arrayVal[i][0].toLocaleLowerCase() == value.toLocaleLowerCase()){
									var temps =arrayVal[i][0];
									this.jobInfo.match_select[temps]="false";									
									
								}
							}
						}
				  }
				  this.isOtherRequired = false;
				  this.isOtherNice = false;
				  this.isOtherDesired = false;
				  this.isOtherOptional = false;
				  
				  if(this.jobInfo.others && this.jobInfo.others.length){
					  for(let i=0;i<this.jobInfo.others.length;i++){
						  var id = this.jobInfo.others[i]['id'];
						 
							  if(this.jobInfo.match_select[id] =='0' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherRequired = true;
							  }if(this.jobInfo.match_select[id] =='2' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherNice = true;
							  }if(this.jobInfo.match_select[id] =='1' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherDesired = true;
							  }if(this.jobInfo.match_select[id] =='' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherOptional = true;
							  }
						  
					  }
				  }
				  
				  if(this.jobInfo.otherss && this.jobInfo.otherss.length){
					  for(let i=0;i<this.jobInfo.others.length;i++){
						  //var id = this.jobInfo.others[i]['id'];
						 // this.jobInfo.match_select[id] = 'false';
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
	**	To detectChanges for required,optional and desired
	**/
  ngOnChanges(changes): void {
    setTimeout( async () => {
		var arr = [];
		console.log(this.jobInfo);
		if(this.jobInfo){
			  if(this.jobInfo.match_select){
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
				this.isOtherRequired = false;
				  this.isOtherNice = false;
				  this.isOtherDesired = false;
				  this.isOtherOptional = false;
				  
				  if(this.jobInfo.others && this.jobInfo.others.length){
					  for(let i=0;i<this.jobInfo.others.length;i++){
						  var id = this.jobInfo.others[i]['id'];
						 
							  if(this.jobInfo.match_select[id] =='0' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherRequired = true;
							  }if(this.jobInfo.match_select[id] =='2' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherNice = true;
							  }if(this.jobInfo.match_select[id] =='1' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherDesired = true;
							  }if(this.jobInfo.match_select[id] =='' && this.jobInfo.others[i]['value'] ===true){
								  this.isOtherOptional = true;
							  }
						  
					  }
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
	**	To filter the type values
	**/	
	checkTypeValue(job,user,role){
		
		if(job && user){
			if(role=='matches'){
				job = this.roleItems.filter(function(a,b){return a.text.toLocaleLowerCase() == job.toLocaleLowerCase()});
				if(job.length !=0){
					job =job[0]['id']
				}else{
					job = 0
				}
				user = this.roleItems.filter(function(a,b){return a.text.toLocaleLowerCase() == user.toLocaleLowerCase()});
				if(user.length !=0){
					user =user[0]['id']
				}else{
					user = 99;
				}
				if(job == user){
					return true;
				}
				if(user == 3){
					return true;
				}
			}if(role == 'missing'){
				job = this.roleItems.filter(function(a,b){return a.text.toLocaleLowerCase() == job.toLocaleLowerCase()});
				if(job.length !=0){
					job =job[0]['id']
				}else{
					job = 0
				}
				user = this.roleItems.filter(function(a,b){return a.text.toLocaleLowerCase() == user.toLocaleLowerCase()});
				if(user.length !=0){
					user =user[0]['id']
				}else{
					user = 99;
				}
				if(user == 3){
					return false;
				}	
				if(job != user){					
					return true;
				}
				
			}
		}
		return false;
	}

	/**
	**	To filter the type values
	**/	
	checkType(array,value,education){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(education == 'education'){
					var datas:any = this.educationItems.filter((el) => {
						  return array.some((f) => {
							return f.degree === el.text ;
					});
					});
				value = this.educationItems.filter(function(a,b){return a.text.toLocaleLowerCase() == value.toLocaleLowerCase()})[0]['id']
					
					if(datas.filter(function(a,b){ return a.id >= value }).length !=0 ){
						return true;
					}else{
						return false;
					}
				}if(education == 'missing'){
					var datas:any = this.educationItems.filter((el) => {
						  return array.some((f) => {
							return f.degree === el.text ;
					});
					});
				value = this.educationItems.filter(function(a,b){return a.text.toLocaleLowerCase() == value.toLocaleLowerCase()})[0]['id']
					
					if(datas.filter(function(a,b){ return a.id < value }).length !=0 ){
						if(datas.filter(function(a,b){ return a.id >= value }).length !=0 ){
							return false;
						}else{
							return true;
						}
					}else{
						return false;
					}
				}if(education == 'type'){
					if(array.filter(function(a,b){ return a.toLocaleLowerCase()==value.toLocaleLowerCase()}).length !=0 ){
						return true;
					}
				}else if(array.filter(function(a,b){ return a.toLocaleLowerCase()==value.toLocaleLowerCase()}).length ==0){
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	**	To Check the data
	**/
	checkTypeEqual(array,value){
		
		if(array && value){
			if(array.toLocaleLowerCase() ==value.toLocaleLowerCase()){
				return true;
			}
		}
		return false;
	}
	
	/**
	**	To check the user language
	**/
	checkLanMatch(array,value){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(array.filter(function(a,b){ return a.language==value}).length !=0){
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	**	To get the language status
	**/
	checkLanExtra(array,value,language){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(language =='language'){
					if(array.filter(function(a,b){ return a.language==value}).length ==0){
						return true;
					}
				}else if(array.filter(function(a,b){ return a!=value}).length !=0){
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	**	To validate the array fileds
	**/
  inArray(needle, haystack, matchAll = false) {
    if ((Array.isArray(needle) && Array.isArray(haystack)) && needle.length && haystack.length) {
      if (matchAll) {
        return needle.every(i => haystack.includes(i));
      } else {
        return needle.some(i => haystack.includes(i));
      }
    }
    return false;
  }

	/**
	**	To check the two arrays
	**/
  onChangeValue(array1: any[] = [], array2: any[] = [], type = 'array', field: string = 'id', filterArray: string = '') {
    if (array1 && array1.length && array2 && array2.length) {
      let result;
      if (type == 'array') {
        result = lodash.uniq([...array1, ...array2])
      }
      if (type == 'arrayObj') {
        result = lodash.uniqBy([...array1, ...array2], field)
      }
      if (result && result.length) {
        return result;
      }
    }
    return [];
  }

  onLoweCase(array: any[] = []) {
    if (array && array.length) {
      return array.map(v => v.toLowerCase());
    }else{
		return [];
	}
  }

  onDiff = (arr1: any[] = [], arr2: any[] = []) => {
    if (arr1 && arr1.length && arr2 && arr2.length) {
      let difference = arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
      return difference;
    }
    return [];
  }

	/**
	**	To convert string 
	**/
  onChangeStringNumber(field1, field2, item, type, isString: boolean = false) {
    let lowerCaseJob = [];
    if (this.userInfo && this.userInfo[field1]) {
      lowerCaseJob = isString ? this.onLoweCase(this.userInfo[field1]) : this.userInfo[field1];
    }
    let lowerCaseUser = [];
    if (this.matchingJob && this.matchingJob.jobs && this.matchingJob.jobs[field2]) {
      lowerCaseUser = isString ? this.onLoweCase(this.matchingJob.jobs[field2]) : this.matchingJob.jobs[field2];
    }
    if (lowerCaseJob.includes(item.toLowerCase()) && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (!lowerCaseJob.includes(item?.toLowerCase()) && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }

	/**
	**	To get Object into String
	**/
  onChangeObj(field1, field2, item, type, filterField) {
    let lowerCaseJob = [];
    if (this.userInfo && this.userInfo[field1]) {
      lowerCaseJob = this.userInfo[field1]
    }
    let lowerCaseUser = [];
    if (this.userInfo && this.userInfo && this.userInfo[field2]) {
      lowerCaseUser = this.userInfo[field2]
    }
    let jobIndex = lowerCaseJob.findIndex(val => val[filterField] == item[filterField]);

    let userIndex = lowerCaseUser.findIndex(val => val[filterField] == item[filterField])
    if (jobIndex > -1 && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (userIndex == -1 && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }

	/**
	**	To find the users language
	**/
	findLanguageArray(value){
		if(value){
			
			if(this.languageSource){
				var array = this.languageSource.filter(function(a,b){ return a.id == value})

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
		
	/**
	**	To find the country values
	**/
	findCountry(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'].toLocaleLowerCase();
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			
			}
			
		}
		
		return '--';
	}
	
	/**
	**	To get the country details
	**/
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
	  
	/**
	**	To show the users details matches
	**/
	  onShowMatches = (event) => {
	  var temp = event.target.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
			this.matchedElement = false;
	 }else{
		  this.matchedElement = true;
	  }
    if(this.missingElement == false && this.matchedElement == false ){
		this.matchedElement = true;
	  }
	  
  }

	/**
	**	To sjow the user details missing
	**/
  onShowMissing = (event) => {
	  var temp = event.target.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
			this.missingElement = false;
	 }else{
		  this.missingElement = true;
	  }
	   
	  if(this.missingElement == false && this.matchedElement == false ){
		this.missingElement = true;
	  }
    
  }
  
  
	checkMatchReference(jobInfo,userInfo){
		var tempCheck = userInfo.reference.filter(function(a,b){ return a.email && a.name && a.company_name });
		if(tempCheck['length'] !=0){
			return true;
		}
		return false;
	}
	checkMissingReference(jobInfo,userInfo){
		var tempCheck = userInfo.reference.filter(function(a,b){ return a.email && a.name && a.company_name });
		if(tempCheck['length'] !=0){
			return false;
		}
		return true;
	}
	
	checkDataOthers(data,value){
		  if(data == value){
			  return true;
		  }else{
			return false;  
		  }
	  }
	  
	  checkValuesField(id,dataValue){
		if(!this.jobInfo['otherss']){
			if(dataValue=='no'){
				return true
			}else{
				return false
			}
		}
		if(id && this.jobInfo['otherss'] && this.jobInfo['otherss']['length']){
			id = parseInt(id);
			var temp = this.jobInfo['otherss'].filter(function(a,b){ return a.id ==id });
			if(temp.length !=0){
				if(temp[0]['value']){
					if(temp[0]['value'].toLowerCase() ==dataValue.toLowerCase()){
						return true
					}else{
						return false
					}
				}
			}
		}
		if(dataValue == 'false'){
			return true
		}else{
			return false
		}
		return false;
	}
	
	checkValues(id){
		if(id && this.jobInfo['otherss'] && this.jobInfo['otherss']&& this.jobInfo['otherss']['length']){
			id = parseInt(id);
			var temp = this.jobInfo['otherss'].filter(function(a,b){ return a.id ==id });
			if(temp.length !=0){
				if(temp[0]['value']){
					return temp[0]['value']
				}
			}
		}
		return '--';
	}
	
}
