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
  public job_type_error: boolean = false;
  public savedUserDetails: any;
  public tabInfos: tabInfo[];
  @Input('userDetails')
  set userDetails(inFo: any) {
    this.savedUserDetails = inFo;
  }
  public othercountry: any[] = [];
  
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
	
	this.dataService.getCountryDataSource().subscribe(
      response => {
		  console.log(response);
        if (response && Array.isArray(response) && response.length) {
			this.othercountry =  response;
			
        }
      }
    );
	
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(async () => {
		if (this.childForm && this.savedUserDetails) {
			if(this.childForm.value.personalDetails.authorized_country){
				
			if(this.childForm.value.personalDetails.authorized_country.length !=0){
				var id = this.childForm.value.personalDetails.authorized_country;
				this.othercountry= this.othercountry.filter(t=>{return id.includes(t.id)})

			}
		}
		if(this.savedUserDetails.job_type!=null){		  
		if(this.savedUserDetails.job_type.length !=0){
			for(let i=0;i<this.savedUserDetails.job_type.length;i++){
				
				for(let j=0;j<document.getElementsByClassName('btn-fltr').length;j++){
					if(document.getElementsByClassName('btn-fltr').item(j)['id'] == this.savedUserDetails.job_type[i]){
						document.getElementsByClassName('btn-fltr').item(j)['className'] = document.getElementsByClassName('btn-fltr').item(j)['className'] +' btn-fltr-active';
					}
				}
			}
		}else{
			this.childForm.patchValue({ 
				jobPref: { 
					
					job_type: ["1"] 
					
				} 
			})
			document.getElementById("1")['className'] = document.getElementById("1")['className'] +' btn-fltr-active';
			// this.savedUserDetails.job_type =["1"];
		}
	  }else{
		  this.childForm.patchValue({ 
				jobPref: { 
					
					job_type: ["1"] 
					
				} 
			});
			document.getElementById("1")['className'] = document.getElementById("1")['className'] +' btn-fltr-active';
		  //this.savedUserDetails.job_type =["1"];
	  }
		}
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
			if(this.savedUserDetails.preferred_countries!=null){		  
		if(this.savedUserDetails.preferred_countries.length){
			for(let i=0;i<this.savedUserDetails.preferred_countries.length;i++){
				
				for(let j=0;j<document.getElementsByClassName('btn-fltr').length;j++){
					if(document.getElementsByClassName('btn-fltr').item(j)['id'] == this.savedUserDetails.preferred_countries[i]){
						document.getElementsByClassName('btn-fltr').item(j)['className'] = document.getElementsByClassName('btn-fltr').item(j)['className'] +' btn-fltr-active';
					}
				}
			}
		}
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
        this.childForm.patchValue({
          jobPref: {
            visa_sponsered: this.savedUserDetails.visa_sponsered,
            remote_only: this.savedUserDetails.remote_only,
          },
        });

      }
    });
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('jobPref', new FormGroup({
      job_type: new FormControl(null),
      job_role: new FormControl('', Validators.required),
      willing_to_relocate: new FormControl(null, Validators.required),
      preferred_location: new FormControl(null),
      //work_authorization: new FormControl(null),
      travel: new FormControl(null, Validators.required),
      preferred_countries : new FormControl(null, Validators.required),
      availability : new FormControl(''),
      remote_only: new FormControl(false, Validators.required),
      visa_sponsered: new FormControl(false, Validators.required),
    }));
    // this.childForm.addControl('skillSet', new FormGroup({
    //   hands_on_experience: new FormArray([this.formBuilder.group({
    //     skill_id: [null, Validators.required],
    //     skill_name: ['dasdasd'],
    //     experience: ['', [Validators.required,]],
    //     exp_type: ['years', [Validators.required]]
    //   })]),
    //   skills: new FormControl(null, Validators.required),
    //   programming_skills: new FormControl(null, Validators.required),
    //   other_skills: new FormControl(null, Validators.required),
    //   certification: new FormControl(null),
    //   bio: new FormControl('Lorem Ipsum'),
    // }));
    // this.childForm.addControl('educationExp', new FormGroup({
    //   education_qualification: new FormArray([this.formBuilder.group({
    //     degree: [''],
    //     field_of_study: [''],
    //     year_of_completion: ['']
    //   })]),
    //   experience: new FormControl('', Validators.required),
    //   sap_experience: new FormControl('', Validators.required),
    //   current_employer: new FormControl('', Validators.required),
    //   current_employer_role: new FormControl('', Validators.required),
    //   domains_worked: new FormControl('', Validators.required),
    //   clients_worked: new FormControl(''),
    //   end_to_end_implementation: new FormControl(null),
    // }));
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
  countryClick(value,clr){
	  var temp = clr.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		 
		this.childForm.value.jobPref.preferred_countries.pop(clr.toElement.id);
		  clr.toElement.className = clr.toElement.className.replace('btn-fltr-active','');
	  }else{
		  clr.toElement.className = clr.toElement.className+' btn-fltr-active';

		if(this.childForm.value.jobPref.preferred_countries==null){
			value =[clr.toElement.id];
			this.childForm.patchValue({ 
				jobPref: { 
					
					preferred_countries: value 
					
				} 
			})
		}else{
			this.childForm.value.jobPref.preferred_countries.push(clr.toElement.id);
		}
	  }
	  console.log(value);
  }
  jobClick(value,clr){
	  var temp = clr.toElement.className.split(' ');
	  if(temp[temp.length-1]=='btn-fltr-active'){
		 if(this.childForm.value.jobPref.job_type){
				this.childForm.value.jobPref.job_type.pop(clr.toElement.id);
				if(this.childForm.value.jobPref.job_type.length==0){
					this.job_type_error = true;					
				}
		 }else{
			 this.job_type_error = true;
		 }
		  clr.toElement.className = clr.toElement.className.replace('btn-fltr-active','');
	  }else{
		  clr.toElement.className = clr.toElement.className+' btn-fltr-active';

		if(this.childForm.value.jobPref.job_type==null){
			value =[clr.toElement.id];
			this.childForm.patchValue({ 
				jobPref: { 
					
					job_type: value 
					
				} 
			})
			
		}else{
			this.childForm.value.jobPref.job_type.push(clr.toElement.id);
		}
		this.job_type_error = false;
	  }
	  console.log(value);
  }
}
