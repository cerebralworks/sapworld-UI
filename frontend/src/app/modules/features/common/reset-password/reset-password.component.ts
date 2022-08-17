import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { ValidationService } from '@shared/service/validation.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public isLoading: boolean;
  public resetPasswordForm: FormGroup;
  public returnUrl: any;
  formError: any;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/employer/login';
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  private buildForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required, ValidationService.passwordValidator]]
    }, {validator: ValidationService.pwdMatchValidator});
  }



  reset() {
    this.isLoading = true;
    const accountId = this.route.snapshot.queryParamMap.get('id');
    const accountToken = this.route.snapshot.queryParamMap.get('token');

    let requestParams: any = {};
    requestParams.id = accountId;
    requestParams.token = accountToken;

    const userCredentials = {...requestParams , ...this.resetPasswordForm.value};
    if (this.resetPasswordForm.valid) {
      this.accountService.resetPassword(userCredentials).subscribe(
        response => {
		 var returnpath = response.user===0 ?'/auth/user/login':'/auth/employer/login';
          this.isLoading = false;
          //this.router.navigate([this.returnUrl]);
          this.router.navigate([returnpath]);
        }, error => {
          this.isLoading = false;
          if(error && error.error && error.error.errors)
          this.formError = error.error.errors;
        }
      )
    }
  }

}
