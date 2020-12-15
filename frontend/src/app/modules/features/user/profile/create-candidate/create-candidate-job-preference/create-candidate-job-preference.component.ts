import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { SharedService } from '@shared/service/shared.service';

@Component({
  selector: 'app-create-candidate-job-preference',
  templateUrl: './create-candidate-job-preference.component.html',
  styleUrls: ['./create-candidate-job-preference.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CreateCandidateJobPreferenceComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  public childForm;
public availabilityArray: any[];
public travelArray: any[]
  userInfo: any;
  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private userSharedService: UserSharedService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.availabilityArray = [
      {id: 0, text: 'Immediate'},
      {id: 15, text: '15 Days'},
      {id: 30, text: '30 Days'},
      {id: 45, text: '45 Days'},
      {id: 60, text: '60 Days'},
    ];

    this.travelArray = [
      {id: 0, text: 'No'},
      {id: 25, text: '25%'},
      {id: 50, text: '50%'},
      {id: 75, text: '75%'},
      {id: 100, text: '100%'},
    ];

    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
        if(this.userInfo) {
          // this.childForm.patchValue({
          //   jobPref: {
          //     ...this.userInfo
          //   }
          // })
        }
      }
    )
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('jobPref', new FormGroup({
      job_type: new FormControl('', Validators.required),
      job_role: new FormControl('', Validators.required),
      willing_to_relocate: new FormControl(null, Validators.required),
      preferred_location: new FormControl(null),
      work_authorization: new FormControl(null),
      travel: new FormControl(null, Validators.required),
      availability: new FormControl(null, Validators.required),
      remote_only: new FormControl(false, Validators.required),
    }));
  }

  get f() {
    return this.childForm.controls.jobPref.controls;
  }

  onSetValue = (event) => {

  }

  onChangeJobType = (value) => {
    if(value == 6 || value == '6'){
      // this.isContractDuration = true;
      // this.childForm.get('jobPref.contract_duration').setValidators([Validators.required]);
      // this.childForm.get('jobPref.contract_duration').updateValueAndValidity();
      // console.log(this.childForm);


    }else {
      // this.isContractDuration = false;
      // this.childForm.get('jobPref.contract_duration').setValidators(null);
      // this.childForm.get('jobPref.contract_duration').updateValueAndValidity();
    }
  }

  onChangeFieldValue = (fieldName, value) => {
    console.log('value', value);

    this.childForm.patchValue({
      jobPref: {
        [fieldName]: value,
      }
    });
    console.log(this.childForm);

  }

}
