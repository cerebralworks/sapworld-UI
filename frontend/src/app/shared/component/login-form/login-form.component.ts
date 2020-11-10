import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [AccountService]
})
export class LoginFormComponent implements OnInit {

  public isOpenedRegisterForm: boolean = false;
  public isOpenedForgotPassForm: boolean = false;
  public error: string;
  public isLoading: boolean;
  public loginForm: FormGroup;
  public returnUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/employer/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.isLoading = true;

    const userCredentials = this.loginForm.value;
    if (this.loginForm.valid) {
      this.accountService.login(userCredentials).subscribe(
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

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onToggleRegisterForm = (status) => {
    this.isOpenedRegisterForm = status;
  }

  onToggleForgotPassForm = (status) => {
    this.isOpenedForgotPassForm = status;
  }

}
