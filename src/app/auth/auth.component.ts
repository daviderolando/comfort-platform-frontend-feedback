import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../notification/notification.service';

import { AuthService } from './auth.service';
import { AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  private notifSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.notificationService.arrNotifications = [];
    this.notificationService.notificationChanged.next([]);
  }

  onSubmit(form: NgForm) {
    // // console.log(form.value);

    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const username = form.value.username;
    const password = form.value.password;

    const authObs: Observable<AuthResponseData> = this.authService.signIn(username, password);

    authObs.subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/feedback']);
        form.reset();
      },
      (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
      }
    );
  }
}
