import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tabInfo } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-requirement-criteria',
  templateUrl: './requirement-criteria.component.html',
  styleUrls: ['./requirement-criteria.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class RequirementCriteriaComponent implements OnInit, OnChanges {

  @Input() currentTabInfo: tabInfo;
  @Input('postedJobsDetails')
  set postedJobsDetails(inFo: JobPosting) {
    this.getPostedJobsDetails = inFo;
  }

  public skillArray: any;
  public childForm;
  public isLoading: boolean;
  public industriesItems: any[] = [];
  public getPostedJobsDetails: JobPosting;
  public jobId: string;

  @ViewChild(NgSelectComponent)
    ngSelect: NgSelectComponent;
    @ViewChild('myselect') myselect;
    optionsSelect:Array<any>;

  constructor(
    private parentF: FormGroupDirective,
    private formBuilder: FormBuilder,
    private employerService: EmployerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.jobId = this.route.snapshot.queryParamMap.get('id');
    // if(this.jobId) {
    //   this.onGetIndustries();
    // }

    this.createForm();
    this.onGetIndustries();
    this.onGetSkill();
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout( async () => {
      if(this.childForm && this.getPostedJobsDetails) {
        this.childForm.patchValue({
          requirement : {
            ...this.getPostedJobsDetails
          }
        });
      }
    });
  }

  onFindSkillsFromID = (arrayValues: Array<any>, returnVal: string = 'string') => {
    if(this.skillArray && this.skillArray.items && Array.isArray(this.skillArray.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
      const temp = this.skillArray.items.filter(r=> {
        return arrayValues.includes(r.id)
      });
      if(returnVal == 'obj') {
        return temp;
      }
      return this.onConvertArrayObjToString(temp, 'tag');
    }
    return '--';
  }

  onFindDomainFromID = (arrayValues: Array<any>, returnVal: string = 'string') => {
    if(this.industriesItems && Array.isArray(this.industriesItems) && Array.isArray(arrayValues) && arrayValues.length > 0) {
      const temp = this.industriesItems.filter(r=> {
        return arrayValues.includes(r.id)
      });
      if(returnVal == 'obj') {
        return temp;
      }
      return this.onConvertArrayObjToString(temp, 'name');
    }
    return '--';
  }

  onFindSkillsFromSingleID = (value: any) => {
    if(value && this.skillArray && this.skillArray.items && Array.isArray(this.skillArray.items)) {
      const temp = this.skillArray.items.find(r=> {
        console.log(value , r.id);

        return value == r.id
      });
      return temp;
    }
    return '--';
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

  onGetIndustries(searchString: string = '') {
    console.log('searchString', searchString);

    this.isLoading = true;
    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.search = searchString;

    this.employerService.getIndustries(requestParams).subscribe(
      response => {
        if(response && response.items) {
          this.industriesItems = [...this.industriesItems, ...response.items];
        }
        if(this.getPostedJobsDetails && this.getPostedJobsDetails.domain) {
          setTimeout(() => {
            this.childForm.patchValue({
              requirement : {
                domain: this.onFindDomainFromID(this.getPostedJobsDetails.domain, 'obj')
              }
            });
          }, 100);
        }

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
        if(this.getPostedJobsDetails && this.getPostedJobsDetails.hands_on_experience && Array.isArray(this.getPostedJobsDetails.hands_on_experience)) {
          const handsOnWith = this.getPostedJobsDetails.hands_on_experience.map((value, index) => {
            value.domain = this.onFindSkillsFromSingleID(value.domain);value.experience = value.experience;
            value.experience_type = value.experience_type;
            return value
          });
          this.setHandOnWithValue(handsOnWith);
        }

      if(this.getPostedJobsDetails && this.getPostedJobsDetails.skills) {
        setTimeout(() => {
          this.childForm.patchValue({
            requirement : {
              skills: this.onFindSkillsFromID(this.getPostedJobsDetails.skills, 'obj')
            }
          });
        }, 100);
      }

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
      this.t.reset();
      // this.setValue()
      // this.childForm.patchValue({
      //   requirement: {
      //     hands_on_experience: {
      //       experience_type: 'year'
      //     }
      //   }
      // });
      // this.childForm.markAsUntouched();
      // this.childForm.markAsPristine();
      // this.childForm.updateValueAndValidity();
    }else {
      this.t.removeAt(index);
    }
  }

  setHandOnWithValue(items: any) {
    this.t.removeAt(0);
    const formArray = new FormArray([]);
    items.forEach((element, index) => {
      this.onDuplicate();
      (this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['domain'].setValue(element.domain);
      (this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['experience'].setValue(element.experience);
      (this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['experience_type'].setValue(element.experience_type);
    });
  }

  onChangeFieldValue = (fieldName, value) => {
    this.childForm.patchValue({
      requirement: {
        fieldName: value,
      }
    });
  }

  onSearchDomain = (searchString: any) => {
    if(searchString.term.length>2){
      this.onGetIndustries(searchString.term)
    }
    else{
      this.industriesItems = [];
    }
  }

  onConvertArrayToString = (value: any[]) => {
    if (!Array.isArray(value)) return "--";
    return value.join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if ((!Array.isArray(value) || value.length==0)) return "--";
    return value.map(s => s[field]).join(", ");
  }

  onGetYesOrNoValue = (value: boolean) => {
    if (value == true) {
      return "Yes";
    } else {
      return "No"
    }
  }

  onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?:string) => {
    if (!Array.isArray(value) || value.length == 0) return "--";
    return value.map(s => {
      let element = this.onFindSkillsFromSingleID(s.domain);
      if(field && (element && element.tag)) {
        return element.tag + ' (' + s.experience + ' ' + s.experience_type + ')'
      }
    }).join(", ");
  }

}
