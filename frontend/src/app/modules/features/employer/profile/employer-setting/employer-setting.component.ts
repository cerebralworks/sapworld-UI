import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-employer-setting',
  templateUrl: './employer-setting.component.html',
  styleUrls: ['./employer-setting.component.css']
})
export class EmployerSettingComponent implements OnInit {

	constructor(
		
		private router: Router
	) { }

	/**
	**	Initially the Component loads
	**/
	
	ngOnInit(): void {
		
		

	}
	
	
	
}
