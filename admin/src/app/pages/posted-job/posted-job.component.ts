import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment as env } from '@env';
@Component({
  selector: 'app-posted-job',
  templateUrl: './posted-job.component.html',
  styleUrls: ['./posted-job.component.scss']
})
export class PostedJobComponent implements OnInit {
  public urlFrame:any;
  constructor(private router:Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  var url=`${env.app_url}admin/employer-dashboard?activeTab=postedJobs&empids=`+this.router.url.split('/')[this.router.url.split('/').length-1];;
	  this.urlFrame=this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  /**To go back **/
  goBack(){
     this.router.navigate(['/employers']);
  }
}
