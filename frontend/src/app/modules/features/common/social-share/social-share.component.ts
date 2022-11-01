import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { environment as env } from '@env';
@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.css']
})
export class SocialShareComponent implements OnInit {

  public jobName:any;
  public linkedInUrl:any;
  constructor(private router: Router,private route: ActivatedRoute) {
  }

  ngOnInit(): void {
     this.jobName=this.route.snapshot.queryParamMap.get('job');
	 const encrypt = this.route.snapshot.queryParamMap.get('id');
	  var id=encrypt.replace(/\s/g, '+');
	   this.linkedInUrl ="https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(`${env.clientUrl}/linkedin-share?job=`)+encodeURIComponent(this.jobName)+'&id='+id;
  }

}
