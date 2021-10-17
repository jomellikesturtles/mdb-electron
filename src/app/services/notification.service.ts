import { IUserSavedData } from '@models/interfaces';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator, CollectionName, FieldName } from './firebase.service';
import { IpcService } from './ipc.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  bookmarkObservable = new Observable<any>();

  constructor(
    private firebaseService: FirebaseService,
    private ipcService: IpcService) { }


  setNotification(notif: INotification) {

  }

}
enum NotificationType {
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface INotification extends IUserSavedData {
  type: NotificationType,
  message: string,
  description?: string;
}
