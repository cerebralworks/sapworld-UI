import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NgPagination } from './components/paginator/ng-pagination/ng-pagination.component';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { ApiService } from './services/api.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [PaginatorComponent, NgPagination,ControlMessagesComponent, SortIconComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
	
	NgbModule,
    ImageCropperModule,
    GooglePlaceModule,
    AngularEditorModule,
    NgxIntlTelInputModule,
	
    InlineSVGModule
  ],
  exports: [
    PaginatorComponent,
    NgPagination,
    ControlMessagesComponent,
    SortIconComponent,
    FormsModule,
    ReactiveFormsModule,
	
	NgbModule,
    ImageCropperModule,
    GooglePlaceModule,
    AngularEditorModule,
    NgxIntlTelInputModule,
	
	
    InlineSVGModule
  ],
  providers: [ApiService]
})
export class SharedModule { }
