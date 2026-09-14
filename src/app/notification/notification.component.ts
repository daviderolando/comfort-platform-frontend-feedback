import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  private notifSub: Subscription;
  private delNotifSub: Subscription;

  arrNotifications: Notification[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.arrNotifications = this.notificationService.arrNotifications;

    this.notifSub = this.notificationService.getUserNotifications().subscribe(
      data => {
        // console.log('Notification header subscription:');
        // console.log(data);
        if ( data.notifications ) {
          // this.notificationService.arrNotifications = data.notifications;
          // this.notificationService.notificationChanged.next([...data.notifications]);
          // this.arrNotifications = [...data.notifications];
          this.arrNotifications = this.notificationService.arrNotifications;
        }
      }
    );


    // if(this.notificationService.hasNotifications.length)
    // {

    // }
  }

  onGotIt(idx: number, hash: string){
    // console.log(idx + ' ' + hash);

    // this.arrNotifications.splice(idx, 1);
    this.arrNotifications = this.arrNotifications.filter(el => {
      return el.hash != hash;
    });

    this.delNotifSub = this.notificationService.delUserNotification(idx, hash).subscribe();
    // this.notificationService.arrNotifications = [...this.notificationService.arrNotifications];
    // this.notificationService.notificationChanged.next([...this.notificationService.arrNotifications]);
  }

  ngOnDestroy(){
    if ( this.delNotifSub ){
      this.delNotifSub.unsubscribe();
    }
    if ( this.notifSub ){
      this.notifSub.unsubscribe();
    }
  }
}
