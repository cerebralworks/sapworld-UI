import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tabInfo, tabProgressor } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';

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
  public nextBtnValidate: boolean =false ;
  public userInfo: any;
  
  tabInfos: any[];
  @Input('userDetails')
  set userDetails(inFo: any) {
    this.savedUserDetails = inFo;
  }

  public btnType: string;
  isOpenedRegisterReviewModal: any;
public requestParams: any;
  constructor(
    private userSharedService: UserSharedService,
		private SharedAPIService: SharedApiService,
    private dataService: DataService
    ) { }

  validateInfo = 0;
  ngOnInit(): void {
	  /* this.requestParams = {'Enter the oninit':'CreateCandidateFooterComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
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
	/* this.requestParams = {'Exist the oninit':'CreateCandidateFooterComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
  }

  onPrevious = () => {
	 /*  this.requestParams = {'Enter the onPrevious':'CreateCandidateFooterComponent','time':new Date().toLocaleString()};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
    this.btnType = 'prev';
    this.onTabChange();
	/* this.requestParams = {'Exist the onPrevious':'CreateCandidateFooterComponent','time':new Date().toLocaleString()};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
  }

  onNext = () => {
	  /* this.requestParams = {'Enter the onNext':'CreateCandidateFooterComponent','time':new Date().toLocaleString()};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
    this.btnType = 'next';
    this.onTabChange();
	/* this.requestParams = {'Exist the onNext':'CreateCandidateFooterComponent','time':new Date().toLocaleString()};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
  }

  onTabChange = () => {
	  /* this.requestParams = {'Enter the onTabChange':'CreateCandidateFooterComponent','time':new Date().toLocaleString()};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
    if(this.btnType == 'next') {
		if(this.currentTabInfo.tabNumber == 1 ){
		if(this.createCandidateForm.value.personalDetails.authorized_country_select){
			if(this.createCandidateForm.value.personalDetails.authorized_country){
				var value = this.createCandidateForm.value.personalDetails.authorized_country_select
				for(let i=0;i<value.length;i++){
					var id = value[i];
					 this.createCandidateForm.value.personalDetails.authorized_country.push(id);
				}
				var val= this.createCandidateForm.value.personalDetails.authorized_country;
				val = val.filter((a, b) => val.indexOf(a) === b);
				this.createCandidateForm.patchValue({
					personalDetails:{
						authorized_country:val
					}
				})
				//this.createCandidateForm.value.personalDetails.authorized_country =val;
				
			}else{
				var value = this.createCandidateForm.value.personalDetails.authorized_country_select
				this.createCandidateForm.patchValue({
					personalDetails:{
						authorized_country:value
					}
				})

			}
		}
		if(this.createCandidateForm.value.jobPref !=null &&this.createCandidateForm.value.jobPref !=undefined  ){
		if(this.createCandidateForm.value.jobPref.preferred_countries){
		var intersection = this.createCandidateForm.value.personalDetails.authorized_country.filter(element => this.createCandidateForm.value.jobPref.preferred_countries.includes(element));
		this.createCandidateForm.patchValue({
			preferred_countries:{
					authorized_country:intersection
				}
			})
		}}}
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
	/* this.requestParams = {'Exist the onTabChange':'CreateCandidateFooterComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
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
	  /* this.requestParams = {'Enter the onToggleRegisterReview':'footer','time':new Date().toLocaleString()};
	 this.SharedAPIService.onSaveLogs(this.requestParams); */
    if(this.createCandidateForm.valid) {
		/* this.requestParams = {'Check Authorized Country Select':'footer','time':new Date().toLocaleString()};
		this.SharedAPIService.onSaveLogs(this.requestParams); */
		if(this.createCandidateForm.value.personalDetails.authorized_country_select){
			/* this.requestParams = {'Check Authorized Country Select After':'footer','Check Authorized Country Bfrore':'footer','time':new Date().toLocaleString()};
			this.SharedAPIService.onSaveLogs(this.requestParams); */
			if(this.createCandidateForm.value.personalDetails.authorized_country){
				this.requestParams = {'Check Authorized Country Aftre':'footer','Check Before concat authorized_country':'footer','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams);
				var val= this.createCandidateForm.value.personalDetails.authorized_country.concat(this.createCandidateForm.value.personalDetails.authorized_country_select);
				val= [...new Set(val)];
				/* this.requestParams = {'Check Aftr concat authorized_country':'footer','Check Before patchValue authorized_country':'footer','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
				this.createCandidateForm.patchValue({personalDetails:{authorized_country:val}})
				/* this.requestParams = {'Check After patchValue authorized_country':'footer'};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
			}else{
				/* this.requestParams = {'Check Aftr concat authorized_country':'footer','Check Before patchValue authorized_country':'footer','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
				var value = this.createCandidateForm.value.personalDetails.authorized_country_select
				this.createCandidateForm.patchValue({personalDetails:{authorized_country:value}	})
				/* this.requestParams = {'Check After patchValue authorized_country':'footer','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
			}
		}
		/* this.requestParams = {'Before the onEnableJobPreviewModalEmit':'footer','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
		this.onEnableJobPreviewModal.emit(status);
		/* this.requestParams = {'Exist onToggleRegisterReview':'footer','time':new Date().toLocaleString()};
				this.SharedAPIService.onSaveLogs(this.requestParams); */
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
