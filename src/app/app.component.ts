import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { SwPush, SwUpdate } from "@angular/service-worker";
import { Router } from '@angular/router';

const VERSION = '0.1.22.09a';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // title = 'ng-feedback-app';
  isAuthenticated = false;

  constructor(
    private authService: AuthService, private router: Router, private swUpdate: SwUpdate
  ) { }

  ngOnInit() {
    // Console log version
    console.log('Version: ', VERSION);
    // Autologin
    this.authService.autoLogin();
    this.authService.authStatusChanged.subscribe(
      (authenticated) => {
        console.log("🚀 ~ file: app.component.ts ~ line 32 ~ AppComponent ~ ngOnInit ~ this.authService.authStatusChanged: authenticated", authenticated)
        this.isAuthenticated = authenticated;
        if (authenticated) {
          this.router.navigate(['/feedback']);
        } else {
          this.router.navigate(['/']);
        }
      }
    );
    this.authService.initAuth();

    // Check if a new version of the app is available
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("A new version of the App is available. Do you want to load the new version?")) {
          window.location.reload();
        }
      });
    }
  }
}
