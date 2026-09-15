import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { AdminBuilding, AdminFeedback } from './admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getBuildings(): Observable<AdminBuilding[]> {
    return this.http.get<AdminBuilding[]>(`${environment.apiBaseUrl}/admin/buildings`).pipe(
      timeout(5000),
      catchError(() => of([])),
    );
  }

  getFeedback(buildingId: number | null, days = 7): Observable<AdminFeedback[]> {
    const params: Record<string, string | number> = { days };
    if (buildingId !== null) {
      params['building_id'] = buildingId;
    }
    return this.http.get<AdminFeedback[]>(`${environment.apiBaseUrl}/admin/feedback`, { params }).pipe(
      timeout(5000),
      catchError(() => of([])),
    );
  }
}
