import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  type = 'info'
  message = 'this is message'
  constructor() { }

  ngOnInit() {
  }

}
