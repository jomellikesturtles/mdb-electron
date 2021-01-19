import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'mdb-win32-x64/resources/app/src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CountState } from '../app.state';
import { SelectedMoviesState } from '../movie.state';
import { AppRunState } from '../states/app-run.state';

import { FirebaseService } from './firebase.service';
const FirestoreStub = {
  collection: (name: string) => ({
    doc: (_id: string) => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: (_d: any) => new Promise((resolve, _reject) => resolve()),
    }),
  }),
};
describe('FirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    // imports: [AngularFireModule],
    imports: [

      AngularFireModule.initializeApp(environment.firebase),
      NgxsModule.forRoot([CountState, SelectedMoviesState, AppRunState]),
      AngularFireAuthModule,
      AngularFirestoreModule,
      HttpClientModule
    ],
    providers: [{provide: AngularFirestore, useValue: FirestoreStub}]
  }
  ));

  it('should be created', () => {
    const service: FirebaseService = TestBed.get(FirebaseService);
    expect(service).toBeTruthy();
  });
});
