import { Component, Input, OnInit } from '@angular/core';
import { JobPosting } from '@data/schema/post-job';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-shared-job-profile',
  templateUrl: './shared-job-profile.component.html',
  styleUrls: ['./shared-job-profile.component.css']
})
export class SharedJobProfileComponent implements OnInit {

  @Input() jobInfo: JobPosting

  constructor(
    public sharedService: SharedService,
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
  }

}
