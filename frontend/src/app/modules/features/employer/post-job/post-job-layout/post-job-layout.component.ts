import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';


import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { JobPosting } from '@data/schema/post-job';

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
    private employerService: EmployerService
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
    const jobInfo: JobPosting = this.postJobForm.value;
    if (this.postJobForm.valid) {
      // this.employerService.jobPost(jobInfo).subscribe(
      //   response => {
      //     this.isLoading = false;
      //   }, error => {
      //     if(error && error.error && error.error.errors)
      //     this.formError = error.error.errors;
      //     this.isLoading = false;
      //   }
      // )
    }
  }

  private buildForm(): void {
    this.postJobForm = this.formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      salary_type: [null, Validators.required],
      salary_currency: [null, Validators.required],
      salary: [null, Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipcode: [null, Validators.required],
      availability: ['', Validators.required],
      remote: [null, Validators.required],
      experience: [null, Validators.required],
      sap_experience: [null, Validators.required],
      latlng: ['', Validators.required],
      domain: [null, Validators.required],
      hands_on_experience: [null, Validators.required],
      skills: [null, Validators.required],
      programming_skills: [null, Validators.required],
      optinal_skills: [null, Validators.required],
      certification: [null, Validators.required],
      work_authorization: [null, Validators.required],
      visa_sponsorship: [null, Validators.required],
      end_to_end_implementation: [null, Validators.required],
    });
  }

}
