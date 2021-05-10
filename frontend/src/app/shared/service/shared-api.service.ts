import { Injectable } from '@angular/core';
import { EmployerService } from '@data/service/employer.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SharedApiService {

  constructor(
    private employerService: EmployerService,
    private dataService: DataService
  ) { }

  onGetIndustries(requestParams: any): any {
    this.employerService.getIndustries(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.dataService.setIndustriesDataSource(response);
        }else {
          this.dataService.clearIndustriesDataSource();
        }
      }, error => {
        this.dataService.clearIndustriesDataSource();
      }
    )
  }

  onGetSkill(requestParams: any): any {
    this.employerService.getSkill(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.dataService.setSkillDataSource(response);
        }else {
          this.dataService.clearSkillDataSource();
        }
      }, error => {
        this.dataService.clearSkillDataSource();
      }
    )
  }
  
  onGetLanguage(requestParams: any): any {
    this.employerService.getLanguage(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.dataService.setLanguageDataSource(response.items);
        }else {
          this.dataService.clearLanguageDataSource();
        }
      }, error => {
        this.dataService.clearLanguageDataSource();
      }
    )
  }
  
  onGetCountry(requestParams: any): any {
    this.employerService.getCountry(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.dataService.setCountryDataSource(response.items);
        }else {
          this.dataService.clearCountryDataSource();
        }
      }, error => {
        this.dataService.clearCountryDataSource();
      }
    )
  }

}
