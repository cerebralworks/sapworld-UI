import { Component,ViewEncapsulation, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';
import { trigger, style, animate, transition, state, group } from '@angular/animations';
@Component({
	selector: 'app-shared-user-profile',
	templateUrl: './shared-user-profile.component.html',
	styleUrls: ['./shared-user-profile.component.css'],
	encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 0 })),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),

        group([
          animate(300, style({ height: 0 })),
          animate('200ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ height: '0', opacity: 0 }),

        group([
          animate(300, style({ height: '*' })),
          animate('400ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
  ]
})

export class SharedUserProfileComponent implements OnInit {

	/**
	**	variable declaration
	**/
	@Input() userInfo: CandidateProfile;
	@Input() applicationDetails: any;
	@Input() fieldsExclude: any;
	@Input() isMatches: boolean = false;
	@Input() isShowUserData: boolean = false;
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
	
	/**
	**	To find the country value
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
	**	To find country array to String
	**/
	findCountryArray(value){
		if(value){
			if(value.length !=0){
				value = value.map(function(a,b){ return parseInt(a) });
			}
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
	**	To find preferred Location
	**/
	filterPrefered(value){
	  var a=value.filter(a=>{return a.city !=''});
		if(a.length !==0){
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
		}else{
		return '--';
		}
	}
	
}
