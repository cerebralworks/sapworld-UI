import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';

@Component({
  selector: 'app-setting-layout',
  templateUrl: './setting-layout.component.html',
  styleUrls: ['./setting-layout.component.css']
})
export class SettingLayoutComponent implements OnInit {

	public currentTabInfo: tabInfo = {
		tabName: 'Profile Setting',
		tabNumber: 1
	};

	constructor() { }

	ngOnInit(): void {
	}

	onTabChange = (tabInfo: tabInfo) => {
		this.currentTabInfo = tabInfo;
	}

}
