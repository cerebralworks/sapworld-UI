import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { UserSharedService } from '@data/service/user-shared.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {

  constructor(
    private employerSharedService: EmployerSharedService,
    private userSharedService: UserSharedService
    ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSharedService.clearUserProfileDetails();
    this.employerSharedService.clearEmployerProfileDetails();
  }

}
