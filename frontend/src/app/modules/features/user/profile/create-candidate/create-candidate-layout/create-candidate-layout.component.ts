import { Component, DoCheck, OnChanges, OnInit,SimpleChanges,HostListener } from '@angular/core';
import { CandidateProfile, tabInfo, tabProgressor } from '@data/schema/create-candidate';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@data/service/user.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { DataService } from '@shared/service/data.service';
import { ImageCropperComponent, ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { UserSharedService } from '@data/service/user-shared.service';
import * as lodash from 'lodash';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { EmployerService } from '@data/service/employer.service';
const left = [
	query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
	group([
		query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.0s ease-out', style({ transform: 'translateX(0%)' }))], {
			optional: true,
		}),
		query(':leave', [style({ transform: 'translateX(0%)' }), animate('.0s ease-out', style({ transform: 'translateX(2500%)' }))], {
			optional: true,
		}),
	]),
];

const right = [
	query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
	group([
		query(':enter', [style({ transform: 'translateX(100%)' }), animate('.0s ease-out', style({ transform: 'translateX(0%)' }))], {
			optional: true,
		}),
		query(':leave', [style({ transform: 'translateX(0%)' }), animate('.0s ease-out', style({ transform: 'translateX(-2500%)' }))], {
			optional: true,
		}),
	]),
];


@Component({
	selector: 'app-create-candidate-layout',
	templateUrl: './create-candidate-layout.component.html',
	styleUrls: ['./create-candidate-layout.component.css'],
	animations: [
    trigger('animSlider', [
		transition(':increment', right),
		transition(':decrement', left),
		]),
	],
})
export class CreateCandidateLayoutComponent implements OnInit {
	
	/**
	**	Variable declaratioin
	**/
	
