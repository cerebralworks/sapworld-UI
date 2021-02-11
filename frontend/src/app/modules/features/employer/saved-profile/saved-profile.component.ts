import { Component, OnInit } from '@angular/core';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-saved-profile',
  templateUrl: './saved-profile.component.html',
  styleUrls: ['./saved-profile.component.css']
})
export class SavedProfileComponent implements OnInit {

  public isOpenedResumeModal: boolean = false;
  public isOpenedAddNotesModal: boolean = false;
  public isOpenedNotesViewModal: boolean = false;
  public savedProfile: any[] = [];
  public page: number = 1;
  public limit: number = 25;
  public savedProfileMeta: any;
  public selectedResumeUrl: string;

  constructor(
    private employerService: EmployerService,
    public sharedService: SharedService,
    public utilsHelperService: UtilsHelperService
  ) { }

  ngOnInit(): void {
    this.onGetSavedProfile()
  }

  onGetSavedProfile = () => {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    // requestParams.expand = "city,account";
    requestParams.status = 1;
    this.employerService.savedProfiles(requestParams).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.savedProfile = [...this.savedProfile, ...response.items];
        }
        this.savedProfileMeta = { ...response.meta }
      }, error => {
      }
    )
}

onLoadMoreJob = () => {
  this.page = this.page + 1;
  this.onGetSavedProfile();
}

  onToggleResumeForm = (status, selectedResumeUrl?: string) => {
    if (selectedResumeUrl) {
      this.selectedResumeUrl = selectedResumeUrl;
    }
    this.isOpenedResumeModal = status;
  }

  onToggleAddNotesModal = (status) => {
    this.isOpenedAddNotesModal = status;
  }

  onToggleNotesViewModal = (status) => {
    this.isOpenedNotesViewModal = status;
  }

  chunk = (array: any[] = [], chunkSize) => {
    return [].concat.apply([],
        array.map(function(elem,i) {
            return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
        })
    );
}

onGetFilteredValue(resumeArray: any[]): any {
  if(resumeArray && Array.isArray(resumeArray)) {
    const filteredValue = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1);
    if(!this.utilsHelperService.isEmptyObj(filteredValue)) {
      return filteredValue.file;
    }
  }
  return "";
}

}
