import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {MdIconRegistry, OVERLAY_PROVIDERS, InteractivityChecker,MdSnackBar,MdSnackBarContainer,MdSnackBarModule} from '@angular/material';
import {AppComponent} from './app.component';
import {routing}        from './app.routing';
import {SharedModule} from './_modules/shared.module';
import {ChangeBgColorDirective, ScrollIntoViewDirective} from './_directives/index';
import {AuthGuard} from './_guards/index';
import {
  AuthenticationService,
  UserService,
  FileStorageService,
  ActiveTabService,
  TeamService,
  VersionControlService,
  InformNewTeamService,
  SlackService,
  AbstractFileStorageService,
  NotificationService
} from './_services/index';
import {APP_CONFIG, AppConfig} from './_models/app.config';
import {XHRBackend} from '@angular/http';
import {CustomBackend} from './_services/CustomBackend';
import {LoginModule} from './login/login.module';

@NgModule({
  declarations: [
    AppComponent,
    ChangeBgColorDirective,
    ScrollIntoViewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing,
    MdSnackBarModule,
    SharedModule,
    LoginModule
  ],
  providers: [
    AuthGuard,
    MdSnackBar,
    AuthenticationService,
    UserService,
    TeamService,
    FileStorageService,
    VersionControlService,
    ActiveTabService,
    InformNewTeamService,
    SlackService,
    AbstractFileStorageService,
    NotificationService,
    OVERLAY_PROVIDERS,
    MdIconRegistry,
    InteractivityChecker,
    {provide: APP_CONFIG, useValue: AppConfig},
    CustomBackend,
    {provide: XHRBackend, useExisting: CustomBackend}
  ],
  entryComponents: [
    MdSnackBarContainer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
