/**
 * Created by PhilippMac on 18.02.17.
 */
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import {Injectable} from '@angular/core';

@Injectable()
export class NotificationService {

  constructor(private mdSnackBar: MdSnackBar) {
    console.log('notservice constructor');
  }

  public success(message: string, info: string) {
    let config = new MdSnackBarConfig();
    config.duration = 2000;
    config.extraClasses = ['snackBarSuccess'];
    this.openSnackBarWithConfig(message + ': ' + info, config);
  };

  public error(message: string, errorMsg: string) {
    let config = new MdSnackBarConfig();
    config.duration = 2000;
    config.extraClasses = ['snackBarError'];
    this.openSnackBarWithConfig(message + ': ' + errorMsg, config);
  }

  private openSnackBarWithConfig(message: string, config: MdSnackBarConfig) {
    this.mdSnackBar.open(message, '', config);
  }

}
