import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FeedbackOption } from './feedback.models';
import { FeedbackService } from './feedback.service';

@Component({
  selector: 'app-feedback',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback implements OnInit {
  private readonly feedbackService = inject(FeedbackService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly changeDetector = inject(ChangeDetectorRef);

  options: FeedbackOption[] = [];
  selectedOption: FeedbackOption | null = null;
  isLoadingOptions = true;
  isSubmitting = false;
  loadError = '';

  readonly form = new FormGroup({
    intensity: new FormControl(1, { nonNullable: true, validators: [Validators.min(1), Validators.max(3)] }),
    comment: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
  });

  ngOnInit(): void {
    this.feedbackService.getOptions().subscribe({
      next: (options) => {
        this.options = options;
        this.isLoadingOptions = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loadError = 'Could not load feedback options.';
        this.isLoadingOptions = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  selectOption(option: FeedbackOption): void {
    if (option.codename === 'everything_ok') {
      this.submit(option);
      return;
    }

    this.selectedOption = option;
    this.form.reset({ intensity: 1, comment: '' });
  }

  cancelSelection(): void {
    this.selectedOption = null;
    this.form.reset({ intensity: 1, comment: '' });
  }

  submit(option = this.selectedOption): void {
    if (!option || this.form.invalid || this.isSubmitting) {
      return;
    }

    const comment = this.form.controls.comment.value.trim();
    const payload = {
      codename: option.codename,
      intensity: option.codename === 'everything_ok' ? null : this.form.controls.intensity.value,
      comment: comment || null,
    };

    this.isSubmitting = true;
    this.feedbackService.submitFeedback(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cancelSelection();
        this.snackBar.open('Thank you for your feedback.', 'OK', { duration: 2500 });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.snackBar.open(error?.error?.detail ?? 'Could not send feedback.', 'OK', { duration: 3500 });
      },
    });
  }

  cssClass(option: FeedbackOption): string {
    return `feedback-${option.color ?? 'default'}`;
  }
}