	public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'Personal Detail'};
	public currentProgessor: tabProgressor;
	public slidingCounter: number = 0;
	public slindingList: Array<number> = [1, 2, 3, 4];
	public isOpenedRegisterReviewModal: any;
	public candidateForm: UntypedFormGroup;
	public userId: string;
	public filesToUploadData: any;
	public userPhotoInfo: any;
	public userDetails: any;
	public screenWidth: any;
	public userInfo: any;
	public requestParams: any;
	public tabInfos: tabInfo[];
	public skils : any=[];
	public candiatevalues :any;
	public checkUpdateSkills : boolean =false;
	public validationType:any;
	public shareid:any;
	constructor(
		private formBuilder: UntypedFormBuilder,
		private modalService: NgbModal,
		public router: Router,
		private route: ActivatedRoute,
		private SharedAPIService: SharedApiService,
		private userService: UserService,
		private dataService: DataService,
		private toastrService: ToastrService,
		private userSharedService: UserSharedService,
		private employerService: EmployerService,
		private utilsHelperService: UtilsHelperService
	) { }
	
	/**
	**	To initialize the layout
	**/
	
	validateInfo = 0;
	ngOnInit(): void {
	
	  this.screenWidth = window.innerWidth;	
		// console.log({'Enter the oninit':'CreateCandidateLayoutComponent'})
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
		this.shareid=localStorage.getItem("shareid");
		this.buildForm();
		this.createFormData();
		//this.onGetCountry('');
		//this.onGetLanguage('');
		this.onGetSkill();
		this.onGetProgram('');
		this.onGetIndustries();
		this.dataService.getUserPhoto().subscribe(
		response => {
			this.userPhotoInfo = response;
		})
		this.dataService.getTabInfo().subscribe(
		response => {
			if (response && Array.isArray(response) && response.length) {
				this.tabInfos = response;
			}
		})
		this.userSharedService.getUserProfileDetails().subscribe(
        response => {
          this.userInfo = response;
          if(this.userInfo && this.userInfo.id && this.validateInfo == 0) {
            this.candidateForm.patchValue({
              ...this.userInfo
            });
            this.validateInfo++;
          }
        })
		this.ngAfterViewInitCheck();
		// console.log({'Exist the oninit':'CreateCandidateLayoutComponent'})
	}
	
	validateOnAPI = 0;
	validateOnForm = 0;
	
	/**
	**	To check the form data's
	**/
	
	ngAfterViewInitCheck(){
	
		//console.log({'Exist the ngAfterViewInitCheck':'CreateCandidateLayoutComponent'})
		if(this.tabInfos && this.tabInfos.length &&  !this.utilsHelperService.isEmptyObj(this.userInfo)) {
				if (this.candidateForm.controls.educationExp !=undefined && this.userInfo && this.userInfo.education_qualification && Array.isArray(this.userInfo.education_qualification)) {
					if(this.userInfo.education_qualification.length == 0){
						this.candidateForm.controls.educationExp['controls']['education_qualification'].removeAt(0);
						this.candidateForm.controls.educationExp['controls']['education_qualification'].push(this.formBuilder.group({
							degree: [''],
							field_of_study: [null],
							year_of_completion: [null, [Validators.min(4)]]
						  }));
					}else if ((this.userInfo.education_qualification.length == 1) || (this.candidateForm.controls.educationExp['controls']['education_qualification'] && this.candidateForm.controls.educationExp['controls']['education_qualification'].length) !== (this.userInfo.education_qualification && this.userInfo.education_qualification.length)) {
					 this.candidateForm.controls.educationExp['controls']['education_qualification'].removeAt(0);
					  this.userInfo.education_qualification.map((value, index) => {
						this.candidateForm.controls.educationExp['controls']['education_qualification'].push(this.formBuilder.group({
							degree: [''],
							field_of_study: [null],
							year_of_completion: [null, [Validators.min(4)]]
						  }));
					  });
					}
				  }
				if (this.userInfo && this.userInfo.education_qualification == null) {
					delete this.userInfo.education_qualification;
				}
				if (this.userInfo.domains_worked != null) {
					for(let i=0;i<this.userInfo.domains_worked.length;i++){
						this.userInfo.domains_worked[i]=parseInt(this.userInfo.domains_worked[i]);
					}
				}
				this.candidateForm.patchValue({
					educationExp : {
						...this.userInfo
					},
				});
				if (this.candidateForm.controls.skillSet !=undefined && this.userInfo && this.userInfo.hands_on_experience && Array.isArray(this.userInfo.hands_on_experience)) {
					if ((this.userInfo.hands_on_experience.length == 1) || (this.candidateForm.controls.skillSet['controls']['hands_on_experience'] && this.candidateForm.controls.skillSet['controls']['hands_on_experience'].length) !== (this.userInfo.hands_on_experience && this.userInfo.hands_on_experience.length)) {
					this.candidateForm.controls.skillSet['controls']['hands_on_experience'].removeAt(0);
				this.userInfo.hands_on_experience.map((value, index) => {
				  value.skill_id = (value && value.skill_id )? value.skill_id.toString() : '';
				  if(this.userInfo.entry==false){
				  this.candidateForm.controls.skillSet['controls']['hands_on_experience'].push(this.formBuilder.group({
					  skill_id: [null, Validators.required],
					  skill_name: [''],
					  experience: ['', [Validators.required,]],
					  exp_type: ['years', [Validators.required]]
					}));
					}else{
					this.candidateForm.controls.skillSet['controls']['hands_on_experience'].push(this.formBuilder.group({
					  skill_id: [null],
					  skill_name: [''],
					  experience: [''],
					  exp_type: ['years']
					}));
					}
				});
				}}
				if (this.userInfo && this.userInfo.hands_on_experience == null) {
				  delete this.userInfo.hands_on_experience;
				}
				if (this.userInfo.hands_on_experience != null) {
					for(let i=0;i<this.userInfo.hands_on_experience.length;i++){
						this.userInfo.hands_on_experience[i]['skill_id']=parseInt(this.userInfo.hands_on_experience[i]['skill_id']);
					}
				}
				if (this.userInfo.skills != null) {
					for(let i=0;i<this.userInfo.skills.length;i++){
						this.userInfo.skills[i]=parseInt(this.userInfo.skills[i]);
					}
				  }
				  this.userInfo.skills = this.utilsHelperService.differenceByPropValArray(this.userInfo.skills, this.userInfo.hands_on_experience, 'skill_id')
				this.candidateForm.patchValue({
					skillSet : {
						...this.userInfo
					},
				});
				if (this.userInfo && this.userInfo.visa_sponsered == null) {
					this.userInfo.visa_sponsered = false;
				}
				if(this.candidateForm.controls.jobPref){
					if(this.userInfo.preferred_locations){
					if(this.userInfo.preferred_locations.length == 0){
						this.candidateForm.controls.jobPref['controls']['preferred_locations'].removeAt(0);
						this.candidateForm.controls.jobPref['controls']['preferred_locations'].push(this.formBuilder.group({
							city: [''],
							state: [''],
							stateShort: [''],
							country: ['']
						  }));
					}else if ((this.userInfo.preferred_locations.length == 1) || (this.candidateForm.controls.jobPref['controls']['preferred_locations'] && this.candidateForm.controls.jobPref['controls']['preferred_locations'].length) !== (this.userInfo.preferred_locations && this.userInfo.preferred_locations.length)) {
					 this.candidateForm.controls.jobPref['controls']['preferred_locations'].removeAt(0);
					  this.userInfo.preferred_locations.map((value, index) => {
						this.candidateForm.controls.jobPref['controls']['preferred_locations'].push(this.formBuilder.group({
							city: [''],
							state: [''],
							stateShort: [''],
							country: ['']
						  }));
					  });
					}
				}}
				this.candidateForm.patchValue({
					jobPref : {
						...this.userInfo
					},
				});
			
		}
		//console.log({'Exist the ngAfterViewInitCheck':'CreateCandidateLayoutComponent'})

	}
	ngAfterViewInit(): void {
		//console.log({'Enter the ngAfterViewInit':'CreateCandidateLayoutComponent'})
		this.createFormData();
		this.ngAfterViewInitCheck();
		//console.log({'Exist the ngAfterViewInit':'CreateCandidateLayoutComponent'})
	}
	/**
	**	To buildForm for the profile
	**/
	createFormData(){
		if(!this.utilsHelperService.isEmptyObj(this.candidateForm) && !this.utilsHelperService.isEmptyObj(this.userInfo) && this.userInfo.profile_completed && this.validateOnForm==0) {
			this.candidateForm.addControl('jobPref', new UntypedFormGroup({
				job_type: new UntypedFormControl(null),
				job_role: new UntypedFormControl(''),
				willing_to_relocate: new UntypedFormControl(null),
				preferred_location: new UntypedFormControl(null),
				preferred_countries: new UntypedFormControl(null),
				preferred_locations : new UntypedFormArray([this.formBuilder.group({
					city: [''],
					state: [''],
					stateShort: [''],
					country: ['']
				  })]),
				travel: new UntypedFormControl(null, Validators.required),
				availability: new UntypedFormControl(null, Validators.required),
				remote_only: new UntypedFormControl(false, Validators.required),
				visa_sponsered: new UntypedFormControl(false),
				//preferred_countries: new FormControl(null),
			}));
			this.candidateForm.addControl('skillSet', new UntypedFormGroup({
				hands_on_experience: new UntypedFormArray([this.formBuilder.group({
					skill_id: [''],
					skill_name: ['dasdasd'],
					experience: [''],
					exp_type: ['years']
				})]),
				skills: new UntypedFormControl(null),
					programming_skills: new UntypedFormControl(null),
					other_skills: new UntypedFormControl(null),
					certification: new UntypedFormControl(null),
					bio: new UntypedFormControl('Lorem Ipsum'),
					new_skills: new UntypedFormArray([]),
					skills_Data: new UntypedFormControl(null),
					skills_Datas: new UntypedFormControl(null),
				}));
				this.candidateForm.addControl('educationExp', new UntypedFormGroup({
					education_qualification: new UntypedFormArray([this.formBuilder.group({
					degree: [''],
					field_of_study: [''],
					year_of_completion: ['']
				})]),
				employer_role_type: new UntypedFormControl(null),
				experience: new UntypedFormControl('', Validators.required),
				sap_experience: new UntypedFormControl(''),
				current_employer: new UntypedFormControl(''),
				current_employer_role: new UntypedFormControl(''),
				domains_worked: new UntypedFormControl(''),
				end_to_end_implementation: new UntypedFormControl(null),
			}));
			this.validateOnForm++
			this.ngAfterViewInitCheck();
		}
		this.ngAfterViewInitCheck();
	}
	
	/**
	**	To slide the tabs
	**/
	
	onNext() {
	
		if(this.candidateForm.value.personalDetails.entry==true){
		  this.validationType = {
		'job_role': [Validators.required],
		'job_type': [Validators.required],
		'willing_to_relocate': [Validators.required],
		'travel': [Validators.required],
		'availability': [Validators.required],
	      }
		}else{
		this.validationType = {
		'experience': [Validators.required],
		'sap_experience': [Validators.required],
		'current_employer': [Validators.required],
		'current_employer_role': [Validators.required],
		'domains_worked': [Validators.required],
		//'skill_id': [Validators.required],
		//'exp_type': [Validators.required],
		//'skills': [Validators.required],
		//'programming_skills': [Validators.required],
		//'other_skills': [Validators.required],
		'job_role': [Validators.required],
        'job_type': [Validators.required],
		'willing_to_relocate': [Validators.required],
		'travel': [Validators.required],
		'availability': [Validators.required],
	}
		
		
		
		
		}
		if (this.slidingCounter != this.slindingList.length - 1) {
			this.slidingCounter++;
			setTimeout(() => {
				if(this.slidingCounter == 1) {
				  this.addValidators(<UntypedFormGroup>this.candidateForm.controls['educationExp']);
				}else if(this.slidingCounter == 2) {
				  this.addValidators(<UntypedFormGroup>this.candidateForm.controls['skillSet']);
				  this.candidateForm.controls.skillSet['controls'].hands_on_experience.controls.map((val, index) => {
				  this.addValidators(<UntypedFormGroup>val);
				})
				}else if(this.slidingCounter == 3) {
				  this.addValidators(<UntypedFormGroup>this.candidateForm.controls['jobPref']);
				}
			 }, 300);
		}
		window.scrollTo(0, 0);
		//console.log({'Exist the onNext':'CreateCandidateLayoutComponent'})
	}
	
	/**
	**	To remove a validationType
	**/
	
	public removeValidators(form: UntypedFormGroup) {
		if(form && form.controls) {
			for (const key in form.controls) {
				form.get(key).clearValidators();
				form.get(key).updateValueAndValidity();
			}
		}
	}
	
	/**
	**	To add the preferred_location
	**/
	public addValidators(form: UntypedFormGroup) {
		if(form && form.controls) {
			for (const key in form.controls) {
				form.get(key).setValidators(this.validationType[key]);
				form.get(key).updateValueAndValidity();
			}		
		}
	}

	
	
	/**
	**	To slide change the prevoius section
	**/
	onPrevious() {
		if (this.slidingCounter > 0) {
			if(this.slidingCounter == 1) {
				this.removeValidators(<UntypedFormGroup>this.candidateForm.controls['educationExp']);
			}else if(this.slidingCounter == 2) {
				this.removeValidators(<UntypedFormGroup>this.candidateForm.controls['skillSet']);
					this.candidateForm.controls.skillSet['controls'].hands_on_experience.controls.map((val, index) => {
					this.removeValidators(<UntypedFormGroup>val);
				})
			}else if(this.slidingCounter == 3) {
				this.removeValidators(<UntypedFormGroup>this.candidateForm.controls['jobPref']);
			}
			this.slidingCounter--;
		}
		window.scrollTo(0, 0)
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
	
	/**
	**	To validate the form details
	**/
	createCandidate = () => {
		
		if(this.candidateForm.value.personalDetails.entry==true){
			if(this.candidateForm.value.educationExp.experience =='' ){
				this.candidateForm.value.educationExp.experience = 0
			}
			if(this.candidateForm.value.educationExp.sap_experience =='' ){
				this.candidateForm.value.educationExp.sap_experience = 0
			}
			
		}
		let candidateInfo: CandidateProfile = {
			...this.candidateForm.value.personalDetails,
			...this.candidateForm.value.educationExp,
			...this.candidateForm.value.skillSet,
			...this.candidateForm.value.jobPref
		};
        this.candiatevalues = candidateInfo;
		if(candidateInfo && candidateInfo.education_qualification && Array.isArray(candidateInfo.education_qualification)) {
			let educationQualification = candidateInfo.education_qualification.filter((val) => {
				return (val.degree != null && val.degree != '') && (val.field_of_study != null && val.field_of_study != '') && (val.year_of_completion != null && val.year_of_completion != '')
			});
			candidateInfo.education_qualification = educationQualification;
		}

		if(candidateInfo && candidateInfo.phone && candidateInfo.phone.e164Number) {
			candidateInfo.phone = candidateInfo.phone.e164Number
		}
		if(candidateInfo && candidateInfo['work_authorization'] ) {
			if(this.candidateForm.value.personalDetails['work_authorization']==1){
			candidateInfo.authorized_country = [candidateInfo.nationality];
			candidateInfo.preferred_countries = [candidateInfo.nationality];
			candidateInfo.visa_type = null;}
			
		}

		if(this.userInfo && this.userInfo.privacy_protection) {
			candidateInfo.privacy_protection = {...this.userInfo.privacy_protection}
		}

		let tempSkill = [];
		if(candidateInfo && candidateInfo.hands_on_experience && Array.isArray(candidateInfo.hands_on_experience)) {
			candidateInfo.hands_on_experience.forEach((element: any) => {
				if(element && element.skill_id && element.skill_id) {
					tempSkill.push(element.skill_id)
				}
			});
		}

		if(Array.isArray(tempSkill) && Array.isArray(candidateInfo.skills)) {
		  candidateInfo.skills = lodash.uniq([...tempSkill, ...candidateInfo.skills]);
		}

		/*if(Array.isArray(tempSkill) && Array.isArray(candidateInfo.skills)) {
		  candidateInfo.skills = lodash.uniq([...tempSkill, ...candidateInfo.skills]);
		}*/
		
		if((candidateInfo.skills && candidateInfo.skills.length && candidateInfo.skills.length!=0) || this.skils.length !=0){
			for(let i=0;i<this.skils.length;i++){
				var temp = this.skils[i];
				candidateInfo.skills.push(temp);
			}
		}else{
			candidateInfo.skills = tempSkill;
		}
		
		if (this.candidateForm.valid) {
			if(this.userPhotoInfo && this.userPhotoInfo.photoBlob) {
				this.onUserPhotoUpdate(candidateInfo);
			}else{
			    if(this.candidateForm.value.skillSet.new_skills.length!==0 && this.checkUpdateSkills ==false){
				  this.postSkills();
				}else{
				  this.onUserUpdate(candidateInfo);
				}
			}
			
		}
		
	}
	
	/**
	**	To create a new skills
	**/
	
	postSkills(){

		for(let i=0;i<this.candidateForm.value.skillSet.new_skills.length;i++){
			var val=this.candidateForm.value.skillSet.new_skills[i];
			this.employerService.createSkills(val).subscribe(
				response => {
					if(response && response['details']){
						
						this.skils.push(response['details']['id'])
					}
					this.checkUpdateSkills=true;
					if(this.skils.length == this.candidateForm.value.skillSet.new_skills.length){
						this.createCandidate();
					}
				}, error => {
				}
			)
		}
	}
	
	
    
	randomString(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	onUserPhotoUpdate = (candidateInfo) => {
		const formData = new FormData();
		//var rString = this.randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
		//formData.append('photo' , this.userPhotoInfo.photoBlob, ((this.userPhotoInfo && this.userPhotoInfo.photoBlob && this.userPhotoInfo.photoBlob.name) ? this.userPhotoInfo.photoBlob.name : rString));
		formData.append('photo', base64ToFile(this.userPhotoInfo.photoBlob));
		formData.append('extension' , this.userPhotoInfo.ext);
		this.userService.photoUpdate(formData).subscribe(
		response => {
			this.onUserUpdate(candidateInfo);
		}, error => {
			this.onUserUpdate(candidateInfo);
		})
	}
	/**
	**	To update the user details
	**/
	onUserUpdate = (candidateInfo: CandidateProfile) => {
	var temp:any[] =candidateInfo.skills;
	    candidateInfo['skills'] = temp.filter(function(a,b){ return a !='' });
		this.userService.update(candidateInfo).subscribe(
		response => {
			if(this.shareid !=null){
			  this.router.navigate(['/user/job-matches/details'], {queryParams: {'id': this.shareid }});
			  localStorage.removeItem('shareid');
			}else{
			this.router.navigate(['/user/dashboard']).then(() => {
				/*if(this.userInfo && this.userInfo.profile_completed == false){
				if(!response.matches && response.matches  !=true && response.matches !=false){
					response= JSON.parse(response);
				}
				if(response.matches == true){
					this.dataService.setMatchesCompletion();
				}
			}*/
			if(this.userInfo){
				if(!response.matches && response.matches  !=true && response.matches !=false){
					response= JSON.parse(response);
				}
				if(response.matches == true){
					this.dataService.setMatchesCompletion();
				}
			}
          if(this.userInfo && (!this.userInfo.doc_resume || this.userInfo.doc_resume.length == 0)) {
            this.dataService.setProfileCompletion();
			
          }

          this.modalService.dismissAll();
          this.onToggleRegisterReview(false)
        });
		}
      }, error => {
        if(error && error.error && error.error.errors) {
          let imp = error.error.errors.filter((_val) => {
           return _val.rules.filter(val => val.rule == 'unique')
          });
          if(imp.length > 0 && imp[0].rules.length > 0) {
            this.toastrService.error(imp[0].rules[0].message,'', {
		  timeOut: 2500
		})
          }
        }
      }
    )
  }
	/**
	**	To get review popup status
	**/
  onToggleRegisterReview = (status) => {
    this.isOpenedRegisterReviewModal = status;
  }

  private buildForm(): void {
    this.candidateForm = this.formBuilder.group({
    });
  }
	/**
	**	To get skills Info
	**/
  onGetSkill = () => {
    this.requestParams = {};
    this.requestParams.page = 1;
    this.requestParams.limit = 1000;
    this.requestParams.search = '';
    this.SharedAPIService.onGetSkill(this.requestParams);
  }
	/**
	**	To get domain Info
	**/
  onGetIndustries = () => {
    this.requestParams = {};
    this.requestParams.page = 1;
    this.requestParams.limit = 1000;
    this.requestParams.search = '';
    this.SharedAPIService.onGetIndustries(this.requestParams);
  }
  
	/**
	**	To get country Info
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
	**	To get language Info
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
	**	To get candidate Info
	**/
  onGetCandidateInfo(userId) {
    this.requestParams = {};
    this.requestParams.id = userId;
    this.userService.profileView(this.requestParams).subscribe(
      response => {
        if(response && response.details) {
          this.userDetails = {...response.details, meta: response.meta};
          this.candidateForm.patchValue({
            ...this.userDetails
          });
        }
      }, error => {
      }
    )
  }
  
	@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }

}
