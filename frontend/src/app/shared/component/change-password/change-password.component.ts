import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ValidationService } from '@shared/service/validation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
 
  /**
  **	Variable declaration
  **/
  public changePasswordForm: UntypedFormGroup;
  public returnUserUrl: any;
  public returnEmpUrl: any;
  public isLoading: boolean = false;
  @Input() role: string;
  public userInfo: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private userSharedService: UserSharedService,
    private employerSharedService: EmployerSharedService,
    private toastrService: ToastrService,
    private utilsHelperService: UtilsHelperService
  ) { }
  
  /**
  **	To initialize the page section
  **/
  ngOnInit(): void {
    this.returnUserUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/user/login';
    this.returnEmpUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/employer/login';

    this.buildForm();

    if (this.role == 'employer') {
      this.employerSharedService.getEmployerProfileDetails().subscribe(
        response => {
          this.userInfo = response;
          if(this.userInfo && this.userInfo.first_name) {
            const userName = this.userInfo.first_name + ' ' + this.userInfo.last_name;
            this.changePasswordForm.controls['userName'].setValue(userName);
            this.changePasswordForm.controls['email'].setValue(this.userInfo.email);
          }

        }
      )
    }
    if (this.role == 'user') {
      this.userSharedService.getUserProfileDetails().subscribe(
        response => {
          this.userInfo = response;
          if(this.userInfo && this.userInfo.first_name) {
            const userName = this.userInfo.first_name + ' ' + this.userInfo.last_name;
            this.changePasswordForm.controls['userName'].setValue(userName);
            this.changePasswordForm.controls['email'].setValue(this.userInfo.email);
          }
        }
      )
    }

    this.changePasswordForm.get('userName').disable();
  }
  
  /**
  **	To build a reset form 
  **/
  private buildForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      userName: [''],
      email: [''],
      //current_password: [''],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: ValidationService.pwdMatchValidator});
  }

  get f() {
    return this.changePasswordForm.controls;
  }
  
  /**
  **	To upload the reset user data
  **/
  change() {
	this.changePasswordForm.markAllAsTouched();
	for (const key of Object.keys(this.changePasswordForm.controls)) {
			  if(this.changePasswordForm.controls[key].invalid) {
				const invalidControl: HTMLElement = document.querySelector('[formcontrolname="' + key + '"]');
				invalidControl.focus();
				break;
			 }
		  }
    const requestParams = {...this.changePasswordForm.value};
    delete requestParams.confirmPassword
    if (this.changePasswordForm.valid) {
	this.isLoading = true;
      this.accountService.changePassword(requestParams).subscribe(
        response => {
          this.isLoading = false;
          if (this.role == 'employer') {
            this.logout(() => {
              this.router.navigate([this.returnEmpUrl]);
            })
          }
          if (this.role == 'user') {
            this.logout(() => {
              this.router.navigate([this.returnUserUrl]);
            })
          }
        }, error => {
          this.isLoading = false;
          if(error && error.error && error.error.errors) {
            error.error.errors.map((val) => {
              if(val.field == 'current_password') {
                val.rules.map((val_temp) => {
                  this.toastrService.error(this.utilsHelperService.capitalizeWord(val_temp.message), 'Failed');
                })
              }
            })
          }else {
            this.toastrService.error('Something went wrong', 'Failed');
          }

        }
      )
    }
  }
  
  /**
  **	To logout the user
  **/
  logout(callBack = () => {}) {
    this.accountService.logout().subscribe(
      response => {
        localStorage.clear();
        callBack();
      },
      error => {
      }
    );
  }

}
