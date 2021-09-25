import { Injectable } from '@angular/core';
import { EmployerService } from '@data/service/employer.service';
import { DataService } from './data.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';

@Injectable({
  providedIn: 'root'
})
export class SharedApiService {

  constructor(
    private employerService: EmployerService,
	private employerSharedService: EmployerSharedService,
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
  onGetNotification(requestParams: any): any {
    this.employerService.onGetNotification(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.dataService.setNotificationDataSource(response);
        }else {
          this.dataService.clearNotificationDataSource();
        }
      }, error => {
        this.dataService.clearNotificationDataSource();
      }
    )
  }
  
  onGetProgram(requestParams: any): any {
    this.employerService.getProgram(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.dataService.setProgramDataSource(response);
        }else {
          this.dataService.clearProgramDataSource();
        }
      }, error => {
        this.dataService.clearProgramDataSource();
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
  
  onGetCompanyDetails(requestParams: any): any {
    this.employerService.getCompanyProfileInfo(requestParams).subscribe(
      response => {
        if(response && response['details']) {
          this.employerSharedService.saveEmployerCompanyDetails(response['details']);
        }else {
          this.employerSharedService.clearEmployerCompanyDetails();
        }
      }, error => {
        this.employerSharedService.clearEmployerCompanyDetails();
      }
    )
  }
  
  onSaveLogs(requestParams: any): any {
    this.employerService.savelogs(requestParams).subscribe(
      response => {
        
      }, error => {
		  
      }
    )
  }

}
