import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { textEditorConfig } from '@config/rich-editor';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ValidationService } from '@shared/service/validation.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-employer-profile',
  templateUrl: './create-employer-profile.component.html',
  styleUrls: ['./create-employer-profile.component.css']
})
export class CreateEmployerProfileComponent implements OnInit {

  public editorConfig: AngularEditorConfig = textEditorConfig;
  public createCompanyForm: FormGroup;
  public defaultProfilePic: string;
  public mbRef: any;
  public profilePicValue: any;
  public profilePicAsEvent: any;
  public previousProfilePic: string;
  public imageChangedEvent: FileList;
  public socialMediaLinks: any[] = [];
  public croppedFile: Blob;
  @ViewChild('companyImage', { static: false }) companyImage: ElementRef;
  public validateSubscribe: any;
  public employerDetails: any;
  public randomNum: number;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private employerSharedService: EmployerSharedService,
    private employerService: EmployerService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.employerSharedService.getEmployerProfileDetails().subscribe(
      details => {
        if(details) {
          this.employerDetails = details;
          if(!this.utilsHelperService.isEmptyObj(details)) {
            console.log(details);

            this.createCompanyForm.patchValue({
              email_id: details.email,
              name: details.company,
              phone: details.phone,
              city: details.city,
              state: details.state,
              country: details.country,
              ...this.employerDetails
            })
            // this.createCompanyForm.get('email_id').disable();

          let latlngText: string = details.latlng_text;
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

        }
      }
    )

  }

  onSaveComapnyInfo = () => {
    if(this.createCompanyForm.valid) {
      let requestParams: any = {...this.createCompanyForm.value};
      requestParams.contact = [this.createCompanyForm.value.contact]
      this.employerService.updateCompanyProfile(requestParams).subscribe(
        response => {

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
      state: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      zipcode: [null, Validators.required],
      description: ['', Validators.required],
      website: ['', Validators.required],
      contact: [null, Validators.required],
      latlng: [null, Validators.required],
      social_media_link: [null],
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

}
