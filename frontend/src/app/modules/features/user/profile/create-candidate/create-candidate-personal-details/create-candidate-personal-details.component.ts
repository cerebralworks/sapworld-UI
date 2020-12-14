import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-create-candidate-personal-details',
  templateUrl: './create-candidate-personal-details.component.html',
  styleUrls: ['./create-candidate-personal-details.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  animations: [
    trigger('slideInOut', [
        state('in', style({height: '*', opacity: 0})),
        transition(':leave', [
            style({height: '*', opacity: 1}),

            group([
                animate(300, style({height: 0})),
                animate('200ms ease-in-out', style({'opacity': '0'}))
            ])

        ]),
        transition(':enter', [
            style({height: '0', opacity: 0}),

            group([
                animate(300, style({height: '*'})),
                animate('400ms ease-in-out', style({'opacity': '1'}))
            ])

        ])
    ])
]
})
export class CreateCandidatePersonalDetailsComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  public childForm;
  public show:boolean = false;
  public userInfo: any = {};
  defaultProfilePic: string;
  mbRef: any;
  profilePicValue: any;
  profilePicAsEvent: any;
  previousProfilePic: string;
  imageChangedEvent: FileList;

  @ViewChild('userImage', { static: false }) userImage: ElementRef;
  croppedFile: any;

  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService,
    private dataService: DataService ,
    private userSharedService: UserSharedService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private utilsHelperService: UtilsHelperService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
        if(this.userInfo) {
          this.childForm.patchValue({
            personalDetails: {
              email: this.userInfo.email,
              // phone: this.userInfo.phone,
            }
          })
          this.childForm.get('personalDetails.email').disable();
          // this.childForm.get('personalDetails.phone').disable()
        }

      }
    )
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('personalDetails', new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl(''),
      phone: new FormControl('',),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      latlng: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zipcode: new FormControl(null, Validators.required),
      social_media_link: new FormControl(null),
      linkedin: new FormControl(''),
      github: new FormControl(''),
      youtube: new FormControl(''),
      blog: new FormControl(''),
      portfolio: new FormControl('')
    }));
  }

  get f() {
    return this.childForm.controls.personalDetails.controls;
  }

  handleAddressChange = (event) => {
    const address = this.sharedService.fromGooglePlace(event);
    console.log('address', address, event.geometry.location.lat() + ',' + event.geometry.location.lng());

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
    console.log(this.childForm.value.personalDetails[fieldName]);

    let arrayValue = [];
    arrayValue.push(
      {
        "media": fieldName,
        "url": this.childForm.value.personalDetails[fieldName],
        "visibility": status
      }
    )
    this.childForm.patchValue({
      personalDetails: {
        social_media_link: arrayValue
      }
    })
    console.log(this.childForm.value);

  }

  handleFileInput(event, CropImagePopUp) {
    let files: FileList = event.target.files;
    if(files && files.length > 0) {
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
    this.dataService.setUserPhoto({photoBlob: this.croppedFile, base64: this.defaultProfilePic})
    // this.onUserPhotoUpdate();
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

  // base64ToFile(data, filename) {

  //   const arr = data.split(',');
  //   const mime = arr[0].match(/:(.*?);/)[1];
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   let u8arr = new Uint8Array(n);

  //   while(n--){
  //       u8arr[n] = bstr.charCodeAt(n);
  //   }

  //   return new File([u8arr], filename, { type: mime });
  // }

  // onUserPhotoUpdate = () => {
  //   console.log('this.profilePicAsEvent', this.croppedFile);

  //   const formData = new FormData();
  //   formData.append('photo' , this.croppedFile, this.croppedFile.name);
  // //   Array.from(this.filesToUploadData).map((file, index) => {
  // //     formData.append('file' + index, file, file.name);
  // // });
  //   this.userService.photoUpdate(formData).subscribe(
  //     response => {
  //     }, error => {
  //     }
  //   )
  // }

}
