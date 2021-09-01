import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { ValidationService } from '@shared/service/validation.service';
import { AppComponent } from 'src/app/app.component';
import { SharedApiService } from '@shared/service/shared-api.service';
import { environment as env } from '@env';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
 
  /**
  **	Variable declaration
  **/
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
	private SharedAPIService: SharedApiService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    //this.returnEmployerUrl = this.route.snapshot.queryParams['redirect'] || '/employer/dashboard';
   // this.returnUserUrl = this.route.snapshot.queryParams['redirect'] || '/user/dashboard';
    this.returnEmployerUrl =  '/employer/dashboard';
    this.returnUserUrl =  '/user/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  /**
  **	To submit the user credientails and check the user is exists or not
  ** 	If exists navigate based on the role
  **/
  login() {
    this.isLoading = true;

    let userCredentials = this.loginForm.value;

    if (this.loginForm.valid) {
      userCredentials.username = userCredentials.username.toLowerCase();
      this.accountService.login(userCredentials).subscribe(
        response => {
			sessionStorage.clear();
          this.isLoading = false;
          if (response.isLoggedIn && response.role.includes(0)) {
			  if(response['verified']==true){
				  if(this.route.snapshot.queryParams['redirect']){
					  var temps = this.route.snapshot.queryParams['redirect'].split('/');
					  if(temps[2] =="candidate-job-view"){
						  this.returnUserUrl = this.route.snapshot.queryParams['redirect'];
						  var id_val = temps[temps.length-1].split('&')[0].split('?')[1].split('=')[1];
						  this.router.navigate(['/user/candidate-job-view/details'], {queryParams: {'show': 'appply','id': id_val }});
					  }
				  }else{
					this.router.navigate([this.returnUserUrl]);
				  }
			  }else{
				  this.router.navigate(['/user/create-candidate']);
			  }
            
          }else if (response.isLoggedIn && response.role.includes(1)) {
			  if(response['verified']==true){
				  let requestParams: any = {};
				  this.SharedAPIService.onGetCompanyDetails(requestParams);
				  this.router.navigate([this.returnEmployerUrl]);
			  }else{
				  
				  this.router.navigate(['/employer/create-profile']);
			  }
            
          }else if (response.isLoggedIn && response.role.includes(2)) {
				  window.location.href=`${env.adminUrl}`;
			}
            
        }, error => {
          this.isLoading = false;
        }
      )
    }
  }

  /**
  **	To build the login form
  **/
  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', Validators.required]
    });
  }

  /**
  **	To open the register form popup
  **/
  onToggleRegisterForm = (status) => {
    this.isOpenedRegisterForm = status;
  }

  /**
  **	To open forgot form popup
  **/
  onToggleForgotPassForm = (status) => {
    this.isOpenedForgotPassForm = status;
  }

}
