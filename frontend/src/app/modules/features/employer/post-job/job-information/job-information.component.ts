import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { tabInfo } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { SharedService } from '@shared/service/shared.service';

import { Address as gAddress } from "ngx-google-places-autocomplete/objects/address";
import { AddressComponent as gAddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";

@Component({
  selector: 'app-job-information',
  templateUrl: './job-information.component.html',
  styleUrls: ['./job-information.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class JobInformationComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;
  @Input('postedJobsDetails')
  set postedJobsDetails(inFo: JobPosting) {
    this.getPostedJobsDetails = inFo;
  }

  public childForm;
  public getPostedJobsDetails: JobPosting;
  public currentCurrencyFormat: string = "en-US";

  constructor(
    private parentF: FormGroupDirective,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.childForm && this.getPostedJobsDetails) {
      this.childForm.patchValue({
        jobInfo : {
          ...this.getPostedJobsDetails,
          salary: this.getPostedJobsDetails.salary.toString()
        }
      });
    }
  }

  createForm() {
    this.childForm = this.parentF.form;

    this.childForm.addControl('jobInfo', new FormGroup({
      title: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      salary_type: new FormControl('', Validators.required),
      salary_currency: new FormControl(0, Validators.required),
      salary: new FormControl(null, Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      latlng: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zipcode: new FormControl(null, Validators.required),
      availability: new FormControl('', Validators.required),
      remote: new FormControl(null, Validators.required),
    }));
  }

  get f() {
    return this.childForm.controls.jobInfo.controls;
  }

  onChangeCurrentFormat  = (value) => {
    if(value == 0) {
      this.currentCurrencyFormat = 'en-US';
    } else if(value == 1) {
      this.currentCurrencyFormat = 'en-IN';
    } else if(value == 2) {
      this.currentCurrencyFormat = 'de-DE';
    }
    this.childForm.patchValue({
      jobInfo: {
        salary: null
      }
    });
    this.childForm.markAsUntouched();
    this.childForm.markAsPristine();
    this.childForm.updateValueAndValidity();
  }

  handleAddressChange = (event) => {
    const address = this.fromGooglePlace(event);
    this.childForm.patchValue({
      jobInfo: {
        city: address.city ? address.city : event.formatted_address,
        state: address.state,
        country: address.country,
        latlng: event.geometry.location.lat() + ',' + event.geometry.location.lat()
      }
    });
  };

  public fromGooglePlace(addr: gAddress) {
    let address: any = {};
    let houseNumber = this.findTypeLongName(addr, "street_number");
    let street = this.findTypeLongName(addr, "route");

    address.street = street && houseNumber ? `${houseNumber} ${street}` : null;
    address.street = address.street ? address.street : street;

    address.city = this.findTypeLongName(addr, "locality");
    address.state = this.findTypeLongName(addr, "administrative_area_level_1");
    address.zipcode = this.findTypeLongName(addr, "postal_code");
    address.country = this.findTypeShortName(addr, "country");

    address.validated = houseNumber != null && street != null && address.city != null && address.state != null && address.zipcode != null;

    return address;
  }

  private findTypeLongName(addr: gAddress, type: string): string {
    let comp: gAddressComponent = addr.address_components.find((item: gAddressComponent) => item.types.indexOf(type) >= 0);
    return comp ? comp.long_name : null;
  }

  private findTypeShortName(addr: gAddress, type: string): string {
    let comp: gAddressComponent = addr.address_components.find((item: gAddressComponent) => item.types.indexOf(type) >= 0);
    return comp ? comp.short_name : null;
  }

}
