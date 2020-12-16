import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { SharedService } from '@shared/service/shared.service';

@Component({
  selector: 'app-create-candidate-skillset',
  templateUrl: './create-candidate-skillset.component.html',
  styleUrls: ['./create-candidate-skillset.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CreateCandidateSkillsetComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  skillArray: any[] = [];
  public childForm;
  public skillItems: any[] = [];
  public userInfo: any;

  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private userSharedService: UserSharedService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.dataService.getSkillDataSource().subscribe(
      response => {
        if(response && response.items) {
          this.skillItems = [...response.items];
        }
      },
      error => {
        this.skillItems = [];
      }
    )

    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
        if(this.userInfo) {
          // this.childForm.patchValue({
          //   skillSet: {
          //     ...this.userInfo
          //   }
          // })
        }
      }
    )
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('skillSet', new FormGroup({
      hands_on_experience: new FormArray([this.formBuilder.group({
        skill_id: [null, Validators.required],
        skill_name: ['dasdasd'],
        experience: ['', [Validators.required, ]],
        exp_type: ['years', [Validators.required]]
      })]),
      skills: new FormControl(null, Validators.required),
      programming_skills: new FormControl(null, Validators.required),
      other_skills: new FormControl(null, Validators.required),
      certification: new FormControl(null),
      bio: new FormControl('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
      // work_authorization: new FormControl(null, Validators.required),
      // visa_sponsorship: new FormControl(false, Validators.required),
      // travel_opportunity: new FormControl("", Validators.required),
      // end_to_end_implementation: new FormControl(null)7742+3292+5600+4200+1000+5000+2000+6000+3000

      //7742+3292+3000+6000+2000+3000+500
      //14466- 5600+5000+2000+4200
    }));
  }

  get f() {
    return this.childForm.controls.skillSet.controls;
  }

  get t() {
    return this.f.hands_on_experience as FormArray;
  }

  onDuplicate = () => {
    this.t.push(this.formBuilder.group({
      skill_id: [null, Validators.required],
      skill_name: ['sdasdasd'],
      experience: ['', [Validators.required, ]],
      exp_type: ['years', [Validators.required]]
    }));
  }

  onRemove = (index) => {
    if(index == 0) {
      this.t.reset();
    }else {
      this.t.removeAt(index);
    }
  }

}
