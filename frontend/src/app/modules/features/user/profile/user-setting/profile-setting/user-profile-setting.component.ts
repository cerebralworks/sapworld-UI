import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile-setting',
  templateUrl: './user-profile-setting.component.html',
  styleUrls: ['./user-profile-setting.component.css']
})
export class UserProfileSettingComponent implements OnInit {

  @Input() isDashboard: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
