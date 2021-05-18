import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

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
  public skillItemsSecondary: any[] = [];
  public skillsItems: any[] = [];
  public commonSkills: any[] = [];
  public userInfo: any;
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
    this.dataService.getSkillDataSource().subscribe(
      response => {
        if (response && response.items) {
          this.skillItems = [...response.items];
          this.skillItemsSecondary = [...response.items];
          this.skillsItems = [...response.items];
          this.commonSkills = [...response.items];
        }
      },
      error => {
        this.skillItems = [];
        this.skillItemsSecondary = [];
        this.skillsItems = [];
        this.commonSkills = [];
      }
    )

    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(async () => {
      if (this.childForm && this.savedUserDetails && (this.userInfo && this.userInfo.profile_completed == true)) {
        if (this.savedUserDetails && this.savedUserDetails.hands_on_experience && Array.isArray(this.savedUserDetails.hands_on_experience)) {
          if ((this.savedUserDetails.hands_on_experience.length == 1) || (this.t && this.t.length) !== (this.savedUserDetails.hands_on_experience && this.savedUserDetails.hands_on_experience.length)) {
            this.t.removeAt(0);
            this.savedUserDetails.hands_on_experience.map((value, index) => {
              value.skill_id = (value && value.skill_id )? value.skill_id.toString() : '';
              this.t.push(this.formBuilder.group({
				  skill_id: [null, Validators.required],
				  skill_name: [''],
				  experience: ['', [Validators.required,]],
				  exp_type: ['years', [Validators.required]]
				}));
            });
			
          }
		  if (this.savedUserDetails.hands_on_experience != null) {
			for(let i=0;i<this.savedUserDetails.hands_on_experience.length;i++){
				this.savedUserDetails.hands_on_experience[i]['skill_id']=parseInt(this.savedUserDetails.hands_on_experience[i]['skill_id']);
				var temp_id = this.savedUserDetails['hands_on_experience'][i]["skill_id"]
				this.skillsItems = this.skillsItems.filter(function(a,b){ return a.id != temp_id })
			}
		  }
          this.savedUserDetails.skills = this.utilsHelperService.differenceByPropValArray(this.savedUserDetails.skills, this.savedUserDetails.hands_on_experience, 'skill_id')

        }
		if (this.savedUserDetails && this.savedUserDetails.hands_on_experience_secondary && Array.isArray(this.savedUserDetails.hands_on_experience_secondary)) {
          if ((this.savedUserDetails.hands_on_experience_secondary.length == 1) || (this.ts && this.ts.length) !== (this.savedUserDetails.hands_on_experience_secondary && this.savedUserDetails.hands_on_experience_secondary.length)) {
            this.ts.removeAt(0);
            this.savedUserDetails.hands_on_experience_secondary.map((value, index) => {
              value.skill_id = (value && value.skill_id )? value.skill_id.toString() : '';
              this.ts.push(this.formBuilder.group({
				  skill_id: [null, Validators.required],
				  skill_name: [''],
				  experience: ['', [Validators.required,]],
				  exp_type: ['years', [Validators.required]]
				}));
            });
			
          }
		  if (this.savedUserDetails.hands_on_experience_secondary != null) {
			for(let i=0;i<this.savedUserDetails.hands_on_experience_secondary.length;i++){
				this.savedUserDetails.hands_on_experience_secondary[i]['skill_id']=parseInt(this.savedUserDetails.hands_on_experience_secondary[i]['skill_id']);
				var temp_id = this.savedUserDetails['hands_on_experience_secondary'][i]["skill_id"]
				this.skillsItems = this.skillsItems.filter(function(a,b){ return a.id != temp_id })
			}
		  }
          this.savedUserDetails.skills = this.utilsHelperService.differenceByPropValArray(this.savedUserDetails.skills, this.savedUserDetails.hands_on_experience_secondary, 'skill_id')

        }
		if (this.savedUserDetails.skills != null) {
			for(let i=0;i<this.savedUserDetails.skills.length;i++){
				this.savedUserDetails.skills[i]=parseInt(this.savedUserDetails.skills[i]);
				var temp_id =this.savedUserDetails.skills[i];
				this.skillItems = this.skillItems.filter(function(a,b){ return a.id != temp_id })
			}
		  }
        if (this.savedUserDetails.hands_on_experience == null) {
          delete this.savedUserDetails.hands_on_experience;
        }
        if (this.savedUserDetails.hands_on_experience_secondary == null) {
          delete this.savedUserDetails.hands_on_experience_secondary;
        }
        this.childForm.patchValue({
          skillSet: {
            ...this.savedUserDetails
          }
        });
      }
    });
  }

  onSelectSkillEvent = async (skillId, index) => {
    if(skillId) {
      const skillObj = this.sharedService.onFindSkillsFromSingleID(skillId);
      const skillName = (skillObj && skillObj.tag) ? skillObj.tag : '';
      if(skillName)
      (this.childForm.controls.skillSet.controls.hands_on_experience).controls[index].controls['skill_name'].setValue(skillName);
		this.skillsItems = this.skillsItems.filter(function(a,b){ return a.id != skillId });
		this.skillItemsSecondary = this.skillItemsSecondary.filter(function(a,b){ return a.id != skillId });
	}
  }

  onSelectSkillsEvent = async (skillId) => {
    if(skillId) {
      this.skillItems = this.skillItems.filter(function(a,b){ return a.id != skillId });
      this.skillItemsSecondary = this.skillItemsSecondary.filter(function(a,b){ return a.id != skillId });
	}
  }

  onRemoveSkillEvent = async (skillId) => {
    if(skillId) {
		var temp = this.commonSkills.filter(function(a,b){ return a.id == skillId });
		this.skillItems.push(temp[0]);
		this.skillItemsSecondary.push(temp[0]);
	}
  }

  onSelectSkillEvents = async (skillId, index) => {
    if(skillId) {
      const skillObj = this.sharedService.onFindSkillsFromSingleID(skillId);
      const skillName = (skillObj && skillObj.tag) ? skillObj.tag : '';
      if(skillName)
      (this.childForm.controls.skillSet.controls.hands_on_experience_secondary).controls[index].controls['skill_name'].setValue(skillName);
		this.skillsItems = this.skillsItems.filter(function(a,b){ return a.id != skillId });
		this.skillItems = this.skillItems.filter(function(a,b){ return a.id != skillId });
	}
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('skillSet', new FormGroup({
      hands_on_experience: new FormArray([this.formBuilder.group({
        skill_id: [null, Validators.required],
        skill_name: [''],
        experience: ['', [Validators.required,]],
        exp_type: ['years', [Validators.required]]
      })]),
      hands_on_experience_secondary: new FormArray([this.formBuilder.group({
        skill_id: [null, Validators.required],
        skill_name: [''],
        experience: ['', [Validators.required,]],
        exp_type: ['years', [Validators.required]]
      })]),
      skills: new FormControl(null, Validators.required),
      programming_skills: new FormControl(null, Validators.required),
      other_skills: new FormControl(null, Validators.required),
      certification: new FormControl(null),
      bio: new FormControl('Lorem Ipsum')
    }));
  }

  get f() {
    return this.childForm.controls.skillSet.controls;
  }

  get t() {
    return this.f.hands_on_experience as FormArray;
  }
  
  onDuplicate = (index) => {
	  if(this.t.value[index]['skill_id']== null ||this.t.value[index]['experience']== '' ){
		  
	  }else{
    this.t.push(this.formBuilder.group({
      skill_id: [null, Validators.required],
      skill_name: [''],
      experience: ['', [Validators.required,]],
      exp_type: ['years', [Validators.required]]
    }));
	  }
  }

  onRemove = (index) => {
	  var id = this.t.value[index]['skill_id'];
	  var temp = this.commonSkills.filter(function(a,b){ return a.id ==id });
	  if(temp.length !=0){
		this.skillsItems.push(temp[0]);
		this.skillItemsSecondary.push(temp[0]);
	  }
    if (index == 0) {
      this.t.reset();
    } else {
      this.t.removeAt(index);
    }
  }
  
  get ts() {
    return this.f.hands_on_experience_secondary as FormArray;
  }

  onDuplicates = (index) => {
	  if(this.ts.value[index]['skill_id']== null ||this.t.value[index]['experience']== '' ){
		  
	  }else{
    this.ts.push(this.formBuilder.group({
      skill_id: [null, Validators.required],
      skill_name: [''],
      experience: ['', [Validators.required,]],
      exp_type: ['years', [Validators.required]]
    }));
	  }
  }

  onRemoves = (index) => {
	  var id = this.ts.value[index]['skill_id'];
	  var temp = this.commonSkills.filter(function(a,b){ return a.id ==id });
	  if(temp.length !=0){
		this.skillsItems.push(temp[0]);
		this.skillItems.push(temp[0]);
	  }
    if (index == 0) {
      this.ts.reset();
    } else {
      this.ts.removeAt(index);
    }
  }

}
