import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/index';
import {NotificationService} from '../_services/index';
import {Response} from "@angular/http";
import {User} from '../_models/index';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private notService: NotificationService) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          if (data instanceof Response) {
            data = data.json();
            if (data.ok) {
              var user = new User(this.model.username, btoa(this.model.username + ':' + this.model.password));
              localStorage.setItem('currentUser', JSON.stringify(user));
              console.log(localStorage.getItem('currentUser'));
              this.notService.success('Logged in!','');
              this.router.navigate(['/home']);
            } else {
              this.notService.error('Login failed', data.errorMsg);
              this.loading = false;
            }
          }
        },
        error => {
          this.notService.error('login error', error.message);
          this.loading = false;
        });
  }
}
