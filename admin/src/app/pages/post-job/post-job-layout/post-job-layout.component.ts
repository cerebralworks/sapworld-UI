import { Component, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-post-job-layout',
  templateUrl: './post-job-layout.component.html',
  styleUrls: ['./post-job-layout.component.scss']
})
export class PostJobLayoutComponent implements OnInit {

  public currentTabInfo: tabInfo = {tabNumber: 1, tabName: 'Job Information'};
  public urlFrame :any;
  urlSafe: SafeResourceUrl;
  constructor(private router:Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
      var url="http://149.56.180.254/#/admin/post-job/"+this.router.url.split('/')[2];
	  this.urlFrame=this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
	**	On header change in the post-job
	**/
	
	onHeaderTabChange = (currentTabInfo: tabInfo) => {
		this.currentTabInfo = { ...currentTabInfo};
	}
  
}
