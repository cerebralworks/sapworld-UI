import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
    private accountService: AccountService
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
      this.accountService.signup(this.onGenerateRes()).subscribe(
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
  }

  onGenerateRes = () => {
    const userInfo = this.registerForm.value;
    let requestParams: any = {};
    requestParams.first_name = userInfo.firstName;
    requestParams.last_name = userInfo.lastName;
    requestParams.company = userInfo.companyName;
    requestParams.email = userInfo.email;
    requestParams.password = userInfo.password;
    return requestParams;
  }

  private buildForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      companyName: ['', Validators.required],
      isAgreed: [false]
    });
  }

}
