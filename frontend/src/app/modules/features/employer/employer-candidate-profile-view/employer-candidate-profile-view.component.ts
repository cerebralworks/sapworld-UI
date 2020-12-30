import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { UserService } from '@data/service/user.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-employer-candidate-profile-view',
  templateUrl: './employer-candidate-profile-view.component.html',
  styleUrls: ['./employer-candidate-profile-view.component.css']
})
export class EmployerCandidateProfileViewComponent implements OnInit {

  public isOpenedResumeModal: boolean;
  public isOpenedSendMailModal: boolean;
  public userDetails: CandidateProfile;
  public userID: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public utilsHelperService: UtilsHelperService
  ) {
    this.userID = this.route.snapshot.queryParamMap.get('id');
  }

  ngOnInit(): void {
    this.onGetCandidateInfo();
  }

  onGetCandidateInfo() {
    let requestParams: any = {};
    requestParams.id = this.userID;
    this.userService.profileView(requestParams).subscribe(
      response => {
        if(response && response.details) {
          this.userDetails = response.details;
        }
      }, error => {
      }
    )
  }

  onToggleResumeForm = (status) => {
    this.isOpenedResumeModal = status;
  }

  onToggleSendMail = (status) => {
    this.isOpenedSendMailModal = status;
  }

}
