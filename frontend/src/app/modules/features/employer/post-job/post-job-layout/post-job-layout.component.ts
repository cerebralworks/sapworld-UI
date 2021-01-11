import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { JobPosting } from '@data/schema/post-job';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

import * as lodash from 'lodash';

const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.6s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.6s ease-out', style({ transform: 'translateX(100%)' }))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(100%)' }), animate('.6s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.6s ease-out', style({ transform: 'translateX(-100%)' }))], {
      optional: true,
    }),
  ]),
];

@Component({
  selector: 'app-post-job-layout',
  templateUrl: './post-job-layout.component.html',
  styleUrls: ['./post-job-layout.component.css'],
  animations: [
    trigger('animSlider', [
      transition(':increment', right),
      transition(':decrement', left),
    ]),
  ],
})
export class PostJobLayoutComponent implements OnInit {

  public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'Job Information'};
  public slidingCounter: number = 0;
  public slindingList: Array<number> = [1, 2, 3, 4];
  public isOpenedJobPreviewModal: boolean;
  public isEnableJobPreviewModal: any;
  public postJobForm: FormGroup;
  public isLoading: boolean;
  public formError: any;
  public postedJobsDetails: JobPosting;
  public jobId: string;

  constructor(
    private formBuilder: FormBuilder,
    private employerService: EmployerService,
    private modalService: NgbModal,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.buildForm();
    this.jobId = this.route.snapshot.queryParamMap.get('id');
    if(this.jobId) {
      this.onGetPostedJob(this.jobId);
    }
  }

  onNext() {
    if (this.slidingCounter != this.slindingList.length - 1) {
      this.slidingCounter++;
    }
  }

  onPrevious() {
    if (this.slidingCounter > 0) {
      this.slidingCounter--;
    }
  }

  onHeaderTabChange = (currentTabInfo: tabInfo) => {
    this.currentTabInfo = { ...currentTabInfo};
  }

  onFooterTabChange = (currentTabInfo: tabInfo) => {
    if(currentTabInfo.tabNumber > this.currentTabInfo.tabNumber) {
      this.onNext()
    }
    if(currentTabInfo.tabNumber < this.currentTabInfo.tabNumber) {
      this.onPrevious();
    }

    this.currentTabInfo = { ...currentTabInfo};
  }

  onToggleJobPreviewModal = (status) => {
    this.isOpenedJobPreviewModal = status;
  }


  get f() {
    return this.postJobForm.controls;
  }

  postJob = () => {
    this.isLoading = true;
    let jobInfo: JobPosting = {
      ...this.postJobForm.value.jobInfo,
      ...this.postJobForm.value.requirement,
      ...this.postJobForm.value.jobPrev
    };

    let handsOnArray = [];
    let tempSkill = [];
    if(jobInfo && jobInfo.hands_on_experience && Array.isArray(jobInfo.hands_on_experience)) {
      jobInfo.hands_on_experience.forEach((element: any) => {
        if(element && element.skill_id && element.skill_id) {
          handsOnArray.push({
            skill_id: element.skill_id,
            experience: element.experience,
            skill_name: element.skill_name,
            exp_type: element.exp_type
          })
          tempSkill.push(element.skill_id)
        }
      });
    }
    jobInfo.hands_on_experience = handsOnArray;

    if(Array.isArray(tempSkill) && Array.isArray(jobInfo.skills)) {
      jobInfo.skills = lodash.uniq([...tempSkill, ...jobInfo.skills]);
    }


    delete jobInfo.temp_extra_criteria;

    if (this.postJobForm.valid) {
      if(this.jobId) {
        this.onJobUpdate(jobInfo);
      }else {
        this.onJobPost(jobInfo);
      }
    }
  }

  onJobPost = (jobInfo: JobPosting) => {
    this.employerService.jobPost(jobInfo).subscribe(
      response => {
        this.router.navigate(['/employer/dashboard']).then(() => {
          this.modalService.dismissAll();
          this.onToggleJobPreviewModal(false)
        });
        this.isLoading = false;
      }, error => {
        if(error && error.error && error.error.errors)
        this.formError = error.error.errors;
        this.isLoading = false;
      }
    )
  }

  onJobUpdate = (jobInfo: JobPosting) => {
    const company: any = this.postedJobsDetails.company;
    jobInfo.company = (company && company.id) ? company.id : company;
    jobInfo.id = this.postedJobsDetails.id;
    this.employerService.jobUpdate(jobInfo).subscribe(
      response => {
        this.router.navigate(['/employer/dashboard']).then(() => {
          this.modalService.dismissAll();
          this.onToggleJobPreviewModal(false)
        });
        this.isLoading = false;
      }, error => {
        if(error && error.error && error.error.errors)
        this.formError = error.error.errors;
        this.isLoading = false;
      }
    )
  }

  private buildForm(): void {
    this.postJobForm = this.formBuilder.group({
    });
  }

  onGetPostedJob(jobId) {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = jobId;
    this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
        if(response && response.details) {
          this.postedJobsDetails = response.details;
          this.postJobForm.patchValue({
            ...this.postedJobsDetails
          });
        }
      }, error => {
      }
    )
  }

}
