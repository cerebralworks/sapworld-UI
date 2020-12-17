import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  public static getValidationErrorMessage(validatorName: string, validatorValue?: any, labelName?: string): any {
    const config = {
      required: `Field is required.`,
      invalidPassword: 'Invalid password. Password must be at least minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
      maxlength: `The field can't contain more than ${validatorValue.requiredLength} characters.`,
      minlength: `The field must contain atleast ${validatorValue.requiredLength} characters.`,
      invalidEmailAddress: 'Please enter a valid email address.',
      mismatch: 'Password doesn\'t match.',
      inValidMobile: 'Invalid mobile number',
      noFreeEmail: "Please use your business email, we don't accept Gmail, Yahoo, Hotmail and Mailinator accounts."
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

  public static emailValidator(control) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  public static pwdMatchValidator(frm: FormGroup) {
    if ((frm.get('password') && frm.get('password').value) && (frm.get('confirmPassword') && frm.get('confirmPassword').value)) {
      if (frm.get('password').value !== frm.get('confirmPassword').value) {
        frm.get('confirmPassword').setErrors({ 'mismatch': true });
        return { mismatch: true };
      }
    }

  }

  public static noFreeEmail(control) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /^([\w-.]+@(?!gmail\.com)(?!yahoo\.com)(?!hotmail\.com)(?!mailinators\.com)([\w-]+.)+[\w-]{2,4})?$/
      )
    ) {
      return null;
    } else {
      return { noFreeEmail: true };
    }
  }

  public static mobileNumber(control) {
    control.value = control.value.toString()
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
}
