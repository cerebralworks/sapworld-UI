import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { EmployerService } from '@data/service/employer.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaultAuth = {
  //   email: '',
  //   password: '',
  // };
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  public isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
		private employerService: EmployerService,
		private employerSharedService: EmployerSharedService,
    private accountService: AccountService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
        this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  login() {
    this.hasError = false;
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      let userCredentials = this.loginForm.value;
      userCredentials.username = userCredentials.username.toLowerCase();
      const loginSubscr = this.accountService.login(userCredentials)
      .pipe(first())
      .subscribe(
        response => {
			this.onGetProfileInfo();
          if (response && response.isLoggedIn) {            
            this.router.navigate([this.returnUrl]);
          } else {
            this.hasError = true;
          }
          this.isLoading = false;
        }, error => {
          this.hasError = true;
          this.isLoading = false;
        }
      )
      this.unsubscribe.push(loginSubscr);
    }
  }
	
	
	onGetProfileInfo() {
		let requestParams: any = {};
		this.employerService.getCompanyProfileInfo(requestParams).subscribe(
			(response: any) => {
				this.employerSharedService.saveEmployerProfileDetails(response.details[0]);
			}, error => {
				
			}
		)
	}
	
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
