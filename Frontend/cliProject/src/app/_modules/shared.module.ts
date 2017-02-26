/**
 * Created by PhilippMac on 17.02.17.
 */
import {NgModule}            from '@angular/core';
import {FormsModule}         from '@angular/forms';
import {CommonModule}  from '@angular/common';
import {XHRBackend} from '@angular/http';
import {CustomBackend} from '../_services/CustomBackend';
import {APP_CONFIG, AppConfig} from '../_models/app.config';

import {
  MdButtonModule,
  MdToolbarModule,
  MdIconModule,
  MdInputModule,
  MdCardModule,
  MdProgressCircleModule,
  MdMenuModule,
  MdSidenavModule
} from '@angular/material';


@NgModule({
  declarations: [],
  exports: [FormsModule, CommonModule, MdSidenavModule, MdButtonModule, MdToolbarModule, MdIconModule, MdInputModule, MdCardModule, MdMenuModule, MdProgressCircleModule],
  imports: [MdSidenavModule, MdButtonModule, MdToolbarModule, MdIconModule, MdInputModule, MdCardModule, MdProgressCircleModule, MdMenuModule],
  providers: [
    {provide: APP_CONFIG, useValue: AppConfig},
    {provide: XHRBackend, useExisting: CustomBackend}
  ]
})
export class SharedModule {
}
