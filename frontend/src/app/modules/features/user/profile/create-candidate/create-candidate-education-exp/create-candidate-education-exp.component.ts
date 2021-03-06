import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-create-candidate-education-exp',
  templateUrl: './create-candidate-education-exp.component.html',
  styleUrls: ['./create-candidate-education-exp.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CreateCandidateEducationExpComponent implements OnInit, OnChanges {

  @Input() currentTabInfo: tabInfo;

  public eduArray: any[] = [];
  public childForm;
  public industryItems: any[] = [];
  public educations: any[] = [];
  public educationsSelectedArray: any[] = [];
  educationsSelectedValue: any;
  educationsSelectedIndex: number;
  userInfo: any;
  savedUserDetails: any;
  @Input('userDetails')
  set userDetails(inFo: any) {
    this.savedUserDetails = inFo;
  }

  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private userSharedService: UserSharedService,
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.educations = [
      "high school",
      "bachelors",
      "diploma",
      "masters",
      "doctorate"
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

        }
      }
    )
  }

  ngOnChanges(changes): void {
    setTimeout( async () => {
    if (this.childForm && this.savedUserDetails && (this.userInfo && this.userInfo.profile_completed == true)) {
      if (this.savedUserDetails && this.savedUserDetails.education_qualification && Array.isArray(this.savedUserDetails.education_qualification)) {
        if ((this.savedUserDetails.education_qualification.length == 1) || (this.t && this.t.length) !== (this.savedUserDetails.education_qualification && this.savedUserDetails.education_qualification.length)) {
         this.t.removeAt(0);
          this.savedUserDetails.education_qualification.map((value, index) => {
            this.t.push(this.formBuilder.group({
				degree: [''],
				field_of_study: [null],
				year_of_completion: [null, [Validators.min(4)]]
			  }));
            this.onChangeDegreeValue(value.degree, index);
          });
        }
      }
      if (this.savedUserDetails.education_qualification == null) {
        delete this.savedUserDetails.education_qualification;
      }
	  
	 
      if (this.savedUserDetails.domains_worked != null) {
        for(let i=0;i<this.savedUserDetails.domains_worked.length;i++){
			this.savedUserDetails.domains_worked[i]=parseInt(this.savedUserDetails.domains_worked[i]);
		}
      }
      this.childForm.patchValue({
        educationExp: {
          ...this.savedUserDetails
        }
      })
      
    }
    // if(this.childForm && this.childForm.value.educationExp.education_qualification && Array.isArray(this.childForm.value.educationExp.education_qualification)) {
    // let remp =  this.childForm.value.educationExp.education_qualification.filter((val, index) => {
    //   if((val.degree == null || val.degree == '') && (val.field_of_study == null || val.field_of_study == '') && (val.year_of_completion == null || val.year_of_completion == '')) {
    //     console.log(this.childForm.get('educationExp.education_qualification').controls[index].controls['degree']);
    //     this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators([Validators.required])
    //     this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
    //   }
    //  });
    // }
  });
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('educationExp', new FormGroup({
      employer_role_type: new FormControl(null),
      education_qualification: new FormArray([this.formBuilder.group({
        degree: [''],
        field_of_study: [null],
        year_of_completion: [null, [Validators.min(4)]]
      })]),
      experience: new FormControl('', Validators.required),
      sap_experience: new FormControl('', Validators.required),
      current_employer: new FormControl('', Validators.required),
      current_employer_role: new FormControl('', Validators.required),
      domains_worked: new FormControl('', Validators.required),
      //clients_worked: new FormControl(''),
      end_to_end_implementation: new FormControl(null),
    }));
  }

  get f() {
    return this.childForm.controls.educationExp.controls;
  }

  get t() {
    return this.f.education_qualification as FormArray;
  }

  onChangeDegreeValue = (value, index) => {
    this.educationsSelectedValue = value;
    if (!this.educationsSelectedArray.includes(this.educationsSelectedValue)) {
      this.educationsSelectedArray.push(this.educationsSelectedValue);
    }
    if(value && index > -1) {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }else {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }
  }

  onChangeStudyValue = (value, index) => {
    if(value && index > -1) {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }else {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }
  }

  onChangeCompletionValue = (value, index) => {
    if(value && index > -1) {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators([Validators.required])
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }else {
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['degree'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['field_of_study'].updateValueAndValidity();
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].setValidators(null)
      this.childForm.get('educationExp.education_qualification').controls[index].controls['year_of_completion'].updateValueAndValidity();
    }
  }

  onDuplicate = (index) => {
	  if(this.t.value[index]['field_of_study']== null ||this.t.value[index]['degree']== '' ||this.t.value[index]['year_of_completion']== null  ){
		  
	  }else if (this.t.length < 5) {
      this.t.push(this.formBuilder.group({
        degree: [''],
        field_of_study: [null],
        year_of_completion: [null, [Validators.min(4)]]
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
      this.t.removeAt(0);
      this.t.push(this.formBuilder.group({
        degree: [''],
        field_of_study: [null],
        year_of_completion: [null]
      }));
    } else {
      this.t.removeAt(index);

    }
  }

}
