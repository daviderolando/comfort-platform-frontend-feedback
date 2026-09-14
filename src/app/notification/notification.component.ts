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


    // if(this.notificationService.hasNotifications.length)
    // {

    // }
  }

  onGotIt(idx: number, hash: string){
    window.alert('Not implemented yet. Notification updates will be connected to the FastAPI backend later.');
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
