import { Component, OnInit } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Subscription } from 'rxjs';
import { WebSocketService } from '@services/socket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mdb-electron';
  constructor(private webSocketService: WebSocketService) { }
  messageSubscription: Subscription;
  ngOnInit() {
    // this.messageSubscription = this.webSocketService.get.subscribe(msg => {
    //   console.log("Response from websocket: " + msg);
    // });

    // this.getCurrentUser()
    this.syncTime();
  }

  getCurrentUser() {
    // this.firebaseService.getUser().then(e => {
    //   this.store.dispatch(new SetUser(e))
    // })
  }

  syncTime() {

  }
}
