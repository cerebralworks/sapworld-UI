import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/service/shared.service';
import { ValidationService } from '@shared/service/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  @Input() toggleRegisterModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public registerModalSub: Subscription;
  public registerForm: FormGroup;

  @ViewChild("registerModal", { static: false }) registerModal: TemplateRef<any>;
  isLoading: boolean;
  formError: any[] = [];

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    public sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    if (this.toggleRegisterModal) {
      this.mbRef = this.modalService.open(this.registerModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
      const currentRole = this.sharedService.getCurrentRoleFromUrl();
      if(currentRole.roleId == 1) {
        this.registerForm.get('companyName').setValidators([Validators.required]);
        this.registerForm.get('email').setValidators([Validators.required, ValidationService.emailValidator, ValidationService.noFreeEmail]);
        this.registerForm.get('companyName').updateValueAndValidity();
      }else {
        this.registerForm.get('companyName').setValidators(null);
        this.registerForm.get('companyName').updateValueAndValidity();
      }
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
    this.registerModalSub && this.registerModalSub.unsubscribe();
  }

  onClickCloseBtn(status){
    this.onEvent.emit(status);
    if(status == false) {
      this.mbRef.close()
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  register = () => {
    this.isLoading = true;

    if (this.registerForm.valid) {
      const currentRole = this.sharedService.getCurrentRoleFromUrl();
      if(currentRole.roleId == 0) {
        this.registerUser();
      }else if(currentRole.roleId == 1) {
        this.registerEmployer();
      }
    }
  }

  registerUser = () => {
    this.accountService.userSignup(this.onGenerateRes()).subscribe(
      response => {
        this.isLoading = false;
        this.onClickCloseBtn(false)
      }, error => {
        if(error && error.error && error.error.errors)
        this.formError = error.error.errors;
        this.isLoading = false;
      }
    )
  }

  registerEmployer = () => {
    this.accountService.employerSignup(this.onGenerateRes()).subscribe(
      response => {
        this.isLoading = false;
        this.onClickCloseBtn(false)
      }, error => {
        if(error && error.error && error.error.errors)
        this.formError = error.error.errors;
        this.isLoading = false;
      }
    )
  }

  onGenerateRes = () => {
    const userInfo = this.registerForm.value;
    let requestParams: any = {};
    requestParams.first_name = userInfo.firstName;
    requestParams.last_name = userInfo.lastName;
    requestParams.company = userInfo.companyName;
    requestParams.email = userInfo.email ? userInfo.email.toLowerCase() : '';
    requestParams.password = userInfo.password;
    return requestParams;
  }

  private buildForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      companyName: [''],
      isAgreed: [false]
    });
  }

}
