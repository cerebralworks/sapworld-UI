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

}
