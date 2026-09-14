import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/notification.model';
import { Router } from '@angular/router';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Define a variable to keep track of the subcription to the User BehaviorSubject
  private userSub: Subscription;
  private notifSub: Subscription;
  private notifChangeSub: Subscription;

  private dropdownShown: boolean = false;

  public notificationTimeInterval: Subscription;

  isAuthenticated = false;
  hasNotifications: Notification[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get authentication status
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;

      if(this.isAuthenticated){

        // Get User Notifications
        // this.notifSub = this.notificationService
        //   .getUserNotifications()
        //   .subscribe((data) => {
        //     this.hasNotifications = data;
        //     this.notificationService.arrNotifications = data;
        //   });

        this.notificationService.notificationChanged.subscribe((data) => {
          // console.log('Weird sub ' + data.length);
          this.hasNotifications = data;
        });
      }

    });

  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.notifSub) {
      this.notifSub.unsubscribe();
    }
    if (this.notifChangeSub) {
      this.notifChangeSub.unsubscribe();
    }

    this.notificationTimeInterval.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onCheckNotifications() {
    this.router.navigate(['../notification']);
  }

  onShowMenu() {
    if (!this.dropdownShown) {
      this.dropdownShown = true;
    }
  }

  onFocusOut() {
    // alert("Close it!");
    let btnNavbar = document.getElementById('navbar-toggler-button');
    if (this.dropdownShown && !btnNavbar.classList.contains('collapsed')) {
      setTimeout(() => {
        document.getElementById('navbar-toggler-button').click();
        this.dropdownShown = false;
      }, 400);
    }
  }
}
