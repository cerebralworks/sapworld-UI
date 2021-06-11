import { Component,ViewEncapsulation, Input, OnInit } from '@angular/core';
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
export class SharedJobProfileComponent implements OnInit {

  @Input() jobInfo: JobPosting;
  @Input() isDescrition: boolean = false;
  @Input() fieldsExclude: JobPosting;
	public languageSource=[];
	public required: boolean = false;
	public desired: boolean = false;
	public optional: boolean = false;
  constructor(private dataService: DataService,
    public sharedService: SharedService,
    private sharedApiService: SharedApiService,
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
	  this.onGetCountry('');
	  this.onGetLanguage('');
	  
	  this.dataService.getLanguageDataSource().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.languageSource = response;
        }
		var arr = [];
		  if(this.jobInfo){
			  if(this.jobInfo.match_select){
				Object.keys(this.jobInfo.match_select).forEach(key => {
					arr.push(this.jobInfo.match_select[key]) 
				});
				var requiredFilter = arr.filter(function(a,b){return a=='0'});
				var desiredFilter = arr.filter(function(a,b){return a=='1'});
				var optionalFilter = arr.filter(function(a,b){return a=='2' || a=='' });
				if(requiredFilter.length>0){
					this.required =true;
				}if(desiredFilter.length>0){
					this.desired=true;
				}if(optionalFilter.length>0){
					this.optional =true;
				}
			  }
		  }
      }
    );
  }
  
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
}
