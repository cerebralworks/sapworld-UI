import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { DataService } from '@shared/service/data.service';

@Component({
  selector: 'app-create-candidate-header',
  templateUrl: './create-candidate-header.component.html',
  styleUrls: ['./create-candidate-header.component.css']
})
export class CreateCandidateHeaderComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Input() createCandidateForm: FormGroup;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
  public tabInfos: any[] = [];
  public tabTempArray: any[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.tabTempArray.push(this.currentTabInfo);
    this.dataService.setTabInfo(this.tabTempArray);
    this.dataService.getTabInfo().subscribe(
      response => {
        if (response && Array.isArray(response) && response.length) {
          this.tabInfos = response;
        }
      }
    )
  }

  onTabChange = (currentTabInfo: tabInfo) => {
    this.currentTabInfo = currentTabInfo;
    this.onTabChangeEvent.emit(currentTabInfo);
    if (this.tabInfos.length == 0) {
      this.tabTempArray.push(currentTabInfo);
    } else {
      let index = this.tabInfos.findIndex(val => val.tabNumber == currentTabInfo.tabNumber);
      if (index == -1) {
        this.tabTempArray.push(currentTabInfo);
      }
    }
    this.dataService.setTabInfo(this.tabTempArray);

    // this.tabInfos.map((val: tabInfo, index) => {
    //   if (currentTabInfo.tabNumber < val.tabNumber) {
    //     if (val.tabNumber == 2) {
    //       this.removeValidators(<FormGroup>this.createCandidateForm.controls['educationExp']);
    //     }
    //     if (val.tabNumber == 3) {
    //       this.removeValidators(<FormGroup>this.createCandidateForm.controls['skillSet']);
    //       this.removeValidators(<FormGroup>this.createCandidateForm.controls['skillSet']);
    //       this.createCandidateForm.controls.skillSet['controls'].hands_on_experience.controls.map((val, index) => {
    //         this.removeValidators(<FormGroup>val);
    //       })
    //     }
    //     if (val.tabNumber == 4) {
    //       this.removeValidators(<FormGroup>this.createCandidateForm.controls['jobPref']);
    //     }
    //   }
    //   if (currentTabInfo.tabNumber > val.tabNumber) {
    //     if (val.tabNumber == 2) {
    //       this.addValidators(<FormGroup>this.createCandidateForm.controls['educationExp']);
    //     }
    //     if (val.tabNumber == 3) {
    //       this.addValidators(<FormGroup>this.createCandidateForm.controls['skillSet']);
    //       this.createCandidateForm.controls.skillSet['controls'].hands_on_experience.controls.map((val, index) => {
    //         this.addValidators(<FormGroup>val);
    //       })
    //     }
    //     if (val.tabNumber == 4) {
    //       this.addValidators(<FormGroup>this.createCandidateForm.controls['jobPref']);
    //     }
    //   }
    // })

    // this.tabInfos.map((val: tabInfo, index) => {
    //   if(val.tabNumber > currentTabInfo.tabNumber) {
    //     if(val.tabNumber == 2) {
    //       this.createCandidateForm.removeControl('educationExp');
    //     }else if(val.tabNumber == 3) {
    //       this.createCandidateForm.removeControl('skillSet');
    //     }else if(val.tabNumber == 4) {
    //       this.createCandidateForm.removeControl('jobPref');
    //     }
    //   }
    // })
  }

  public removeValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }

  public addValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).setValidators(this.validationType[key]);
      form.get(key).updateValueAndValidity();
    }
  }

  validationType = {
    'experience': [Validators.required],
    'sap_experience': [Validators.required],
    'current_employer': [Validators.required],
    'current_employer_role': [Validators.required],
    'domains_worked': [Validators.required],
    'skill_id': [Validators.required],
    'exp_type': [Validators.required],
    'skills': [Validators.required],
    'programming_skills': [Validators.required],
    'other_skills': [Validators.required],
    'job_role': [Validators.required],
    'willing_to_relocate': [Validators.required],
    'travel': [Validators.required],
    'availability': [Validators.required],
    'remote_only': [Validators.required],
    'job_type': [Validators.required],
  }


}
