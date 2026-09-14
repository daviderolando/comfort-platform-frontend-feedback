import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

// The data format that the API endpoint will require for receiving new Feedback
export interface FeedbackRequestData {
  codename: string;
  comment: string;
  intensity?: number;
  extra?: any;
}

export interface FeedbackResponseAdd {
  "status": boolean,
  "debug": any,
  "code": number,
  "errors": string[],
  "username": string
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  // private addApiUrl = environment.feedbackEndPointAPI + '/add-feedback';
  private addApiUrl = environment.feedbackEndPointAPI;
  private chartApiUrl = environment.feedbackEndPointAPI + "/summary";
  private chartNeighApiUrl = environment.feedbackEndPointAPI + "/summary-compare";
  // private addApiUrl = environment.feedbackEndPointAPI + '/test';

  constructor(private authService: AuthService, private http: HttpClient) {}

  /**
   * Send Feedback
   * @param addFeedbackPost
   */
  sendFeedback(addFeedbackPost: FeedbackRequestData) {

    return this.http
      // .post<any>(this.addApiUrl, addFeedbackPost, httpOptions)
      .post<FeedbackResponseAdd>(this.addApiUrl, addFeedbackPost)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          // Do something with the response
          // console.log(resData);
          console.log("🚀 ~ file: feedback.service.ts ~ line 48 ~ FeedbackService ~ sendFeedback ~ resData", resData)
      }));
  }

  /**
   * Get Feedbacks to populate the chart
   */
  getFeedbackChartData() {
    // const token = "eyJraWQiOiIxOWZNTzc1ek5wOFAwNzNTeFY1MDJrMHk0SmFZY0R5a1VRbVNoaTR6bVFvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkZTg5YWE0Yi05MDk4LTQ1NzMtYmUyZi00YjdlNDA1NjNlM2QiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfSkhrWUxRODdtIiwiY29nbml0bzp1c2VybmFtZSI6ImRhdmlkZTIiLCJvcmlnaW5fanRpIjoiZjM5OGNmYTctZDc5Mi00Nzk2LWIyMmItZDk3NmNjMmZkODQzIiwiYXVkIjoiNnNhdDVibjU4czZvNmNpaWtlc2JpaTVjNXEiLCJldmVudF9pZCI6ImNkZWYzNzVmLTUxMWYtNDEyOS1hNTBiLWJhMDU5NmQxNzRhNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM0NDg3NDg4LCJleHAiOjE2MzQ0OTEwODgsImlhdCI6MTYzNDQ4NzQ4OSwianRpIjoiNjAzMjNkYWUtNjkyYy00ODQ3LTgzMzItYjQ4Zjc0YzQzYWUwIiwiZW1haWwiOiJkYXZpZGUucm9sYW5kb0BnbWFpbC5jb20ifQ.BwNeqzlAY-815iXFvY2cZatYHxhJgzCN1UQ6t6dhaHRtdheQQqn0GCx3fwuyC1rzOEHKdJom1EmPUvwnVfUlQRvUXSbnf5dqLQZiR3bMUgqfJtFPuT99bGQiHh3jCCPZRM1pj-IRl4dVMPGVHVfWMi0gl9N0kAnzLcPVQ856wO0AJRm1r-XSFZRqBWHK_8va4y_11YfUKVqyqRAHz4rICJukB2cnrVjkmBR3b8_IVa7s082z_MA-w-DDOLPKbHi9gQYlZJgdVGBamFVWJS-GMUHV_uttRz5iK6I9-V93VYG1uzXm0yeySS6R-ABrJvDSKr-lhJYPO5HNOqGi76JVKw"
    return this.http.get<any>(this.chartApiUrl)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          // Do something with the response
          // console.log('My feedbacks:');
          console.log(resData);
        }),
        map(resData => {
          let resFeedbacks = resData.feedbacks;
          let labels = [];
          let feedbacks = [];

          if (resFeedbacks && resFeedbacks.length) {
            resFeedbacks.forEach(element => {
              labels.push(element.codename);
              feedbacks.push(+element.count);
            });
          }

          return {
            'labels': this.mapLabels(labels),
            'feedbacks': feedbacks,
          };
        }),
      );
  }

  /**
   * Get Neighbourhood Feedbacks to populate the chart
   */
  getFeedbackNeighChartData() {
    // const token = "eyJraWQiOiIxOWZNTzc1ek5wOFAwNzNTeFY1MDJrMHk0SmFZY0R5a1VRbVNoaTR6bVFvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkZTg5YWE0Yi05MDk4LTQ1NzMtYmUyZi00YjdlNDA1NjNlM2QiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfSkhrWUxRODdtIiwiY29nbml0bzp1c2VybmFtZSI6ImRhdmlkZTIiLCJvcmlnaW5fanRpIjoiZjM5OGNmYTctZDc5Mi00Nzk2LWIyMmItZDk3NmNjMmZkODQzIiwiYXVkIjoiNnNhdDVibjU4czZvNmNpaWtlc2JpaTVjNXEiLCJldmVudF9pZCI6ImNkZWYzNzVmLTUxMWYtNDEyOS1hNTBiLWJhMDU5NmQxNzRhNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM0NDg3NDg4LCJleHAiOjE2MzQ0OTEwODgsImlhdCI6MTYzNDQ4NzQ4OSwianRpIjoiNjAzMjNkYWUtNjkyYy00ODQ3LTgzMzItYjQ4Zjc0YzQzYWUwIiwiZW1haWwiOiJkYXZpZGUucm9sYW5kb0BnbWFpbC5jb20ifQ.BwNeqzlAY-815iXFvY2cZatYHxhJgzCN1UQ6t6dhaHRtdheQQqn0GCx3fwuyC1rzOEHKdJom1EmPUvwnVfUlQRvUXSbnf5dqLQZiR3bMUgqfJtFPuT99bGQiHh3jCCPZRM1pj-IRl4dVMPGVHVfWMi0gl9N0kAnzLcPVQ856wO0AJRm1r-XSFZRqBWHK_8va4y_11YfUKVqyqRAHz4rICJukB2cnrVjkmBR3b8_IVa7s082z_MA-w-DDOLPKbHi9gQYlZJgdVGBamFVWJS-GMUHV_uttRz5iK6I9-V93VYG1uzXm0yeySS6R-ABrJvDSKr-lhJYPO5HNOqGi76JVKw"
    return this.http.get<any>(this.chartNeighApiUrl)
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        // Do something with the response
        // console.log('Neighbourhood feedbacks:');
        // console.log(resData);
      }),
      map(resData => {
        let resFeedbacks = resData.feedbacks;
        let labels = [];
        let feedbacks = [];

        if (resFeedbacks && resFeedbacks.length) {
          resFeedbacks.forEach(element => {
            labels.push(element.codename);
            feedbacks.push(+element.avg);
          });
        }

        return {
          'labels': this.mapLabels(labels),
          'feedbacks': feedbacks,
        };
      }),
    );
  }

  private mapLabels(labels: string[])
  {
    let newLabels = [];
    const labelMap = {
      'all-good' : 'Ok',
      'too-humid' : 'Humid',
      'too-dry' : 'Dry',
      'too-noisy' : 'Noisy',
      'poor-air-quality' : 'Air quality',
      'too-cold' : 'Cold',
      'too-warm' : 'Warm'
    }

    labels.forEach(el => {
      if( el in labelMap){
        newLabels.push(labelMap[el]);
      } else {
        newLabels.push(el);
      }
    });
    return newLabels;
  }

  /**
   * Handle errors
   */
  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred.';

    // console.log(errorRes);

    if (!errorRes.error || !errorRes.error.code || !errorRes.error.errors){
      return throwError(errorMessage);
    }
    switch(errorRes.error.code){
      case 422:
        // errorMessage = errorRes.error.errors[0];
        errorMessage = errorRes.error.errors;
      break;
      default:
        errorMessage = 'Invalid credentials';
      break;
    }
    return throwError(errorMessage);
  }
}
