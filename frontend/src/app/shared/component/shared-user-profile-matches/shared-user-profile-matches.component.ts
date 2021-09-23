import { Component,ViewEncapsulation, EventEmitter, Input, OnInit, Output,OnChanges, TemplateRef, ViewChild } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';
import * as lodash from 'lodash';
@Component({
	selector: 'app-shared-user-profile-matches',
	templateUrl: './shared-user-profile-matches.component.html',
	styleUrls: ['./shared-user-profile-matches.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class SharedUserProfileMatchesComponent implements OnInit {

	/**
	**	Variable declaration
	**/
	@Input() matchingUsers: any;
	@Input() postedJobsDetails: any;
	@Input() matchingUsersNew: any;
	@Input() moreElement: any;
	@Input() matchedElement: any;
	@Input() application: any;
	@Input() missingElement: any;
	@Input() isMultipleMatches: any;
	@Input() isShownRequiements: boolean= false;
	
	public required: boolean = true;
	public desired: boolean = true;
	public optional: boolean = false;
	public nice: boolean = true;
	public IsValidate: boolean = false;
	public isOtherRequired: boolean = false;
	public isOtherOptional: boolean = false;
	public isOtherNice: boolean = false;
	public isOtherDesired: boolean = false;
	public applicationShow: boolean = false;
	
	public languageSource=[];
	public nationality=[];
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

	constructor(private dataService: DataService,public sharedService: SharedService,public utilsHelperService: UtilsHelperService ) { }

	ngOnInit(): void {
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
		}
    );
	}
	
	/**
	**	To seperate the required,desired and optional data
	**/
  ngOnChanges(changes): void {
    setTimeout( async () => {
		var arr = [];
		if(this.postedJobsDetails){
			  if(this.postedJobsDetails.match_select){
				  this.postedJobsDetails.match_select.remote="false";
				  this.postedJobsDetails.match_select.willing_to_relocate="false";
				  if(!this.postedJobsDetails.certification){
					this.postedJobsDetails.match_select.certification="false";
					  
				  }else if(this.postedJobsDetails.certification.length==0){
					this.postedJobsDetails.match_select.certification="false";
					  
				  }if(!this.postedJobsDetails.education || this.postedJobsDetails.education=='-1'){
					this.postedJobsDetails.match_select.education="false";
					  
				  }if(!this.postedJobsDetails.employer_role_type || this.postedJobsDetails.employer_role_type=='' || this.postedJobsDetails.employer_role_type==undefined){
					this.postedJobsDetails.match_select.employer_role_type="false";
					  
				  }if(!this.postedJobsDetails.facing_role || this.postedJobsDetails.facing_role=='' || this.postedJobsDetails.facing_role==undefined){
					this.postedJobsDetails.match_select.facing_role="false";
					  
				  }else{
					  this.postedJobsDetails.match_select.facing_role="false";
				  }if(!this.postedJobsDetails.training_experience || this.postedJobsDetails.training_experience=='' || this.postedJobsDetails.training_experience==undefined){
					this.postedJobsDetails.match_select.training_experience="false";
					  
				  }else{
					  this.postedJobsDetails.match_select.training_experience="false";
				  }if(!this.postedJobsDetails.skills || this.postedJobsDetails['skills']['length'] ==0 || this.postedJobsDetails.skills==undefined){
					this.postedJobsDetails.match_select.skills="false";
					  
				  }if(this.postedJobsDetails.work_authorization ==null || this.postedJobsDetails.match_select['work_authorization']=='' || this.postedJobsDetails.work_authorization==undefined){
					this.postedJobsDetails.match_select.work_authorization="false";
					  
				  }
				  if(this.application !=null){
					  this.applicationShow = true;
				  }
				  if(this.postedJobsDetails['programming_skills'] ==null || this.postedJobsDetails['programming_skills'] ==undefined || this.postedJobsDetails['programming_skills']['length'] ==0){
					this.postedJobsDetails.match_select['programming_skills']="false";
					  
				  } 
				  this.isShownRequiements = false;
				 if(this.postedJobsDetails.others && this.postedJobsDetails.others.length){
					  for(let i=0;i<this.postedJobsDetails.others.length;i++){
						  var id = this.postedJobsDetails.others[i]['id'];
						  if(this.isShownRequiements == false){
							  if(this.postedJobsDetails.match_select[id] =='0'){
								  this.isOtherRequired = true;
							  }if(this.postedJobsDetails.match_select[id] =='2'){
								  this.isOtherNice = true;
							  }if(this.postedJobsDetails.match_select[id] =='1'){
								  this.isOtherDesired = true;
							  }if(this.postedJobsDetails.match_select[id] ==''){
								  this.isOtherOptional = true;
							  }
						  }else{
							  this.postedJobsDetails.match_select[id] ='false';
						  }
					  }
				  }
				Object.keys(this.postedJobsDetails.match_select).forEach(key => {
					arr.push(this.postedJobsDetails.match_select[key]) 
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
		  }
		
	});
	  
  }
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

  onChangeStringNumber(field1, field2, item, type, isString: boolean = false, isNew: boolean = false) {
    let lowerCaseJob = [];
    if (this.postedJobsDetails && this.postedJobsDetails[field1]) {
      lowerCaseJob = isString ? this.onLoweCase(this.postedJobsDetails[field1]) : this.postedJobsDetails[field1];
    }
    let lowerCaseUser = [];
    if (!isNew && this.matchingUsers && this.matchingUsers.profile && this.matchingUsers.profile[field2]) {
      lowerCaseUser = isString ? this.onLoweCase(this.matchingUsers.profile[field2]) : this.matchingUsers.profile[field2];
    }
    if (isNew && this.matchingUsersNew && this.matchingUsersNew.profile && this.matchingUsersNew.profile[field2]) {
      lowerCaseUser = isString ? this.onLoweCase(this.matchingUsersNew.profile[field2]) : this.matchingUsersNew.profile[field2];
    }

    const itemMod = isString ? item.toLowerCase() : item;
    if (lowerCaseJob.includes(itemMod) && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (!lowerCaseUser.includes(itemMod) && type == 'info') {
      return { type: 'info', class: 'text-blue' }
    } else if (!lowerCaseJob.includes(itemMod) && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }

  onChangeObj(field1, field2, item, type, filterField, isNew = false) {
    let lowerCaseJob = [];
    if (this.postedJobsDetails && this.postedJobsDetails[field1]) {
      lowerCaseJob = this.postedJobsDetails[field1]
    }
    let lowerCaseUser = [];
    if (!isNew && this.matchingUsers && this.matchingUsers.profile && this.matchingUsers.profile[field2]) {
      lowerCaseUser = this.matchingUsers.profile[field2]
    }
    if (isNew && this.matchingUsersNew && this.matchingUsersNew.profile && this.matchingUsersNew.profile[field2]) {
      lowerCaseUser = this.matchingUsersNew.profile[field2]
    }
    let jobIndex = lowerCaseJob.findIndex(val => val[filterField] == item[filterField]);

    let userIndex = lowerCaseUser.findIndex(val => val[filterField] == item[filterField]);
    if (jobIndex > -1 && type == 'check') {
      return { type: 'check', class: 'text-green' }
    } else if (userIndex == -1 && type == 'info') {
      return { type: 'info', class: 'text-blue' }
    } else if (jobIndex == -1 && type == 'close') {
      return { type: 'close', class: 'text-danger' }
    }
    return { type: '', class: '' }
  }


  onGetFilteredValue(resumeArray: any[]): any {
    if (resumeArray && Array.isArray(resumeArray)) {
      const filteredValue = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1);
      if (!this.utilsHelperService.isEmptyObj(filteredValue)) {
        return filteredValue.file;
      }
    }
    return "";
  }

	/**
	**	To find the language
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
	**	To find the country data
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
	**	To find the country data
	**/
	findCountrysData(value){
		if(value){
			value = value.map(function(a,b){ return parseInt(a)});

			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(parseInt(f.id))})

				if(array.length !=0){
					var temp = array[0]['nicename'].toLocaleLowerCase();
					return temp;
				}
			
			}
			
		}
		
		return '--';
	}
	
	finpostJobDetailsCountry(country){
		if(country){
			return country.toLocaleLowerCase();
		}
		return '--';
	}
	
	/**
	**	To find the jobtype
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
					if(datas.filter(function(a,b){ return a.id >= value }).length ==0 ){
						return true;
					}else{
						return false;
					}
				}if(education == 'type'){
					if(array.filter(function(a,b){ return a.toLocaleLowerCase()==value.toLocaleLowerCase()}).length ==0 ){
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
	**	To check the education match
	**/
	checkTypeEqual(array,value){
		
		if(array && value){
			array = this.educationItems.filter(function(a,b){return a.text.toLocaleLowerCase() == array.toLocaleLowerCase()})[0]['id']
			value = this.educationItems.filter(function(a,b){return a.text.toLocaleLowerCase() == value.toLocaleLowerCase()})[0]['id']
			if(array >= value){
				return true;
			}
		}
		return false;
	}
	
	/**
	**	To check the education extra
	**/
	checkTypeExtra(array,value){
		
		if(array && value){
			array = this.educationItems.filter(function(a,b){return a.text.toLocaleLowerCase() == array.toLocaleLowerCase()})[0]['id']
			value = this.educationItems.filter(function(a,b){return a.text.toLocaleLowerCase() == value.toLocaleLowerCase()})[0]['id']
			if(array < value){
				return true;
			}
		}
		return false;
	}
	
	/**
	**	To check language match
	**/
	checkLanMatch(array,value){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(array.filter(function(a,b){ return a==value}).length !=0){
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	**	To check language extra
	**/
	checkLanExtra(array,value,language){
		
		if(array && value){
			if(array.length!=0 && array.length!= undefined){
				if(language =='language'){
					if(array.filter(function(a,b){ return a.language==value}).length ==0){
						return true;
					}
				}else if(array.filter(function(a,b){ return a==value}).length ==0){
					return true;
				}
			}
		}
		return false;
	}
	
	
	
  onShowMatches = (event) => {
	  var temp = event.target.className.split(' ');
	  if(this.matchedElement ==true){
			this.matchedElement = false;
	 }else{
		  this.matchedElement = true;
	  }
	this.missingElement = false;

    if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
	}
	 
  }

  onShowMissing = (event) => {
	  if(this.missingElement ==true){
		this.missingElement = false;
		this.matchedElement = true;
		this.moreElement = true;
	 }else{
		  this.missingElement = true;
		this.matchedElement = false;
		this.moreElement = false;
	  }
	  if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
	  }
    
  }

  onShowMore = (event) => {
	  if(this.moreElement ==true){
			this.moreElement = false;
	 }else{
		  this.moreElement = true;
	  }
	this.missingElement = false;
    if(this.missingElement == false && this.matchedElement == false && this.moreElement == false){
		this.missingElement = true;
		this.matchedElement = true;
		this.moreElement = true;
	  }
  }

  onReset = () => {
	 
    this.moreElement = true;
    this.matchedElement = true;
    this.missingElement = false;
  }
  
	/**
	**	To check the country
	**/
  checkCountry(country){
	  if(country){
		  if(this.matchingUsers.profile){
			  var Temp:any = this.findCountrys(this.matchingUsers.profile.authorized_country);
			  if(Temp.length !=0){
				  if(Temp.filter(function(a,b){return a.toLocaleLowerCase() == country.toLocaleLowerCase()}).length !=0){
					  return true;
				  }
			  }else{
				  if(this.matchingUsers.profile.preferred_locations &&this.matchingUsers.profile.preferred_locations.length){
					  if(this.matchingUsers.profile.preferred_locations.filter(function(a,b){return a.country.toLocaleLowerCase() == country.toLocaleLowerCase()}).length !=0){
					  return true;
					}
				  }
			  }
			  if(this.matchingUsers.profile.country.toLocaleLowerCase() == country.toLocaleLowerCase()){
				  return true;
			  }
		  }
				
			
	  }
	  return false;
  }
  
	CheckExtraId(value,data){
		if(value){
			var val = false;
			var vales:any = '';
			var arrayVal =Object.entries(this.postedJobsDetails.match_select);
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
	
	/**
	**	To check the country return string
	**/
  findCountrys(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'].toLocaleLowerCase() ;
					})
					if(temp.length !=0){
						return temp;
					}
				}
			
			}
			
		}
		
		return [];
	}
	
	checkValues(id){
		
		if(id && this.application && this.application['others']&& this.application['others']['length']){
			id = parseInt(id);
			var temp = this.application['others'].filter(function(a,b){ return a.id ==id });
			if(temp.length !=0){
				if(temp[0]['value']){
					return temp[0]['value']
				}
			}
		}
		return '--';
	}
	
	
	checkValuesField(id,dataValue){
		
		if(id && this.application && this.application['others']&& this.application['others']['length']){
			id = parseInt(id);
			var temp = this.application['others'].filter(function(a,b){ return a.id ==id });
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
	}
	checkDataOthers(data,value){
		  if(data == value){
			  return true;
		  }else{
			return false;  
		  }
	  }
}
