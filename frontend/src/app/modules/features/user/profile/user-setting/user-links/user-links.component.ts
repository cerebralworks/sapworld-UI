import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.css']
})
export class UserLinksComponent implements OnInit {

	public userLinksForm: FormGroup;
	public socialMediaLinks: any[] = [];
	public currentProfileInfo: any;

	constructor(
		private formBuilder: FormBuilder,
		private sharedService: SharedService,
		private utilsHelperService: UtilsHelperService,
		private dataService: DataService,
		private toastrService: ToastrService,
		private userSharedService: UserSharedService,
		private userService: UserService,
	) { }
	
	/**
	**	To initialize the user links page
	**/
	
	ngOnInit(): void {
		this.buildForm();
		this.userSharedService.getUserProfileDetails().subscribe(
		  response => {
			this.currentProfileInfo = response;
			if (this.currentProfileInfo && this.currentProfileInfo.latlng_text) {
			  const splitedString: any[] = this.currentProfileInfo.latlng_text.split(',');
			  if (splitedString && splitedString.length) {
				this.currentProfileInfo.latlng =  {
				  lat: splitedString[0],
				  lng: splitedString[1]
				}
			  }
			}
		  }
		)
	}

	validateOnCompanyProfile = 0;
	ngDoCheck(): void {
		if ((!this.utilsHelperService.isEmptyObj(this.currentProfileInfo) && this.currentProfileInfo.social_media_link && Array.isArray(this.currentProfileInfo.social_media_link)) && this.validateOnCompanyProfile == 0) {
			this.socialMediaLinks = [...this.currentProfileInfo.social_media_link];
			this.userLinksForm.patchValue({
				linkedin: this.onFindMediaLinks('linkedin', this.currentProfileInfo.social_media_link).url,
				github: this.onFindMediaLinks('github', this.currentProfileInfo.social_media_link).url,
				youtube: this.onFindMediaLinks('youtube', this.currentProfileInfo.social_media_link).url,
				blog: this.onFindMediaLinks('blog', this.currentProfileInfo.social_media_link).url,
				portfolio: this.onFindMediaLinks('portfolio', this.currentProfileInfo.social_media_link).url,
				linkedinBoolen: this.onFindMediaLinks('linkedin', this.currentProfileInfo.social_media_link).visibility,
				githubBoolen: this.onFindMediaLinks('github', this.currentProfileInfo.social_media_link).visibility,
				youtubeBoolen: this.onFindMediaLinks('youtube', this.currentProfileInfo.social_media_link).visibility,
				blogBoolen: this.onFindMediaLinks('blog', this.currentProfileInfo.social_media_link).visibility,
				portfolioBoolen: this.onFindMediaLinks('portfolio', this.currentProfileInfo.social_media_link).visibility
			})
			this.validateOnCompanyProfile++
		}
		if (this.userLinksForm.value.linkedin
		  || this.userLinksForm.value.github
		  || this.userLinksForm.value.youtube
		  || this.userLinksForm.value.blog
		  || this.userLinksForm.value.portfolio) {
		  this.socialMediaLinks.map((val) => {
			if (val.media == 'linkedin') {
			  val.url = this.userLinksForm.value.linkedin,
			  val.visibility = this.userLinksForm.value.linkedinBoolen
			}
			if (val.media == 'github') {
			  val.url = this.userLinksForm.value.github,
			  val.visibility = this.userLinksForm.value.githubBoolen
			}
			if (val.media == 'youtube') {
			  val.url = this.userLinksForm.value.youtube,
			  val.visibility = this.userLinksForm.value.youtubeBoolen
			}
			if (val.media == 'blog') {
			  val.url = this.userLinksForm.value.blog,
			  val.visibility = this.userLinksForm.value.blogBoolen
			}
			if (val.media == 'portfolio') {
			  val.url = this.userLinksForm.value.portfolio,
			  val.visibility = this.userLinksForm.value.portfolioBoolen
			}
		  });
		}
	}
	
	/**
	**	To build the user links form
	**/
	
	private buildForm(): void {
		this.userLinksForm = this.formBuilder.group({
		  linkedin: new FormControl(''),
		  github: new FormControl(''),
		  youtube: new FormControl(''),
		  blog: new FormControl(''),
		  portfolio: new FormControl(''),
		  linkedinBoolen: new FormControl(false),
		  githubBoolen: new FormControl(false),
		  youtubeBoolen: new FormControl(false),
		  blogBoolen: new FormControl(false),
		  portfolioBoolen: new FormControl(false),
		});
	}
	
	/**
	**	To validate the post-job details
	**/
	
	onFindMediaLinks = (mediaType: string, array: any[]) => {
		if (mediaType) {
		  const link = array.find((val, index) => {
			return val.media == mediaType;
		  });
		  return link ? link : ''
		}
		return ''
	}

  onSetLinks = (fieldName, status) => {
    if (this.socialMediaLinks.length == 0) {
      this.socialMediaLinks.push(
        {
          "media": fieldName,
          "url": this.userLinksForm.value[fieldName],
          "visibility": status
        }
      )
    } else {
      let findInex = this.socialMediaLinks.findIndex(val => ((val.media == fieldName) && (val.visibility == true)))
      if (findInex > -1) {
        this.socialMediaLinks[findInex].visibility = status;
      } else {
        this.socialMediaLinks.push(
          {
            "media": fieldName,
            "url": this.userLinksForm.value[fieldName],
            "visibility": status
          }
        )
      }
    }
    this.userLinksForm.patchValue({
      social_media_link: this.socialMediaLinks
    })

    this.setLinks();

  }

  setLinks() {
    if(this.currentProfileInfo && !this.utilsHelperService.isEmptyObj(this.currentProfileInfo)) {

      let requestParams = {...this.currentProfileInfo, social_media_link: [...this.socialMediaLinks]};

      this.userService.update(requestParams).subscribe(
        response => {
        }, error => {
          this.toastrService.error('Something went wrong', 'Failed');        }
      )
    }

  }

}
