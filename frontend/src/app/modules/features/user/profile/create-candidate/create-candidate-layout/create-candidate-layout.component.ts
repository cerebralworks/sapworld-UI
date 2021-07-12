import { Component, DoCheck, OnChanges, OnInit,SimpleChanges } from '@angular/core';
import { CandidateProfile, tabInfo, tabProgressor } from '@data/schema/create-candidate';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

	public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'Personal Detail'};
	public currentProgessor: tabProgressor;
	public slidingCounter: number = 0;
	public slindingList: Array<number> = [1, 2, 3, 4];
	public isOpenedRegisterReviewModal: any;
	public candidateForm: FormGroup;
	public userId: string;
	public filesToUploadData: any;
	public userPhotoInfo: any;
	public userDetails: any;
	public userInfo: any;
	public requestParams: any;
	public tabInfos: tabInfo[];
	
	constructor(
		private formBuilder: FormBuilder,
		private modalService: NgbModal,
		public router: Router,
		private route: ActivatedRoute,
		private SharedAPIService: SharedApiService,
		private userService: UserService,
		private dataService: DataService,
		private toastrService: ToastrService,
		private userSharedService: UserSharedService,
		private utilsHelperService: UtilsHelperService
	) { }

	validateInfo = 0;
	ngOnInit(): void {
		 console.log({'Enter the oninit':'CreateCandidateLayoutComponent'})
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
		this.buildForm();
		this.createFormData();
		this.onGetCountry('');
		this.onGetLanguage('');
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
		 console.log({'Exist the oninit':'CreateCandidateLayoutComponent'})
	}
	
	validateOnAPI = 0;
	validateOnForm = 0;
	ngAfterViewInitCheck(){
		console.log({'Exist the ngAfterViewInitCheck':'CreateCandidateLayoutComponent'})
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
				  this.candidateForm.controls.skillSet['controls']['hands_on_experience'].push(this.formBuilder.group({
					  skill_id: [null, Validators.required],
					  skill_name: [''],
					  experience: ['', [Validators.required,]],
					  exp_type: ['years', [Validators.required]]
					}));
				});
				}}
				if (this.userInfo && this.userInfo.hands_on_experience == null) {
				  delete this.userInfo.hands_on_experience;
				}
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
		console.log({'Exist the ngAfterViewInitCheck':'CreateCandidateLayoutComponent'})

	}
	ngAfterViewInit(): void {
		console.log({'Enter the ngAfterViewInit':'CreateCandidateLayoutComponent'})
		this.createFormData();
		this.ngAfterViewInitCheck();
		console.log({'Exist the ngAfterViewInit':'CreateCandidateLayoutComponent'})
	}
	
	createFormData(){
		if(!this.utilsHelperService.isEmptyObj(this.candidateForm) && !this.utilsHelperService.isEmptyObj(this.userInfo) && this.userInfo.profile_completed && this.validateOnForm==0) {
			this.candidateForm.addControl('jobPref', new FormGroup({
				job_type: new FormControl(null, Validators.required),
				job_role: new FormControl(''),
				willing_to_relocate: new FormControl(null, Validators.required),
				preferred_location: new FormControl(null),
				preferred_countries: new FormControl(null),
				preferred_locations : new FormArray([this.formBuilder.group({
					city: [''],
					state: [''],
					stateShort: [''],
					country: ['']
				  })]),
				travel: new FormControl(null, Validators.required),
				availability: new FormControl(null, Validators.required),
				remote_only: new FormControl(false, Validators.required),
				visa_sponsered: new FormControl(false),
				//preferred_countries: new FormControl(null),
			}));
			this.candidateForm.addControl('skillSet', new FormGroup({
				hands_on_experience: new FormArray([this.formBuilder.group({
					skill_id: [null, Validators.required],
					skill_name: ['dasdasd'],
					experience: ['', [Validators.required,]],
					exp_type: ['years', [Validators.required]]
				})]),
				skills: new FormControl(null, Validators.required),
					programming_skills: new FormControl(null, Validators.required),
					other_skills: new FormControl(null, Validators.required),
					certification: new FormControl(null),
					bio: new FormControl('Lorem Ipsum'),
				}));
				this.candidateForm.addControl('educationExp', new FormGroup({
					education_qualification: new FormArray([this.formBuilder.group({
					degree: [''],
					field_of_study: [''],
					year_of_completion: ['']
				})]),
				employer_role_type: new FormControl(null),
				experience: new FormControl('', Validators.required),
				sap_experience: new FormControl('', Validators.required),
				current_employer: new FormControl('', Validators.required),
				current_employer_role: new FormControl('', Validators.required),
				domains_worked: new FormControl('', Validators.required),
				end_to_end_implementation: new FormControl(null),
			}));
			this.validateOnForm++
			this.ngAfterViewInitCheck();
		}
		this.ngAfterViewInitCheck();
	}
	onNext() {
		//console.log({'Enter the onNext':'CreateCandidateLayoutComponent'})
		if (this.slidingCounter != this.slindingList.length - 1) {
			this.slidingCounter++;
			setTimeout(() => {
				if(this.slidingCounter == 1) {
				  this.addValidators(<FormGroup>this.candidateForm.controls['educationExp']);
				}else if(this.slidingCounter == 2) {
				  this.addValidators(<FormGroup>this.candidateForm.controls['skillSet']);
				  this.candidateForm.controls.skillSet['controls'].hands_on_experience.controls.map((val, index) => {
				  this.addValidators(<FormGroup>val);
				})
				}else if(this.slidingCounter == 3) {
				  this.addValidators(<FormGroup>this.candidateForm.controls['jobPref']);
				}
			 }, 300);
		}
		//console.log({'Exist the onNext':'CreateCandidateLayoutComponent'})
	}

	public removeValidators(form: FormGroup) {
		if(form && form.controls) {
			for (const key in form.controls) {
				form.get(key).clearValidators();
				form.get(key).updateValueAndValidity();
			}
		}
	}

	public addValidators(form: FormGroup) {
		if(form && form.controls) {
			for (const key in form.controls) {
				form.get(key).setValidators(this.validationType[key]);
				form.get(key).updateValueAndValidity();
			}		
		}
	}

	validationType = {
		'experience': [Validators.required],
		'sap_experience': [Validators.required],
		'current_employer': [Validators.required],
		'current_employer_role': [Validators.required],
		'domains_worked': [Validators.required],
		'skill_id': [Validators.required],
		'exp_type': [Validators.required],
		'skills': [Validators.required],
		'programming_skills': [Validators.required],
		'other_skills': [Validators.required],
		//'job_role': [Validators.required],
		'willing_to_relocate': [Validators.required],
		'travel': [Validators.required],
		'availability': [Validators.required],
	}

	onPrevious() {
		//this.requestParams = {'Enter the onPrevious':'CreateCandidateLayoutComponent'};
	// this.SharedAPIService.onSaveLogs(this.requestParams);
	 // console.log(this.requestParams);
		if (this.slidingCounter > 0) {
			if(this.slidingCounter == 1) {
				this.removeValidators(<FormGroup>this.candidateForm.controls['educationExp']);
			}else if(this.slidingCounter == 2) {
				this.removeValidators(<FormGroup>this.candidateForm.controls['skillSet']);
					this.candidateForm.controls.skillSet['controls'].hands_on_experience.controls.map((val, index) => {
					this.removeValidators(<FormGroup>val);
				})
			}else if(this.slidingCounter == 3) {
				this.removeValidators(<FormGroup>this.candidateForm.controls['jobPref']);
			}
			this.slidingCounter--;
		}
		//this.requestParams = {'Exist the onPrevious':'CreateCandidateLayoutComponent'};
	// this.SharedAPIService.onSaveLogs(this.requestParams);
	 // console.log(this.requestParams)
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

	createCandidate = () => {
		let candidateInfo: CandidateProfile = {
			...this.candidateForm.value.personalDetails,
			...this.candidateForm.value.educationExp,
			...this.candidateForm.value.skillSet,
			...this.candidateForm.value.jobPref
		};

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

		if(Array.isArray(tempSkill) && Array.isArray(candidateInfo.skills)) {
		  candidateInfo.skills = lodash.uniq([...tempSkill, ...candidateInfo.skills]);
		}

		if (this.candidateForm.valid) {
			if(this.userPhotoInfo && this.userPhotoInfo.photoBlob) {
				this.onUserPhotoUpdate(candidateInfo);
			}else{
				this.onUserUpdate(candidateInfo);
			}
			
		}
	}
    
	randomString(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	onUserPhotoUpdate = (candidateInfo) => {
		const formData = new FormData();
		var rString = this.randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
		formData.append('photo' , this.userPhotoInfo.photoBlob, ((this.userPhotoInfo && this.userPhotoInfo.photoBlob && this.userPhotoInfo.photoBlob.name) ? this.userPhotoInfo.photoBlob.name : rString));
		this.userService.photoUpdate(formData).subscribe(
		response => {
			this.onUserUpdate(candidateInfo);
		}, error => {
			this.onUserUpdate(candidateInfo);
		})
	}

	onUserUpdate = (candidateInfo: CandidateProfile) => {
		this.userService.update(candidateInfo).subscribe(
		response => {
			this.router.navigate(['/user/dashboard']).then(() => {
          if(this.userInfo && (!this.userInfo.doc_resume || this.userInfo.doc_resume.length == 0)) {
            this.dataService.setProfileCompletion();
          }

          this.modalService.dismissAll();
          this.onToggleRegisterReview(false)
        });
      }, error => {
        if(error && error.error && error.error.errors) {
          let imp = error.error.errors.filter((_val) => {
           return _val.rules.filter(val => val.rule == 'unique')
          });
          if(imp.length > 0 && imp[0].rules.length > 0) {
            this.toastrService.error(imp[0].rules[0].message)
          }
        }
      }
    )
  }

  onToggleRegisterReview = (status) => {
	 /*  this.requestParams = {'Enter the onToggleRegisterReview':'CreateCandidateLayoutComponent'};
	 this.SharedAPIService.onSaveLogs(this.requestParams);
	  console.log(this.requestParams) */
    this.isOpenedRegisterReviewModal = status;
	 /* console.log({'Exist the onToggleRegisterReview':'CreateCandidateLayoutComponent'})
	 this.requestParams = {'Exist the onToggleRegisterReview':'CreateCandidateLayoutComponent'};
	 this.SharedAPIService.onSaveLogs(this.requestParams); */
  }

  private buildForm(): void {
    this.candidateForm = this.formBuilder.group({
    });
  }

  onGetSkill = () => {
    this.requestParams = {};
    this.requestParams.page = 1;
    this.requestParams.limit = 1000;
    this.requestParams.search = '';
    this.SharedAPIService.onGetSkill(this.requestParams);
  }

  onGetIndustries = () => {
    this.requestParams = {};
    this.requestParams.page = 1;
    this.requestParams.limit = 1000;
    this.requestParams.search = '';
    this.SharedAPIService.onGetIndustries(this.requestParams);
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

}
