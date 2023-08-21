import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { SharedService } from './shared.service';
import * as CryptoJS from 'crypto-js';
declare const require;
// const bowser = require('bowser');

@Injectable({
  providedIn: 'root'
})
export class UtilsHelperService {

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  isEmptyObj(obj) {
    for (let x in obj) { if (obj.hasOwnProperty(x)) return false; }
    return true;
  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
      if (Array.isArray(obj[propName]) && obj[propName].length == 0) {
        delete obj[propName];
      }
    }
    return obj
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
    if (!Array.isArray(value)) return "--";
    return value.filter(function(a,b){return a!=''}).join(", ");
  }

  onConvertArrayObjToString = (value: any[], field: string = 'name') => {
    if ((!Array.isArray(value) || value.length == 0)) return "--";
    return value.map(s => this.capitalizeFirstLetter(s[field])).join(", ");
  }

  onGetYesOrNoValue = (value: boolean) => {
    if (value == true) {
      return "Yes";
    } else {
      return "No"
    }
  }
  
  onGetRemoteOption = (value)=>{
	     if (value == 0) {
			return "Domestic";
		} else if(value == 1){
			return "Worldwide"
		}
	}
	
	capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  onConvertArrayObjToAdditionalString = (value: any[], field: string = 'name', field2?: string) => {
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

  onSplitTag = (string: string) => {
    if (!string) return '--';
	return string;
    const splitedString = string.split('-');
    if (splitedString.length && splitedString[1]) {
      return splitedString[1]
    }
    return '--';
  }

  differenceByPropVal<T>(arr1: T[], arr2: T[], propertyName: string): T[] {
    return arr1.filter(
      (a: T): boolean =>
        !arr2.find((b: T): boolean => b[propertyName] === a[propertyName])
    );
  }

  differenceByPropValArray<T>(arr1: T[], arr2: T[], propertyName: string): T[] {
    if (arr1 && arr2 && Array.isArray(arr1) && Array.isArray(arr2)) {
      return arr1.filter(
        (a: any): boolean => {
          return !arr2.find((b: T): boolean => {
            return parseInt(b[propertyName]) == parseInt(a)
          })
        }

      );
    }
    return [];
  }

  onGetFilteredValue = (array: any[], fields, value) => {
    if (array && Array.isArray(array) && array.length) {
      return array.find(i => {
        return (i[fields] == value || i[fields] == value.toString())
      });
    }
    return {}
  }

  capitalizeWord(value) {
    if (typeof value !== "string") return "";
    return value
      .toLowerCase()
      .split(",")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(", ");
  }
   
   //To encrypt string
   encryptData(data) {

		try {
		  return CryptoJS.AES.encrypt(JSON.stringify(data), 'SECRETKEY').toString();
		} catch (e) {
		  console.log(e);
		}
	  }
	
	 //To decrypt string
    decryptData(data) {
		try {
		  const bytes = CryptoJS.AES.decrypt(data, 'SECRETKEY');
		  
		  if (bytes.toString()) {
			return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		  }
		  return data;
		} catch (e) {
		  console.log(e);
		}
	  }
	  
	  /** This Function to convert blob URL to base64
     * @url - pass the blob url
	**/
   getImageAsBase64(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = () => {
        reject('Failed to convert image to base64.');
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }
  
}
