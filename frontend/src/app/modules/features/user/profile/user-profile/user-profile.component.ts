import { Component, OnInit } from '@angular/core';
import { UserSharedService } from '@data/service/user-shared.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public isOpenedContactInfoModal: boolean = false;
  public isOpenedResumeModal: boolean = false;
  public userInfo: any;
  public userPhotoInfo: any;

  constructor(
    private userSharedService: UserSharedService,
    public utilsHelperService: UtilsHelperService,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
      }
    )
  }

  onToggleContactInfoModal = (status) => {
    this.isOpenedContactInfoModal = status;
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  convertToImage(imageString: string): string {
    return this.utilsHelperService.convertToImageUrl(imageString);
  }

}
