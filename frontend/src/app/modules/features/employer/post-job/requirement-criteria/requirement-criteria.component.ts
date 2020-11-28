import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { EmployerService } from '@data/service/employer.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-requirement-criteria',
  templateUrl: './requirement-criteria.component.html',
  styleUrls: ['./requirement-criteria.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class RequirementCriteriaComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;

  public skillArray: any;
  public childForm;

  items = [
    {id: 1, name: 'Python'},
    {id: 2, name: 'Node Js'},
    {id: 3, name: 'Java'},
    {id: 4, name: 'PHP', disabled: true},
    {id: 5, name: 'Django'},
    {id: 6, name: 'Angular'},
    {id: 7, name: 'Vue'},
    {id: 8, name: 'ReactJs'},
  ];
  public isLoading: boolean;
  public industries: any

  @ViewChild(NgSelectComponent)
    ngSelect: NgSelectComponent;
    @ViewChild('myselect') myselect;
    optionsSelect:Array<any>;

  constructor(
    private parentF: FormGroupDirective,
    private formBuilder: FormBuilder,
    private employerService: EmployerService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.onGetIndustries();
    this.onGetSkill();
  }

  onChangeSelectSkillEvent = async (event) => {
    let selectedEle = [];
    await event.forEach(async element => {
      if(element && element.tag) {
        const tag = element.tag.split('-');
        element.tag = tag[0];
        await selectedEle.push(element);
      }
    });
    this.childForm.patchValue({
      requirement: {
        skills: selectedEle,
      }
    });
  }

  onChangeSelectDomainEvent = async (event, index) => {
    if(event && event.tag) {
      const tag = event.tag.split('-');
      event.tag = tag[0];
    }
    // this.childForm.patchValue({
    //   requirement: {
    //     domain: event,
    //   }
    // });
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('requirement', new FormGroup({
      experience: new FormControl(null, Validators.required),
      sap_experience: new FormControl(null, Validators.required),
      domain: new FormControl(null, Validators.required),
      hands_on_experience: new FormArray([this.formBuilder.group({
        domain: [null, Validators.required],
        experience: ['', [Validators.required, ]],
        experience_type: ['year', [Validators.required]]
      })]),
      skills: new FormControl(null, Validators.required),
      programming_skills: new FormControl(null),
      optinal_skills: new FormControl(null),
      certification: new FormControl(null),
      work_authorization: new FormControl(null, Validators.required),
      visa_sponsorship: new FormControl(false, Validators.required),
      travel_opportunity: new FormControl("", Validators.required),
      end_to_end_implementation: new FormControl(null)
    }));

  }

  get f() {
    return this.childForm.controls.requirement.controls;
  }

  get t() {
    return this.f.hands_on_experience as FormArray;
  }

  onGetIndustries() {
    this.isLoading = true;
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getIndustries(requestParams).subscribe(
      response => {
        this.industries = response;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    )
  }

  onGetSkill() {
    this.isLoading = true;
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    this.employerService.getSkill(requestParams).subscribe(
      response => {
        this.skillArray = response;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    )
  }

  onDuplicate = () => {
    this.t.push(this.formBuilder.group({
      domain: [null, Validators.required],
      experience: ['', [Validators.required]],
      experience_type: ['year', [Validators.required]]
    }));
  }

  onRemove = (index) => {
    if(index == 0) {
      this.t.reset()
      // this.childForm.markAsUntouched();
      // this.childForm.markAsPristine();
      // this.childForm.updateValueAndValidity();
    }else {
      this.t.removeAt(index);
    }
  }

  onChangeFieldValue = (fieldName, value) => {
    this.childForm.patchValue({
      requirement: {
        fieldName: value,
      }
    });
  }

}
