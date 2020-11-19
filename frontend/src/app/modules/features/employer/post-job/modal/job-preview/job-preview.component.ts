import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-preview',
  templateUrl: './job-preview.component.html',
  styleUrls: ['./job-preview.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class JobPreviewComponent implements OnInit {

  @Input() toggleJobPreviewModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();
  @Input() postJobForm: FormGroup;
  @Output() postJob: EventEmitter<any> = new EventEmitter();

  public mbRef: NgbModalRef;
  public criteriaModalRef: NgbModalRef;
  public jobPreviewModalRef: NgbModalRef;
  public jdSub: Subscription;
  public childForm;
  public isOpenCriteriaModal: boolean;
  public industries: any;
  public profileInfo: any;
  public mustMacthArray: any[] = [];

  @ViewChild("jobPreviewModal", { static: false }) jobPreviewModal: TemplateRef<any>;
  @ViewChild("criteriaModal", { static: false }) criteriaModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private parentF: FormGroupDirective,
    private formBuilder: FormBuilder,
    private employerService: EmployerService
  ) { }

  ngOnInit(): void {
    this.onGetProfile();
  }

  ngAfterViewInit(): void {
    if (this.toggleJobPreviewModal) {
      this.jobPreviewModalRef = this.modalService.open(this.jobPreviewModal, {
        windowClass: 'modal-holder',
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });
      this.createForm();
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.jdSub && this.jdSub.unsubscribe();
  }

  onClickCloseBtn(status) {
    if (status == false) {
      this.modalService.dismissAll()
    }
    this.onEvent.emit(status);
  }

  onRedirectDashboard(status) {
    // if (status == false) {
    //   this.router.navigate(['/employer/dashboard']).then(() => {
    //     this.modalService.dismissAll();
    //   });
    // }
    this.postJob.next();
    // this.onEvent.emit(status);
  }

  onCloseCriteriaModal() {
    this.clearFormArray(this.childForm.get('jobPrev.temp_extra_criteria'));
    this.criteriaModalRef.close();
    this.isOpenCriteriaModal = false;
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  onOpenCriteriaModal = () => {
    this.isOpenCriteriaModal = true;
    if (this.isOpenCriteriaModal) {
      setTimeout(() => {
        this.criteriaModalRef = this.modalService.open(this.criteriaModal, {
          windowClass: 'modal-holder',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
        this.onCreateExtraCriteriaField();
      }, 300);
    }
  }

  onCreateExtraCriteriaField = () => {
    this.t.push(this.formBuilder.group({
      title: ['', Validators.required],
      value: ['', [Validators.required]]
    }));
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('jobPrev', new FormGroup({
      number_of_positions: new FormControl(null, Validators.required),
      must_match: new FormControl(null),
      extra_criteria: new FormArray([]),
      temp_extra_criteria: new FormArray([]),
    }));

  }

  get f() {
    return this.childForm.controls.jobPrev.controls;
  }

  get t() {
    return this.f.temp_extra_criteria as FormArray;
  }

  get tEX() {
    return this.f.extra_criteria as FormArray;
  }

  onAddOrRemoveMustMatch = (event, fieldName) => {
    if (this.mustMacthArray.length == 0) {
      this.mustMacthArray.push({ [fieldName]: event.target.checked })
    } else {
      let index = this.mustMacthArray.findIndex((x, i) => {
        return x[fieldName] === true
      });

      if (index == -1) {
        this.mustMacthArray.push({ [fieldName]: event.target.checked });
      }
      else {
        this.mustMacthArray.splice(index, 1);
      }
    }

    this.childForm.patchValue({
      jobPrev: {
        must_match: this.mustMacthArray,
      }
    });

  }

  onAddExtraCriteria = () => {
    const jobPrev = this.childForm.value.jobPrev.temp_extra_criteria;
    if(jobPrev && Array.isArray(jobPrev) && jobPrev.length > 0) {
      this.tEX.push(this.formBuilder.group({
        title: [jobPrev[0].title],
        value: [jobPrev[0].value]
      }));
      this.onCloseCriteriaModal();
    }
  }

  onGetProfile() {
    this.employerService.profile().subscribe(
      response => {
        this.profileInfo = response;
      }, error => {
      }
    )
  }

  onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name') => {
    if (!Array.isArray(value)) return "--";
    return value.map(s => s[field] + ' (' + s.experience + ' ' + s.quote + ')').toString();
  }

  onConvertArrayToString = (value: any[]) => {
    if (!Array.isArray(value)) return "--";
    return value.join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if (!Array.isArray(value)) return "--";
    return value.map(s => s[field]).toString();
  }

  onGetYesOrNoValue = (value: boolean) => {
    if (value == true) {
      return "Yes";
    } else {
      return "No"
    }

  }

}
