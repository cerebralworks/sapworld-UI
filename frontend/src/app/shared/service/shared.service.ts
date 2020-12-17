import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Address as gAddress } from "ngx-google-places-autocomplete/objects/address";
import { AddressComponent as gAddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";

import  *  as  currencies  from  '@shared/json/currency.json';
import { SharedApiService } from './shared-api.service';
import { DataService } from './data.service';
import { UtilsHelperService } from './utils-helper.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public currencyArray: any;

  constructor(
    public router: Router,
    private dataService: DataService,
    private utilsHelperService: UtilsHelperService,
    private sharedApiService: SharedApiService
  ) {
    this.currencyArray = currencies;

    let requestParams: any = {};
    requestParams.page = 1;
    requestParams.limit = 1000;
    requestParams.search = '';
    sharedApiService.onGetSkill(requestParams);
    sharedApiService.onGetIndustries(requestParams);
   }

  getCurrentRoleFromUrl = () => {
    if(this.router.url.includes('employer')) {
      return { roleName: 'employer', roleId: 1}
    }else if(this.router.url.includes('user')) {
      return { roleName: 'user', roleId: 0}
    }else if(this.router.url.includes('admin')) {
      return { roleName: 'admin', roleId: 2}
    }
  }

  onGetJobType = (index?) => {
     let jobTypeArray = ['Full Time', 'Part Time', 'Freelance', 'Internship', 'Temporary', 'Remote', 'Contract', 'Day Job'];
     if(index > -1) { return jobTypeArray[index] }
     return jobTypeArray;
  }

  onGetCurrency = (index?) => {
    if(index > -1) { return this.currencyArray.default[index] }
    return this.currencyArray.default;
 }

 onGetPreferedLocation = (index?) => {
  let locationArray = [ 'Within 10 miles from my current location', 'Within 15 miles', 'Within 25 miles', 'Within 50 miles'];
  if(index > -1) { return locationArray[index] }
  return locationArray;
 }

 onGetAvailability = () => {
  let availabilityArray = [
    {value_id: 0, text: 'Immediate'},
    {value_id: 15, text: '15 Days'},
    {value_id: 30, text: '30 Days'},
    {value_id: 45, text: '45 Days'},
    {value_id: 60, text: '60 Days'},
  ];
  return availabilityArray;
 }

 onGetTravel = () => {
  let travelArray = [
    {id: 0, text: 'No'},
    {id: 25, text: '25%'},
    {id: 50, text: '50%'},
    {id: 75, text: '75%'},
    {id: 100, text: '100%'},
  ];
  return travelArray;
 }

 onFindDomainFromID = (arrayValues: Array<any>, returnVal: string = 'string') => {
  let industries;
  this.dataService.getIndustriesDataSource().subscribe(
    response => {
      industries = response
    }
  );
  if(industries && industries.items && Array.isArray(industries.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
    const temp = industries.items.filter(r=> {
      return arrayValues.includes(r.id)
    });

    if(returnVal == 'obj') {
      return temp;
    }
    return this.utilsHelperService.onConvertArrayObjToString(temp, 'name');
  }
  return '--';
}

onFindSkillsFromSingleID = (value: any) => {
  let skillItems;
  this.dataService.getSkillDataSource().subscribe(
    response => {
      skillItems = response
    }
  );
  if(value && skillItems && skillItems.items && Array.isArray(skillItems.items)) {
    const temp = skillItems.items.find(r=> {
      return value == r.id
    });
    return temp;
  }
  return '--';
}

onFindSkillsFromID = (arrayValues: Array<any>, returnVal: string = 'string') => {
  let skillItems;
  this.dataService.getSkillDataSource().subscribe(
    response => {
      skillItems = response
    }
  );
  if(skillItems && skillItems.items && Array.isArray(skillItems.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
    const temp = skillItems.filter(r=> {
      return arrayValues.includes(r.id)
    });
    if(returnVal == 'obj') {
      return temp;
    }
    return this.utilsHelperService.onConvertArrayObjToString(temp, 'tag');
  }
  if(returnVal == 'obj') {
    return [];
  }
  return '--';
}

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
