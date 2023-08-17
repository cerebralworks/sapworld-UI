import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup,Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

public contactform : UntypedFormGroup
public submitted : boolean = false;
public dubmail : boolean = false;
  constructor(private fb : UntypedFormBuilder, private EmpService : EmployerService) {
  this.contactform = this.fb.group({
  name : new UntypedFormControl('',Validators.required),
  email : new UntypedFormControl('',Validators.required),
  subject : new UntypedFormControl('',Validators.required),
  message : new UntypedFormControl('',Validators.required)
  })
  }

  ngOnInit(): void {
  }
get f(){
	return this.contactform.controls
}
submit(){
this.submitted = true;
if(this.contactform.invalid){return}
this.EmpService.createcontact(this.contactform.value).subscribe(data=>{
this.contactform.reset();
this.submitted = false;
},error=>{
if(error.error.errors[0].field==="email"){
this.dubmail=true;
setTimeout(()=>{this.dubmail=false},2000)
}

})

}
}
