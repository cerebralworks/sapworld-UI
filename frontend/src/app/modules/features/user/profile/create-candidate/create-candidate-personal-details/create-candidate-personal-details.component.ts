import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { trigger, style, animate, transition, state, group } from '@angular/animations';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SharedService } from '@shared/service/shared.service';
import { ValidationService } from '@shared/service/validation.service';
import { DataService } from '@shared/service/data.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { UserService } from '@data/service/user.service';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-create-candidate-personal-details',
  templateUrl: './create-candidate-personal-details.component.html',
  styleUrls: ['./create-candidate-personal-details.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
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
export class CreateCandidatePersonalDetailsComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  public childForm;
  public show: boolean = false;
  public userInfo: any = {};
  public defaultProfilePic: string;
  public mbRef: any;
  public profilePicValue: any;
  public profilePicAsEvent: any;
  public previousProfilePic: string;
  public imageChangedEvent: FileList;
  public socialMediaLinks: any[] = [];
  savedUserDetails: any;
  @Input('userDetails')
  set userDetails(inFo: any) {
    this.savedUserDetails = inFo;
  }

  @ViewChild('userImage', { static: false }) userImage: ElementRef;
  croppedFile: any;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService,
    private dataService: DataService,
    private userSharedService: UserSharedService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private utilsHelperService: UtilsHelperService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.createForm();

    // this.userSharedService.getUserProfileDetails().subscribe(
    //   response => {
    //     this.userInfo = response;
    //     if (this.userInfo) {
    //       this.childForm.patchValue({
    //         personalDetails: {
    //           ...this.userInfo,
    //         }
    //       });
    //       if(this.userInfo && this.userInfo.social_media_link && this.userInfo.social_media_link.length > 0) {
    //         this.childForm.patchValue({
    //           personalDetails: {
    //             linkedin: this.onFindMediaLinks('linkedin', this.userInfo.social_media_link).url,
    //             github: this.onFindMediaLinks('github', this.userInfo.social_media_link).url,
    //             youtube: this.onFindMediaLinks('youtube', this.userInfo.social_media_link).url,
    //             blog: this.onFindMediaLinks('blog', this.userInfo.social_media_link).url,
    //             portfolio: this.onFindMediaLinks('portfolio', this.userInfo.social_media_link).url,
    //             linkedinBoolen: this.onFindMediaLinks('linkedin', this.userInfo.social_media_link).visibility,
    //             githubBoolen: this.onFindMediaLinks('github', this.userInfo.social_media_link).visibility,
    //             youtubeBoolen: this.onFindMediaLinks('youtube', this.userInfo.social_media_link).visibility,
    //             blogBoolen: this.onFindMediaLinks('blog', this.userInfo.social_media_link).visibility,
    //             portfolioBoolen: this.onFindMediaLinks('portfolio', this.userInfo.social_media_link).visibility
    //           }
    //         })
    //       }
    //       this.childForm.get('personalDetails.email').disable();

    //       let latlngText: string = this.userInfo.latlng_text;
    //       if (latlngText) {
    //         const splitedString: any[] = latlngText.split(',');
    //         if (splitedString && splitedString.length) {
    //           this.childForm.patchValue({
    //             personalDetails: {
    //               latlng: {
    //                 lat: splitedString[0],
    //                 lng: splitedString[1]
    //               }
    //             }
    //           })
    //         }
    //       }
    //     }

    //   }
    // )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.childForm && this.savedUserDetails) {
      this.childForm.patchValue({
        personalDetails: {
          ...this.savedUserDetails,
        }
      });
      if(this.savedUserDetails && this.savedUserDetails.social_media_link && this.savedUserDetails.social_media_link.length > 0) {
        this.childForm.patchValue({
          personalDetails: {
            linkedin: this.onFindMediaLinks('linkedin', this.savedUserDetails.social_media_link).url,
            github: this.onFindMediaLinks('github', this.savedUserDetails.social_media_link).url,
            youtube: this.onFindMediaLinks('youtube', this.savedUserDetails.social_media_link).url,
            blog: this.onFindMediaLinks('blog', this.savedUserDetails.social_media_link).url,
            portfolio: this.onFindMediaLinks('portfolio', this.savedUserDetails.social_media_link).url,
            linkedinBoolen: this.onFindMediaLinks('linkedin', this.savedUserDetails.social_media_link).visibility,
            githubBoolen: this.onFindMediaLinks('github', this.savedUserDetails.social_media_link).visibility,
            youtubeBoolen: this.onFindMediaLinks('youtube', this.savedUserDetails.social_media_link).visibility,
            blogBoolen: this.onFindMediaLinks('blog', this.savedUserDetails.social_media_link).visibility,
            portfolioBoolen: this.onFindMediaLinks('portfolio', this.savedUserDetails.social_media_link).visibility
          }
        })
      }
      this.childForm.get('personalDetails.email').disable();

      let latlngText: string = this.savedUserDetails.latlng_text;
      if (latlngText) {
        const splitedString: any[] = latlngText.split(',');
        if (splitedString && splitedString.length) {
          this.childForm.patchValue({
            personalDetails: {
              latlng: {
                lat: splitedString[0],
                lng: splitedString[1]
              }
            }
          })
        }
      }
      let phoneNumber: string = this.savedUserDetails.phone;
      if(phoneNumber) {
        // this.childForm.controls.personalDetails.controls.phone.setValue('+919898989898');
        // this.cd.detectChanges();
        let phoneComponents = {
          IDDCC: phoneNumber.substring(0, phoneNumber.length - 10),
          NN: phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length)
        };
        // this.childForm.patchValue({
        //   personalDetails: {
        //     phone: phoneComponents.NN,
        //     dialCode: phoneComponents.IDDCC
        //   }
        // })
      }
    }
  }

  onFindMediaLinks = (mediaType: string, array: any[]) => {
    if(mediaType) {
      const link = array.find((val, index) => {
        return val.media == mediaType;
      });
      return link ? link : ''
    }
    return ''
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('personalDetails', new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl(''),
      phone: new FormControl('', [Validators.required]),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      latlng: new FormControl({}, Validators.required),
      country: new FormControl('', Validators.required),
      zipcode: new FormControl(null, Validators.required),
      social_media_link: new FormControl(null),
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
    }));
  }

  get f() {
    return this.childForm.controls.personalDetails.controls;
  }

  handleAddressChange = (event) => {
    const address = this.sharedService.fromGooglePlace(event);
    this.childForm.patchValue({
      personalDetails: {
        city: address.city ? address.city : event.formatted_address,
        state: address.state,
        country: address.country,
        latlng: {
          "lat": event.geometry.location.lat(),
          "lng": event.geometry.location.lng()
        }
      }
    });
  };

  onSetLinks = (fieldName, status) => {
    if(this.socialMediaLinks.length == 0) {
      this.socialMediaLinks.push(
        {
          "media": fieldName,
          "url": this.childForm.value.personalDetails[fieldName],
          "visibility": status
        }
      )
    }else {
      let findInex = this.socialMediaLinks.findIndex(val => ((val.media == fieldName) && (val.visibility == true)))
      if(findInex > -1) {
        this.socialMediaLinks[findInex].visibility = status;
      }else {
        this.socialMediaLinks.push(
          {
            "media": fieldName,
            "url": this.childForm.value.personalDetails[fieldName],
            "visibility": status
          }
        )
      }
    }
    this.childForm.patchValue({
      personalDetails: {
        social_media_link: this.socialMediaLinks
      }
    })
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
    this.userImage.nativeElement.value = null;
    this.imageChangedEvent = null;
    this.mbRef.close();
  }

  convertToImage(imageString: string): string {
    return this.utilsHelperService.convertToImageUrl(imageString);
  }

  onCountryChange = (event) => {
    // if(event && event.dialCode) {
    //   this.childForm.patchValue({
    //     personalDetails: {
    //       dialCode: '+' + event.dialCode
    //     }
    //   })
    // }
  }

}
