import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, DoCheck, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { SearchCountryField,  CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-create-admin-profile',
  templateUrl: './create-admin-profile.component.html',
  styleUrls: ['./create-admin-profile.component.css'],
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
export class CreateAdminProfileComponent implements OnInit, DoCheck {
	
	/**	
	**	Variable Declaration
	**/
	
	public editorConfig: AngularEditorConfig =  {
  editable: true,
  spellcheck: true,
  // height: 'auto',
  // minHeight: '200px',
  // maxHeight: 'auto',
  // width: 'auto',
  // minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
 // uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [[
  'insertImage',
    'insertVideo'
  ] 
  ]
};

	public createCompanyForm: FormGroup;
	public defaultProfilePic: string;
	public mbRef: any;
	public profilePicValue: any;
	public profilePicAsEvent: any;
	public previousProfilePic: string;
	public imageChangedEvent: FileList;
	public socialMediaLinks: any[] = [];
	public croppedFile: any;
	@ViewChild('companyImage', { static: false }) companyImage: ElementRef;
	public validateSubscribe: any;
	public employerDetails: any;
	public randomNum: number;
	public companyProfileInfo: any;
	public show: boolean = false;
	public invalidMobile: boolean = false;
	separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
 
	constructor(
		private formBuilder: FormBuilder,
		private modalService: NgbModal,
		private router: Router
	) { }
	
	
	/**
	**	Initially the Component loads
	**/
	
	ngOnInit(): void {
		
	}
	ngDoCheck(): void {
		
	}

}
