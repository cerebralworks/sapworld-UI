import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visa-sponsored',
  templateUrl: './visa-sponsored.component.html',
  styleUrls: ['./visa-sponsored.component.css']
})
export class VisaSponsoredComponent implements OnInit {

  public isOpenedResumeSelectModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleResumeSelectModal = (status) => {
    this.isOpenedResumeSelectModal = status;
  }

}
