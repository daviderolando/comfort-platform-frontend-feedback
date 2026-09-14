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

    const username = form.value.username;
    const password = form.value.password;

    // Definition of an Observable of type AuthResponseData (defined in auth.service.ts)
    // let authObs: Observable<AuthResponseData>;
    let authObs: Observable<any>;

    // Check if the mode is Login (and not Signup, for example)
    if (this.isLoginMode) {
      // Login through the service
      // Instatiate an Observable
      // authObs = this.authService.login(email, password);
      authObs = this.authService.signIn(username, password);

    }

    // Subscribe to the Observable
    authObs.subscribe(
      // Next
      (resData) => {
        // console.log("SignIn Success", resData);
        this.isLoading = false;
        this.router.navigate(['/feedback']);
      },
      // Error
      (errorMessage) => {
        // console.log(errorMessage);

        this.error = errorMessage;
        this.isLoading = false;
      }
      // Complete
    );

    form.reset();
  }
}
