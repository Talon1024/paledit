import { Component, OnInit } from '@angular/core';
import { MessageService, IMessage } from '../message.service';

@Component({
  selector: 'app-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.css']
})
export class MessageLogComponent implements OnInit {

  messages: IMessage[];

  constructor(private msg: MessageService) { }

  ngOnInit() {
    this.msg.subscribe((m) => {
      this.messages.push(m);
    });
  }

  getMessageClass(msg: IMessage) {
    return `mlvl ${msg.level}`;
  }

}
