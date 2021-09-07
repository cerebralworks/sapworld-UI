import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


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
  @Input() role: string;
  public userInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
  ) { }
  
  /**
  **	To initialize the page section
  **/
  ngOnInit(): void {
    this.returnUserUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/login';
    this.returnEmpUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/login';

    this.buildForm();

    this.changePasswordForm.get('userName').disable();
  }
  
  /**
  **	To build a reset form 
  **/
  private buildForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      userName: [''],
      email: [''],
      current_password: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get f() {
    return this.changePasswordForm.controls;
  }
  
  /**
  **	To upload the reset user data
  **/
  change() {
    this.isLoading = true;

    const requestParams = {...this.changePasswordForm.value};
    delete requestParams.confirmPassword
    
  }
  
  /**
  **	To logout the user
  **/
  logout(callBack = () => {}) {
    
  }
}
