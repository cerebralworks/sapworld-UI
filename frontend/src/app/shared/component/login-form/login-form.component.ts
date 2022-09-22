import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { AccountService } from '@data/service/account.service';
import { ValidationService } from '@shared/service/validation.service';
import { AppComponent } from 'src/app/app.component';
import { SharedApiService } from '@shared/service/shared-api.service';
import { environment as env } from '@env';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '@shared/service/data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  public showError: boolean = false;
  public error: string;
  public isLoading: boolean;
  public loginForm: FormGroup;
  public otpForm: FormGroup;
  public returnEmployerUrl: any;
  public returnUserUrl: any;
	public loggedUserInfo: any;
	public checkrole :any;
	public shareid :any;
	public mbRef: NgbModalRef;
    public openotp:boolean =false;
  @ViewChild("otpModal", { static: false }) otpModal: TemplateRef<any>;
  public userId:any;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toastr: ToastrService,
    private route: ActivatedRoute,
	private dataService: DataService,
    private accountService: AccountService,
	private SharedAPIService: SharedApiService,
	private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildForm1();
    //this.returnEmployerUrl = this.route.snapshot.queryParams['redirect'] || '/employer/dashboard';
   // this.returnUserUrl = this.route.snapshot.queryParams['redirect'] || '/user/dashboard';
    this.returnEmployerUrl =  '/employer/dashboard';
    this.returnUserUrl =  '/user/dashboard';
	this.accountService
      .getLoginCredientials()
      .subscribe(response => {
		this.loggedUserInfo = response;
      });
	  this.shareid=this.route.snapshot.queryParamMap.get('shareid');
	 this.checkrole = this.router.url.includes('user')? 0 : 1;
  }

  get f() {
    return this.loginForm.controls;
  }

  /**
  **	To submit the user credientails and check the user is exists or not
  ** 	If exists navigate based on the role
  **/
  login() {
	if(this.loginForm.invalid === true){
	this.loginForm.markAllAsTouched();
	for (const key of Object.keys(this.loginForm.controls)) {
      if (this.loginForm.controls[key].invalid) {
			const invalidControl: HTMLElement = document.querySelector('[formcontrolname="'+ key +'"]');
			invalidControl.focus();
			break;
		}
	}
	
	}else{
    //this.isLoading = true;
    this.showError = false;

    let userCredentials = this.loginForm.value;
    if (this.loginForm.valid) {
	  userCredentials.roles = this.checkrole;
      userCredentials.username = userCredentials.username.toLowerCase();
      this.accountService.login(userCredentials).subscribe(
        response => {
		  sessionStorage.clear();
          //this.isLoading = false;
          if (response.isLoggedIn && response.role.includes(0)) {
			  if(response['verified']==true){
				  if(this.route.snapshot.queryParams['redirect']){
					  var temps = this.route.snapshot.queryParams['redirect'].split('/');
					  if(temps[2] =="candidate-job-view"){
						  this.returnUserUrl = this.route.snapshot.queryParams['redirect'];
						  var id_val = temps[temps.length-1].split('&')[0].split('?')[1].split('=')[1];
						  this.router.navigate(['/user/candidate-job-view/details'], {queryParams: {'show': 'appply','id': id_val }});
					  }else if(temps[2]==="job-matches" && temps[temps.length-1].split('?').length===2){
						  var id_val = temps[temps.length-1].split('&')[0].split('?')[1].split('=')[1];
					      this.router.navigate(['/user/job-matches/details'], {queryParams: {'id': id_val }});
					  }else if(temps[2]==="create-candidate"){
					    this.router.navigate(['/user/create-candidate']);
					  }else{
						this.router.navigate(['/user/dashboard']);
					  }
				  }else{
					this.router.navigate(['/user/dashboard']);
				  }
			  }else{
			     if(this.shareid==null){
				    this.router.navigate(['/user/create-candidate']);
				  }else{
				  localStorage.setItem('shareid',this.shareid)
				  this.router.navigate(['/user/create-candidate']);
				  }
			  }
            
          }else if (response.isLoggedIn && response.role.includes(1)) {
			  if(response['verified']==true){
				  //let requestParams: any = {};
				  //this.SharedAPIService.onGetCompanyDetails(requestParams);
				  this.router.navigate([this.returnEmployerUrl]);
			  }else{
				  
				  this.router.navigate(['/employer/create-profile']);
			  }
            
          }else if(response.set_password ===true){
		        let reqParams:any ={};
				reqParams.id=response.userId;
				this.userId=response.userId;
		        reqParams.otp=Array(6).fill("0123456789").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
		        this.accountService.sendOtp(reqParams).subscribe(data=>{ 
				})
		        this.openotp=true;
				setTimeout(()=>{
				this.mbRef = this.modalService.open(this.otpModal, {
					windowClass: 'modal-holder',
					centered: true,
					backdrop: 'static',
					size: 'md',
					keyboard: false
				  });
				});
		  }
        }, error => {
			this.toastr.error('Invalid username or password combination.');
          this.isLoading = false;
          this.showError = true;
        }
      )
    }
	}
  }
  
  
	getUserDetailsData(){
		
		var emailData = { 'email' : this.loginForm.value.username ? this.loginForm.value.username.toLowerCase() : '','organization': 'https://api.calendly.com/organizations/'+this.loggedUserInfo['ORGANIZATION_ID'] } ;
		this.accountService.userCalendlyDetailsGet(emailData,this.loggedUserInfo).subscribe(
			response => {
				if(response && response.collection && response.collection.length ){
					var responseCollection =response.collection[0];
					this.dataService.setCalendlyDataSource(responseCollection);
				}
			}, error => {
				console.log(error);
			}
		)
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
  **	To build the login form
  **/
  private buildForm1(): void {
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required,ValidationService.otpValidation]]
    });
  }
  
  /**
	**	Assign the form controls to f
	**/
	
	get o() {
		return this.otpForm.controls;
	}
  
  /**To submit otp**/
  sendotp(){
  var values:any={};
  values.otp=parseInt(this.otpForm.value.otp);
  values.id=this.userId;
     this.accountService.verifyOtp(values).subscribe(data=>{
	    this.mbRef.close();
		this.openotp=false;
	     this.accountService.logout().subscribe(
		  response => {
			localStorage.clear();
			this.router.navigate(['/reset-password'], {queryParams: {'id':data.id,'token':data.token,'verify':true}});
		}); 
		
	})
  
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
