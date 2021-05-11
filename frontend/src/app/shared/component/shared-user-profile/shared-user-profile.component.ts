import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CandidateProfile } from '@data/schema/create-candidate';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { trigger, style, animate, transition, state, group } from '@angular/animations';

@Component({
	selector: 'app-shared-user-profile',
	templateUrl: './shared-user-profile.component.html',
	styleUrls: ['./shared-user-profile.component.css'],
	animations: [
		trigger('slideInOut', [
			state('in', style({ height: '*', opacity: 0 })),
			transition(':leave', [
				style({ height: '*', opacity: 1 }),
				group([
					animate(300, style({ height: 0 })),
					animate('200ms ease-in-out', style({ 'opacity': '0' }))
				])

			]),
			transition(':enter', [
				style({ height: '0', opacity: 0 }),
				group([
					animate(300, style({ height: '*' })),
					animate('400ms ease-in-out', style({ 'opacity': '1' }))
				])

			])
		])
	]
})

export class SharedUserProfileComponent implements OnInit {

	@Input() userInfo: CandidateProfile;
	@Input() fieldsExclude: any;
	public show: boolean = false;

	constructor(public sharedService: SharedService,public utilsHelperService: UtilsHelperService ) { }

	ngOnInit(): void {
	
	}

}
