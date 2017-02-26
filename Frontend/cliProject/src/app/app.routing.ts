import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './_guards/index';

const appRoutes: Routes = [
  {path: 'home', loadChildren: 'app/home/home.module#HomeModule', canActivate: [AuthGuard]},
  {path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
  {path: 'register', loadChildren: 'app/register/register.module#RegisterModule'},
  // otherwise redirect to home
  {path: '**', redirectTo: 'home'}
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true});
