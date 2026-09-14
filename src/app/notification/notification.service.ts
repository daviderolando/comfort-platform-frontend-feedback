import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { Notification } from "./notification.model";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationUserApiUrl = environment.notificationEndPointAPI;

  public arrNotifications: Notification[] = [];
  public notificationChanged: Subject<Notification[]> = new Subject<Notification[]>();

  constructor(private authService: AuthService, private http: HttpClient) {}

  getUserNotifications() {
    this.arrNotifications = [];
    this.notificationChanged.next([]);
    return of({
      notifications: [],
    });

    // if (!this.authService.isLoggedIn()){
    //   return false;
    // }

    return this.http.get<any>(this.notificationUserApiUrl + '/user').pipe(
      // delay(500),
      tap((resData) => {
        // console.log("🚀 ~ file: notification.service.ts ~ line 30 ~ NotificationService ~ tap ~ resData", resData)
        // console.log("🚀 ~ file: notification.service.ts ~ line 30 ~ NotificationService ~ tap ~ resData.notifications", resData.notifications)
        // console.log("🚀 ~ file: notification.service.ts ~ line 33 ~ NotificationService ~ tap ~ this.arrNotifications", this.arrNotifications)
        // // console.log((new Date).getTime() + ' Notifications: ' + this.arrNotifications.length);
        this.arrNotifications = [...resData.notifications];
        this.notificationChanged.next([...this.arrNotifications]);
      })
    );

  }

  delUserNotification(idx: number, hash: string){
    window.alert('Not implemented yet. Notification updates will be connected to the FastAPI backend later.');
    return of({
      status: false,
    });

    // this.arrNotifications.splice(idx,1);
    this.arrNotifications = this.arrNotifications.filter(el => {
      return el.hash != hash;
    });

    // this.notificationChanged.next(this.arrNotifications);

    return this.http.post<any>(this.notificationUserApiUrl + '/as-read',
      {
        "hash": hash
      }
    ).pipe(
      // delay(500),
      tap((resData) => {
        console.log(this.arrNotifications);
        this.notificationChanged.next(this.arrNotifications);

      })
    );

  }
}
