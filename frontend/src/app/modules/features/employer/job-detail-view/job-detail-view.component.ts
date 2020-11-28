import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetResponse } from '@data/schema/response';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';

@Component({
  selector: 'app-job-detail-view',
  templateUrl: './job-detail-view.component.html',
  styleUrls: ['./job-detail-view.component.css']
})
export class JobDetailViewComponent implements OnInit {

  public isOpenedJDModal: boolean = false;
  public postedJobsDetails: any = {};
  public skills: GetResponse;
  public industries: GetResponse;

  constructor(
    public employerService: EmployerService,
    private route: ActivatedRoute,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if(jobId) {
      this.onGetPostedJob(jobId);
      this.onGetSkill();
      this.onGetIndustries();
    }

  }

  onGetPostedJob(jobId) {
    let requestParams: any = {};
    requestParams.expand = 'employer';
    requestParams.id = jobId;
    this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
        if(response && response.details) {
          this.postedJobsDetails = response.details;
        }
      }, error => {
      }
    )
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

  onFindSkillsFromID = (arrayValues: Array<any>) => {
    if(this.skills && this.skills.items && Array.isArray(this.skills.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
      const temp = this.skills.items.filter(r=> {
        return arrayValues.includes(r.id)
      });
      return this.onConvertArrayObjToString(temp, 'tag');
    }
    return '--';
  }

  onFindDomainFromID = (arrayValues: Array<any>) => {
    if(this.industries && this.industries.items && Array.isArray(this.industries.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
      const temp = this.industries.items.filter(r=> {
        return arrayValues.includes(r.id)
      });
      return this.onConvertArrayObjToString(temp, 'name');
    }
    return '--';
  }

  onFindSkillsFromSingleID = (value: any) => {
    if(value && this.skills && this.skills.items && Array.isArray(this.skills.items)) {
      const temp = this.skills.items.find(r=> {
        return value == r.id
      });
      return temp;
    }
    return '--';
  }

  onGetSkill() {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getSkill(requestParams).subscribe(
      response => {
        this.skills = response;
      }, error => {
      }
    )
  }

  onGetIndustries() {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getIndustries(requestParams).subscribe(
      response => {
        this.industries = response;
      }, error => {
      }
    )
  }

  onConvertArrayToString = (value: any[]) => {
    if (!Array.isArray(value)) return "--";
    return value.join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if ((!Array.isArray(value) || value.length==0)) return "--";
    return value.map(s => s[field]).join(", ");
  }

  onGetYesOrNoValue = (value: boolean) => {
    if (value == true) {
      return "Yes";
    } else {
      return "No"
    }
  }

  onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?:string) => {
    if (!Array.isArray(value) || value.length == 0) return "--";
    return value.map(s => {
      let element = this.onFindSkillsFromSingleID(s.domain);
      if(field && (element && element.tag)) {
        return element.tag + ' (' + s.experience + ' ' + s.experience_type + ')'
      }
    }).join(", ");
  }

}
