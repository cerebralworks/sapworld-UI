import { Component, OnInit,Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { AccountService } from '@data/service/account.service';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import { environment as env } from '@env';

@Component({
  selector: 'app-saved-profile',
  templateUrl: './saved-profile.component.html',
  styleUrls: ['./saved-profile.component.css']
})
export class SavedProfileComponent implements OnInit {
	
	/**
	**	Variable declaration 
	**/
	
	@Input()screenWidth:any;
	public isOpenedResumeModal: boolean = false;
	public isOpenedAddNotesModal: boolean = false;
	public isOpenedNotesViewModal: boolean = false;
	public savedProfile: any[] = [];
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [10, 25,50,100];
	public savedProfileMeta: any;
	public selectedResumeUrl: string;
	public searchField: UntypedFormControl = new UntypedFormControl();
	public employerDetails: any = {};
	public validateSubscribe: number = 0;
	public loggedUserInfo: any;
	public randomNum: number;
	public userInfo: any;
	public userprofilepath: any;
	constructor(
		private employerService: EmployerService,
		public sharedService: SharedService,
		public utilsHelperService: UtilsHelperService,
		private toastrService: ToastrService,
		private employerSharedService: EmployerSharedService,
		private accountService: AccountService
	  ) { }
	
	/**
	**	To triggers the page loads
	**/
	
	ngOnInit(): void {
		this.randomNum = Math.random();
		this.searchField.valueChanges.pipe(
			debounceTime(1000),
			distinctUntilChanged(),
		).subscribe(term => {
			this.page = 1;
			this.savedProfile = [];
			this.onGetSavedProfile(term);
		});
		this.accountService
		.isCurrentUser()
		.subscribe(response => {
			this.loggedUserInfo = response;
		});
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				if (!this.utilsHelperService.isEmptyObj(details) && this.validateSubscribe == 0) {
					this.employerDetails = details;
					this.onGetSavedProfile();
					this.validateSubscribe ++;
				}
			}
		)
	}
	
	/**
	**	To get the saved user details
	**/
	
	onGetSavedProfile = (searchString?: string) => {
   
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.status = 1;
		// requestParams.company = this.employerDetails.company;
		if (searchString) {
			requestParams.search = searchString;
		}
		this.employerService.savedProfiles(requestParams).subscribe(
			response => {
				if (response && response.items) {
					this.savedProfile = [...this.savedProfile, ...response.items];
				}
				this.userprofilepath = `${env.apiUrl}/images/user/`;
				this.savedProfileMeta = { ...response.meta }
				if(response['meta']['total']){
					var TotalValue = response['meta']['total'];
					if(document.getElementById('SavedCount')){
						document.getElementById('SavedCount').innerHTML="("+TotalValue+")";
					}				
				}else{
					if(document.getElementById('SavedCount')){
						document.getElementById('SavedCount').innerHTML="(0)";
					}
				}
				if(this.savedProfileMeta.total){
					this.length = this.savedProfileMeta.total
				}
			}, error => {
			}
		)
	}
	
	/**
	**	To get the saved user details count 
	**/
	
	onSaveProfile = (item, index) => {
		if ((item && item.id)) {
			let requestParams: any = {};
			requestParams.user_id = item.id;
			requestParams.delete = 1;
			this.employerService.saveProfile(requestParams).subscribe(
				response => {
					this.savedProfile.splice(index, 1);
					this.savedProfileMeta.total = this.savedProfileMeta.total-1;
					if(document.getElementById('SavedCount')){
						document.getElementById('SavedCount').innerHTML="("+this.savedProfileMeta.total+")";
					}else{
						if(document.getElementById('SavedCount')){
							document.getElementById('SavedCount').innerHTML="(0)";
						}
					}	
				}, error => {
				}
			)
		} else {
			this.toastrService.error('Something went wrong','', {
		  timeOut: 2500
		})
		}
	}
	
	/**	
	**	To load more user details
	**/
	
	onLoadMoreJob = () => {
		this.page = this.page + 1;
		this.onGetSavedProfile();
	}
	
	/**
	**	To check the resume popup status
	**/
	
	onToggleResumeForm = (status, selectedResumeUrl?: string) => {
		if (selectedResumeUrl) {
			this.selectedResumeUrl = `${env.apiUrl}/documents/resume/${selectedResumeUrl}`;
		}
		this.isOpenedResumeModal = status;
	}
	
	/**
	**	To Chec the add toggle popup status
	**/
	
	onToggleAddNotesModal = (status,data) => {
		this.userInfo = data;
		this.isOpenedAddNotesModal = status;
	}
	
  	/**
	**	To emit the status of the notes
	**/
	
	onToggleAddNotesModalEmit = (status) => {
		if(status ==false){
		  this.savedProfile =[];
		  this.onGetSavedProfile();
		}
		this.isOpenedAddNotesModal = false;
	}
	
	/**
	**	To check t he toogle notes view model
	**/
	
	onToggleNotesViewModal = (status) => {
		this.isOpenedNotesViewModal = status;
	}
	
	/**
	**	To array to string Convert
	**/
	
	chunk = (array: any[], chunkSize) => {
		if (array && Array.isArray(array) && array.length) {
			return [].concat.apply([],
				array.map(function (elem, i) {
					return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
				})
			);
		}
		return [];
	}
	
	/**
	**	To filter the resume array to set the resume data
	**/
	
	onGetFilteredValue(resumeArray: any[]): any {
		if(resumeArray && Array.isArray(resumeArray)) {
		  const filteredValue = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1);
		  if(!this.utilsHelperService.isEmptyObj(filteredValue)) {
			return this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1).file;
		  }
		  const filteredValues = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 0);
		  if(!this.utilsHelperService.isEmptyObj(filteredValues)) {
			return filteredValues.file;
		  }
		}
		return "";
	}
	
	/**
	**	To triggers the when the pagination calls
	**/
	
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.savedProfile =[];
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		this.onGetSavedProfile();
	}
	
	/**
	**	To check the jobtype with the id
	**/
	
	checkJobType(item){
		var data = this.sharedService.onGetJobType(item);
		if(data.length){
			if(data.length!=0){
				return data['join'](', ');
			}
		}
		return data;
	}

}
