import {Injectable} from '@angular/core';
import { DataService } from './data.service';
import { SharedService } from './shared.service';

declare const require;
// const bowser = require('bowser');

@Injectable({
  providedIn: 'root'
})
export class UtilsHelperService {

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  convertToImageUrl(imageString: any): string {
    if (imageString !== null && imageString !== undefined && imageString !== 0) {
      if (!(imageString.indexOf("https://") >= 0 || imageString.indexOf("http://") >= 0)) {
        imageString = "data:image/png;base64," + imageString;
      }
    }
    else {
      //imageString = "data:image/png;base64," + this._commonService.imagePath;
    }
    return imageString;
  }

  onConvertArrayToString = (value: any[]) => {
    console.log(value);

    if (!Array.isArray(value)) return "--";
    return value.join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if ((!Array.isArray(value) || value.length==0)) return "--";
    return value.map(s => s[field]).join(", ");
  }

  onGetYesOrNoValue = (value: boolean) => {
    if (value == true) {
      return "Yes";
    } else {
      return "No"
    }
  }

  onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?:string) => {
    if (!Array.isArray(value) || value.length == 0) return "--";
    return value.map(s => {
      // let element = this.sharedService.onFindSkillsFromSingleID(s.skill_id);
      // if(field && (element && element.tag)) {
      //   return element.tag + ' (' + s.experience + ' ' + s.experience_type + ')'
      // }
    }).join(", ");
  }

  onSplitValueWithNewLine = (value: string) => {
    if (value == "" || value == "-") return "-";
    if (value) {
      let splitValue: any = value.split(",");
      splitValue = splitValue.join(", \n");
      return splitValue;
    }
  };

}
