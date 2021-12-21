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


	constructor(
		public router: Router,
		private dataService: DataService,
		private utilsHelperService: UtilsHelperService,
		private sharedApiService: SharedApiService
	) {
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
