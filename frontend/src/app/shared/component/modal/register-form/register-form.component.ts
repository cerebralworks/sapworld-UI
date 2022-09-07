import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '@shared/service/shared.service';
import { ValidationService } from '@shared/service/validation.service';
import { Subscription } from 'rxjs';
import { LoggedIn } from '@data/schema/account';
declare let gtag: Function;
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  /**
  **	Variable declaration
  **/
  @Input() toggleRegisterModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public registerModalSub: Subscription;
  public registerForm: FormGroup;
  public loggedUserInfo: LoggedIn;
  public loggedUserInfoStatus: boolean=true;

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
	this.accountService
      .isCurrentUser()
      .subscribe(response => {
		  if(this.loggedUserInfoStatus == true ){
			  this.loggedUserInfo = response;
			  this.loggedUserInfoStatus = false;
		  }
        
      });
  }

  /**
  **	To open the popup
  **/
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
        this.registerForm.get('companyName').setValidators([Validators.required,ValidationService.StartingEmptyStringValidator]);
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
	this.registerForm.markAllAsTouched();
	for (const key of Object.keys(this.registerForm.controls)) {
			  if(this.registerForm.controls[key].invalid) {
			  if(key==='password'){ 
			  var pass: HTMLElement = document.getElementById('regpass');
				pass.focus();
				break;
			  
			  }else{
				const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
				invalidControl.focus();
				break;
				}
			 }
		  }
    if (this.registerForm.valid && this.registerForm.value.isAgreed===true) {
	  this.isLoading = true;
      const currentRole = this.sharedService.getCurrentRoleFromUrl();
      if(currentRole.roleId == 0) {
        this.registerUser();
      }else if(currentRole.roleId == 1) {
        this.registerEmployer();
      }
    }
  }

  /**
  **	To register the userSignup
  **/
  registerUser = () => {
    this.accountService.userSignup(this.onGenerateRes()).subscribe(
      response => {
        this.isLoading = false;
        this.onClickCloseBtn(false);
		gtag('event', 'sign_up', { method: 'Direct' });
      }, error => {
        if(error && error.error && error.error.errors)
        this.formError = error.error.errors;
        this.isLoading = false;
      }
    )
  }

  /**
  **	To register the employerSignup
  **/
  registerEmployer = () => {
    this.accountService.employerSignup(this.onGenerateRes()).subscribe(
      response => {
        this.isLoading = false;
		this.onClickCloseBtn(false)
			/* var emailData = { 'email' : this.registerForm.value.email ? this.registerForm.value.email.toLowerCase() : '' } ;
			this.accountService.userSignupInviteUrl(emailData,this.loggedUserInfo).subscribe(
				response => {
					
				}
			) */
      }, error => {
        if(error && error.error && error.error.errors)
        this.formError = error.error.errors;
        this.isLoading = false;
      }
    )
  }

  /**
  **	To get user data as params
  **/
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

  /**
  **	To build the signup form
  **/
  private buildForm(): void {
    this.registerForm = this.formBuilder.group({
      //firstName: ['', Validators.required],
	  firstName: ['', Validators.compose([Validators.required,ValidationService.StartingEmptyStringValidator,Validators.minLength(3)])],
      lastName: ['', [Validators.required,ValidationService.emptyStringValidator]],
	  companyName: [''],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      
      isAgreed: ['',Validators.required]
    });
  }

}
