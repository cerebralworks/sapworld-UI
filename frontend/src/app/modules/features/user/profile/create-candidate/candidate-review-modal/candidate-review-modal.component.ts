import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Subscription } from 'rxjs';
import { SharedApiService } from '@shared/service/shared-api.service';

import { trigger, style, animate, transition, state, group } from '@angular/animations';
@Component({
  selector: 'app-candidate-review-modal',
  templateUrl: './candidate-review-modal.component.html',
  styleUrls: ['./candidate-review-modal.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 0 })),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),

        group([
          animate(300, style({ height: 0 })),
          animate('200ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ height: '0', opacity: 0 }),

        group([
          animate(300, style({ height: '*' })),
          animate('400ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
  ]
})
export class CandidateReviewModalComponent implements OnInit {

	@Input() toggleRegisterReviewModal: boolean;
	@Output() onEvent = new EventEmitter<boolean>();
	public show: boolean = false;
	@Output() createCandidate: EventEmitter<any> = new EventEmitter();
	public savedUserDetails: any;
	public jobId: string;
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}

	public childForm;
	public mbRef: NgbModalRef;
	public registerReviewModalSub: Subscription;
	public userInfo: any = {};
	public userPhotoInfo: any;
	public nationality: any[] = [];
	public languageSource: any[] = [];
	public requestParams: any;
	
	@ViewChild("registerReviewModal", { static: false }) registerReviewModal: TemplateRef<any>;

	constructor(
		private modalService: NgbModal,
		public router: Router,
		private parentF: FormGroupDirective,
		private formBuilder: FormBuilder,
		private employerService: EmployerService,
		public sharedService: SharedService,
		public route: ActivatedRoute,
		public utilsHelperService: UtilsHelperService,
		private userSharedService: UserSharedService,
		private SharedAPIService: SharedApiService,
		private dataService: DataService
	) { }

	ngOnInit(): void {
		/* this.requestParams = {'Entering the onInit':'ReviewComponent'};
	 this.SharedAPIService.onSaveLogs(this.requestParams);
	  console.log(this.requestParams); */
		this.childForm = this.parentF.form;
		this.jobId = this.route.snapshot.queryParamMap.get('id');
		this.userSharedService.getUserProfileDetails().subscribe(
		response => {
			this.userInfo = response;
		});
		this.dataService.getUserPhoto().subscribe(
		response => {
			this.userPhotoInfo = response;
		})
		this.dataService.getCountryDataSource().subscribe(
		response => {
			if (response && Array.isArray(response) && response.length) {
			  this.nationality = response;
			}
		});
		this.dataService.getLanguageDataSource().subscribe(
		  response => {
			if (response && Array.isArray(response) && response.length) {
			  this.languageSource = response;
			}
		});
		/* this.requestParams = {'Exist the onInit':'ReviewComponent'};
	 this.SharedAPIService.onSaveLogs(this.requestParams);
	  console.log(this.requestParams); */
	}

	ngAfterViewInit(): void {
		if (this.toggleRegisterReviewModal) {
			/* this.requestParams = {'Entering the toggleRegisterReviewModal':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
			this.mbRef = this.modalService.open(this.registerReviewModal, {
				windowClass: 'modal-holder',
				size: 'lg',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
			/* this.requestParams = {'Exist the toggleRegisterReviewModal':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
		}
	}

	ngOnDestroy(): void {
		/* this.requestParams = {'Enter the ngOnDestroy':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
		this.onClickCloseBtn(false);
		this.registerReviewModalSub && this.registerReviewModalSub.unsubscribe();
		/* this.requestParams = {'Exist the ngOnDestroy':'reviewComponent'};
			this.SharedAPIService.onSaveLogs(this.requestParams);
			console.log(this.requestParams); */
	}

	onClickCloseBtn(status){
		this.onEvent.emit(status);
		if(status == false) {
			this.mbRef.close()
		}
	}

	onRedirectDashboard(status) {
		this.createCandidate.next();
	}

	convertToImage(imageString: string): string {
		return this.utilsHelperService.convertToImageUrl(imageString);
	}
	
	findCountry(value){
		if(value){
			if(this.nationality){
				var temp = this.nationality.filter(function(a,b){
					return a.id == value;
				})
				if(temp.length !=0){
					return temp[0]['nicename'];
				}
			}
		}
		
		return '--';
	}
	
	findEducation(value){
		if(value){
		if(value.length!=0 && value.length!=null && value.length!=undefined){
			return this.utilsHelperService.onConvertArrayToString(value.map(function(a,b){return a.degree}));
		}else{
			return '--';
		}
		
		}
		return '--';
		
	}
	
	findLanguageArray(value){
		if(value){
			value = value.map(function(a,b){
				return a.language 
			})
			if(this.languageSource){
				var array = this.languageSource.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['name'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			}
		}
		return '--';
	}
	
	findCountryArray(value){
		if(value){
			if(this.nationality){
				var array = this.nationality.filter(f=>{ return value.includes(f.id)})

				if(array.length !=0){
					var temp = array.map(function(a,b){
						return a['nicename'];
					})
					if(temp.length !=0){
						return this.utilsHelperService.onConvertArrayToString(temp);
					}
				}
			}
		}
		return '--';
	}

}
