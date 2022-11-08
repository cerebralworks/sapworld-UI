import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment as env } from '@env';
@Component({
  selector: 'app-post-job-layout',
  templateUrl: './post-job-layout.component.html',
  styleUrls: ['./post-job-layout.component.scss']
})
export class PostJobLayoutComponent implements OnInit {

  public urlFrame :any;
  urlSafe: SafeResourceUrl;
  constructor(private router:Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
      var url=`${env.app_url}admin/post-job/`+this.router.url.split('/')[this.router.url.split('/').length-1];
	  this.urlFrame=this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack(){
    this.router.navigate(['/employers']);
  }
}
