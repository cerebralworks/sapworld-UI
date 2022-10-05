import { Component, OnInit,HostListener } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UserSharedService } from '@data/service/user-shared.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	public isOpenedContactInfoModal: boolean = false;
	public isOpenedResumeModal: boolean = false;
	public isShowUserData: boolean = true;
	public userInfo: any;
	public userPhotoInfo: any;
	public screenWidth: any;
	public userProfileInfo:any;

	constructor(
		private userSharedService: UserSharedService,
		public utilsHelperService: UtilsHelperService,
		public sharedService: SharedService,
		private route: ActivatedRoute,
		private userService?: UserService,
	) { }

	/**
	**	To initialize the page loads
	**/	
	  
	ngOnInit(): void {
	  this.screenWidth = window.innerWidth;	
		if(this.route.snapshot.queryParamMap.get('userid')==null){
				this.userSharedService.getUserProfileDetails().subscribe(
			response => {
				this.userInfo = response;
			}
			)
		}else{
		let requestParams: any = {};
		 requestParams.userid = this.route.snapshot.queryParamMap.get('userid');
		this.userService.profile(requestParams).subscribe(
			response => {
				this.userInfo = response.details;
						}
			)
		}
	}

	/**
	**	To Open the infomation of the contact details
	**/	
	  
	onToggleContactInfoModal = (status) => {
		this.isOpenedContactInfoModal = status;
	}

	/**
	**	To open the resume in popup
	**/	
	  
	onToggleResumeForm = (status) => {
		this.isOpenedResumeModal = status;
	}

	/**
	**	To open the coverletter in popup view
	**/	
	  
	convertToImage(imageString: string): string {
		return this.utilsHelperService.convertToImageUrl(imageString);
	}
	
	
	@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }
  

}
