import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { JobPosting } from '@data/schema/post-job';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedApiService } from '@shared/service/shared-api.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';

import * as lodash from 'lodash';

const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.1s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.1s ease-out', style({ transform: 'translateX(100%)' }))], {
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
  public getDataCount: boolean = false;
  public formError: any;
  public postedJobsDetails: JobPosting;
  public jobId: string;
	public requestParams: any;
	public screeningProcess : any=[];

  constructor(
    private formBuilder: FormBuilder,
    private employerService: EmployerService,
		private employerSharedService: EmployerSharedService,
    private modalService: NgbModal,
    public router: Router,
		private SharedAPIService: SharedApiService,
    private route: ActivatedRoute,
		public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
		this.onGetCountry('');
		this.onGetLanguage('');
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.buildForm();
    this.jobId = this.route.snapshot.queryParamMap.get('id');
    if(this.jobId) {
      this.onGetPostedJob(this.jobId);
    }
	
	this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				if(details) {
					if(details && details.id && this.getDataCount == false) {
						this.onGetScreening(details.id);
						this.getDataCount =true;
					}
				}
			}
		)
		
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
      ...this.postJobForm.value.otherPref,
      ...this.postJobForm.value.requirement,
      ...this.postJobForm.value.screeningProcess,
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
	if(jobInfo.extra_criteria){
	jobInfo.extra_criteria = jobInfo.extra_criteria.filter(function(a,b){ return a.title!=null&&a.title!=''&&a.value!=null&&a.value!=''});
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
		  this.postJobForm.addControl('requirement', new FormGroup({
			experience: new FormControl(null, Validators.required),
			education: new FormControl(null),
			sap_experience: new FormControl(null, Validators.required),
			domain: new FormControl(null, Validators.required),
			hands_on_experience: new FormArray([this.formBuilder.group({
				skill_id: [null, Validators.required],
				skill_name: [''],
				experience: ['', [Validators.required,]],
				exp_type: ['years', [Validators.required]]
			})]),
			skills: new FormControl(null),
			programming_skills: new FormControl(null),
			optinal_skills: new FormControl(null),
			work_authorization: new FormControl(null),
			visa_sponsorship: new FormControl(false, Validators.required),
			need_reference: new FormControl(false, Validators.required),
			travel_opportunity: new FormControl(null, Validators.required),
			end_to_end_implementation: new FormControl(null)
		}));
		this.postJobForm.addControl('otherPref', new FormGroup({
			facing_role: new FormControl(null),
			training_experience: new FormControl(null),
			certification: new FormControl(null),
			language: new FormControl(null, Validators.required),
			extra_criteria: new FormArray([this.formBuilder.group({
				title: [null],
				value: [null]
			})]),
			temp_extra_criteria: new FormArray([]),
		}));
        if(response && response.details) {
          this.postedJobsDetails = response.details;
          this.postJobForm.patchValue({
            ...this.postedJobsDetails
          });
		  if (this.postedJobsDetails.extra_criteria != null) {
			for(let i=0;i<=this.postJobForm.controls.otherPref['controls']['extra_criteria'].value.length;i++){
				this.postJobForm.controls.otherPref['controls']['extra_criteria'].removeAt(0);
				i=0;
			}
			if(this.postedJobsDetails.extra_criteria.length==0){
				this.postJobForm.controls.otherPref['controls']['extra_criteria'].push(this.formBuilder.group({
					title: [null],
					value: [null]
				}));
			}else{
			this.postedJobsDetails.extra_criteria.map((value, index) => {
				this.postJobForm.controls.otherPref['controls']['extra_criteria'].push(this.formBuilder.group({
					title: [null],
					value: [null]
				}));
			});
			}
		}
		this.postJobForm.patchValue({
			otherPref : {
				...this.postedJobsDetails
			}
		});
		  if(this.postedJobsDetails && this.postedJobsDetails.hands_on_experience && Array.isArray(this.postedJobsDetails.hands_on_experience)) {
					
					for(let i=0;i<=this.postJobForm.controls.requirement['controls']['hands_on_experience'].length;i++){
						this.postJobForm.controls.requirement['controls']['hands_on_experience'].removeAt(0);
						i=0;
					}
					this.postedJobsDetails.hands_on_experience.map((value, index) => {
						this.postJobForm.controls.requirement['controls']['hands_on_experience'].push(this.formBuilder.group({
							skill_id: [null, Validators.required],
							skill_name: [''],
							experience: ['', [Validators.required,]],
							exp_type: ['years', [Validators.required]]
						}));
					});
				}
		if (this.postedJobsDetails.skills != null) {
			for(let i=0;i<this.postedJobsDetails.skills.length;i++){
				this.postedJobsDetails.skills[i]=parseInt(this.postedJobsDetails.skills[i]);
			}
		}
		this.postedJobsDetails.skills = this.utilsHelperService.differenceByPropValArray(this.postedJobsDetails.skills, this.postedJobsDetails.hands_on_experience, 'skill_id')
		if (this.postedJobsDetails.domain != null) {
			for(let i=0;i<this.postedJobsDetails.domain.length;i++){
				this.postedJobsDetails.domain[i]=parseInt(this.postedJobsDetails.domain[i]);
			}
		}
		  this.postJobForm.patchValue({
					requirement : {
						...this.postedJobsDetails
					}
				});
        }
      }, error => {
      }
    )
  }
onGetCountry(query) {
		this.requestParams = {};
		this.requestParams.page = 1;
		this.requestParams.limit = 1000;
		this.requestParams.status = 1;
		this.requestParams.search = query;

		this.SharedAPIService.onGetCountry(this.requestParams);
		 
	  }
	  
	onGetLanguage(query) {
		this.requestParams = {};
		this.requestParams.page = 1;
		this.requestParams.limit = 1000;
		this.requestParams.status = 1;
		this.requestParams.search = query;

		this.SharedAPIService.onGetLanguage(this.requestParams);
	  }
	  
	  
	/**
	**	TO Get the Applied job details screeningProcess
	**/
	 
	onGetScreening(companyId) {
		let requestParams: any = {};
		requestParams.limit = 50000;
		requestParams.view = 'screening_process';
		requestParams.company = companyId;
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					if(this.jobId){
						var valuses = this.jobId;
						response['count'] =response['count'].filter(function(a,b){return a.id != valuses });
					}
					//this.screeningProcess = response['count'];
					var temps = response['count'].map(function(a,b){return a.screening_process});
					temps = temps.map(JSON.stringify).reverse().filter(function (e, i, a) {
						return a.indexOf(e, i+1) === -1;
					}).reverse().map(JSON.parse);
					this.screeningProcess = temps;
				}
				
			}, error => {
			}
		)
	}
}
