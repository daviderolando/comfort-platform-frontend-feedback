import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, shareReplay, startWith, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { DEFAULT_FEEDBACK_OPTIONS, FeedbackCreate, FeedbackOption, FeedbackRecord } from './feedback.models';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly http = inject(HttpClient);
  private readonly options$ = this.http.get<FeedbackOption[]>(`${environment.apiBaseUrl}/feedback-options`).pipe(
    timeout(5000),
    catchError(() => of(DEFAULT_FEEDBACK_OPTIONS)),
    startWith(DEFAULT_FEEDBACK_OPTIONS),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  getOptions(): Observable<FeedbackOption[]> {
    return this.options$;
  }

  submitFeedback(payload: FeedbackCreate): Observable<FeedbackRecord> {
    return this.http.post<FeedbackRecord>(`${environment.apiBaseUrl}/feedback`, payload);
  }
}
