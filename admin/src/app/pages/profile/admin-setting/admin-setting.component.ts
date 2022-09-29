import { Component, Input, OnInit, ChangeDetectorRef ,ViewChild,TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@modules/auth/_services/auth.service';

import { EmployerService } from '@data/service/employer.service';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UtilsHelperService } from '@shared/services/utils-helper.service';
import { ValidationService } from '@shared/services/validation.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.css']
})
export class AdminSettingComponent implements OnInit {

 /**
  **	Variable declaration
  **/
  public changePasswordForm: FormGroup;
  public returnUserUrl: any;
  public returnEmpUrl: any;
  public isLoading: boolean = false;
  public userInfo: any;
  public showPassword: boolean;
  public showPasswords: boolean;
  //formError: any[] = [];
  public passwordupdate: boolean = false;
  @ViewChild('logoutpopup', { static: false }) logoutpopup: TemplateRef<any>;
  public mbRef: NgbModalRef;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
		private ref: ChangeDetectorRef,private authService: AuthService,
		private employerService: EmployerService,
    private accountService: AccountService,
    private employerSharedService: EmployerSharedService,
    private utilsHelperService: UtilsHelperService,
	private modelService: NgbModal,
  ) { }
  
  /**
  **	To initialize the page section
  **/
  ngOnInit(): void {
    this.returnUserUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/login';
    this.returnEmpUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/login';

    this.buildForm();

      let requestParams: any = {};
		this.employerService.getCompanyProfileInfo(requestParams).subscribe(
        (response: any) => {
          this.userInfo = response['details'];
          if(this.userInfo && this.userInfo.first_name) {
            const userNames = this.userInfo.first_name + ' ' + this.userInfo.last_name;
            this.changePasswordForm.controls['userNames'].setValue(userNames);
            this.changePasswordForm.controls['email'].setValue(this.userInfo.email);
          }
			this.ref.detectChanges();
			this.changePasswordForm.get('userNames').disable();

        }
      )
  }
  
  /**
  **	To build a reset form 
  **/
  private buildForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      userNames: [''],
      email: [''],
      //current_password: ['',Validators.required],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: ValidationService.pwdMatchValidator});
  }

  get f() {
    return this.changePasswordForm.controls;
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
			this.passwordupdate= true;
		  setTimeout(() => {
					this.mbRef = this.modelService.open(this.logoutpopup, {
						windowClass: 'modal-holder',
						centered: true,
						backdrop: 'static',
						keyboard: false
					});
				},1000);
          this.isLoading = false;
		  this.changePasswordForm.reset({
			  'password': '',
			  'confirmPassword': '',
			});
            /*this.logout(() => {
              this.router.navigate([this.returnEmpUrl]);
            })*/         
        }, error => {
		//this.formError = error.error.errors;
          this.isLoading = false;
          if(error && error.error && error.error.errors) {
            error.error.errors.map((val) => {
              /*if(val.field == 'current_password') {
                val.rules.map((val_temp) => {
                  //this.toastrService.error(this.utilsHelperService.capitalizeWord(val_temp.message), 'Failed');
                })
              }*/
            })
          }else {
           // this.toastrService.error('Something went wrong', 'Failed');
          }

        }
      )
    }
  }
  
  /*close the pop and log out or dashboard navigate
  */
  sessionclose(val){
		this.mbRef.close();
		this.passwordupdate=false;
	  if(val===true){
	  this.logout(() => {
              this.router.navigate([this.returnEmpUrl]);
        })           
	  }else{
		  this.router.navigate(['/dashboard'])
	  }
		
  }
  
  /**
  **	To logout the user
  **/
  logout(callBack = () => {}) {
    this.accountService.logout();
        this.authService.logout();
		localStorage.clear();
  }


}
