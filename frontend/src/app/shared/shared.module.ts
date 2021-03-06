import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './component/login-form/login-form.component';
import { RegisterFormComponent } from './component/modal/register-form/register-form.component';
import { ResumeModalComponent } from './component/modal/resume-modal/resume-modal.component';
import { CoverModalComponent } from './component/modal/cover-modal/cover-modal.component';
import { JobDescriptionComponent } from './component/modal/job-description/job-description.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendMailJobPreviewComponent } from './component/modal/send-mail-job-preview/send-mail-job-preview.component';
import { ForgotPasswordComponent } from './component/modal/forgot-password/forgot-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ContactInfoComponent } from './component/modal/contact-info/contact-info.component';
import { NotesViewComponent } from './component/modal/notes-view/notes-view.component';
import { ControlMessagesComponent } from './component/control-messages/control-messages.component';
import { ApiService } from './service/api.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { CurrencyFormatterDirective } from './directives/currency-formatter.directive';
import { MarkAsteriskDirective } from './directives/mark-asterisk.directive';
import { NgxSelectModule } from 'ngx-select-ex';
import { DeleteModalComponent } from './component/modal/delete-modal/delete-modal.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AvatarModule } from 'ngx-avatar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ContactCardComponent } from './component/contact-card/contact-card.component';
import { RouterModule } from '@angular/router';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgInitDirective } from './directives/nginit.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ClickOutsideDirective } from './directives/clickOutside.directive';
import { AppPasswordDirective } from './directives/app-password.directive';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { SharedUserProfileComponent } from './component/shared-user-profile/shared-user-profile.component';
import { SharedJobProfileComponent } from './component/shared-job-profile/shared-job-profile.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { JobPreviewModalComponent } from '@modules/features/employer/modal/job-preview/job-preview.component';
import { PhonePipe } from './pipes/phone.pipe';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ChangePasswordComponent } from './component/change-password/change-password.component';

@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    ResumeModalComponent,
    CoverModalComponent,
    JobDescriptionComponent,
    SendMailJobPreviewComponent,
    ForgotPasswordComponent,
    ContactInfoComponent,
    NotesViewComponent,
    ControlMessagesComponent,
    NumbersOnlyDirective,
    CurrencyFormatterDirective,
    MarkAsteriskDirective,
    DeleteModalComponent,
    ContactCardComponent,
    NgInitDirective,
    ClickOutsideDirective,
    AppPasswordDirective,
    SharedUserProfileComponent,
    SharedJobProfileComponent,
    JobPreviewModalComponent,
    PhonePipe,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxSelectModule,
    GooglePlaceModule,
    TranslateModule.forChild(),
    AngularEditorModule,
    AvatarModule,
    ImageCropperModule,
    NgxSliderModule,
    PerfectScrollbarModule,
    Ng2TelInputModule,
    NgxDocViewerModule,
    CarouselModule
  ],
  exports: [
    LoginFormComponent,
    RegisterFormComponent,
    ResumeModalComponent,
    CoverModalComponent,
    JobDescriptionComponent,
    SendMailJobPreviewComponent,
    ForgotPasswordComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ContactInfoComponent,
    NotesViewComponent,
    NgSelectModule,
    GooglePlaceModule,
    ControlMessagesComponent,
    NumbersOnlyDirective,
    CurrencyFormatterDirective,
    NgxSelectModule,
    MarkAsteriskDirective,
    DeleteModalComponent,
    AngularEditorModule,
    AvatarModule,
    ImageCropperModule,
    ContactCardComponent,
    RouterModule,
    NgxSliderModule,
    NgInitDirective,
    PerfectScrollbarModule,
    ClickOutsideDirective,
    AppPasswordDirective,
    SharedUserProfileComponent,
    SharedJobProfileComponent,
    Ng2TelInputModule,
    NgxDocViewerModule,
    NgxDocViewerModule,
    JobPreviewModalComponent,
    PhonePipe,
    CarouselModule,
    ChangePasswordComponent
  ],
  providers: [ApiService]
})
export class SharedModule { }
