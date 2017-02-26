import {Component, ViewEncapsulation} from '@angular/core';
import {ActiveTabService} from '../_services/index';

@Component({
  selector: 'serviceSelection',
  templateUrl: 'serviceSelection.component.html',
  styleUrls: ['serviceSelection.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ActiveTabService]
})

export class ServiceSelectionComponent {
  private current: number = 0;
  private tabStarted: boolean[]= [false,false,false,false,false,false];

  constructor(private activeTabService: ActiveTabService) {
    activeTabService.wentActive$.subscribe(
      tabId => {
        this.tabStarted[tabId] = true;
      });
  }

}
