import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './component/login-form/login-form.component';
import { RegisterFormComponent } from './component/modal/register-form/register-form.component';
import { ResumeModalComponent } from './component/modal/resume-modal/resume-modal.component';
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

@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    ResumeModalComponent,
    JobDescriptionComponent,
    SendMailJobPreviewComponent,
    ForgotPasswordComponent,
    ContactInfoComponent,
    NotesViewComponent,
    ControlMessagesComponent,
    NumbersOnlyDirective,
    CurrencyFormatterDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    GooglePlaceModule,
    TranslateModule.forChild()
  ],
  exports: [
    LoginFormComponent,
    RegisterFormComponent,
    ResumeModalComponent,
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
    CurrencyFormatterDirective
  ],
  providers: [ApiService]
})
export class SharedModule { }
