import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin, finalize } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { DataBuilding, FeedbackSummary, FeedbackSummaryItem, PeriodOption } from './data.models';
import { DataService } from './data.service';

@Component({
  selector: 'app-data',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    BaseChartDirective,
  ],
  templateUrl: './data.html',
  styleUrl: './data.css',
})
export class Data implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly authService = inject(AuthService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly days = 7;
  readonly periodOptions: PeriodOption[] = [
    { label: '24h', days: 1 },
    { label: '3 days', days: 3 },
    { label: '7 days', days: 7 },
    { label: '14 days', days: 14 },
    { label: '30 days', days: 30 },
  ];
  readonly chartType: ChartConfiguration<'bar'>['type'] = 'bar';
  readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: 'rgba(29, 34, 43, 0.08)',
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x} feedback${context.parsed.x === 1 ? '' : 's'}`,
        },
      },
    },
  };

  mySummary: FeedbackSummary | null = null;
  buildingSummary: FeedbackSummary | null = null;
  adminSummary: FeedbackSummary | null = null;
  adminBuildings: DataBuilding[] = [];
  myChartData: ChartData<'bar', number[], string> = this.emptyChartData();
  buildingChartData: ChartData<'bar', number[], string> = this.emptyChartData();
  adminChartData: ChartData<'bar', number[], string> = this.emptyChartData();
  selectedAdminBuildingId: number | null = null;
  selectedAdminDays = 7;
  isLoading = true;
  isLoadingAdmin = false;
  errorMessage = '';
  adminErrorMessage = '';

  get isAdmin(): boolean {
    return this.authService.session?.user.role === 'admin';
  }

  get selectedPeriodLabel(): string {
    return this.periodOptions.find((option) => option.days === this.selectedAdminDays)?.label ?? `${this.selectedAdminDays} days`;
  }

  ngOnInit(): void {
    this.loadSummaries();
    if (this.isAdmin) {
      this.loadAdminData();
    }
  }

  refreshData(): void {
    this.loadSummaries();
    if (this.isAdmin) {
      this.loadAdminSummary();
    }
  }

  loadSummaries(): void {
    this.isLoading = true;
    this.errorMessage = '';
    forkJoin({
      me: this.dataService.getMyFeedbackSummary(this.days),
      building: this.dataService.getBuildingFeedbackSummary(this.days),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        }),
      )
      .subscribe({
        next: ({ me, building }) => {
          this.mySummary = me;
          this.buildingSummary = building;
          this.myChartData = this.toChartData(me.items, 'My feedbacks');
          this.buildingChartData = this.toChartData(building.items, 'My building');
          this.changeDetector.markForCheck();
        },
        error: (error) => {
          this.errorMessage = error?.error?.detail ?? 'Could not load feedback summaries.';
          this.changeDetector.markForCheck();
        },
      });
  }

  loadAdminData(): void {
    this.isLoadingAdmin = true;
    this.adminErrorMessage = '';
    forkJoin({
      buildings: this.dataService.getAdminBuildings(),
      summary: this.dataService.getAdminFeedbackSummary(this.selectedAdminBuildingId, this.selectedAdminDays),
    })
      .pipe(
        finalize(() => {
          this.isLoadingAdmin = false;
          this.changeDetector.markForCheck();
        }),
      )
      .subscribe({
        next: ({ buildings, summary }) => {
          this.adminBuildings = buildings;
          this.applyAdminSummary(summary);
        },
        error: (error) => {
          this.adminErrorMessage = error?.error?.detail ?? 'Could not load admin summary.';
          this.changeDetector.markForCheck();
        },
      });
  }

  loadAdminSummary(): void {
    if (!this.isAdmin) {
      return;
    }

    this.isLoadingAdmin = true;
    this.adminErrorMessage = '';
    this.dataService
      .getAdminFeedbackSummary(this.selectedAdminBuildingId, this.selectedAdminDays)
      .pipe(
        finalize(() => {
          this.isLoadingAdmin = false;
          this.changeDetector.markForCheck();
        }),
      )
      .subscribe({
        next: (summary) => {
          this.applyAdminSummary(summary);
        },
        error: (error) => {
          this.adminErrorMessage = error?.error?.detail ?? 'Could not load admin summary.';
          this.changeDetector.markForCheck();
        },
      });
  }

  total(summary: FeedbackSummary | null): number {
    return summary?.items.reduce((sum, item) => sum + item.count, 0) ?? 0;
  }

  private toChartData(items: FeedbackSummaryItem[], label: string): ChartData<'bar', number[], string> {
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          label,
          data: items.map((item) => item.count),
          backgroundColor: items.map((item) => this.colorFor(item.color)),
          borderRadius: 6,
          maxBarThickness: 30,
        },
      ],
    };
  }

  private applyAdminSummary(summary: FeedbackSummary): void {
    this.adminSummary = summary;
    this.adminChartData = this.toChartData(summary.items, 'Admin');
    this.changeDetector.markForCheck();
  }

  private emptyChartData(): ChartData<'bar', number[], string> {
    return {
      labels: [],
      datasets: [{ data: [], label: 'Feedbacks' }],
    };
  }

  private colorFor(color: string | null): string {
    const colors: Record<string, string> = {
      blue: '#1976d2',
      gray: '#69727d',
      grey: '#69727d',
      red: '#d82f45',
      success: '#188754',
      yellow: '#f4b400',
    };
    return colors[color ?? ''] ?? '#5f6f89';
  }
}
