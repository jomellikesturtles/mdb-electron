import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mdb-electron';
  constructor() { }

  ngOnInit() {
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
