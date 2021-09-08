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
   // sharedApiService.onGetCountry(requestParams);
   // sharedApiService.onGetLanguage(requestParams);
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
	  var temp=[];
	  let jobTypeArray = [
		{id: 1000, text: 'Full Time'},
		{id: 1001, text: 'Part Time'},
		{id: 1002, text: 'Contract'},
		{id: 1003, text: 'Freelance'},
		{id: 1004, text: 'Internship'},
	  ];
     //let jobTypeArray = ['','', '', '', '', '', 'Temporary', 'Permanent', 'Onsite'];
     if(index) {
		 if(typeof index === 'string' || ((!!index && typeof index === 'object') && Object.prototype.toString.call(index) === '[object String]')){
			var datas = jobTypeArray.filter(function(a,b){ return a.id == index });
				if(datas.length!=0){
					 return datas[0]['text'];
				 }
				 return '';
		 }else if(index.length !=0) {
			 var index = index.filter(function(elem, index, self) {
				return index === self.indexOf(elem);
			})
			 for(let i=0;i<index.length;i++){
				 var id = index[i];
				 var datas = jobTypeArray.filter(function(a,b){ return a.id == id });
				 if(datas.length!=0){
					 temp.push(datas[0]['text']);
				 }
				 
			 }
			 return temp;
		}
	 }
	 
     return jobTypeArray;
  }

  onGetCurrency = (index?) => {
    if(index > -1) { return this.currencyArray.default[index] }
    return this.currencyArray.default;
 }

 onGetCurrencyCode = (value?) => {
  if(value) { return this.currencyArray.default.find(val => {

    return ((val.code && val.code.toLowerCase()) == value.toLowerCase());
  }) }
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
  arrayValues = arrayValues.map(function(a,b){ return parseInt(a)});

   const temp = industries.items.filter(r=> {
      return arrayValues.includes(r.id)
    });

    if(returnVal == 'obj') {
      return temp;
    }
    return this.utilsHelperService.onConvertArrayObjToString(temp, 'name');
  }
  if(returnVal == 'obj') {
    return [];
  }
  return '--';
}

onFindDomainFromSingleID = (value: any) => {
  let industries;
  this.dataService.getIndustriesDataSource().subscribe(
    response => {
      industries = response
    }
  );
  if(value && industries && industries.items && Array.isArray(industries.items)) {
    const temp = industries.items.find(r=> {
      return value == r.id
    });
    return temp;
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
      skillItems = response;
    }
  );
  if(skillItems && skillItems.items && Array.isArray(skillItems.items) && Array.isArray(arrayValues) && arrayValues.length > 0) {
    const temp = skillItems.items.filter(r=> {
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
  if(address.city==null){
	  if(addr.formatted_address){
		  var splits = addr.formatted_address.split(',');
		  if(splits[0]){
			  address.city =splits[0];
		  }
	  }
	  
  }
  address.state = this.findTypeLongName(addr, "administrative_area_level_1");
  address.stateShort = this.findTypeShortName(addr, "administrative_area_level_1");
  if(address.state ==null){
	address.state = this.findTypeLongName(addr, "neighborhood");
	  
  }
  if(address.stateShort ==null){
	address.stateShort = this.findTypeShortName(addr, "locality" );
	  
  }
  
  address.zipcode = this.findTypeLongName(addr, "postal_code");
  address.country = this.findTypeLongName(addr, "country");
	if(address.city==address.country){
	  if(addr.formatted_address){
		  var splits = addr.formatted_address.split(',');
		  if(splits[0]){
			  address.city =splits[0];
		  }
	  }
	  
  }
  address.validated = houseNumber != null && street != null && address.city != null && address.state != null && address.zipcode != null;

  return address;
}

private findTypeLongName(addr: gAddress, type: string): string {
	if(addr.address_components){
  let comp: gAddressComponent = addr.address_components.find((item: gAddressComponent) => item.types.indexOf(type) >= 0);
	 return comp ? comp.long_name : null;
	}else{
		return null;
	}

}

private findTypeShortName(addr: gAddress, type: string): string {
	if(addr.address_components){
  let comp: gAddressComponent = addr.address_components.find((item: gAddressComponent) => item.types.indexOf(type) >= 0);
  return comp ? comp.short_name : null;
	}else{
		return null;
	}
}

}
