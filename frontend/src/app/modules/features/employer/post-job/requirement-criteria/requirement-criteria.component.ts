import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component, Input, OnChanges, OnInit,ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tabInfo } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { DataService } from '@shared/service/data.service';
import { EmployerService } from '@data/service/employer.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-requirement-criteria',
  templateUrl: './requirement-criteria.component.html',
  styleUrls: ['./requirement-criteria.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class RequirementCriteriaComponent implements OnInit, OnChanges {

	/**
	**	Variable Declaration
	**/
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	public sapExpError: boolean = false;
	public totalExpError: boolean = false;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	programming_skills = [ ];
	optinal_skills = [ ];
	
	@Input() currentTabInfo: tabInfo;
	@Input('postedJobsDetails')
	set postedJobsDetails(inFo: JobPosting) {
		this.getPostedJobsDetails = inFo;
	}

	public travelArray: { id: number; text: string; }[];
	public skillItems: any[] = [];
	public skillsItems: any[] = [];
	public commonSkills: any[] = [];
	public authorized_country: any[] = [];
	public childForm;
	public isLoading: boolean;
	public errorShown: boolean = false;
	public industriesItems: any[] = [];
	public educationItems: any[] = [];
	public programItems: any[] = [];
  
	public getPostedJobsDetails: JobPosting;
	public jobId: string;

	@ViewChild(NgSelectComponent)
	ngSelect: NgSelectComponent;
    @ViewChild('myselect') myselect;
    optionsSelect:Array<any>;
	public searchCallback = (search: string, item) => true; 
	programCtrl = new FormControl();
	filteredProgram: Observable<any[]>;
	@ViewChild('programInput') programInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;
	@ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

	constructor(
		private parentF: FormGroupDirective,
		private formBuilder: FormBuilder,
		private employerService: EmployerService,
		private dataService: DataService,
		private route: ActivatedRoute,
		private sharedService: SharedService,
		public utilsHelperService: UtilsHelperService
	) { 
	
		this.filteredProgram = this.programCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => fruit ? this._filter(fruit) : [])
		);
	}
	
	/**
	**	To get the selected autocomplete
	**/
	
	selected(event: MatAutocompleteSelectedEvent): void {
		const value = (event.option.value || '').trim();

		if (value) {
			const index = this.programming_skills.indexOf(value);
			if (index >= 0) {
				
			}else{
				this.programming_skills.pop();
			this.programming_skills.push(value);
			this.childForm.patchValue({
			  requirement: {
				['programming_skills']: this.programming_skills,
			  }
			});}
			
		}
		 this.programInput.nativeElement.value = '';
	}
	
	/**
	**	To add the programming_skills
	**/
	
	add(event: MatChipInputEvent): void {
		if (!this.matAutocomplete.isOpen) {
			const value = (event.value || '').trim();

			if (value) {
				const index = this.programming_skills.indexOf(value);
				if (index >= 0) {
					
				}else{
				this.programming_skills.push(value);
				this.childForm.patchValue({
				  requirement: {
					['programming_skills']: this.programming_skills,
				  }
				});}
				
			}

			// Clear the input value
			event.chipInput!.clear();
		}else{
			const value = (event.value || '').trim();

			if (value) {
				const index = this.programming_skills.indexOf(value);
				if (index >= 0) {
					
				}else{
				this.programming_skills.push(value);
				this.childForm.patchValue({
				  requirement: {
					['programming_skills']: this.programming_skills,
				  }
				});}
				
			}

			event.chipInput!.clear();
		}
	}
	
	/**
	**	To remove the programming_skills
	**/
	
	remove(visa): void {
		
		const index = this.programming_skills.indexOf(visa);

		if (index >= 0) {
			this.programming_skills.splice(index, 1);
			this.childForm.patchValue({
			  requirement: {
				['programming_skills']: this.programming_skills,
			  }
			});
		}
	}
	
	/**
	**	To add the optinal_skills
	**/
	
	addOptional(event: MatChipInputEvent): void {
		
		const value = (event.value || '').trim();

		if (value) {
			const index = this.optinal_skills.indexOf(value);
			if (index >= 0) {
				
			}else{
			this.optinal_skills.push(value);
			this.childForm.patchValue({
			  requirement: {
				['optinal_skills']: this.optinal_skills,
			  }
			});}
			
		}

		// Clear the input value
		event.chipInput!.clear();
	}
	
	/**
	**	To remove the optinal_skills
	**/
	
	removeOptional(employer): void {
		
		const index = this.optinal_skills.indexOf(employer);

		if (index >= 0) {
			this.optinal_skills.splice(index, 1);
			this.childForm.patchValue({
			  requirement: {
				['optinal_skills']: this.optinal_skills,
			  }
			});
		}
	}
	
	/**
	**	When the intial component calls
	** 	Create form
	**/
	
	ngOnInit(): void {
    
		this.jobId = this.route.snapshot.queryParamMap.get('id');
		this.createForm();
		this.onGetIndustries();
		this.onGetSkill();
		this.dataService.getCountryDataSource().subscribe(
		  response => {
			if (response && Array.isArray(response) && response.length) {
			  this.authorized_country = response;
			}
		  }
		);
		this.dataService.getProgramDataSource().subscribe(
		  response => {
			if (response && response.items) {
			 
			  this.programItems = [...response.items];
			}
		  },
		  error => {
			this.programItems = [];
		  }
		);
		this.travelArray = [
		  { id: 0, text: 'No' },
		  { id: 25, text: '25%' },
		  { id: 50, text: '50%' },
		  { id: 75, text: '75%' },
		  { id: 100, text: '100%' },
		];
		this.educationItems = [
			{  text: 'High School' },
			{  text: 'Diploma' },
			{  text: 'Bachelors' },
			{  text: 'Masters' },
			{ text: 'Doctorate' }
		];
	}
	
	
	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		var prp =  this.programming_skills;
		var filters = this.programItems.filter(function(a,b){ return !prp.includes(a.name) })

		return filters.filter(fruit => fruit.name.toLowerCase().includes(filterValue));
	  }
	  
	private _filtersdata(): string[] {
		var prp =  this.programming_skills;
		return this.programItems.filter(function(a,b){ return !prp.includes(a.name) })
	  }
	  
	/**
	**	To detect keyPress event
	**/
	
	keyPress() {
		if(this.childForm.value.requirement.sap_experience && this.childForm.value.requirement.experience ){
			if(this.childForm.value.requirement.sap_experience !="" && this.childForm.value.requirement.experience != ""){
				if(parseFloat(this.childForm.value.requirement.sap_experience)<=this.childForm.value.requirement.experience){
					this.totalExpError = false;
					this.sapExpError = false;
				}else{
					this.totalExpError = true;
					this.sapExpError = true;
				}
			}
		}
		
	}

	/**
	**	Assign the values for the requirementCriteria Form
	** 	
	**/
	
	ngOnChanges(changes: SimpleChanges): void {
		setTimeout( async () => {
			 if(this.childForm && this.getPostedJobsDetails) {
				if (this.childForm.value.requirement.optinal_skills != null) {
					this.optinal_skills = this.childForm.value.requirement.optinal_skills;
				}
				if (this.childForm.value.jobInfo.entry == false && ( !this.childForm.value.requirement.hands_on_experience || !this.childForm.value.requirement.hands_on_experience.length || this.childForm.value.requirement.hands_on_experience==0  || ( this.childForm.value.requirement.hands_on_experience[0] && this.childForm.value.requirement.hands_on_experience[0]['experience'] =='' )) ) {
					if(this.t && this.t.length && ( this.childForm.value.requirement.hands_on_experience[0] && this.childForm.value.requirement.hands_on_experience[0]['experience'] =='' )){
						for(let i=0;i<=this.t.value.length;i++){
							this.t.removeAt(0);
							i=0;
						}
					}
					this.t.push(this.formBuilder.group({
						skill_id: [null, Validators.required],
						skill_name: [''],
						experience: ['', [Validators.required,]],
						exp_type: ['years', [Validators.required]]
					}));
				}
				
				if (this.childForm.value.jobInfo.entry == true) {
					if(this.t && this.t.length){
						for(let i=0;i<=this.t.value.length;i++){
							this.t.removeAt(0);
							i=0;
						}
					}
					this.t.push(this.formBuilder.group({
						skill_id: [null],
						skill_name: [''],
						experience: [''],
						exp_type: ['years']
					}));
				}
				if(this.childForm.value.jobInfo.entry==true){
					this.childForm.patchValue({
						requirement : {
							['sap_experience']:0
						}
					});
				}
				if (this.childForm.value.requirement.programming_skills  != null) {
					this.programming_skills = this.childForm.value.requirement.programming_skills;
				}
				/*if(this.getPostedJobsDetails && this.getPostedJobsDetails.hands_on_experience && Array.isArray(this.getPostedJobsDetails.hands_on_experience)) {
					
					for(let i=0;i<=this.t.value.length;i++){
						this.t.removeAt(0);
						i=0;
					}
					this.getPostedJobsDetails.hands_on_experience.map((value, index) => {
						this.t.push(this.formBuilder.group({
							skill_id: [null, Validators.required],
							skill_name: [''],
							experience: ['', [Validators.required,]],
							exp_type: ['years', [Validators.required]]
						}));
					});
					this.getPostedJobsDetails.skills = this.utilsHelperService.differenceByPropValArray(this.getPostedJobsDetails.skills, this.getPostedJobsDetails.hands_on_experience, 'skill_id')
				}
				if (this.getPostedJobsDetails.skills != null) {
					for(let i=0;i<this.getPostedJobsDetails.skills.length;i++){
						this.getPostedJobsDetails.skills[i]=parseInt(this.getPostedJobsDetails.skills[i]);
						var temp_id =this.getPostedJobsDetails.skills[i];
						this.skillItems = this.skillItems.filter(function(a,b){ return a.id != temp_id })
					}
				}
				if (this.getPostedJobsDetails.domain != null) {
					for(let i=0;i<this.getPostedJobsDetails.domain.length;i++){
						this.getPostedJobsDetails.domain[i]=parseInt(this.getPostedJobsDetails.domain[i]);
					}
				}
				if (this.getPostedJobsDetails.programming_skills != null) {
					this.programming_skills = this.getPostedJobsDetails.programming_skills;
				}
				if (this.getPostedJobsDetails.optinal_skills != null) {
					this.optinal_skills = this.getPostedJobsDetails.optinal_skills;
				}
				this.childForm.patchValue({
					requirement : {
						...this.getPostedJobsDetails
					}
				});*/
			}else{
				if (this.childForm.value.jobInfo.entry ==false &&(!this.childForm.value.requirement.hands_on_experience || !this.childForm.value.requirement.hands_on_experience.length || this.childForm.value.requirement.hands_on_experience==0  || ( this.childForm.value.requirement.hands_on_experience[0] && this.childForm.value.requirement.hands_on_experience[0]['experience'] =='' ) )) {
					if(this.t && this.t.length && ( this.childForm.value.requirement.hands_on_experience[0] && this.childForm.value.requirement.hands_on_experience[0]['experience'] =='' )){
						for(let i=0;i<=this.t.value.length;i++){
							this.t.removeAt(0);
							i=0;
						}
					}
					this.t.push(this.formBuilder.group({
						skill_id: [null, Validators.required],
						skill_name: [''],
						experience: ['', [Validators.required,]],
						exp_type: ['years', [Validators.required]]
					}));
				}
				
				if (this.childForm.value.jobInfo.entry == true) {
					if(this.t && this.t.length){
						for(let i=0;i<=this.t.value.length;i++){
							this.t.removeAt(0);
							i=0;
						}
					}
					this.t.push(this.formBuilder.group({
						skill_id: [null],
						skill_name: [''],
						experience: [''],
						exp_type: ['years']
					}));
				}
				if(this.childForm.value.jobInfo.entry==true){
					this.childForm.patchValue({
						requirement : {
							['sap_experience']:0
						}
					});
				}
				if (this.childForm.value.requirement.programming_skills != null) {
					this.programming_skills = this.childForm.value.requirement.programming_skills;
				}
				if (this.childForm.value.requirement.optinal_skills != null) {
					this.optinal_skills = this.childForm.value.requirement.optinal_skills;
				}
			} 
		});
	}

	/**
	**	Find the Skilsid from string
	** 	
	**/
	
	onFindSkillsFromID = (arrayValues: Array<any>, returnVal: string = 'string') => {
		if(this.skillItems && this.skillItems && Array.isArray(this.skillItems) && Array.isArray(arrayValues) && arrayValues.length > 0) {
			const temp = this.skillItems.filter(r=> {
				return arrayValues.includes(r.id)
			});
			if(returnVal == 'obj') {
				return temp;
			}
			return this.onConvertArrayObjToString(temp, 'tag');
		}
		return '--';
	}

	/**
	**	Find the deomainid from string
	** 	
	**/
	
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

	/**
	**	Find the single skillId from string
	** 	
	**/
	
	onFindSkillsFromSingleID = (value: any) => {
		if(value && this.skillItems && this.skillItems && Array.isArray(this.skillItems)) {
			const temp = this.skillItems.find(r=> {
				return value == r.id
			});
			return temp;
		}
		return '--';
	}

	/**
	**	When the skills selected assign to form
	** 	
	**/
	
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

	/**
	**	While the skills selected assign to form in hands_on_experience
	** 	
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
						(this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['skill_id'].setValue('');
					}

				}
			}
			if(statusSkill ==false){
		  (this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['skill_name'].setValue(skillName);
			this.skillsItems = this.skillsItems.filter(function(a,b){ return a.id != skillId });
			}
		}
	}

	/**
	**	Create a new form arrtibutes
	**/
	
	createForm() {
		
		this.childForm = this.parentF.form;
		if(this.childForm.value.jobInfo.entry==false){
			
			this.childForm.addControl('requirement', new FormGroup({
				experience: new FormControl(null, Validators.required),
				education: new FormControl(null),
				sap_experience: new FormControl(null, Validators.required),
				domain: new FormControl(null, Validators.required),
				hands_on_experience: new FormArray([this.formBuilder.group({
					skill_id: [null, Validators.required],
					skill_name: [''],
					experience: ['', [Validators.required,]],
					exp_type: ['years', [Validators.required]]
				})]),
				new_skills: new FormArray([]),
				skills: new FormControl(null),
				skills_Data: new FormControl(null),
				skills_Datas: new FormControl(null),
				programming_skills:  new FormControl(null),
				optinal_skills: new FormControl(null, Validators.required),
				work_authorization: new FormControl(null),
				visa_sponsorship: new FormControl(false, Validators.required),
				need_reference: new FormControl(false, Validators.required),
				travel_opportunity: new FormControl(null, Validators.required),
				end_to_end_implementation: new FormControl(null,Validators.required)
			}));
		}else{
			
			this.childForm.addControl('requirement', new FormGroup({
				experience: new FormControl(null),
				education: new FormControl(null),
				sap_experience: new FormControl(null),
				domain: new FormControl(null),
				hands_on_experience: new FormArray([this.formBuilder.group({
					skill_id: [''],
					skill_name: [''],
					experience: [''],
					exp_type: ['years']
				})]),
				new_skills: new FormArray([]),
				skills: new FormControl(null),
				skills_Data: new FormControl(null),
				skills_Datas: new FormControl(null),
				programming_skills:  new FormControl(null),
				optinal_skills: new FormControl(null),
				work_authorization: new FormControl(null),
				visa_sponsorship: new FormControl(false, Validators.required),
				need_reference: new FormControl(false, Validators.required),
				travel_opportunity: new FormControl(null, Validators.required),
				end_to_end_implementation: new FormControl(null)
			}));
		}

	}

	/**
	**	Assign the form controls to f
	**/
	
	get f() {
		return this.childForm.controls.requirement.controls;
	}

	/**
	**	Assign the form controls to f to hands_on_experience in t
	**/
	
	get t() {
		return this.f.hands_on_experience as FormArray;
	}

	get newskills() {
		return this.f.new_skills as FormArray;
	}
	 
	
	
	/**
	**	create a new hands_on_experience
	**/
	
	onDuplicateOthers = () => {
		var value = this.childForm.value.requirement.skills_Data.trim();
		var skills_Datas = this.childForm.value.requirement.skills_Datas.trim();
		if(!skills_Datas || skills_Datas==undefined){

		}
		this.errorShown = false;
		if(value !=null && value !=undefined && value !='' && skills_Datas !=null && skills_Datas !=undefined && skills_Datas !=''){
			var Checking = this.commonSkills.filter(function(a,b){ return a.tag.toLowerCase() == value.toLowerCase() }).length;
			var CheckingSkills = this.newskills.value.filter(function(a,b){ return a.tag.toLowerCase() == value.toLowerCase() }).length;
			if(Checking==0 && CheckingSkills ==0 ){
				this.newskills.push(this.formBuilder.group({
					tag: [value, Validators.required],
					status: [1, Validators.required],
					long_tag: [skills_Datas, Validators.required]
				}));
				this.childForm.patchValue({
					requirement : {
						skills_Data :null,
						skills_Datas :null
					}
				});
			}else{
				this.errorShown = true;
			}
		}
		
	}
	
	/**
	**	Remove the hands_on_experience
	**/
	
	onRemoveOthers = (index) => {
		if(index == 0 &&this.newskills.value.length==1) {
			this.newskills.removeAt(index);
		}else {
			this.newskills.removeAt(index);
		}
	}
	
	/**
	**	Get the Industries Data
	**/
	
	onGetIndustries(searchString: string = '') {
		this.isLoading = true;
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.search = searchString;

		this.employerService.getIndustries(requestParams).subscribe(
			response => {
				if(response && response.items) {
					this.industriesItems = [...response.items];
				}
				this.isLoading = false;
			}, error => {
				this.isLoading = false;
			}
		)
	}

	/**
	**	Get the Skills Data
	**/
	
	onGetSkill(searchString: string = "") {
	
		this.isLoading = true;
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.search = searchString;
		this.employerService.getSkill(requestParams).subscribe(
		  response => {
			if(response && response.items) {
				for(let i=0;i<response.items.length;i++){
				  response['items'][i]['tags'] =response['items'][i]['tag']+' -- '+response['items'][i]['long_tag'];
				}
				 if(this.getPostedJobsDetails == undefined){
				    this.skillItems = [...response.items];
			        this.skillsItems = [...response.items];
				 
				 }else{
				 var data = response.items;
				 this.skillItems = data.filter(a=>{
				    return !this.getPostedJobsDetails['skills'].includes(a.id);
				 });
				var pj = this.getPostedJobsDetails['hands_on_skills'].map(Number);
			    this.skillsItems = data.filter(a=>{ 
		            return !pj.includes(a.id)
                }); 
			    }
			  this.commonSkills = [...response.items];
			}
			this.isLoading = false;
		  }, error => {
			this.isLoading = false;
		  }
		)
	}

	/**
	**	create a new hands_on_experience
	**/
	
	onDuplicate = (index) => {
		if(this.t.value[index]['skill_id']== null ||this.t.value[index]['skill_name']== '' || this.t.value[index]['experience']== '' ){
		  
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
	**	Filter the hands_on_experience options
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
	**	Remove the hands_on_experience
	**/
	
	onRemove = (index) => {
		var id = this.t.value[index]['skill_id'];
		var temp = this.commonSkills.filter(function(a,b){ return a.id ==id });
		if(temp.length !=0){
			this.skillsItems.push(temp[0]);
		}
		if(index == 0 &&this.t.value.length==1) {
			this.t.reset();
		}else {
			this.t.removeAt(index);
		}
	}

	/**
	**	Set the hands_on_experience
	**/
	
	setHandOnWithValue(items: any) {
		this.t.removeAt(0);
		items.forEach((element, index) => {
			this.t.push(this.formBuilder.group({
				skill_id: [null, Validators.required],
				skill_name: [''],
				experience: ['', [Validators.required,]],
				exp_type: ['years', [Validators.required]]
			}));
			(this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['skill_id'].setValue(element.skill_id);
			(this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['experience'].setValue(element.experience);
			(this.childForm.controls.requirement.controls.hands_on_experience).controls[index].controls['exp_type'].setValue(element.exp_type);
		});
	}

	/**
	**	To change the fields type value
	**/
	
	onChangeFieldValue = (fieldName, value) => {
		
		this.childForm.patchValue({
			requirement: {
				fieldName: value,
			}
		});
	}

	/**
	**	To Search the domain value
	**/
	
	onSearchDomain = (searchString: any) => {
		if(searchString.length>2){
			this.onGetIndustries(searchString)
		}
	}

	/**
	**	To Search the Skills value
	**/
	
	onSearchSkill = (searchString: any) => {
		if(searchString.length>2){
			this.onGetSkill(searchString)
		}
	}

	/**
	**	To Convert Array to string
	**/
	
	onConvertArrayToString = (value: any[]) => {
		if (!Array.isArray(value)) return "--";
		return value.join(", ");
	}

	/**
	**	To Convert ArrayObject to string
	**/
	
	onConvertArrayObjToString = (value: any[], field: string = 'name') => {
		if ((!Array.isArray(value) || value.length==0)) return "--";
		return value.map(s => s[field]).join(", ");
	}

	/**
	**	To Get the radio button data
	**/
	
	onGetYesOrNoValue = (value: boolean) => {
		if (value == true) {
			return "Yes";
		} else {
			return "No"
		}
	}

	/**
	**	To join the arraystring
	**/
	
	onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?:string) => {
		if (!Array.isArray(value) || value.length == 0) return "--";
		return value.map(s => {
			let element = this.onFindSkillsFromSingleID(s.domain);
			if(field && (element && element.tag)) {
				return element.tag + ' (' + s.experience + ' ' + s.experience_type + ')'
			}
		}).join(", ");
	}
  onRemoveSkillEvent = async (skillId) => {
    if(skillId) {
		var temp = this.commonSkills.filter(function(a,b){ return a.id == skillId });
		this.skillItems.push(temp[0]);
	}
  }

  onSelectSkillsEvent = async (skillId) => {
    if(skillId) {
      this.skillItems = this.skillItems.filter(function(a,b){ return a.id != skillId });
	}
  }
  
  
	/**
	**	To handle match select
	**/
	
	handleChange(event,value){
		if(this.childForm.value.requirement.work_authorization == value){
			this.childForm.controls.requirement['controls']['work_authorization'].setValue(null);
			this.childForm.controls.requirement['controls']['work_authorization'].updateValueAndValidity();
		}else{
			this.childForm.patchValue({
				requirement: {
					'work_authorization': value,
				}
			});
		}
	}
	
}
