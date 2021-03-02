import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-posted-job',
  templateUrl: './posted-job.component.html',
  styleUrls: ['./posted-job.component.css']
})
export class PostedJobComponent implements OnInit {
  public isLoading: boolean;
  public postedJobs: any[] = [];
  public page: number = 1;
  public limit: number = 25;
  public postedJobMeta: any = {};
  public currentEmployerDetails: any = {};
  public isDeleteModalOpened: boolean = false;
  public currentJobDetails: any;
  public currentJobIndex: any;
  public statusGlossary: any;
  public mbRef: NgbModalRef;

  @ViewChild('statusModal', { static: false }) deleteModal: TemplateRef<any>;
  public currentValueOfStatus: any;
  public currentValueOfJob: JobPosting;
  isStatusValue: any;

  constructor(
    public employerService: EmployerService,
    private employerSharedService: EmployerSharedService,
    private router: Router,
    private modelService: NgbModal,
    private utilsHelperService: UtilsHelperService
  ) { }

  validateSubscribe = 0;
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          this.currentEmployerDetails = details;
          if(this.currentEmployerDetails.id && this.validateSubscribe == 0) {
            this.onGetPostedJob(this.currentEmployerDetails.id);
            this.validateSubscribe ++;
          }
        }
      }
    )
  }

  onGetPostedJob(companyId, statusValue?: number) {
    this.isLoading = true;
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    requestParams.company = companyId;
    requestParams.sort = 'created_at.desc';
    if(statusValue != null) {
      requestParams.status = statusValue;
      this.postedJobs = [];
    }
    this.employerService.getPostedJob(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          if(statusValue != null) {
            this.postedJobs = [];
          }
          this.postedJobs = [...this.postedJobs, ...response.items];
        }
        this.postedJobMeta = { ...response.meta }

        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    )
  }

  onSelectStatus = (value: number, job: any) => {
    if (value && !this.utilsHelperService.isEmptyObj(job)) {
      this.currentValueOfStatus = value;
      this.currentValueOfJob = job;
      this.mbRef = this.modelService.open(this.deleteModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  onChangeStatus = () => {
    let requestParams: any = {};
    requestParams.id = this.currentValueOfJob.id;
    requestParams.status = parseInt(this.currentValueOfStatus);
    requestParams.status_glossary = this.statusGlossary;

    this.employerService.changeJobStatus(requestParams).subscribe(
      response => {
        this.onStatusModelClose();
      }, error => {
      }
    )
  }

  onStatusModelClose = () => {
    this.statusGlossary = "";
    this.mbRef.close();
  }

  onStatusModelSubmit = () => {
    if(this.statusGlossary) {
      this.onChangeStatus();
    }
  }

  onGetChangedStatus = (value: number) => {
    if(this.isStatusValue != value) {
      this.isStatusValue = value;
    }else {
      this.isStatusValue = null;
    }
    this.onGetPostedJob(this.currentEmployerDetails.id, this.isStatusValue);
  }

  onDeleteJobConfirm = (item, index) => {
    this.currentJobDetails = item;
    this.currentJobIndex = index;
    this.isDeleteModalOpened = true;
  }

  onDeleteJobConfirmed = (status) => {
    if(status == true) {
      this.onDeletePostedJob();
    }else {
      this.isDeleteModalOpened = false;
    }
  }

  onDeletePostedJob() {
    this.isLoading = true;
    let requestParams: any = {};
    requestParams.ids = [parseInt(this.currentJobDetails.id)];

    this.employerService.deletePostedJob(requestParams).subscribe(
      response => {
        this.onDeleteJobConfirmed(false);
        if (this.currentJobIndex > -1) {
          this.postedJobs.splice(this.currentJobIndex, 1);
          this.postedJobMeta.total = this.postedJobMeta.total ? this.postedJobMeta.total - 1 : this.postedJobMeta.total;
        }
        this.isLoading = false;
      }, error => {
        this.onDeleteJobConfirmed(false);
        this.isLoading = false;
      }
    )
  }

  onConfirmDelete = () => {
    const x = confirm('Are you sure you want to delete?');
    if (x) {
      return true;
    } else {
      return false;
    }
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    if(this.currentEmployerDetails.id) {
      this.onGetPostedJob(this.currentEmployerDetails.id);
    }
  }

}
