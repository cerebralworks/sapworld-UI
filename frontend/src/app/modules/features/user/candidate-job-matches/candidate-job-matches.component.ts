import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-candidate-job-matches',
  templateUrl: './candidate-job-matches.component.html',
  styleUrls: ['./candidate-job-matches.component.css']
})
export class CandidateJobMatchesComponent implements OnInit {

  public isOpenedJDModal: boolean = false;
  public userInfo: CandidateProfile;
  public jobId: string;

  constructor(
    private route: ActivatedRoute,
    private userSharedService: UserSharedService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
      }
    )
    this.onGetJobById();
  }

  onGetJobById = () => {
    let requestParams: any = {};
    requestParams.id = this.jobId;

    this.userService.getJob(requestParams).subscribe(
      response => {
      }, error => {
      }
    )
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

}
