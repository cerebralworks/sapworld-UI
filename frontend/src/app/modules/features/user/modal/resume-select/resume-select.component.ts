import { Component, EventEmitter, ElementRef,Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder,FormControl,FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { DataService } from '@shared/service/data.service';

@Component({
  selector: 'app-resume-select',
  templateUrl: './resume-select.component.html',
  styleUrls: ['./resume-select.component.css']
})
export class ResumeSelectComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	public userSelectedResume: File;
	public selectedResumeUrl: any;
	public resumeForm: FormGroup;
	public isOpenedResumeModal: boolean;
	public isShowData: boolean = false;
	public isShowValidShow: boolean = false;
	public isShowDatas: boolean = false;
	public isShowUpload: boolean = true;
	@Input() toggleResumeSelectModal: boolean;
	@Input() userAccept: boolean = false;
	@Input() currentJobDetails: JobPosting;
	@Output() onEvent = new EventEmitter<boolean>();

	public mbRef: NgbModalRef;
	public mbRefs: NgbModalRef;
	public mbRefss: NgbModalRef;
	public mbRefsss: NgbModalRef;
	public userInfo: any;
	public nationality: any[]=[];
	public statusArray: any[]=[];

	@ViewChild("resumeSelectModal", { static: false }) resumeSelectModal: TemplateRef<any>;
	@ViewChild("resumeTitleModal", { static: false }) resumeTitleModal: TemplateRef<any>;
	@ViewChild("openSuccessPopup", { static: false }) openSuccessModal: TemplateRef<any>;
	@ViewChild("openWarningPopup", { static: false }) openWarningPopup: TemplateRef<any>;
	@ViewChild('userResume', { static: false }) userResume: ElementRef;
	public resumeSelectForm: FormGroup;
	public jobDetailsForm: FormGroup;
	public resumeSelected: any;

	constructor(
		private formBuilder: FormBuilder,
		private modalService: NgbModal,
		public router: Router,
		private dataService: DataService,
		private userSharedService: UserSharedService,
		private utilsHelperService: UtilsHelperService,
		private toastrService: ToastrService,
		private userService: UserService
	) { }
	
	/**
	**	When the page loads the Function calls
	**/
	
	ngOnInit(): void {
		this.dataService.getCountryDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
					this.nationality = response;
				}
			}
		);
		this.userSharedService.getUserProfileDetails().subscribe(
		response => {
			this.userInfo = response;
			if(this.userInfo){
				var tempNationality = parseInt(this.userInfo['nationality']);
				var tempFilterdata = this.nationality.filter(function(a,b){ return a.id == tempNationality });
				if(tempFilterdata.length==1){
					if(tempFilterdata[0]['nicename'].toLocaleLowerCase() == this.currentJobDetails['job_location']['country'].toLocaleLowerCase()){
						 this.isShowValidShow = true
					}else if(this.userInfo['visa_type'] !=null && this.userInfo['visa_type']['length']&& this.userInfo['visa_type']['length']!=0){
							this.isShowValidShow = true;
					}else if (this.currentJobDetails['visa_sponsorship'] == true){
						this.isShowValidShow = true;
					}
				}
				if(this.isShowValidShow ==true){
					if(this.userInfo && this.userInfo.doc_resume && Array.isArray(this.userInfo.doc_resume)) {
						this.resumeSelected = this.onGetFilteredValue(this.userInfo.doc_resume, 'default');
						if(this.userInfo.doc_resume.length!=0){
							this.isShowData = true;
							this.isShowDatas = true;
							this.isShowUpload = false;
						}
					}
				}
			}
		}
		)
	}

	/**
	**	To filter the resume array data's
	**/
	
	onGetFilteredValue = (array: any[], fields) => {
		if (array && Array.isArray(array) && array.length) {
			return array.find(i => {
				return (i[fields] == 1 || i[fields] == '1')
			});
		}
		return []
	}

	/**
	**	To open the resume in popup view for select
	**/
	
	ngAfterViewInit(): void {
		if (this.toggleResumeSelectModal && this.isShowValidShow == true) {
			this.mbRef = this.modalService.open(this.resumeSelectModal, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
			this.buildForm();
			if(this.isShowData ==true){
				this.isShowData =true;
			}
		}else{
			this.mbRefsss = this.modalService.open(this.openWarningPopup, {
				windowClass: 'modal-holder',
				centered: true,
				backdrop: 'static',
				keyboard: false
			});
		}
	}
	
	/**
	**	To leave the page destroy Function triggers
	**/
	
	ngOnDestroy(): void {
		if(this.isShowValidShow !=true){
			//this.onClickCloseBtn(false);
		}
	}

	/**
	**	To Apply for the new jobs
	**/	

	onApplyJob = () => {
		if (this.resumeSelected && this.resumeSelected.file) {
			let requestParams: any = {};
			requestParams.job_posting = this.currentJobDetails.id;
			requestParams.location_id = this.currentJobDetails['job_location']['id'];
			requestParams.user_resume = this.resumeSelected.file;
			requestParams.others = this.others.value;
			
			if(this.userAccept ==true ){
				//requestParams.status =  8 ;
			}
			this.userService.jobApply(requestParams).subscribe(
				response => {
					//this.onClickCloseBtn(false);
					this.mbRef.close()
					this.onOpenStatusModal();
				}, error => {
					//this.onClickCloseBtn(false);
					this.mbRef.close()
					this.onOpenStatusModal();
				}
			)
		}
	}
	
	/**
	**	To Select the resume in choose Option
	**/
	
	onItemChange = (value) => {
		this.resumeSelected = value;
	}
	
	/**
	**	To Build a apply Form and the select form
	**/
	
	private buildForm(): void {
		this.resumeSelectForm = this.formBuilder.group({
			title: ['', [Validators.required]]
		});
		this.jobDetailsForm = this.formBuilder.group({
			others: new FormArray([this.formBuilder.group({
				id: [null],
				title: [null],
				value: [null]
			})])
		});
		this.resumeForm = this.formBuilder.group({
			title: new FormControl('', [Validators.required])
		});
		this.buildData();
		
	}

	get others() {
		return this.ft.others as FormArray; 
	}
	  
	changeStatus(id,event){
	 
	}
	
	buildData(){
		
	  if (this.currentJobDetails.others != null) {
			for(let i=0;i<=this.jobDetailsForm['controls']['others'].value.length;i++){
				this.others.removeAt(0);
				i=0;
			}			
			this.currentJobDetails.others.map((value, index) => {
				var id = value['id'];
				var title = value['title'];
				var values:any = value['value'];
				if(values == true || values == 'true' ){
					this.others.push(this.formBuilder.group({
						id: [id],
						title: [title],
						value: [null, [Validators.required]]
					}));
				}
			});
			this.statusArray = this.others.value;
		}
	}

	/**
	**	To change the resume controls in f Function
	**/
	
	get f() {
		return this.resumeSelectForm.controls;
	}
	
	/**
	**	To change the resume controls in f Function
	**/
	
	get ft() {
		return this.jobDetailsForm.controls;
	}

	/**
	**	To Close the popup and output the status
	**/
	
	onClickCloseBtn(status) {
		this.onEvent.emit(status);
		if (status == false) {
			if(this.mbRefsss){
				this.mbRefsss.close();			
			}
			if(this.mbRef){
				this.mbRef.close()				
			}
		}
	}

	/**
	**	To Close the popup and output the status
	**/
	
	onClickCloseBtns(status) {
		this.onEvent.emit(false);
		if (status == false) {
			if(this.mbRefsss){
				this.mbRefsss.close();			
			}
			if(this.mbRef){
				this.mbRef.close()				
			}
		}
	}
	
	/**
	**	To Close button status in the popup
	**/
	
	onClickCloseBtnStatus(status) {
		this.onEvent.emit(true);
		this.mbRefss.close();
		if (status == false) {
			this.mbRefss.close();
		}
	}
  
	/**
	**	To navigate the matches View
	**/
	
	navigateMatches(){
		this.onEvent.emit(false);
		this.mbRefss.close();
		this.router.navigate(['/user/dashboard'], {queryParams: {activeTab: 'matches'}})
	}  
	/**
	**	To navigate the profile View
	**/
	
	navigateProfile(){
		this.mbRefsss.close();
		this.router.navigate(['/user/create-candidate']);
	}  
	 
	/**
	**	To close the warning preview
	**/
	
	onClickCloseBtnStatusWarning(){
		this.onEvent.emit(false);
		this.mbRefsss.close();
	}  
	
	/**
	**	To upload the selected files for the resume validation
	**/
	
	handleFileInput(event,data) {
		let files: FileList = event.target.files;
		if (files && files.length > 0) {
			let allowedExtensions = ["doc", "docx", "pdf"];
			let fileExtension = files
			.item(0)
			.name.split(".")
			.pop();
			if (!this.utilsHelperService.isInArray(allowedExtensions, fileExtension)) {
				this.toastrService.error('File format not supported(Allowed Format:doc,pdf,docx)');
				return;
			}
			if (files.item(0).size > 3145728) {
				this.toastrService.error('Size Should be less than or equal to 3 MB');
				return;
			}	  
			this.userSelectedResume = files[0];
			this.onOpenResumeTitleModal();
		}
	}
  
	/**
	**	To Open the resume upload title popup
	**/
	
	onOpenResumeTitleModal = () => {
		this.mbRefs = this.modalService.open(this.resumeTitleModal, {
			windowClass: 'modal-holder',
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
	}
  
	/**
	**	To Open the status view in the popup
	**/
	
	onOpenStatusModal = () => {
		this.mbRefss = this.modalService.open(this.openSuccessModal, {
			windowClass: 'modal-holder',
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
	}
      
	/**
	**	To Get the toogle form select Urls and open the resume model
	**/
	
	onToggleResumeForm = (status, selectedResumeUrl?) => {
		if (selectedResumeUrl) {
			this.selectedResumeUrl = selectedResumeUrl;
		}
		this.isOpenedResumeModal = status;
	}
	
	/**
	**	To save the resume
	**/
	
    onSaveResume = () => {
		if(this.resumeForm.valid) {
			this.onUserResumeUpdate();
		}
	  }
	  
	/**
	**	To get the resumeForm controls get Function
	**/
	
	get fs() {
		return this.resumeForm.controls;
	}
	
	
	/**
	**	To upload the selected files for the resume
	**/
	
	onUserResumeUpdate = () => {
		const formData = new FormData();
		formData.append('doc_resume', this.userSelectedResume, this.userSelectedResume.name);
		formData.append('title', this.resumeForm.value.title);
		this.userService.resumeUpdate(formData).subscribe(
			response => {
				//this.modalService.dismissAll();
				this.onGetUserProfile(true);
				this.mbRefs?.close();
				this.resumeForm.reset();
				//this.userResume.nativeElement.value = null;
			}, error => {
			}
		)
	}
  
	/**
	**	To Get the user profile details
	**/
	
	onGetUserProfile(isRequiredDefault : boolean = false) {
		this.userService.profile().subscribe(
		response => {
			if(response['details']){
				this.userSharedService.saveUserProfileDetails(response['details']);
			}
		}, error => {
			//this.modalService.dismissAll();
		})
	}
	
	/**
	**	To handle the page navigation
	**/
	
	handleChange(event,index){
		if(event.target.value){
			var id = index;
			var value = event.target.value;
			this.others['controls'][id]['controls']['value'].setValue(value);
			this.others['controls'][id]['controls']['value'].updateValueAndValidity();
			
		}else{
			var id = index;
			this.others['controls'][id]['controls']['value'].setValue(null);
			this.others['controls'][id]['controls']['value'].updateValueAndValidity();
		}
		
	}
  
}
