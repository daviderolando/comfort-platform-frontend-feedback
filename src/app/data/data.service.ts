import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { DEFAULT_FEEDBACK_OPTIONS } from '../feedback/feedback.models';
import { DataBuilding, FeedbackSummary } from './data.models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);

  getMyFeedbackSummary(days = 7): Observable<FeedbackSummary> {
    return this.http.get<FeedbackSummary>(`${environment.apiBaseUrl}/feedback/summary/me`, {
      params: { days },
    }).pipe(
      timeout(5000),
      catchError(() => of(this.emptySummary('me', days))),
    );
  }

  getBuildingFeedbackSummary(days = 7): Observable<FeedbackSummary> {
    return this.http.get<FeedbackSummary>(`${environment.apiBaseUrl}/feedback/summary/building`, {
      params: { days },
    }).pipe(
      timeout(5000),
      catchError(() => of(this.emptySummary('building', days))),
    );
  }

  getAdminBuildings(): Observable<DataBuilding[]> {
    return this.http.get<DataBuilding[]>(`${environment.apiBaseUrl}/admin/buildings`).pipe(
      timeout(5000),
      catchError(() => of([])),
    );
  }

  getAdminFeedbackSummary(buildingId: number | null, days = 7): Observable<FeedbackSummary> {
    const params: Record<string, number> = { days };
    if (buildingId !== null) {
      params['building_id'] = buildingId;
    }
    return this.http.get<FeedbackSummary>(`${environment.apiBaseUrl}/admin/feedback-summary`, { params }).pipe(
      timeout(5000),
      catchError(() => of(this.emptySummary('admin', days))),
    );
  }

  private emptySummary(scope: 'me' | 'building' | 'admin', days: number): FeedbackSummary {
    return {
      scope,
      days,
      items: DEFAULT_FEEDBACK_OPTIONS.map((option) => ({
        codename: option.codename,
        label: option.label,
        group: option.group,
        color: option.color,
        count: 0,
      })),
    };
  }
}
