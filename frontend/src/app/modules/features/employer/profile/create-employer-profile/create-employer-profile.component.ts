import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, DoCheck, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { textEditorConfig } from '@config/rich-editor';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ValidationService } from '@shared/service/validation.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { callbackify } from 'util';

@Component({
  selector: 'app-create-employer-profile',
  templateUrl: './create-employer-profile.component.html',
  styleUrls: ['./create-employer-profile.component.css'],
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
export class CreateEmployerProfileComponent implements OnInit, DoCheck {

  public editorConfig: AngularEditorConfig = textEditorConfig;
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

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private employerSharedService: EmployerSharedService,
    private employerService: EmployerService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.randomNum = Math.random();

    this.buildForm();

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if (!this.utilsHelperService.isEmptyObj(details)) {
          this.employerDetails = details;
          console.log(this.employerDetails);

          this.createCompanyForm.patchValue({
            email_id: this.employerDetails.email,
            name: this.employerDetails.company,
            firstName: this.employerDetails.first_name,
            lastName: this.employerDetails.last_name,
          })
          this.createCompanyForm.get('email_id').disable();
          this.createCompanyForm.get('firstName').disable();
          this.createCompanyForm.get('lastName').disable();
        }
      }
    )

    this.onGetProfileInfo();

  }

  onGetProfileInfo() {
    let requestParams: any = {};
    this.employerService.getCompanyProfileInfo(requestParams).subscribe(
      (response: any) => {
        this.companyProfileInfo = { ...response.details };
        if (!this.utilsHelperService.isEmptyObj(this.companyProfileInfo)) {
          this.createCompanyForm.patchValue({
            ...this.companyProfileInfo
          })
          this.createCompanyForm.get('email_id').disable();

          let latlngText: string = this.companyProfileInfo.latlng_text;
          if (latlngText) {
            const splitedString: any[] = latlngText.split(',');
            if (splitedString && splitedString.length) {
              this.createCompanyForm.patchValue({
                latlng: {
                  lat: splitedString[0],
                  lng: splitedString[1]
                }
              })
            }
          }
        }
      }, error => {
        this.companyProfileInfo = {};
      }
    )
  }

  onUserPhotoUpdate = (callback = () => { }) => {
    const formData = new FormData();
    formData.append('photo', this.croppedFile, ((this.croppedFile.name) ? this.croppedFile.name : ''));
    this.employerService.photoUpdate(formData).subscribe(
      response => {
        callback();
      }, error => {
      }
    )
  }

  onSaveComapnyInfo = () => {
    if (this.createCompanyForm.valid) {
      let requestParams: any = { ...this.createCompanyForm.value };
      requestParams.email_id = this.employerDetails.email;
      if (this.createCompanyForm.value && this.createCompanyForm.value.contact && !Array.isArray(this.createCompanyForm.value.contact)) {
        requestParams.contact = [this.createCompanyForm.value.contact];
      } else {
        requestParams.contact = this.createCompanyForm.value.contact
      }

      if(requestParams && requestParams.website) {
        const re = /http/gi;
        if (requestParams.website.search(re) === -1 ) {
          requestParams.website = `http://${requestParams.website}`
        }
      }


      this.employerService.updateCompanyProfile(requestParams).subscribe(
        response => {
          if (this.croppedFile) {
            this.onUserPhotoUpdate(() => {
              this.router.navigate(['/employer/profile'])
            });
          } else {
            this.router.navigate(['/employer/profile'])
          }

        }, error => {
          this.toastrService.error('Something went wrong', 'Failed')
        }
      )
    }
  }

  private buildForm(): void {
    this.createCompanyForm = this.formBuilder.group({
      email_id: ['', [Validators.required, ValidationService.emailValidator]],
      name: ['', Validators.required],
      city: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      state: ['', Validators.required],
      address: [''],
      country: ['', Validators.required],
      zipcode: [null],
      description: ['', Validators.compose([Validators.required, Validators.minLength(100)])],
      website: ['', Validators.compose([Validators.required, ValidationService.urlValidator])],
      contact: [null],
      latlng: [null, Validators.required],
      social_media_link: [null],
      linkedin: new FormControl(''),
      github: new FormControl(''),
      youtube: new FormControl(''),
      blog: new FormControl(''),
      portfolio: new FormControl(''),
      linkedinBoolen: new FormControl(false),
      githubBoolen: new FormControl(false),
      youtubeBoolen: new FormControl(false),
      blogBoolen: new FormControl(false),
      portfolioBoolen: new FormControl(false),
    });
  }

  get f() {
    return this.createCompanyForm.controls;
  }

  handleAddressChange = (event) => {
    const address = this.sharedService.fromGooglePlace(event);
    this.createCompanyForm.patchValue({
      city: address.city ? address.city : event.formatted_address,
      state: address.state,
      country: address.country,
      latlng: {
        "lat": event.geometry.location.lat(),
        "lng": event.geometry.location.lng()
      }
    });
  };

  convertToImage(imageString: string): string {
    return this.utilsHelperService.convertToImageUrl(imageString);
  }

  handleFileInput(event, CropImagePopUp) {
    let files: FileList = event.target.files;
    if (files && files.length > 0) {
      let fileToUpload = files.item(0);
      let allowedExtensions = ["jpg", "jpeg", "png", "JPG", "JPEG"];

      let fileExtension = files
        .item(0)
        .name.split(".")
        .pop();
      if (!this.utilsHelperService.isInArray(allowedExtensions, fileExtension)) {
        this.toastrService.error('File format not supported(Allowed Format:jpg,jpeg,png)');
        return;
      }
      if (files.item(0).size > 3145728) {
        this.toastrService.error('Size Should be less than or equal to 3 MB');
        return;
      }
      this.open(CropImagePopUp);
      this.imageChangedEvent = event;
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(fileToUpload);
    }

  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    this.defaultProfilePic = base64textString;
  }

  open(content: any) {
    this.mbRef = this.modalService.open(content, {
      windowClass: 'insurance-modal-zindex',
      size: "lg",
      centered: true
    });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.profilePicValue = event.base64.split(",")[1];
    let file = base64ToFile(event.base64);
    this.croppedFile = file;
    this.profilePicAsEvent = event;

  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed(event: any) {
    this.toastrService.error('File format not supported(Allowed Format:jpg,jpeg,png)');
    this.mbRef.close();
  }

  onImageCropSave() {
    this.defaultProfilePic = this.profilePicValue;
    this.previousProfilePic = this.defaultProfilePic;
    this.dataService.setUserPhoto({ photoBlob: this.croppedFile, base64: this.defaultProfilePic })
    this.mbRef.close();
  }

  SetPreviousProfilePic() {
    this.defaultProfilePic = this.previousProfilePic;
    this.previousProfilePic = this.defaultProfilePic;
    this.companyImage.nativeElement.value = null;
    this.imageChangedEvent = null;
    this.mbRef.close();
  }

  validateOnCompanyProfile = 0;
  ngDoCheck(): void {
    if ((!this.utilsHelperService.isEmptyObj(this.companyProfileInfo) && this.companyProfileInfo.social_media_link && Array.isArray(this.companyProfileInfo.social_media_link)) && this.validateOnCompanyProfile == 0) {
      this.createCompanyForm.patchValue({
        linkedin: this.onFindMediaLinks('linkedin', this.companyProfileInfo.social_media_link).url,
        github: this.onFindMediaLinks('github', this.companyProfileInfo.social_media_link).url,
        youtube: this.onFindMediaLinks('youtube', this.companyProfileInfo.social_media_link).url,
        blog: this.onFindMediaLinks('blog', this.companyProfileInfo.social_media_link).url,
        portfolio: this.onFindMediaLinks('portfolio', this.companyProfileInfo.social_media_link).url,
        linkedinBoolen: this.onFindMediaLinks('linkedin', this.companyProfileInfo.social_media_link).visibility,
        githubBoolen: this.onFindMediaLinks('github', this.companyProfileInfo.social_media_link).visibility,
        youtubeBoolen: this.onFindMediaLinks('youtube', this.companyProfileInfo.social_media_link).visibility,
        blogBoolen: this.onFindMediaLinks('blog', this.companyProfileInfo.social_media_link).visibility,
        portfolioBoolen: this.onFindMediaLinks('portfolio', this.companyProfileInfo.social_media_link).visibility
      })
      this.validateOnCompanyProfile++
    }


    if (this.createCompanyForm.value.linkedin || this.createCompanyForm.value.portfolio) {
      this.socialMediaLinks.map((val) => {
        if (val.media == 'linkedin') {
          val.url = this.createCompanyForm.value.linkedin
        }
        if (val.media == 'portfolio') {
          val.url = this.createCompanyForm.value.portfolio
        }
      });
    }
  }

  onFindMediaLinks = (mediaType: string, array: any[]) => {
    if (mediaType) {
      const link = array.find((val, index) => {
        return val.media == mediaType;
      });
      return link ? link : ''
    }
    return ''
  }

  onSetLinks = (fieldName, status) => {
    console.log(this.createCompanyForm.value[fieldName]);

    if (this.socialMediaLinks.length == 0) {
      this.socialMediaLinks.push(
        {
          "media": fieldName,
          "url": this.createCompanyForm.value[fieldName],
          "visibility": status
        }
      )
    } else {
      let findInex = this.socialMediaLinks.findIndex(val => ((val.media == fieldName) && (val.visibility == true)))
      if (findInex > -1) {
        this.socialMediaLinks[findInex].visibility = status;
      } else {
        this.socialMediaLinks.push(
          {
            "media": fieldName,
            "url": this.createCompanyForm.value[fieldName],
            "visibility": status
          }
        )
      }
    }
    this.createCompanyForm.patchValue({
      social_media_link: this.socialMediaLinks
    })
    console.log(this.socialMediaLinks);


    console.log(this.createCompanyForm.value[fieldName]);

  }

}
