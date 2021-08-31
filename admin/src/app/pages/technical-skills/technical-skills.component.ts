import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technical-skills',
  templateUrl: './technical-skills.component.html',
  styleUrls: ['./technical-skills.component.scss']
})
export class TechnicalSkillsComponent implements OnInit {
	SlideOptions = { items: 5, dots: false, nav: true };  
	CarouselOptions = { dots: false, nav: true };  
  constructor() { }

  ngOnInit(): void {
  }

}
