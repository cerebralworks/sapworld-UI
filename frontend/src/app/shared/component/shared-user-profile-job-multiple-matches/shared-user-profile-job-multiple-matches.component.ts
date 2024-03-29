import { Component,ViewEncapsulation, EventEmitter, Input, OnInit, Output,OnChanges, TemplateRef, ViewChild } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';
import { trigger, style, animate, transition, state, group } from '@angular/animations';
@Component({
	selector: 'app-shared-user-profile-job-multiple-matches',
	templateUrl: './shared-user-profile-job-multiple-matches.component.html',
	styleUrls: ['./shared-user-profile-job-multiple-matches.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class SharedUserProfileJobMultipleMatchesComponent implements OnInit {

	/**
	**	Variable declaration
	**/
	@Input() userInfo: CandidateProfile;
	@Input() fieldsExclude: any;
	@Input() postedJobsDetails: any;
	@Input() isMatches: boolean = false;
	@Input() isMultipleMatches: boolean = false;
	public show: boolean = false;
	public nationality: any[] = [];
	public languageSource: any[] = [];
	public required: boolean = true;
	public desired: boolean = true;
	public optional: boolean = true;
	public nice: boolean = true;
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
	**	To get the required,desired and optional
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
				  }if(!this.postedJobsDetails.skills || this.postedJobsDetails['skills']['length'] ==0  || this.postedJobsDetails.skills==undefined){
					this.postedJobsDetails.match_select.skills="false";
					  
				  }if(this.postedJobsDetails.work_authorization ==null || this.postedJobsDetails.match_select['work_authorization']=='' || this.postedJobsDetails.work_authorization==undefined){
					this.postedJobsDetails.match_select.work_authorization="false";
					  
				  }
				  if(this.postedJobsDetails['programming_skills'] ==null || this.postedJobsDetails['programming_skills'] ==undefined || this.postedJobsDetails['programming_skills']['length'] ==0){
					this.postedJobsDetails.match_select['programming_skills']="false";
					  
				  } 
				  if(this.postedJobsDetails['optinal_skills'] ==null || this.postedJobsDetails['optinal_skills'] ==undefined || this.postedJobsDetails['optinal_skills']['length'] ==0){
					this.postedJobsDetails.match_select['optinal_skills']="false";
					  
				  } 
				  if(this.postedJobsDetails['domain'] ==null || this.postedJobsDetails['domain'] ==undefined || this.postedJobsDetails['domain']['length'] ==0){
					this.postedJobsDetails.match_select['domain']="false";
					  
				  } 
				  
				  if(this.postedJobsDetails.need_reference ==false || !this.postedJobsDetails.need_reference || this.postedJobsDetails.need_reference =='false'){
					this.postedJobsDetails.match_select['need_reference']="false";
					  
				  } 
				  if(this.postedJobsDetails.others && this.postedJobsDetails.others.length){
					  for(let i=0;i<this.postedJobsDetails.others.length;i++){
						  var id = this.postedJobsDetails.others[i]['id'];
						  this.postedJobsDetails.match_select[id] = 'false';
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
	
	/**
	**	To find the country String
	**/
	findCountry(value){
		if(value){
			if(this.nationality){
				var temp = this.nationality.filter(function(a,b){
					return a.id == value;
				})
				
				if(temp.length !=0){
					return temp[0]['nicename'];
				}
			}
			
		}
		
		return '--';
	}
	
	/**
	**	To find the education
	**/
	findEducation(value){
		if(value){
			if(value.length!=0){
				return this.utilsHelperService.onConvertArrayToString(value.map(function(a,b){return a.degree}));
			}else{
				return '--';
			}
		}
		
		return '--';
	}
	
	/**
	**	To find the language
	**/
	findLanguageArray(value){
		if(value){
			value = value.map(function(a,b){
				return a.language 
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
	
	/**
	**	To find country Array to String
	**/
	findCountryArray(value){
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
	**	To filter the preferred Location
	**/	
	filterPrefered(value){
		if(value){
			if(value.length !=0){
				var temp = value.map(function(a,b){
					if(a['stateShort']){
						return a['city']+' '+a['stateShort'];
					}else{
						return a['city'];
					}
					
				})
				if(temp.length !=0){
					temp =temp.filter(function(item, pos, self) {
						return self.indexOf(item) == pos;
					})
					return this.utilsHelperService.onConvertArrayToString(temp);
				}
			}
		}
		return '--';
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
	
}
