/**
 * Created by PhilippMac on 17.02.17.
 */
import {NgModule}            from '@angular/core';
import {SharedModule} from '../_modules/shared.module';
import {TeamAreaComponent} from '../teamArea/teamArea.component';
import {UserAreaComponent} from '../userArea/userArea.component';
import {ServiceSelectionComponent} from '../serviceSelection/serviceSelection.component';
import {FileStorageComponent} from '../fileStorage/fileStorage.component';
import {AbstractFileStorageComponent} from '../abstractFileStorage/abstractFileStorage.component';
import {VersionControlComponent} from '../versionControl/versionControl.component';
import {AuthSettingsComponent} from '../auth-settings/auth-settings.component';
import {CreateTeamComponent} from '../create-team/create-team.component';
import {ChangeTeamComponent} from '../change-team/change-team.component';
import {JoinTeamComponent} from '../join-team/join-team.component';
import {SlackComponent} from '../slack/slack.component';
import {HomeComponent}       from './home.component';
import {FileSizePipe} from '../_pipes/fileSize.pipe';
import {MdDataTableModule} from '../data-table/index';
import {routing} from './home.routing';

import {
  MdTabsModule,
  MdTooltipModule,
  MdProgressBarModule,
  MdIconModule,
  MdRadioModule,
  MdListModule,
  MdDialogModule,
  UniqueSelectionDispatcher,
  MdDialog
} from '@angular/material';

@NgModule({
  imports: [SharedModule, routing,MdTabsModule,MdTooltipModule,MdProgressBarModule,MdIconModule,MdRadioModule,MdListModule,MdDialogModule,MdDataTableModule],
  declarations: [
    HomeComponent,
    TeamAreaComponent,
    UserAreaComponent,
    ServiceSelectionComponent,
    FileStorageComponent,
    AbstractFileStorageComponent,
    VersionControlComponent,
    AuthSettingsComponent,
    CreateTeamComponent,
    ChangeTeamComponent,
    JoinTeamComponent,
    SlackComponent,
    FileSizePipe
  ],
  entryComponents: [
    AuthSettingsComponent,
    CreateTeamComponent,
    ChangeTeamComponent,
    JoinTeamComponent,
  ],
  providers: [
    UniqueSelectionDispatcher,
    MdDialog
  ]
})
export class HomeModule {
}
