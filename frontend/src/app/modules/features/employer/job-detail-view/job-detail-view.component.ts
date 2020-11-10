import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-detail-view',
  templateUrl: './job-detail-view.component.html',
  styleUrls: ['./job-detail-view.component.css']
})
export class JobDetailViewComponent implements OnInit {

  public isOpenedJDModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleJDModal = (status) => {
    this.isOpenedJDModal = status;
  }

}
