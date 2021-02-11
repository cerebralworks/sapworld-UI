import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

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
  public searchField: FormControl = new FormControl();

  constructor(
    private employerService: EmployerService,
    public sharedService: SharedService,
    public utilsHelperService: UtilsHelperService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

    this.searchField.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(term => {
      this.page = 1;
      this.savedProfile = [];
      this.onGetSavedProfile(term);
    });


    this.onGetSavedProfile()
  }

  onGetSavedProfile = (searchString?: string) => {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.status = 1;

    if (searchString) {
      requestParams.search = searchString;
    }

    this.employerService.savedProfiles(requestParams).subscribe(
      response => {
        if (response && response.items) {
          this.savedProfile = [...this.savedProfile, ...response.items];
        }
        this.savedProfileMeta = { ...response.meta }
      }, error => {
      }
    )
  }

  onSaveProfile = (item, index) => {
    if ((item && item.id)) {
      let requestParams: any = {};
      requestParams.user_id = item.id;
      requestParams.delete = 1;
      this.employerService.saveProfile(requestParams).subscribe(
        response => {
          this.savedProfile.splice(index, 1)
        }, error => {
        }
      )
    } else {
      this.toastrService.error('Something went wrong', 'Failed')
    }
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

  chunk = (array: any[], chunkSize) => {
    if (array && Array.isArray(array) && array.length) {
      return [].concat.apply([],
        array.map(function (elem, i) {
          return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
      );
    }
    return [];
  }

  onGetFilteredValue(resumeArray: any[]): any {
    if (resumeArray && Array.isArray(resumeArray)) {
      const filteredValue = this.utilsHelperService.onGetFilteredValue(resumeArray, 'default', 1);
      if (!this.utilsHelperService.isEmptyObj(filteredValue)) {
        return filteredValue.file;
      }
    }
    return "";
  }

}
