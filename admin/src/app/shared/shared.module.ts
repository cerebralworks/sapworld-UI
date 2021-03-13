import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NgPagination } from './components/paginator/ng-pagination/ng-pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { ApiService } from './services/api.service';
@NgModule({
  declarations: [PaginatorComponent, NgPagination, SortIconComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule
  ],
  exports: [
    PaginatorComponent,
    NgPagination,
    SortIconComponent,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule
  ],
  providers: [ApiService]
})
export class SharedModule { }
