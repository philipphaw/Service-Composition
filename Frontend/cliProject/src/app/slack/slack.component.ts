import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {SlackChannel} from '../_models/slackChannel';
import {SlackService, ActiveTabService} from '../_services/index';
import {NotificationService} from '../_services/index';
import {SlackChannelMessage} from "../_models/slackChannelMessage";
import {Response} from "@angular/http";

@Component({
  selector: 'app-slack',
  templateUrl: './slack.component.html',
  styleUrls: ['./slack.component.scss']
})
export class SlackComponent implements OnInit {

  @Input() tabId: number;
  @Input() name: string;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chatMsgBinding: string;

  channels: any[] = [];
  messages: SlackChannelMessage[] = [];
  loading: boolean;
  loadingMessages: boolean;
  loadingSendMessage: boolean;
  hasMessages: boolean;
  selectedChannel: SlackChannel;
  timeStampOfLastMsgReceived: number = 0;

  scrollChat: boolean = false;

  constructor(private slackService: SlackService,
              private notService: NotificationService,
              private activeTabService: ActiveTabService) {
  }

  ngOnInit() {

    this.activeTabService.wentActive(this.tabId);

    this.loading = true;
    this.slackService.channelList()
      .subscribe(
        data => {
          if (data instanceof Response) {
            data = data.json();
            if (data.ok) {
              this.notService.success('Got slack channel list!', '');
              this.fillChannelList(data.channels);
              this.loading = false;
            } else {
              this.notService.error('slack channellist failed', data.errorMsg);
              this.loading = false;
            }
          }
        },
        error => {
          this.notService.error('slack channellist error', error.message);
          this.loading = false;
        });
  }

  ngAfterViewChecked() {
    if(this.scrollChat){
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    console.log('scroll to bottom called');
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      if(this.myScrollContainer.nativeElement.scrollHeight > 0){
        this.scrollChat = false;
        console.log('dont scroll anymore');
      }
    } catch (err) {
      console.log(err);
    }
  }

  getChannelMessages(channel: SlackChannel, lastTimeStamp: number) {
    this.loadingMessages = true;
    this.slackService.channelMessages(channel, lastTimeStamp)
      .subscribe(
        data => {
          if (data instanceof Response) {
            data = data.json();
            this.loadingMessages = false;
            if (data.ok) {
              this.notService.success('Got slack channelmessages!', '');
              this.setTimeStampOfLastMsg(data.timeStampOfLastMsg);
              this.scrollChat = true;
              this.appendMessages(data.messages);
            } else {
              this.notService.error('slack channelmessages failed', data.errorMsg);
            }
          }
        },
        error => {
          this.notService.error('slack channelmessages error', error.message);
          this.loadingMessages = false;
        });
  }

  sendMessage(channelId: string, message: string) {
    this.loadingSendMessage = true;
    this.slackService.sendMessage(channelId, message)
      .subscribe(
        data => {
          if (data instanceof Response) {
            data = data.json();
            this.loadingSendMessage = false;
            if (data.ok) {
              this.notService.success('slack message sent!', '');
              this.refresh();
            } else {
              this.notService.error('slack sending message failed', data.errorMsg);
            }
          }
        },
        error => {
          this.notService.error('slack sending message error', error.message);
          this.loadingSendMessage = false;
        });
  }

  setTimeStampOfLastMsg(ts: number) {
    this.timeStampOfLastMsgReceived = ts;
  }

  appendMessages(newMessages: SlackChannelMessage[]) {
    this.messages = this.messages.concat(newMessages);
    if (this.messages.length > 0) {
      this.hasMessages = true;
    }
    this.scrollToBottom();
  }

  /**
   * Clear timestamp and messages array
   */
  channelChanged() {
    this.timeStampOfLastMsgReceived = 0;
    this.messages = [];
    this.hasMessages = false;
  }

  refresh() {
    this.getChannelMessages(this.selectedChannel, this.timeStampOfLastMsgReceived + 1);
  }

  sendPressed() {
    this.sendMessage(this.selectedChannel.id, this.chatMsgBinding);
    this.chatMsgBinding = ''; //refresh chatbox content
  }

  channelClicked(channel: SlackChannel) {
    if (this.selectedChannel !== channel) {
      //new channel selection,reset channelmessages
      this.channelChanged();
    }
    this.selectedChannel = channel;
    this.getChannelMessages(this.selectedChannel, this.timeStampOfLastMsgReceived);
  }

  fillChannelList(channelList: any[]) {
    this.channels = channelList;
  }

}
