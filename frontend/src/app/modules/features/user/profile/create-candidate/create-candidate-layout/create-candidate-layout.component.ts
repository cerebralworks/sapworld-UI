import { Component, OnInit } from '@angular/core';
import { CandidateProfile, tabInfo, tabProgressor } from '@data/schema/create-candidate';

import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@data/service/user.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { DataService } from '@shared/service/data.service';
import { ImageCropperComponent, ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { UserSharedService } from '@data/service/user-shared.service';

import * as lodash from 'lodash';

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
  userDetails: any;
  userInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router,
    private route: ActivatedRoute,
    private sharedApiService: SharedApiService,
    private userService: UserService,
    private dataService: DataService,
    private toastrService: ToastrService,
    private userSharedService: UserSharedService
  ) { }

  validateInfo = 0;
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.buildForm();
    // this.onGetSkill();
    // this.onGetIndustries();

    this.dataService.getUserPhoto().subscribe(
      response => {
        this.userPhotoInfo = response;
      }
    )

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

  postJob = () => {
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
    console.log(this.userPhotoInfo);

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
