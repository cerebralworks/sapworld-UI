import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  public static getValidationErrorMessage(validatorName: string, validatorValue?: any, labelName?: string): any {
    const config = {
      required: `Field is required.`,
	  invalidString:`Invalid String.`,
      invalidPassword: 'Invalid password. Password must be at least minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
      maxlength: `The field can't contain more than ${validatorValue.requiredLength} characters.`,
      minlength: `The field must contain atleast ${validatorValue.requiredLength} characters.`,
      invalidEmailAddress: 'Please enter a valid email address.',
      mismatch: 'Password doesn\'t match.',
      range: `The field must contain atleast characters.`,
      inValidMobile: 'Invalid mobile number',
      invalidUrl: 'Invalid url',
      invalidOtp: 'Invalid OTP',
      noFreeEmail: "Please use your business email."
    };

    return config[validatorName];
  }

  public static passwordValidator(control: AbstractControl): any {
    if (!control.value) { return; }

    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    // (?!.*\s)          - Spaces are not allowed
    return (control.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) ? '' : { invalidPassword: true };

    // return (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{8,100}$/)) ? '' : { invalidPassword: true };
  }

public static emptyStringValidator(control:AbstractControl):any{
	  if(!control.value) {return;}
	  //return(control.value.match(/^(\s+\S+\s*)*(?!\s).*$/)) ? '' : {
		 // required:true };
		//return(control.value.match((/[\S]/))) ? '' : {
		  //required:true };
		  //return(control.value.match(/^[^\s][a-zA-Z\s]+[^\s]$/)) ? '' : {
		  //invalidString:true };
		  return(control.value.match(/^[a-zA-Z0-9.\-_$@*!]{1,30}$/)) ? '' : {
		  invalidString:true };
		  
  }
  public static StartingEmptyStringValidator(control:AbstractControl):any{
	  if(!control.value) {return;}
	  //return(control.value.match(/^(\s+\S+\s*)*(?!\s).*$/)) ? '' : {
		 // required:true };
		return(control.value.match((/^[^\s].*$/))) ? '' : {
		  invalidString:true };
		  //return(control.value.match(/^(?![\s-])[\w -]+$/)) ? '' : {
		  //invalidString:true };
		  //return(control.value.match(/^[a-zA-Z0-9.\-_$@*!]{1,30}$/)) ? '' : {
		  //invalidString:true };
  }
  
  public static urlValidator(control: AbstractControl): any {
    if (!control.value) { return; }

    return (control.value.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)) ? '' : { invalidUrl: true };

    // return (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{8,100}$/)) ? '' : { invalidPassword: true };
  }

  public static emailValidator(control) {
    // RFC 2822 compliant regex
	if(control.value){
		control.value =control.value.toLocaleLowerCase();
		if (control.value.match(
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
		)) {
			return null;
		} else {
			return { invalidEmailAddress: true };
		}
	} else {
		return null;
	}
  }

  public static pwdMatchValidator(frm: UntypedFormGroup) {
    if ((frm.get('password') && frm.get('password').value) && (frm.get('confirmPassword') && frm.get('confirmPassword').value)) {
      if (frm.get('password').value !== frm.get('confirmPassword').value) {
        frm.get('confirmPassword').setErrors({ 'mismatch': true });
        return { mismatch: true };
      }
    }

  }

  public static noFreeEmail(control) {
    if (
      control.value.match(
        /^([\w-.]+@(?!yopmail\.)(?!mailinator\.)([\w-]+.)+[\w-]{2,4})?$/
      )
    ) {
      return null;
    } else {
      return { noFreeEmail: true };
    }
  }

  public static mobileNumber(control) {
    // control.value = control.value.toString()
    // RFC 2822 compliant regex
    if (
      control && control.value && (control.value.match(
        /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
      ))
    ) {
      return null;
    } else {
      return { inValidMobile: true };
    }
  }

 public static otpValidation(control) {
    if (
      control && control.value && (control.value.match(
        /^(\d\s*){6}$/g
      ))
    ) {
      return null;
    } else {
      return { invalidOtp: true };
    }
  }
  public static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { range: true };
        }
        return null;
    };
  }

}
