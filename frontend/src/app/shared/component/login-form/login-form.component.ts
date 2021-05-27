import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { ValidationService } from '@shared/service/validation.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  public isOpenedRegisterForm: boolean = false;
  public isOpenedForgotPassForm: boolean = false;
  public error: string;
  public isLoading: boolean;
  public loginForm: FormGroup;
  public returnEmployerUrl: any;
  public returnUserUrl: any;


  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.returnEmployerUrl = this.route.snapshot.queryParams['redirect'] || '/employer/dashboard';
    this.returnUserUrl = this.route.snapshot.queryParams['redirect'] || '/user/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.isLoading = true;

    let userCredentials = this.loginForm.value;

    if (this.loginForm.valid) {
      userCredentials.username = userCredentials.username.toLowerCase();
      this.accountService.login(userCredentials).subscribe(
        response => {
          this.isLoading = false;
          if (response.isLoggedIn && response.role.includes(0)) {
			  if(response['verified']==true){
				  this.router.navigate([this.returnUserUrl]);
			  }else{
				  this.router.navigate(['/user/create-candidate']);
			  }
            
          }else if (response.isLoggedIn && response.role.includes(1)) {
            this.router.navigate([this.returnEmployerUrl]);
          }
        }, error => {
          this.isLoading = false;
        }
      )
    }
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, ValidationService.emailValidator]],
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
