import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { ControlContainer, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { JobPosting } from '@data/schema/post-job';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedApiService } from '@shared/service/shared-api.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
declare let gtag: Function;
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
	public postJobForm: UntypedFormGroup;
	public isLoading: boolean;
	public getDataCount: boolean = false;
	public showData: boolean = false;
	public isEdit: boolean = false;
	public isCopy: boolean = false;
	public formError: any;
	public postedJobsDetails: JobPosting;
	public jobId: string;
	public requestParams: any;
	public screeningProcess : any=[];
	public others : any=[];
	public skils : any=[];
	public showBack:boolean = false;
	constructor(
		private formBuilder: UntypedFormBuilder,
		private employerService: EmployerService,
		private employerSharedService: EmployerSharedService,
		private modalService: NgbModal,
		public router: Router,
		private SharedAPIService: SharedApiService,
		private route: ActivatedRoute,
		public utilsHelperService: UtilsHelperService
	) { }
	
	/**
	**	To initialize the post-job layout
	**/
	
	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
        if(params.id){
		  this.showBack= true;
		 }
        });
		this.onGetCountry('');
		this.onGetLanguage('');
		this.onGetProgram('');
		this.loadGetSkill('');
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
		  return false;
		};
		this.buildForm();
		this.jobId = this.route.snapshot.queryParamMap.get('id');
		if(this.jobId) {
		  this.onGetPostedJob(this.jobId);
		}
		var tempStatus = this.route.snapshot.queryParamMap.get('status');
		if(tempStatus == 'copy') {
		  this.isCopy = true;
		}else{
			this.isCopy = false;
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
	
	
	/**
	**	To slider changes for the tabInfo
	**/
	
	onNext() {
		if (this.slidingCounter != this.slindingList.length - 1) {
			this.slidingCounter++;
		}
		window.scrollTo(0, 0)
	}
	
	/**
	**	To move previous tab
	**/
	
	onPrevious() {
		if (this.slidingCounter > 0) {
			this.slidingCounter--;
		}
		window.scrollTo(0, 0)
	}
	
	/**
	**	On header change in the post-job
	**/
	
	onHeaderTabChange = (currentTabInfo: tabInfo) => {
		this.currentTabInfo = { ...currentTabInfo};
	}
  
	/**
	**	To get program Info
	**/
    onGetProgram(query) {
		this.requestParams = {};
		this.requestParams.page = 1;
		this.requestParams.limit = 100000;
		this.requestParams.status = 1;
		this.requestParams.search = query;
		this.SharedAPIService.onGetProgram(this.requestParams);
	}
	
	/**
	**	To get skills Info
	**/
    loadGetSkill(query) {
		this.requestParams = {};
		this.requestParams.page = 1;
		this.requestParams.limit = 100000;
		this.requestParams.status = 1;
		this.requestParams.search = query;
		this.SharedAPIService.onGetSkill(this.requestParams);
	}
	
	
	/**
	**	On footer change event calls
	**/
	
	onFooterTabChange = (currentTabInfo: tabInfo) => {
		if(currentTabInfo.tabNumber > this.currentTabInfo.tabNumber) {
		  this.onNext()
		}
		if(currentTabInfo.tabNumber < this.currentTabInfo.tabNumber) {
		  this.onPrevious();
		}
		this.currentTabInfo = { ...currentTabInfo};
	}
	
	/**
	**	To job-preview popup status
	**/
	
	onToggleJobPreviewModal = (status) => {
		this.isOpenedJobPreviewModal = status;
	}

	/**
	**	To get the form controls
	**/
	
	get f() {
		return this.postJobForm.controls;
	}
	
	/**
	**	To validate the post-job details
	**/
	
	postJobValidate = () => {
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
		if(jobInfo.skills && jobInfo.skills.length && jobInfo.skills.length!=0){
			for(let i=0;i<this.skils.length;i++){
				var temp = this.skils[i];
				jobInfo.skills.push(temp);
			}
		}else{
			jobInfo.skills = this.skils;
		}
		if(jobInfo.extra_criteria){
		jobInfo.extra_criteria = jobInfo.extra_criteria.filter(function(a,b){ return a.title!=null&&a.title!=''&&a.value!=null&&a.value!=''});
		}
	   delete jobInfo.temp_extra_criteria;
		if (this.postJobForm.valid) {
			if(this.jobId && this.isCopy == false) {
			    if(this.router.url.includes('admin')){
			    var a=this.router.url.split('/')[this.router.url.split('/').length-1];
			    jobInfo.emp_id=parseInt(a.split('?')[0]);
				}
				this.onJobUpdate(jobInfo);
			}else {
			    if(this.router.url.includes('admin')){
				  jobInfo.emp_id = parseInt(this.router.url.split('/')[this.router.url.split('/').length-1]);
				}
				this.onJobPost(jobInfo);
			}
		}
	}
	
	/**
	**	To validate the post-job details
	**/
	
	postJob = () => {
  
		if(!this.postJobForm.value.requirement.experience || this.postJobForm.value.requirement.experience ==undefined){
			this.postJobForm.value.requirement.experience =0;
		}
		if(!this.postJobForm.value.requirement.sap_experience || this.postJobForm.value.requirement.sap_experience ==undefined){
			this.postJobForm.value.requirement.sap_experience =0;
		}
		if(!this.postJobForm.value.requirement.programming_skills || this.postJobForm.value.requirement.programming_skills ==undefined){
			this.postJobForm.value.requirement.programming_skills =[];
		}
		if(this.postJobForm.value.requirement.new_skills.length==0){
			this.postJobValidate();
		}else{
			this.postSkills();
		}
		
	}
	
	/**
	**	To create a new skills
	**/
	
	postSkills(){

		for(let i=0;i<this.postJobForm.value.requirement.new_skills.length;i++){
			var val=this.postJobForm.value.requirement.new_skills[i];
			this.employerService.createSkills(val).subscribe(
				response => {
					if(response && response['details']){
						this.skils.push(response['details']['id'])
					}
					if(this.skils.length == this.postJobForm.value.requirement.new_skills.length){
						this.postJobValidate();
					}
				}, error => {
				}
			)
		}
	}
	
	/**
	**	To post the job-details
	**/
	
	onJobPost = (jobInfo: JobPosting) => {
		this.employerService.jobPost(jobInfo).subscribe(
			response => {
				gtag('event', 'post_job', {
					'event_callback': this.loadDash(response)
				  });
				this.isLoading = false;
			}, error => {
				if(error && error.error && error.error.errors)
				this.formError = error.error.errors;
				this.isLoading = false;
			}
		)
	}
	
	loadDash(response){
           if(this.router.url.includes('admin')){
			  this.router.navigate(['/admin/employer-dashboard'], { queryParams: {activeTab:'postedJobs','empids':response['details'].company } })
			}else{
	           this.router.navigate(['/employer/dashboard']).then(() => {
				  this.modalService.dismissAll();
				  this.onToggleJobPreviewModal(false)
				});
	     }
	}
	
	/**
	**	To update the job details
	**/
	
	onJobUpdate = (jobInfo: JobPosting) => {
		const company: any = this.postedJobsDetails.company;
		jobInfo.company = (company && company.id) ? company.id : company;
		jobInfo.id = this.postedJobsDetails.id;
		this.employerService.jobUpdate(jobInfo).subscribe(
		  response => {
		    if(this.router.url.includes('admin')){
			  this.router.navigate(['/admin/employer-dashboard'], { queryParams: {activeTab:'postedJobs','empids':response['details'].company } })
			}else{
			this.router.navigate(['/employer/dashboard']).then(() => {
			  this.modalService.dismissAll();
			  this.onToggleJobPreviewModal(false)
			});
			}
			this.isLoading = false;
		  }, error => {
			if(error && error.error && error.error.errors)
			this.formError = error.error.errors;
			this.isLoading = false;
		  }
		)
	}
	
	/**
	**	To build a form for post job
	**/
	
	private buildForm(): void {
		this.postJobForm = this.formBuilder.group({
			
		});
		
	}
	
	/**
	**	To get the post-job details
	**/
	
	onGetPostedJob(jobId) {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = jobId;
	if(this.router.url.includes('admin')){
		var a=this.router.url.split('/')[this.router.url.split('/').length-1];
		requestParams.emp_id=parseInt(a.split('?')[0]);
	}
    this.employerService.getPostedJobDetails(requestParams).subscribe(
      response => {
		  if(response['details']['entry'] == true){
			 this.postJobForm.addControl('requirement', new UntypedFormGroup({
				experience: new UntypedFormControl(null),
				education: new UntypedFormControl(null),
				sap_experience: new UntypedFormControl(null),
				domain: new UntypedFormControl(null),
				hands_on_experience: new UntypedFormArray([this.formBuilder.group({
					skill_id: [''],
					skill_name: [''],
					experience: [''],
					exp_type: ['years']
				})]),
				new_skills: new UntypedFormArray([]),
				skills: new UntypedFormControl(null),
				skills_Data: new UntypedFormControl(null),
				skills_Datas: new UntypedFormControl(null),
				programming_skills:  new UntypedFormControl(null),
				optinal_skills: new UntypedFormControl(null),
				work_authorization: new UntypedFormControl(null),
				visa_sponsorship: new UntypedFormControl(false, Validators.required),
				need_reference: new UntypedFormControl(false, Validators.required),
				travel_opportunity: new UntypedFormControl(null, Validators.required),
				end_to_end_implementation: new UntypedFormControl(null)
			}));

		  }else{
			  this.postJobForm.addControl('requirement', new UntypedFormGroup({
				experience: new UntypedFormControl(null, Validators.required),
				education: new UntypedFormControl(null),
				sap_experience: new UntypedFormControl(null, Validators.required),
				domain: new UntypedFormControl(null,Validators.required),
				hands_on_experience: new UntypedFormArray([this.formBuilder.group({
					skill_id: [null, Validators.required],
					skill_name: [''],
					experience: ['', [Validators.required,]],
					exp_type: ['years', [Validators.required]]
				})]),
				new_skills: new UntypedFormArray([]),
				skills: new UntypedFormControl(null),
				skills_Data: new UntypedFormControl(null),
				skills_Datas: new UntypedFormControl(null),
				programming_skills:  new UntypedFormControl(null),
				optinal_skills: new UntypedFormControl(null, Validators.required),
				work_authorization: new UntypedFormControl(null),
				visa_sponsorship: new UntypedFormControl(false, Validators.required),
				need_reference: new UntypedFormControl(false, Validators.required),
				travel_opportunity: new UntypedFormControl(null, Validators.required),
				end_to_end_implementation: new UntypedFormControl(null)
			}));
		  }
		this.postJobForm.addControl('otherPref', new UntypedFormGroup({
			facing_role: new UntypedFormControl(null),
			training_experience: new UntypedFormControl(null),
			certification: new UntypedFormControl(null),
			others_data: new UntypedFormControl(null),
			language: new UntypedFormControl(null, Validators.required),
			extra_criteria: new UntypedFormArray([this.formBuilder.group({
				title: [null],
				value: [null]
			})]),
			others: new UntypedFormArray([this.formBuilder.group({
				id: [null],
				title: [null],
				value: [null]
			})]),
			temp_extra_criteria: new UntypedFormArray([]),
		}));
		
		this.postJobForm.addControl('screeningProcess', new UntypedFormGroup({
			screening_process: new UntypedFormArray([]),
			temp_screening_process: new UntypedFormControl(null),
		}));
        if(response && response.details) {
			if(this.isCopy){
				response.details['min']='';
				response.details['max']='';
				response.details['salary_type']='';
				response.details['salary']='';
				response.details['salary_currency']='USD';
				response.details['job_locations']=[];	
				response.details['health_wellness']={
					'dental':false,
					'disability':false,
					'life':false
				};		
				response.details['paid_off']={
					'vacation_policy':false,
					'paid_sick_leaves':false,
					'paid_parental_leave':false,
					'maternity':false
				};		
				response.details['financial_benefits']={
					'tuition_reimbursement':false,
					'corporate_plan':false,
					'retirement_plan':false,
					'performance_bonus':false,
					'purchase_plan':false
				};			
				response.details['office_perks']={
					'telecommuting':false,
					'free_food':false,
					'wellness_program':false,
					'social_outings':false,
					'office_space':false
				};	
				
				
			}
          this.postedJobsDetails = response.details;
          this.postJobForm.patchValue({
            ...this.postedJobsDetails
          });
		  if (this.postedJobsDetails.others == null) {
			  for(let i=0;i<=this.postJobForm.controls.otherPref['controls']['others'].value.length;i++){
				this.postJobForm.controls.otherPref['controls']['others'].removeAt(0);
				i=0;
			}
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [1],
					title: ['Should have done client facing role'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [2],
					title: ['Should have experience in training'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [3],
					title: ['Should have experience in design, build & configure applications'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [4],
					title: ['Should have experience in data intergation'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [5],
					title: ['Should have experience in data migration'],
					value: [null]
				}));
		  }
		  if (this.postedJobsDetails.others != null) {
			for(let i=0;i<=this.postJobForm.controls.otherPref['controls']['others'].value.length;i++){
				this.postJobForm.controls.otherPref['controls']['others'].removeAt(0);
				i=0;
			}
			this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [1],
					title: ['Should have done client facing role'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [2],
					title: ['Should have experience in training'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [3],
					title: ['Should have experience in design, build & configure applications'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [4],
					title: ['Should have experience in data intergation'],
					value: [null]
				}));
			  this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
					id: [5],
					title: ['Should have experience in data migration'],
					value: [null]
				}));
				
			this.postedJobsDetails.others.map((value, index) => {
				var id = parseInt(value['id']);
				var title = value['title'];
				var values = value['value'];
				if(id>5){
					this.postJobForm.controls.otherPref['controls']['others'].push(this.formBuilder.group({
						id: [id],
						title: [title],
						value: [values]
					}));
				}else{
					id = id-1;
					this.postJobForm.controls.otherPref['controls']['others']['controls'][id]["controls"]['value'].setValue(values);
					this.postJobForm.controls.otherPref['controls']['others']['controls'][id]["controls"]['value'].updateValueAndValidity();
				}
			});
		}
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
					if(this.postedJobsDetails.entry==false){
						this.postJobForm.controls.requirement['controls']['hands_on_experience'].push(this.formBuilder.group({
							skill_id: [null, Validators.required],
							skill_name: [''],
							experience: ['', [Validators.required,]],
							exp_type: ['years', [Validators.required]]
						}));
						}else{
						this.postJobForm.controls.requirement['controls']['hands_on_experience'].push(this.formBuilder.group({
							skill_id: [null],
							skill_name: [''],
							experience: [''],
							exp_type: ['years']
						}));
						
						
						}
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
		
		if (this.postedJobsDetails.screening_process != null) {
			for(let i=0;i<=this.postJobForm.controls.screeningProcess['controls']['screening_process'].value.length;i++){
				this.postJobForm.controls.screeningProcess['controls']['screening_process'].removeAt(0);
				i=0;
			}
			if(this.postedJobsDetails.screening_process.length==0){
				this.postJobForm.controls.screeningProcess['controls']['screening_process'].push(this.formBuilder.group({
					title: [null]
				}));
			}else{
			this.postedJobsDetails.screening_process.map((value, index) => {
				this.postJobForm.controls.screeningProcess['controls']['screening_process'].push(this.formBuilder.group({
					title: [null]
				}));
			});
			}
			
			this.postJobForm.patchValue({
				screeningProcess : {
					...this.postedJobsDetails
				}
			});
				
		}
				
		  this.postJobForm.patchValue({
				requirement : {
					...this.postedJobsDetails
				}
			});
        }
		 setTimeout(()=>{
			  this.isEdit = true;
		  },1000);
      }, error => {
      }
    )
  }
  
	/**
	**	To get the counry details
	**/
	
	onGetCountry(query) {
		this.requestParams = {};
		this.requestParams.page = 1;
		this.requestParams.limit = 1000;
		this.requestParams.status = 1;
		this.requestParams.search = query;
		this.SharedAPIService.onGetCountry(this.requestParams);

	}
	
	/**
	**	To get the skills details
	**/
	
	onGetSkill() {
		this.requestParams = {};
		this.requestParams.page = 1;
		this.requestParams.limit = 1000;
		this.requestParams.status = 1;
		this.requestParams.search = query;
		this.SharedAPIService.onGetSkill(this.requestParams);
	}
	
	/**
	**	To get the language details
	**/
	
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
					this.screeningProcess = temps.slice(0, 5);
				}
				
			}, error => {
			}
		)
	}
}
