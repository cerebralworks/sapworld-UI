import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';


import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { JobPosting } from '@data/schema/post-job';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
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

  constructor(
    private formBuilder: FormBuilder,
    private employerService: EmployerService,
    private modalService: NgbModal,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.buildForm();
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
    let domainArray = [];
    jobInfo.domain.forEach((element: any) => {
      domainArray.push(parseInt(element.id))
    });
    jobInfo.domain = domainArray;

    let skillTagArray = [];
    jobInfo.skills.forEach((element: any) => {
      skillTagArray.push(parseInt(element.id))
    });
    jobInfo.skills = skillTagArray;

    delete jobInfo.temp_extra_criteria;
    // delete jobInfo.location;

    if (this.postJobForm.valid) {
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
  }

  private buildForm(): void {
    this.postJobForm = this.formBuilder.group({
    });
  }

}
