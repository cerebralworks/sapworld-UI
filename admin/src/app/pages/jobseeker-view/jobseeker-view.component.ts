import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment as env } from '@env';

@Component({
  selector: 'app-jobseeker-view',
  templateUrl: './jobseeker-view.component.html',
  styleUrls: ['./jobseeker-view.component.scss']
})
export class JobseekerViewComponent implements OnInit {
	public urlFrame:any;
  constructor(
  private router:Router,
  private sanitizer: DomSanitizer
  ) 
  { }


  ngOnInit(): void {
	  var url=`${env.app_url}#/admin/user-dashboard?activeTab=profile&userid=`+this.router.url.split('/')[this.router.url.split('/').length-1];
	  //var url=`${env.app_url}#/admin/user-dashboard?activeTab=profile`;
	  this.urlFrame=this.sanitizer.bypassSecurityTrustResourceUrl(url);
		console.log('url',this.urlFrame);

  }
  
  /**To go back **/
  goBack(){
     this.router.navigate(['/jobseeker']);
  }

}
