import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Input, OnInit,ViewChild,ElementRef, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedApiService } from '@shared/service/shared-api.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-create-candidate-skillset',
  templateUrl: './create-candidate-skillset.component.html',
  styleUrls: ['./create-candidate-skillset.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CreateCandidateSkillsetComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	certification = [ ];
	othersSkills = [ ];
	programmingSkills = [ ];
	@Input() currentTabInfo: tabInfo;
	skillArray: any[] = [];
	public childForm;
	public skillItems: any[] = [];
	public skillsItems: any[] = [];
	public commonSkills: any[] = [];
	public programItems: any[] = [];
	public userInfo: any;
	savedUserDetails: any;
	@Input('userDetails')
	set userDetails(inFo: any) {
		this.savedUserDetails = inFo;
	}
	public requestParams: any;	
	public searchCallback = (search: string, item) => true; 
	programCtrl = new FormControl();
	filteredProgram: Observable<any[]>;
	@ViewChild('programInput') programInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;
	
	constructor(
		private parentF: FormGroupDirective,
		public sharedService: SharedService,
		private formBuilder: FormBuilder,
		private dataService: DataService,
		private userSharedService: UserSharedService,
		private SharedAPIService: SharedApiService,
		public utilsHelperService: UtilsHelperService
	) { 
	
		this.filteredProgram = this.programCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => fruit ? this._filter(fruit) : [])
		);
		
	}
	
	/**
	**	To initialize the skillset tab
	**/
	
	ngOnInit(): void {
		this.createForm();
		this.dataService.getSkillDataSource().subscribe(
		  response => {
			if (response && response.items) {
			 for(let i=0;i<response.items.length;i++){
				  response['items'][i]['tags'] =response['items'][i]['tag']+' -- '+response['items'][i]['long_tag'];
			  } 
			  this.skillItems = [...response.items];
			  this.skillsItems = [...response.items];
			  this.commonSkills = [...response.items];
			}
		  },
		  error => {
			this.skillItems = [];
			this.skillsItems = [];
			this.commonSkills = [];
		  }
		)
		this.dataService.getProgramDataSource().subscribe(
		  response => {
			if (response && response.items) {
			 
			  this.programItems = [...response.items];
			}
		  },
		  error => {
			this.programItems = [];
		  }
		)

		this.userSharedService.getUserProfileDetails().subscribe(
		  response => {
			this.userInfo = response;
		  }
		)
	}
	
	/**
	**	To get the selected programming_skills
	**/
	
	selected(event: MatAutocompleteSelectedEvent): void {
		const value = (event.option.value || '').trim();

		if (value) {
			const index = this.programmingSkills.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.programmingSkills.push(value);
			this.childForm.patchValue({
			  skillSet: {
				['programming_skills']: this.programmingSkills,
			  }
			});}
			
		}
		 this.programInput.nativeElement.value = '';
	}
	
	/**
	**	To filter the programming_skills
	**/
	
	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		var prp =  this.programmingSkills;
		var filters = this.programItems.filter(function(a,b){ return !prp.includes(a.name) })

		return filters.filter(fruit => fruit.name.toLowerCase().includes(filterValue));
	}
	
	/**
	**	To filter the programming_skills data
	**/
	
	private _filtersdata(): string[] {
		var prp =  this.programmingSkills;
		return this.programItems.filter(function(a,b){ return !prp.includes(a.name) })
	}
	
	/**
	**	To add the programmingSkills data
	**/
	
	add(event: MatChipInputEvent): void {
		if (!this.matAutocomplete.isOpen) {
			const value = (event.value || '').trim();

			if (value) {
				var values = value.replace(/\b\w/g, l => l.toUpperCase()); 
				const index = this.programmingSkills.indexOf(values);
				if (index >= 0) {
					
				}else{
				this.programmingSkills.push(values);
				this.childForm.patchValue({
				  skillSet: {
					['programming_skills']: this.programmingSkills,
				  }
				});}
				
			}

			// Clear the input value
			event.chipInput!.clear();
		}
	}
	
	/**
	**	To remove the programmingSkills data
	**/
	
	remove(data): void {
		
		const index = this.programmingSkills.indexOf(data);

		if (index >= 0) {
			this.programmingSkills.splice(index, 1);
			this.childForm.patchValue({
			  skillSet: {
				['programming_skills']: this.programmingSkills,
			  }
			});
		}
	}
	
	
	/**
	**	To add the other_skills data
	**/
	
	addOthersSkills(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.othersSkills.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.othersSkills.push(value);
			this.childForm.patchValue({
			  skillSet: {
				['other_skills']: this.othersSkills,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the other_skills data
	**/
	
	removeOthersSkills(data): void {
		
		const index = this.othersSkills.indexOf(data);

		if (index >= 0) {
			this.othersSkills.splice(index, 1);
			this.childForm.patchValue({
			  skillSet: {
				['other_skills']: this.othersSkills,
			  }
			});
		}
	}
	
	/**
	**	To add the certification data
	**/
	
	addCertification(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.certification.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.certification.push(value);
			this.childForm.patchValue({
			  skillSet: {
				['certification']: this.certification,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the certification data
	**/
	
	removeCertification(data): void {
		
		const index = this.certification.indexOf(data);

		if (index >= 0) {
			this.certification.splice(index, 1);
			this.childForm.patchValue({
			  skillSet: {
				['certification']: this.certification,
			  }
			});
		}
	}

	
	/**
	**	To detect the changes in the skillSet form data's
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
	  
		setTimeout(async () => {
			if(this.childForm.controls.skillSet.status =="INVALID"){
			  
		  if (this.childForm && this.savedUserDetails && (this.userInfo && this.userInfo.profile_completed == true)) {
			if (this.savedUserDetails && this.savedUserDetails.hands_on_experience && Array.isArray(this.savedUserDetails.hands_on_experience)) {
			  if ((this.savedUserDetails.hands_on_experience.length == 1) || (this.t && this.t.length) !== (this.savedUserDetails.hands_on_experience && this.savedUserDetails.hands_on_experience.length)) {
				this.t.removeAt(0);
				if(this.savedUserDetails.hands_on_experience.length ==0 && this.childForm.controls.personalDetails.value.entry == false ){
					this.t.push(this.formBuilder.group({
					  skill_id: [null,[Validators.required]],
					  skill_name: [''],
					  experience: ['',[Validators.required]],
					  exp_type: ['years',[Validators.required]]
					}));
				}else{
					this.savedUserDetails.hands_on_experience.map((value, index) => {
					  value.skill_id = (value && value.skill_id )? value.skill_id.toString() : '';
					  this.t.push(this.formBuilder.group({
						  skill_id: [''],
						  skill_name: [''],
						  experience: [''],
						  exp_type: ['years']
						}));
					});
				}
				
			  }
			 
			  if (this.savedUserDetails.hands_on_experience != null) {
				for(let i=0;i<this.savedUserDetails.hands_on_experience.length;i++){
					this.savedUserDetails.hands_on_experience[i]['skill_id']=parseInt(this.savedUserDetails.hands_on_experience[i]['skill_id']);
					var temp_id:any = this.savedUserDetails['hands_on_experience'][i]["skill_id"]
					
					
				}
			  } 
			  this.savedUserDetails.skills = this.utilsHelperService.differenceByPropValArray(this.savedUserDetails.skills, this.savedUserDetails.hands_on_experience, 'skill_id')

			}
			if (this.savedUserDetails.skills != null) {
				 var temp_ids:any = this.savedUserDetails.hands_on_experience;
				for(let i=0;i<this.savedUserDetails.skills.length;i++){
					this.savedUserDetails.skills[i]=parseInt(this.savedUserDetails.skills[i]);
					var temp_id:any = parseInt(this.savedUserDetails.skills[i]);
					var checkData = temp_ids.filter(function(a,b){ return parseInt(a.skill_id)== temp_id }).length;
					if(checkData ==0){
						 this.skillItems = this.skillItems.filter(function(a,b){ return a.id != temp_id })
					}
					
				}
			  }
			if (this.savedUserDetails.hands_on_experience == null) {
			  delete this.savedUserDetails.hands_on_experience;
			}
			if (this.savedUserDetails.programming_skills != null) {
				this.programmingSkills = this.savedUserDetails.programming_skills;
				var prp =  this.programmingSkills;
				//this.filteredProgram = this.programItems.filter(function(a,b){ return !prp.includes(a.name) })
			}
			if (this.savedUserDetails.other_skills != null) {
				this.othersSkills = this.savedUserDetails.other_skills;
			}
			if (this.savedUserDetails.certification != null) {
				this.certification = this.savedUserDetails.certification;
			}
			this.childForm.patchValue({
			  skillSet: {
				...this.savedUserDetails
			  }
			});
			}}else{
				if(this.childForm.controls.personalDetails.value.entry == true){
					if(this.t && this.t.length){
						for(let i=0;i<=this.t.value.length;i++){
							this.t.removeAt(0);
							i=0;
						}
					}
					this.t.push(this.formBuilder.group({
					  skill_id: [''],
					  skill_name: [''],
					  experience: [''],
					  exp_type: ['years']
					}));
				}
			  if (this.childForm.controls.skillSet.value.hands_on_experience != null) {
				if( this.childForm.controls.personalDetails.value.entry == false && ( !this.childForm.controls.skillSet.value.hands_on_experience || !this.childForm.controls.skillSet.value.hands_on_experience.length || this.childForm.controls.skillSet.value.hands_on_experience.length==0 || ( this.childForm.controls.skillSet.value.hands_on_experience[0] && this.childForm.controls.skillSet.value.hands_on_experience[0]['experience'] =='' ) )) {
					if(this.t && this.t.length && ( this.childForm.controls.skillSet.value.hands_on_experience[0] && this.childForm.controls.skillSet.value.hands_on_experience[0]['experience'] =='' )){
						for(let i=0;i<=this.t.value.length;i++){
							this.t.removeAt(0);
							i=0;
						}
					}
					this.t.push(this.formBuilder.group({
					  skill_id: [null,[Validators.required]],
					  skill_name: [''],
					  experience: ['',[Validators.required]],
					  exp_type: ['years',[Validators.required]]
					}));
				}
				for(let i=0;i<this.childForm.controls.skillSet.value.hands_on_experience.length;i++){
					this.childForm.controls.skillSet.value.hands_on_experience[i]['skill_id']=parseInt(this.childForm.controls.skillSet.value.hands_on_experience[i]['skill_id']);
					var temp_id:any = this.childForm.controls.skillSet.value['hands_on_experience'][i]["skill_id"]
					this.skillsItems = this.skillsItems.filter(function(a,b){ return a.id != temp_id })
				}
				
			  } 
			  
			if (this.childForm.controls.skillSet.value.skills != null ) {
				this.childForm.controls.skillSet.value.skills = this.childForm.controls.skillSet.value.skills.filter(function(a,b){ return !Number.isNaN(a) });
			 var temp_ids:any = this.childForm.controls.skillSet.value['hands_on_experience'];
				for(let i=0;i<this.childForm.controls.skillSet.value.skills.length;i++){
					this.childForm.controls.skillSet.value.skills[i]=parseInt(this.childForm.controls.skillSet.value.skills[i]);
					var temp_id:any =parseInt(this.childForm.controls.skillSet.value.skills[i]);
					var checkData = temp_ids.filter(function(a,b){ return parseInt(a.skill_id)== temp_id }).length;
					if(checkData ==0){
						this.skillItems = this.skillItems.filter(function(a,b){ return a.id != temp_id })
					}
				}
			  }
			if (this.childForm.controls.skillSet.value.programming_skills != null) {
				this.programmingSkills = this.childForm.controls.skillSet.value.programming_skills;
				var prp =  this.programmingSkills;
				//this.filteredProgram = this.programItems.filter(function(a,b){ return !prp.includes(a.name) })
			}
			if (this.childForm.controls.skillSet.value.other_skills != null) {
				this.othersSkills = this.childForm.controls.skillSet.value.other_skills;
			}
			if (this.childForm.controls.skillSet.value.certification != null) {
				this.certification = this.childForm.controls.skillSet.value.certification;
			}
			}
		});
	}
	
	/**
	**	To filter the Array dublicates
	**/
	
	indexOfFilter(hasIndex,indexvalue) {
      var tempArray = this.t.value;
	  if(tempArray.filter(function(a,b){ return a.skill_id == hasIndex }).length !=0 ){
		  return false;
	  }else{
		 return true;
	  }
       
	}
	
	/**
	**	To set the skills items
	**/
	
	onSelectSkillEvent = async (skillId, index) => {
		if(skillId) {
		  const skillObj = this.sharedService.onFindSkillsFromSingleID(skillId);
		  const skillName = (skillObj && skillObj.tag) ? skillObj.tag : '';
		  if(skillName)
			  var statusSkill = false;
			if(this.t.value){
				if(this.t.value.length !=null && this.t.value.length !=undefined && this.t.value.length !=0  ){
					var tempLen = this.t.value.filter(function(a,b){ return a.skill_id == skillId});
					if(this.t.value.filter(function(a,b){ return a.skill_id == skillId}).length!=1){
						statusSkill = true;
						this.t.value[index]['skill_id']="";
						(this.childForm.controls.skillSet.controls.hands_on_experience).controls[index].controls['skill_id'].setValue('');
					}

				}
			}
			if(statusSkill ==false){
		  (this.childForm.controls.skillSet.controls.hands_on_experience).controls[index].controls['skill_name'].setValue(skillName);
			this.skillsItems = this.skillsItems.filter(function(a,b){ return a.id != skillId });
			}
		}
	}
	
	/**
	**	To filter the skillItems
	**/
	
	onSelectSkillsEvent = async (skillId) => {
		if(skillId) {
		  this.skillItems = this.skillItems.filter(function(a,b){ return a.id != skillId });
		}
	}
	
	/**
	**	To validate the post-job details
	**/
	
	onRemoveSkillEvent = async (skillId) => {
		if(skillId) {
			var temp = this.commonSkills.filter(function(a,b){ return a.id == skillId });
			this.skillItems.push(temp[0]);
		}
	}
	
	/**
	**	To filter the skillItems and skillsItems
	**/
	
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
	
	/**
	**	To build a new skillSet form
	**/
	
	createForm() {
		this.childForm = this.parentF.form;
		if(this.childForm.value.personalDetails.entry==false){
			this.childForm.addControl('skillSet', new FormGroup({
			  hands_on_experience: new FormArray([this.formBuilder.group({
				skill_id: [null, Validators.required],
				skill_name: [''],
				experience: ['', [Validators.required,]],
				exp_type: ['years', [Validators.required]]
			  })]),
			  skills: new FormControl(null),
			  programming_skills: new FormControl(null, Validators.required),
			  other_skills: new FormControl(null, Validators.required),
			  certification: new FormControl(null),
			  bio: new FormControl('Lorem Ipsum')
			}));
		}else{
			this.childForm.addControl('skillSet', new FormGroup({
			  hands_on_experience: new FormArray([this.formBuilder.group({
				skill_id: [''],
				skill_name: [''],
				experience: [''],
				exp_type: ['years']
			  })]),
			  skills: new FormControl(null),
			  programming_skills: new FormControl(null),
			  other_skills: new FormControl(null),
			  certification: new FormControl(null),
			  bio: new FormControl('Lorem Ipsum')
			}));

		}
	}

	get f() {
		return this.childForm.controls.skillSet.controls;
	}

	get t() {
		return this.f.hands_on_experience as FormArray;
	}
	
	/**
	**	To add the hands_on_experience
	**/
	
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
	
	/**
	**	To remove the hands_on_experience
	**/
	
	onRemove = (index) => {
		var id = this.t.value[index]['skill_id'];
		var temp = this.commonSkills.filter(function(a,b){ return a.id ==id });
		if(temp.length !=0){
			this.skillsItems.push(temp[0]);
		}
		if (index == 0) {
			this.t.reset();
		} else {
			this.t.removeAt(index);
		}
	}
  

}
