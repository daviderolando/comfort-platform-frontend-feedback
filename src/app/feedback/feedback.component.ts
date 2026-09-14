import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';
import { FeedbackService, FeedbackRequestData } from './feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit, OnDestroy {
  private subFeedbackAdd: Subscription;

  isFeedbackSelected = false;
  feedbackTypeSelected: string;

  public intensityValue: number = 1;
  public intensityLevel = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };
  public intensityNeeded: boolean = true;

  public notificationTimeInterval: Subscription;

  public feedbackForm: FormGroup;
  error = false;

  // Feedback alerts
  feedbackAdded = false;
  feedbackAddedSoon = false;
  errorMessages: string[];

  // noHtmlTagsRegex = /.*\S.*/;
  // noHtmlTagsRegex = "^[a-z0-9_-\s]{8,15}$";
  noHtmlTagsRegex = "[-_a-zA-Z0-9 .!?']*";
  // noHtmlTagsRegex = '^[(?!s{2,}).]*$';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private feedbackService: FeedbackService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Polling for new notifications
    if (this.authService.user.value) {
      // Timer interval
      // Start polling for new notifications (on every login this will reset)
      // this.notificationTimeInterval = interval(120000)
      //   .pipe(
      //     startWith(0),
      //     switchMap(() => this.notificationService.getUserNotifications())
      //   )
      //   .subscribe((pollData) => {
      //     // this.notificationService.arrNotifications = [...pollData];
      //     // this.notificationService.notificationChanged.next([...pollData]);
      //     // console.log('Feedback Component polling subscription');
      //     // console.log('Number of notificaitons: ' + pollData.length);
      //   });
    }
  }

  changeIntensity(value: number) {
    this.intensityValue = value;
  }

  onFeedback(feedbackType: string) {
    // console.log('Form init', this.feedbackForm);

    // console.log(feedbackType);
    this.feedbackTypeSelected = feedbackType;
    this.isFeedbackSelected = true;

    // Init intensity
    this.intensityValue = 1;
    // Don't show intensity for all-good
    if (feedbackType != 'all-good') {
      this.intensityNeeded = true;
    } else {
      this.intensityNeeded = false;
    }
  }

  // onFeedbackComment() {
  //   // console.log('Feedback comment');
  //   this.isFeedbackSelected = false;
  // }

  private initForm() {
    // console.log('Form init', this.feedbackForm);

    let feedbackComment = '';

    if (this.isFeedbackSelected) {
      feedbackComment = "I've left this comment because ...";
    }

    this.feedbackForm = new FormGroup({
      comment: new FormControl(feedbackComment, [
        Validators.maxLength(100),
        Validators.pattern(this.noHtmlTagsRegex),
      ]),
      intensity: new FormControl(this.intensityValue, [
        Validators.min(1),
        Validators.max(3),
      ]),
    });
  }

  get comment() {
    return this.feedbackForm.get('comment');
  }

  /**
   * Form submit
   */
  onSubmit() {
    // console.log(this.feedbackForm);
    // this.router.navigate(['/'], {relativeTo: this.route});

    window.alert('Not implemented yet. Feedback will be sent to the FastAPI backend later.');

    // Return to the original Feedback panel
    this.isFeedbackSelected = false;
  }

  // noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace =
  //     ((control && control.value && control.value.toString()) || '').trim()
  //       .length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { whitespace: true };
  // }

  ngOnDestroy() {
    if (this.subFeedbackAdd) {
      this.subFeedbackAdd.unsubscribe();
    }
  }
}
