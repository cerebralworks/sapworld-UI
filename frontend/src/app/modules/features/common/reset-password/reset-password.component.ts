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
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: ValidationService.pwdMatchValidator});
  }



  reset() {
    this.isLoading = true;
    const accountId = this.route.snapshot.paramMap.get('id');
    const accountToken = this.route.snapshot.paramMap.get('token');

    let requestParams: any = {};
    requestParams.id = accountId;
    requestParams.token = accountToken;

    const userCredentials = this.resetPasswordForm.value;
    if (this.resetPasswordForm.valid) {
      this.accountService.resetPassword(userCredentials).subscribe(
        response => {
          this.isLoading = false;
          if (response.isLoggedIn) {
            this.router.navigate([this.returnUrl]);
          }
        }, error => {
          this.isLoading = false;
        }
      )
    }
  }

}
