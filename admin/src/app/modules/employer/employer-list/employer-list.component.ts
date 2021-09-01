import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmployerService } from '@data/service/employer.service';
import { PaginatorState } from '@shared/models/paginator.model';
import { SortState } from '@shared/models/sort.model';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.scss']
})
export class EmployerListComponent implements OnInit {
  public filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  public sorting: SortState;
  public employerList: any = {};
  public paginator: PaginatorState;
  public isLoading: boolean = false;
  public searchField: FormControl = new FormControl();
  
  constructor(
    private fb: FormBuilder,
    private employerService: EmployerService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.paginator = new PaginatorState();
    
    this.searchField.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      let extraParams: any = {};
      extraParams.search = term ? term : '';
      this.onGetEmployers(extraParams);
    });

    this.onGetEmployers();
  }

  onGetEmployers(extraParams: any = {}) {
    let requestParams: any = {...extraParams};
    requestParams.page = this.paginator.page;
    requestParams.limit = this.paginator.pageSize;
    requestParams.expand = "account"
    this.employerService.getEmployers(requestParams).subscribe(
      response => {
        this.employerList = response;
        this.paginator.total = (this.employerList.meta  && this.employerList.meta.total) ? this.employerList.meta.total : 0;        
        this.cd.markForCheck();
        
      }, error => {
      }
    )
  }

  onFilterWithStatus = (value) => {
    let extraParams: any = {};
    extraParams.status = value ? parseInt(value) : '';
    this.onGetEmployers(extraParams);
  }

  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    console.log('sorting', sorting);
    
    // this.customerService.patchState({ sorting });
  }

  paginate(paginator: PaginatorState) {
    console.log('paginator', paginator);
    this.onGetEmployers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
