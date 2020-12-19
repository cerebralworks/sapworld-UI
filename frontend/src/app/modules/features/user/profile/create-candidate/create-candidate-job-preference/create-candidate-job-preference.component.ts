import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
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
  public availabilityArray: { id: number; text: string; }[];
  public travelArray: { id: number; text: string; }[];
  public userInfo: any;
  public savedUserDetails: any;
  public tabInfos: tabInfo[];
  @Input('userDetails')
  set userDetails(inFo: any) {
    this.savedUserDetails = inFo;
  }
  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private userSharedService: UserSharedService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.availabilityArray = [
      { id: 0, text: 'Immediate' },
      { id: 15, text: '15 Days' },
      { id: 30, text: '30 Days' },
      { id: 45, text: '45 Days' },
      { id: 60, text: '60 Days' },
    ];

    this.travelArray = [
      { id: 0, text: 'No' },
      { id: 25, text: '25%' },
      { id: 50, text: '50%' },
      { id: 75, text: '75%' },
      { id: 100, text: '100%' },
    ];

    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
      }
    )
    this.dataService.getTabInfo().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.tabInfos = response;
        }
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(async () => {
      if (this.childForm && this.savedUserDetails && (this.userInfo && this.userInfo.profile_completed == true)) {
        if(this.tabInfos && this.tabInfos.length) {
          let educationExpIndex = this.tabInfos.findIndex(val => val.tabNumber == 2);
          if(educationExpIndex == -1) {
            this.childForm.patchValue({
              educationExp : {
                ...this.savedUserDetails
              },
            });
          }

          let skillSetIndex = this.tabInfos.findIndex(val => val.tabNumber == 3);
          if(skillSetIndex == -1) {
            this.childForm.patchValue({
              skillSet : {
                ...this.savedUserDetails
              },
            });
          }
        }
        this.childForm.patchValue({
          jobPref: {
            ...this.savedUserDetails
          },
        });

      }
    });
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
    this.childForm.addControl('skillSet', new FormGroup({
      hands_on_experience: new FormArray([this.formBuilder.group({
        skill_id: [null, Validators.required],
        skill_name: ['dasdasd'],
        experience: ['', [Validators.required,]],
        exp_type: ['years', [Validators.required]]
      })]),
      skills: new FormControl(null, Validators.required),
      programming_skills: new FormControl(null, Validators.required),
      other_skills: new FormControl(null, Validators.required),
      certification: new FormControl(null),
      bio: new FormControl('Lorem Ipsum'),
    }));
    this.childForm.addControl('educationExp', new FormGroup({
      education_qualification: new FormArray([this.formBuilder.group({
        degree: [''],
        field_of_study: [''],
        year_of_completion: ['']
      })]),
      experience: new FormControl('', Validators.required),
      sap_experience: new FormControl('', Validators.required),
      current_employer: new FormControl('', Validators.required),
      current_employer_role: new FormControl('', Validators.required),
      domains_worked: new FormControl('', Validators.required),
      clients_worked: new FormControl(''),
      end_to_end_implementation: new FormControl(null),
    }));
  }

  get f() {
    return this.childForm.controls.jobPref.controls;
  }

  onSetValue = (event) => {

  }

  onChangeJobType = (value) => {
    if (value == 6 || value == '6') {
      // this.isContractDuration = true;
      // this.childForm.get('jobPref.contract_duration').setValidators([Validators.required]);
      // this.childForm.get('jobPref.contract_duration').updateValueAndValidity();
    } else {
      // this.isContractDuration = false;
      // this.childForm.get('jobPref.contract_duration').setValidators(null);
      // this.childForm.get('jobPref.contract_duration').updateValueAndValidity();
    }
  }

  onChangeFieldValue = (fieldName, value) => {
    this.childForm.patchValue({
      jobPref: {
        [fieldName]: value,
      }
    });
  }

}
