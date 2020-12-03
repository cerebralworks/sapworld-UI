import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isFindSearch: any = 0;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRedirect = () => {
    if(this.isFindSearch == 0) {
      this.router.navigate(['/find-jobs']);
    }else {
      this.router.navigate(['/find-candidates']);
    }
  }

}
