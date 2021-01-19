import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tabInfo, tabProgressor } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';

@Component({
  selector: 'app-create-candidate-footer',
  templateUrl: './create-candidate-footer.component.html',
  styleUrls: ['./create-candidate-footer.component.css']
})
export class CreateCandidateFooterComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
  @Output() createCandidate: EventEmitter<any> = new EventEmitter();
  @Output() onEnableJobPreviewModal: EventEmitter<boolean> = new EventEmitter();
  @Input() createCandidateForm: FormGroup;
  public savedUserDetails: any;
  public userInfo: any;
  tabInfos: any[];
  @Input('userDetails')
  set userDetails(inFo: any) {
    this.savedUserDetails = inFo;
  }

  public btnType: string;
  isOpenedRegisterReviewModal: any;

  constructor(
    private userSharedService: UserSharedService,
    private dataService: DataService
    ) { }

  validateInfo = 0;
  ngOnInit(): void {
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
        if(this.userInfo && this.userInfo.id && this.validateInfo == 0) {
          this.validateInfo++;
        }
      }
    )
    this.dataService.getTabInfo().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.tabInfos = response;
        }
      }
    )

    console.log(this.getErrors(this.createCandidateForm));

  }

  onPrevious = () => {
    this.btnType = 'prev';
    this.onTabChange();
  }

  onNext = () => {
    this.btnType = 'next';
    this.onTabChange();
  }

  onTabChange = () => {
    if(this.btnType == 'next') {
      let nextTabProgressor = {} as tabInfo;
      nextTabProgressor.tabNumber = this.currentTabInfo.tabNumber + 1;
      nextTabProgressor.tabName = this.onGetTabName(nextTabProgressor.tabNumber);
      this.onTabChangeEvent.emit(nextTabProgressor);
    }
    if(this.btnType == 'prev') {
      let prevTabProgressor = {} as tabInfo;
      prevTabProgressor.tabNumber = this.currentTabInfo.tabNumber - 1;
      prevTabProgressor.tabName = this.onGetTabName(prevTabProgressor.tabNumber);
      this.onTabChangeEvent.emit(prevTabProgressor);
    }
  }

  onGetTabName = (tabNumber: number) => {
    let tabName: string = 'Personal Detail';
    switch (tabNumber) {
      case 1:
        tabName = 'Personal Detail';
        break;
      case 2:
        tabName = 'Education Experience';
        break;
      case 3:
        tabName = 'Skillsets';
        break;
      case 4:
        tabName = 'Job Preference';
        break;
      default:
        break;
    }
    return tabName;
  }

  onToggleRegisterReview = (status) => {
    if(this.createCandidateForm.valid) {
      this.onEnableJobPreviewModal.emit(status);
    }
  }

  getErrors = (formGroup: FormGroup, errors: any = {}) => {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        errors[field] = control.errors;
      } else if (control instanceof FormGroup) {
        errors[field] = this.getErrors(control);
      }
    });
    return errors;
  }


}
