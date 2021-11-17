import { Component, OnInit,HostListener  } from '@angular/core';
export {}; declare global { interface Window { Parallax: any; } } 
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-employer-login',
  templateUrl: './employer-login.component.html',
  styleUrls: ['./employer-login.component.css']
})
export class EmployerLoginComponent implements OnInit {
public screenWidth: any;
public translatePage='en';
  constructor(
    public translate: TranslateService) { }

  ngOnInit(): void {
	  this.screenWidth = window.innerWidth;
	  setTimeout(() => {
		  var scene = document.getElementById('scene');
			new window.Parallax(scene)
	  });
	  
	  this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
		if(event.lang=='es'){
			this.translatePage = 'es';
		}if(event.lang=='de'){
			this.translatePage = 'de';
		}if(event.lang=='en'){
			this.translatePage = 'en';
		}
		setTimeout(() => {
			  var scene = document.getElementById('scene');
				new window.Parallax(scene)
		  });
	});
  }
  /* ngAfterViewInit(): void {
	  setTimeout(() => {
		  var scene = document.getElementById('scene');
			new window.Parallax(scene)
	  });
  } */
@HostListener('window:resize', ['$event'])  
  onResize(event) {  
    this.screenWidth = window.innerWidth;  
  }  
}
