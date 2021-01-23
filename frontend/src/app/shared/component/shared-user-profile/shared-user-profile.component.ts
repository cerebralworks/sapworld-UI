import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-shared-user-profile',
  templateUrl: './shared-user-profile.component.html',
  styleUrls: ['./shared-user-profile.component.css']
})
export class SharedUserProfileComponent implements OnInit {

  @Input() userInfo: CandidateProfile;
  @Input() fieldsExclude: any;

  constructor(
    public sharedService: SharedService,
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
  }

}
