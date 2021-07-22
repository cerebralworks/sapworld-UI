import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';

@Component({
  selector: 'app-create-candidate-header',
  templateUrl: './create-candidate-header.component.html',
  styleUrls: ['./create-candidate-header.component.css']
})
export class CreateCandidateHeaderComponent implements OnInit {
	
	/**
	**	variable declaration
	**/
	
  @Input() currentTabInfo: tabInfo;
  @Input() createCandidateForm: FormGroup;
  @Output() onTabChangeEvent: EventEmitter<tabInfo> = new EventEmitter();
  public tabInfos: any[] = [];
  public tabTempArray: any[] = [];
  public userInfo: any;

  constructor(
    private userSharedService: UserSharedService,
    private dataService: DataService
  ) { }
	/**
	**	Initialize section
	**/
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
		this.userSharedService.getUserProfileDetails().subscribe(
		  response => {
			this.userInfo = response;
		  }
		)
	}
	/**
	**	detect the tabInfo change
	**/
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
	}
	
	/**
	**	remove the validation for edit update
	**/
	public removeValidators(form: FormGroup) {
		for (const key in form.controls) {
		  form.get(key).clearValidators();
		  form.get(key).updateValueAndValidity();
		}
	}
	
	/**
	**	Add the validation 
	**/
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
    //'skills': [Validators.required],
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
