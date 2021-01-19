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

@Component({
  selector: 'app-candidate-review-modal',
  templateUrl: './candidate-review-modal.component.html',
  styleUrls: ['./candidate-review-modal.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CandidateReviewModalComponent implements OnInit {

  @Input() toggleRegisterReviewModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();
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
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.childForm = this.parentF.form;

    this.jobId = this.route.snapshot.queryParamMap.get('id');

    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
      }
    )
    this.dataService.getUserPhoto().subscribe(
      response => {
        this.userPhotoInfo = response;
      }
    )
  }

  ngAfterViewInit(): void {
    if (this.toggleRegisterReviewModal) {
      this.mbRef = this.modalService.open(this.registerReviewModal, {
        windowClass: 'modal-holder',
        size: 'lg',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.registerReviewModalSub && this.registerReviewModalSub.unsubscribe();
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

}
