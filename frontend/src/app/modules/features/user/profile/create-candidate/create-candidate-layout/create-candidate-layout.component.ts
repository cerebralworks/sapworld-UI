import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class CreateCandidateLayoutComponent implements OnInit, DoCheck {

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
  public tabInfos: tabInfo[];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router,
    private route: ActivatedRoute,
    private sharedApiService: SharedApiService,
    private userService: UserService,
    private dataService: DataService,
    private toastrService: ToastrService,
    private userSharedService: UserSharedService,
    private utilsHelperService: UtilsHelperService
  ) { }

  validateInfo = 0;
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.dataService.getUserPhoto().subscribe(
      response => {
        this.userPhotoInfo = response;
      }
    )

    this.dataService.getTabInfo().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.tabInfos = response;
          console.log('this.tabInfos', this.tabInfos);

        }
      }
    )

    this.buildForm();

    this.userSharedService.getUserProfileDetails().subscribe(
        response => {
          this.userInfo = response;
          if(this.userInfo && this.userInfo.id && this.validateInfo == 0) {
            this.onGetCandidateInfo(this.userInfo.id);
            this.validateInfo++;
          }
        }
      )

  }

  validateOnAPI = 0;
  validateOnForm = 0;
  ngDoCheck(): void {

    if(!this.utilsHelperService.isEmptyObj(this.candidateForm) && !this.utilsHelperService.isEmptyObj(this.userInfo) && this.userInfo.profile_completed && this.validateOnForm==0) {
      this.candidateForm.addControl('jobPref', new FormGroup({
            job_type: new FormControl('', Validators.required),
            job_role: new FormControl('', Validators.required),
            willing_to_relocate: new FormControl(null, Validators.required),
            preferred_location: new FormControl(null),
            work_authorization: new FormControl(null),
            travel: new FormControl(null, Validators.required),
            availability: new FormControl(null, Validators.required),
            remote_only: new FormControl(false, Validators.required),
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
            experience: new FormControl('', Validators.required),
            sap_experience: new FormControl('', Validators.required),
            current_employer: new FormControl('', Validators.required),
            current_employer_role: new FormControl('', Validators.required),
            domains_worked: new FormControl('', Validators.required),
            clients_worked: new FormControl(''),
            end_to_end_implementation: new FormControl(null),
          }));
          this.validateOnForm++
    }
    if(this.tabInfos && this.tabInfos.length && this.validateOnAPI == 0 && !this.utilsHelperService.isEmptyObj(this.userDetails)) {
      let educationExpIndex = this.tabInfos.findIndex(val => val.tabNumber == 2);

      if(educationExpIndex == -1) {
        if (this.userDetails && this.userDetails.education_qualification == null) {
          delete this.userDetails.education_qualification;
        }
        this.candidateForm.patchValue({
          educationExp : {
            ...this.userDetails
          },
        });
      }

      let skillSetIndex = this.tabInfos.findIndex(val => val.tabNumber == 3);
      if(skillSetIndex == -1) {
        if (this.userDetails && this.userDetails.hands_on_experience == null) {
          delete this.userDetails.hands_on_experience;
        }
        this.candidateForm.patchValue({
          skillSet : {
            ...this.userDetails
          },
        });
      }

      let jobPrefIndex = this.tabInfos.findIndex(val => val.tabNumber == 4);
      if(jobPrefIndex == -1) {
        this.candidateForm.patchValue({
          jobPref : {
            ...this.userDetails
          },
        });
      }
      this.validateOnAPI++
    }

  }

  onNext() {
    if (this.slidingCounter != this.slindingList.length - 1) {
      this.slidingCounter++;
    }
  }

  onPrevious() {
    if (this.slidingCounter > 0) {
      // console.log(this.slidingCounter);
      // if(this.slidingCounter == 1) {
      //   this.candidateForm.removeControl('educationExp');
      // }else if(this.slidingCounter == 2) {
      //   this.candidateForm.removeControl('skillSet');
      // }else if(this.slidingCounter == 3) {
      //   this.candidateForm.removeControl('jobPref');
      // }
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

    if (this.candidateForm.valid) {
      if(this.userPhotoInfo && this.userPhotoInfo.photoBlob) {
        this.onUserPhotoUpdate();
      }
      this.onUserUpdate(candidateInfo);
    }
  }

  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

  onUserPhotoUpdate = () => {
    const formData = new FormData();
    var rString = this.randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    formData.append('photo' , this.userPhotoInfo.photoBlob, ((this.userPhotoInfo && this.userPhotoInfo.photoBlob && this.userPhotoInfo.photoBlob.name) ? this.userPhotoInfo.photoBlob.name : rString));
    this.userService.photoUpdate(formData).subscribe(
      response => {
      }, error => {
      }
    )
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
    this.isOpenedRegisterReviewModal = status;
  }

  private buildForm(): void {
    this.candidateForm = this.formBuilder.group({
    });
  }

  onGetSkill = () => {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.search = '';
    this.sharedApiService.onGetSkill(requestParams);
  }

  onGetIndustries = () => {
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.search = '';
    this.sharedApiService.onGetIndustries(requestParams);
  }

  onGetCandidateInfo(userId) {
    let requestParams: any = {};
    requestParams.id = userId;
    this.userService.profileView(requestParams).subscribe(
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
