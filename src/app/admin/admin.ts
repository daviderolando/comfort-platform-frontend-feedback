import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { finalize, forkJoin } from 'rxjs';

import { AdminBuilding, AdminFeedback } from './admin.models';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly days = 7;
  readonly displayedColumns = ['created_at', 'username', 'location', 'feedback', 'intensity', 'comment'];

  buildings: AdminBuilding[] = [];
  feedback: AdminFeedback[] = [];
  selectedBuildingId: number | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    forkJoin({
      buildings: this.adminService.getBuildings(),
      feedback: this.adminService.getFeedback(this.selectedBuildingId, this.days),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        }),
      )
      .subscribe({
        next: ({ buildings, feedback }) => {
          this.buildings = buildings;
          this.feedback = feedback;
          this.changeDetector.markForCheck();
        },
        error: (error) => {
          this.errorMessage = error?.error?.detail ?? 'Could not load admin data.';
          this.changeDetector.markForCheck();
        },
      });
  }

  loadFeedback(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminService
      .getFeedback(this.selectedBuildingId, this.days)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        }),
      )
      .subscribe({
        next: (feedback) => {
          this.feedback = feedback;
          this.changeDetector.markForCheck();
        },
        error: (error) => {
          this.errorMessage = error?.error?.detail ?? 'Could not load feedback.';
          this.changeDetector.markForCheck();
        },
      });
  }

  locationFor(row: AdminFeedback): string {
    return [row.building_name, row.room_label].filter(Boolean).join(' / ') || 'No room';
  }
}
