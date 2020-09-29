import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { Store } from '@ngxs/store';
import { SetUser } from './app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mdb-electron';
  constructor(private firebaseService: FirebaseService, private store: Store) { }

  ngOnInit() {
    // this.getCurrentUser()
    this.syncTime()
  }

  getCurrentUser() {
    this.firebaseService.getUser().then(e => {
      this.store.dispatch(new SetUser(e))
    })
  }

  syncTime() {

  }
}
