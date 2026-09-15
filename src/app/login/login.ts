import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    username: new FormControl('davide', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('demo', { nonNullable: true, validators: [Validators.required] }),
  });

  isLoading = false;
  errorMessage = '';

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.form.controls.username.value, this.form.controls.password.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/feedback');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.detail ?? 'Login failed.';
      },
    });
  }
}
