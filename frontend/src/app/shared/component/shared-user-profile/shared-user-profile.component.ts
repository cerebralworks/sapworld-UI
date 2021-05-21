import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';

@Component({
	selector: 'app-shared-user-profile',
	templateUrl: './shared-user-profile.component.html',
	styleUrls: ['./shared-user-profile.component.css']
})

export class SharedUserProfileComponent implements OnInit {

	@Input() userInfo: CandidateProfile;
	@Input() fieldsExclude: any;
	public show: boolean = false;
	public nationality: any[] = [];
	public languageSource: any[] = [];

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
	
	findEducation(value){
		if(value){
			return this.utilsHelperService.onConvertArrayToString(value.map(function(a,b){return a.degree}));
			
		}
		
		return '--';
	}
	
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

}
