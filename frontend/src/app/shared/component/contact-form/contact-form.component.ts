import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

public contactform : FormGroup
public submitted : boolean = false;
public dubmail : boolean = false;
  constructor(private fb : FormBuilder, private EmpService : EmployerService) {
  this.contactform = this.fb.group({
  name : new FormControl('',Validators.required),
  email : new FormControl('',Validators.required),
  subject : new FormControl('',Validators.required),
  message : new FormControl('',Validators.required)
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
