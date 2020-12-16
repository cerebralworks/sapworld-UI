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
  jobId: any;
  filesToUploadData: any;
  public userPhotoInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router,
    private route: ActivatedRoute,
    private sharedApiService: SharedApiService,
    private userService: UserService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.buildForm();
    this.onGetSkill();
    this.onGetIndustries();
    this.userId = this.route.snapshot.queryParamMap.get('id');
    if(this.userId) {
      this.onGetCreatedUserInfo(this.userId);
    }

    this.dataService.getUserPhoto().subscribe(
      response => {
        this.userPhotoInfo = response;
        console.log('this.userPhotoInfo', this.userPhotoInfo);

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
    console.log('candidateInfo', candidateInfo);


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
          this.modalService.dismissAll();
          this.onToggleRegisterReview(false)
        });
      }, error => {
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

  onGetCreatedUserInfo(jobId) {
    let requestParams: any = {};
    requestParams.expand = 'company';
    requestParams.id = jobId;
    // this.employerService.getPostedJobDetails(requestParams).subscribe(
    //   response => {
    //     if(response && response.details) {
    //       this.postedJobsDetails = response.details;
    //       this.postJobForm.patchValue({
    //         ...this.postedJobsDetails
    //       });
    //     }
    //   }, error => {
    //   }
    // )
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

}
