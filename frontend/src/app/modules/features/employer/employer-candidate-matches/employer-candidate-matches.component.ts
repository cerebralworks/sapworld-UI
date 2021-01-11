import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-employer-candidate-matches',
  templateUrl: './employer-candidate-matches.component.html',
  styleUrls: ['./employer-candidate-matches.component.css']
})
export class EmployerCandidateMatchesComponent implements OnInit, OnDestroy {

  public isOpenedResumeModal: boolean;
  public isOpenedSendMailModal: boolean;
  public page: number = 1;
  public limit: number = 25;
  public userList: any[] = [];
  public userMeta: any;
  public userInfo: any;
  public postedJobs: any[] = [];
  public postedJobMeta: any;
  public selectedJob: any;
  public queryParams: any = { job_types: [], sort: ''};
  public experienceFilter: { value: {min: number, max: number}; text: string; }[];
  public minMaxExp: any[] = [];
  public skills: any[] = [];
  public customParseInt = parseInt

  public minValue: number = 100;
  public maxValue: number = 400;
  public options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min:</b> " + value;
        case LabelType.High:
          return "<b>Max:</b> " + value;
        default:
          return "$" + value;
      }
    }
  };
  skillItems: any;

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private userService: UserService,
    private employerSharedService: EmployerSharedService,
    private employerService: EmployerService,
    private location: Location
  ) {
    this.experienceFilter = [
      {value: {min: 0, max: 1}, text: 'Freshers'},
      {value: {min: 1, max: 3}, text: '1 - 3 Years'},
      {value: {min: 3, max: 5}, text: '3 - 5 Years'},
      {value: {min: 5, max: 7}, text: '5 - 7 Years'},
      {value: {min: 7, max: 10}, text: '7 - 10 Years'},
      {value: {min: 10, max: 20}, text: '10 Years & above'}
    ]
    this.route.queryParams.subscribe(params => {
      if(params && !this.utilsHelperService.isEmptyObj(params)) {
        let urlQueryParams = {...params};

        if(urlQueryParams && urlQueryParams.id) {
          this.selectedJob = {id: urlQueryParams.id};
        }

        const jobTypes = this.route.snapshot.queryParamMap.get('job_types');
        if(jobTypes) {
          var jobTypesSplited = new Array();
          jobTypesSplited = jobTypes.split(",");
          if(jobTypesSplited && jobTypesSplited.length) {
            for (let a in jobTypesSplited ) {
              jobTypesSplited[a] = parseInt(jobTypesSplited[a], 10);
            }
            urlQueryParams.job_types = jobTypesSplited;
          }
        }

        const skillTags = this.route.snapshot.queryParamMap.get('skill_tags');
        if(skillTags) {
          let skillArray = new Array();
          skillArray = skillTags.split(",");
          if(skillArray && skillArray.length) {
            for (let a in skillArray ) {
              skillArray[a] = parseInt(skillArray[a], 10);
            }
            this.skills = skillArray;
          }
        }

        const minExperience = this.route.snapshot.queryParamMap.get('min_experience');
        const maxExperience = this.route.snapshot.queryParamMap.get('max_experience');
        if(parseInt(minExperience) >= 0 && parseInt(maxExperience) >= 0) {
          const tempExp = this.experienceFilter.filter((val) => {
            return ((val.value.min >= parseInt(minExperience)) && (val.value.max <= parseInt(maxExperience)))
          })
          if(tempExp.length) {
            this.minMaxExp = [...tempExp]
          }


        }

        this.queryParams = {...this.queryParams, ...urlQueryParams };
        console.log(this.queryParams);

      }
    });
  }

  validateSubscribe = 0;
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    // this.route.queryParams.subscribe(params => {
    //   if(params && !this.utilsHelperService.isEmptyObj(params)) {
    //     this.queryParams = {...params};


    //   }
    // });

    this.dataService.getSkillDataSource().subscribe(
      response => {
        this.skillItems = response
      }
    );

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          if((details && details.id) && this.validateSubscribe == 0) {
            this.onGetPostedJob(details.id);
            this.validateSubscribe ++;
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.validateSubscribe = null;
  }

  onSetJob = (item) =>{
    this.selectedJob = item;
    if(this.selectedJob && this.selectedJob.id) {
      this.userList = [];
      const removeEmpty = this.utilsHelperService.clean(this.queryParams);
      let url = this.router.createUrlTree(['/employer/dashboard'], {queryParams: {...removeEmpty, id: this.selectedJob.id}, relativeTo: this.route}).toString();
      this.location.go(url);
      this.onGetCandidateList(this.selectedJob.id);
    }

  }

  onGetPostedJob(companyId) {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    requestParams.company = companyId;
    requestParams.sort = 'created_at.desc';
    this.employerService.getPostedJob(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.postedJobs = [...response.items];
          if(this.postedJobs && this.postedJobs.length && this.postedJobs[0]) {
            if(this.selectedJob && this.selectedJob.id) {
              const filterJob = this.postedJobs.find((val) => {
                if(this.selectedJob && this.selectedJob.id)
                return parseInt(val.id) == parseInt(this.selectedJob.id);
              });
              if(filterJob && !this.utilsHelperService.isEmptyObj(filterJob)) {
                this.selectedJob = filterJob;
              }
              this.onGetCandidateList(this.selectedJob.id);
            }else {
              this.selectedJob = this.postedJobs[0];
              this.onGetCandidateList(this.selectedJob.id);
            }

          }

        }
        this.postedJobMeta = { ...response.meta }

      }, error => {
      }
    )
  }

  onGetCandidateList(jobId) {
    let requestParams: any = {...this.queryParams};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.status = 1;
    // if(!this.route.snapshot.queryParamMap.get('skill_tags')) {
      requestParams.skill_tags_filter_type = 1;
      requestParams.job_posting = jobId;
    // }else {
    //   requestParams.skill_tags_filter_type = 0;
    // }

    if(!this.route.snapshot.queryParamMap.get('min_experience')) {
      requestParams.min_experience = this.selectedJob.sap_experience;
    }
    if(requestParams.job_types && requestParams.job_types.length) {
      requestParams.job_types = requestParams.job_types.join(',')
    }


    requestParams.city = this.selectedJob.city;

    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.userService.getUsers(removeEmpty).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.userList = [...response.items];
        }
        this.userMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    if(this.selectedJob &&this.selectedJob.id) {
      this.onGetCandidateList(this.selectedJob.id);
    }

  }

  onFiltertByJobType = (fieldName, value) => {
    if(value != 'undefined') {
      console.log(this.queryParams);

      let index = this.queryParams.job_types.indexOf(value);
      if(index > -1) {
        this.queryParams.job_types.splice(index, 1)
      }else {
        this.queryParams.job_types.push(value)
      }

      if( this.queryParams.job_types &&  this.queryParams.job_types.length) {
        this.onRedirectRouteWithQuery({[fieldName]: this.queryParams.job_types.join(',')})
      }else {
        this.onRedirectRouteWithQuery({[fieldName]: [].toString()})
      }
    }
  }

  onFiltertBySkill = (item) => {
    if(item != 'undefined') {
      let index = this.skills.findIndex((element) => {
        return element == item.id;
      });
      if(index > -1) {
        this.skills.splice(index, 1)
      }else {
        this.skills.push(parseInt(item.id))
      }

      if( this.skills &&  this.skills.length) {
        this.onRedirectRouteWithQuery({skill_tags: this.skills.join(',')})
      }else {
        this.onRedirectRouteWithQuery({skill_tags: [].toString()})
      }
    }
  }

  onFiltertByExperience = (item) => {
    if(item != 'undefined') {
      let index = this.minMaxExp.findIndex((element) => {
        return ((element.value.min == item.value.min) && (element.value.max == item.value.max))
      });

      if(index > -1) {
        this.minMaxExp.splice(index, 1)
      }else {
        this.minMaxExp.push(item)
      }

      const min = Math.min.apply(null, this.minMaxExp.map(function(item) {
        if(item && item.value && (item.value.min || item.value.min == 0)) {
          return item.value.min;
        }
      }));
      const max = Math.max.apply(null, this.minMaxExp.map(function(item) {
        if(item && item.value && (item.value.max || item.value.max == 0)) {
          return item.value.max;
        }
      }));


      if(this.minMaxExp.length == 0) {
        this.onRedirectRouteWithQuery({min_experience: "", max_experience: ""})
      }

      if((min || min ==0) && max && this.minMaxExp.length) {
        this.onRedirectRouteWithQuery({min_experience: min, max_experience: max})
      }
    }
  }

  onRedirectRouteWithQuery = (params: any = {}) => {
    this.queryParams = { ...this.queryParams, ...params };
    const removeEmpty = this.utilsHelperService.clean(this.queryParams);

    if(removeEmpty && removeEmpty.job_types && Array.isArray(removeEmpty.job_types)) {
      removeEmpty.job_types = removeEmpty.job_types.join(',');
    }


    const navigationExtras: NavigationExtras = {
      queryParams: {...removeEmpty}
    };

    this.router.navigate([], navigationExtras);
  }

  onCheckExpDefault = (item) => {
    if(((item.value.min >= parseInt(this.queryParams.min_experience)) && (item.value.max <= parseInt(this.queryParams.max_experience)))) {
     return true;
    }
    return false;
  }

  onChangeEve = (event) => {
    if(event != 'undefined') {
      this.onRedirectRouteWithQuery({min_salary: event.value, max_salary: event.highValue})
    }else {
      this.onRedirectRouteWithQuery({min_salary: '', max_salary: ''})
    }
  }

  onClearFilter = () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {activeTab:'matches', 'id': this.selectedJob.id}
    };

    this.router.navigate([], navigationExtras);
    // this.onRedirectRouteWithQuery({activeTab:'matches', 'id': this.selectedJob.id})
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
