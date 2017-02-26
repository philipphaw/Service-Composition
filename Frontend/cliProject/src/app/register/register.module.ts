/**
 * Created by PhilippMac on 17.02.17.
 */
import {NgModule}            from '@angular/core';
import {SharedModule} from '../_modules/shared.module';
import {RegisterComponent}       from './register.component';
import {routing} from './register.routing';

@NgModule({
  imports: [SharedModule,routing],
  declarations: [
    RegisterComponent
  ]
})
export class RegisterModule {
}
