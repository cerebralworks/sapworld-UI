import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleInfo } from '@data/schema/role';
import { AccountService } from '@data/service/account.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/service/shared.service';
import { ValidationService } from '@shared/service/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  /**
  **	Variable declaration
  **/
  @Input() toggleForgotPassModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();
  public mbRef: NgbModalRef;
  public fpSub: Subscription;
  public isMailSent: boolean = false;
  public errorShow: boolean = false;
  public forgotPasswordForm: FormGroup
  @ViewChild("fpModal", { static: false }) fpModal: TemplateRef<any>;

  public isLoading: boolean;
  public formError: any;
  public currentRole: RoleInfo

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,

  ) { }

  ngOnInit(): void {
    this.currentRole = this.sharedService.getCurrentRoleFromUrl();
    this.buildForm();
  }

  /**
  **	To open the popup for forgotPasswordForm
  **/
  ngAfterViewInit(): void {
    if (this.toggleForgotPassModal) {
      this.mbRef = this.modalService.open(this.fpModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.fpSub && this.fpSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.isMailSent = false;
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

  onMailSuccess = () => {
    this.isMailSent = true;
  }

  /**
  **	To send the e-mail for reset passowrd
  **/
  onGetResetLink = () => {
    this.isLoading = true;

    let requestParams: any = { ...this.forgotPasswordForm.value };

    if (this.forgotPasswordForm.valid) {
      this.accountService.getResetLink(requestParams).subscribe(
        response => {
          this.isLoading = false;
          this.errorShow = false;
          this.onMailSuccess();
        }, error => {
          if(error && error.error && error.error.errors)
          this.formError = error.error.errors;
          this.isLoading = false;
          this.errorShow = true;
        }
      )
    }
  }

  /**
  **	To build a reset form password
  **/
  private buildForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      type: [this.currentRole.roleId]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

}
