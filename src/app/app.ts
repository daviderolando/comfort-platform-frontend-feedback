import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly session$ = this.authService.session$;

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
