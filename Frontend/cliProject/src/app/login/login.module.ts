/**
 * Created by PhilippMac on 17.02.17.
 */
import {NgModule}            from '@angular/core';
import {SharedModule} from '../_modules/shared.module';
import {LoginComponent}       from './login.component';
import {routing} from './login.routing';

@NgModule({
  imports: [SharedModule,routing],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule {
}
