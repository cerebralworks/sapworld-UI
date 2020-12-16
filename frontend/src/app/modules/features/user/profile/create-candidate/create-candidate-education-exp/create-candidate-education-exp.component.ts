import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';

@Component({
  selector: 'app-create-candidate-education-exp',
  templateUrl: './create-candidate-education-exp.component.html',
  styleUrls: ['./create-candidate-education-exp.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CreateCandidateEducationExpComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;

  public eduArray: any[] = [];
  public childForm;
  public industryItems: any[] = [];
  public educations: any[] = [];
  public educationsSelectedArray: any[] = [];
  educationsSelectedValue: any;
  educationsSelectedIndex: number;
  userInfo: any;

  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private userSharedService: UserSharedService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.educations = [
      "High School",
      "Bachelors",
      "Diploma",
      "Masters",
      "Doctorate"
    ];
    this.dataService.getIndustriesDataSource().subscribe(
      response => {
        if (response && response.items) {
          this.industryItems = [...response.items];
        }
      },
      error => {
        this.industryItems = [];
      }
    )
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
        if(this.userInfo) {
          // this.childForm.patchValue({
          //   educationExp: {
          //     ...this.userInfo
          //   }
          // })
        }
      }
    )
  }

  createForm() {
    this.childForm = this.parentF.form;

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
    return this.childForm.controls.educationExp.controls;
  }

  get t() {
    return this.f.education_qualification as FormArray;
  }

  onChangeDegreeValue = (value) => {
    this.educationsSelectedValue = value;
    if (!this.educationsSelectedArray.includes(this.educationsSelectedValue)) {
      this.educationsSelectedArray.push(this.educationsSelectedValue);
    }
  }

  onDuplicate = () => {
    if (this.t.length < 4) {
      this.t.push(this.formBuilder.group({
        degree: [''],
        field_of_study: [''],
        year_of_completion: ['']
      }));
    }
  }

  onRemove = (index) => {
    let removedValue = this.t.value[index];
    if (removedValue && removedValue.degree) {
      let indexDeg = this.educationsSelectedArray.indexOf(removedValue.degree);
      this.educationsSelectedArray.splice(indexDeg, 1);
    }

    if (index == 0 && this.t.length == 1) {
      this.t.reset();
    } else {
      this.t.removeAt(index);

    }
  }

}
