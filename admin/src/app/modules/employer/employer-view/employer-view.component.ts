import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employer-view',
  templateUrl: './employer-view.component.html',
  styleUrls: ['./employer-view.component.scss']
})
export class EmployerViewComponent implements OnInit {
  public companyProfileInfo: any;
  public companyProfileMeta: any;
  public employerId: string;
  public statusGlossary: any;
  @ViewChild('statusModal', { static: false }) statusModal: TemplateRef<any>;
  public mbRef: NgbModalRef;
  public statusValue: any;
  public isLoading: boolean;
  // public currentValueOfStatus: any;
  // public currentValueOfJob: JobPosting;

  constructor(
    private employerService: EmployerService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.employerId = this.route.snapshot.paramMap.get('id');
    if(this.employerId) {
      this.onGetProfileInfo();
    }
  }

  onGetProfileInfo() {
    let requestParams: any = {};
    requestParams.id = this.employerId;
    requestParams.expand = 'account,company,job';
    requestParams.company = 'company';
    this.employerService.profileView(requestParams).subscribe(
      (response: any) => {
        this.companyProfileInfo = { ...response.details };
        this.companyProfileMeta = { ...response.meta };
        this.cd.markForCheck();
      }, error => {
        this.companyProfileInfo = {};
      }
    )
  }

  onGetChangedStatus = (value: number) => {
    this.statusValue = value;
    this.mbRef = this.modelService.open(this.statusModal, {
      windowClass: 'modal-holder',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  onChangeStatus = () => {
    this.isLoading = true;
    let requestParams: any = {};
    requestParams.id = this.employerId;
    requestParams.status = parseInt(this.statusValue);
    requestParams.status_glossary = this.statusGlossary;
    // requestParams.employer = this.employerId;
    this.employerService.changeEmployerStatus(requestParams).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.onGetProfileInfo();
        this.cd.markForCheck();
      }, error => {
        this.isLoading = false;
      }
    )
  }

  onStatusModelClose = () => {
    this.statusGlossary = "";
    this.mbRef.close();
  }

  onStatusModelSubmit = () => {
    if(this.statusGlossary) {
      this.onChangeStatus();
    }
  }

}
