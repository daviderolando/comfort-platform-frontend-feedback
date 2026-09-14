import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { FeedbackService } from '../feedback/feedback.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit, OnDestroy {
  private yAxisMax1 = 2;
  private yAxisMax2 = 2;
  public yAxisMaxTest = 2;

  private yWeathMin = 0;
  private yWeathMax = 10;
  private yWeathForeMin = 0;
  private yWeathForeMax = 10;

  public location: string = '';

  private subFeed1: Subscription;
  private subFeed2: Subscription;
  private subWeath1: Subscription;
  private subWeath2: Subscription;
  private subWeath3: Subscription;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            max: this.yAxisMax1,
            beginAtZero: true,
            callback: function (value, index, values) {
              // return '$' + value;
              return +value % 2 == 0 ? value : '';
              return value;
            },
          },
        },
      ],
    },
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [{ data: [], label: 'Feedbacks' }];

  public neighChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            max: this.yAxisMax2,
            beginAtZero: true,
            callback: function (value, index, values) {
              // return '$' + value;
              return +value % 2 == 0 ? value : '';
              return value;
            },
          },
        },
      ],
    },
  };

  public neighChartLabels: Label[] = [];
  public neighChartType: ChartType = 'bar';
  public neighChartLegend = true;
  public neighChartPlugins = [];

  public neighChartData: ChartDataSets[] = [{ data: [], label: 'Feedbacks' }];

  //
  // Line Chart
  // public lineChartOptions: ChartOptions = { responsive: true };

  lineChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0], label: 'Outdoor Temperature [\u{2103}]' },
  ];

  lineChartLabels: Label[] = [
    // 'January',
    // 'February',
    // 'March',
    // 'April',
    // 'May',
    // 'June',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  lineChartOptions: ChartOptions = { responsive: true };
  //   responsive: true,
  //   scales: {
  //     yAxes: [
  //       {
  //         ticks: {
  //           min: this.yWeathMin,
  //           max: this.yWeathMax,
  //           beginAtZero: false,
  //           callback: function (value, index, values) {
  //             // return '$' + value;
  //             return +value % 2 == 0 ? value : '';
  //             return value;
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   elements: {
  //     line: {
  //       fill: false
  //     }
  //   }
  // };

  lineChartColors: Color[] = [
    {
      borderColor: 'rgba(0,0,255,0.28)',
      // borderColor: 'black',
      // backgroundColor: 'rgba(255,255,0,0.28)',
      // backgroundColor: null,
    },
  ];

  //
  // Line Chart: forecast
  // public forecastChartOptions: ChartOptions = { responsive: true };

  forecastChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0], label: 'Outdoor Temperature [\u{2103}]' },
  ];

  forecastChartLabels: Label[] = [
    // 'January',
    // 'February',
    // 'March',
    // 'April',
    // 'May',
    // 'June',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
  ];

  forecastChartLegend = true;
  forecastChartPlugins = [];
  forecastChartType = 'line';

  forecastChartOptions: ChartOptions = { responsive: true };
  //   responsive: true,
  //   scales: {
  //     yAxes: [
  //       {
  //         ticks: {
  //           min: this.yWeathMin,
  //           max: this.yWeathMax,
  //           beginAtZero: false,
  //           callback: function (value, index, values) {
  //             // return '$' + value;
  //             return +value % 2 == 0 ? value : '';
  //             return value;
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   elements: {
  //     line: {
  //       fill: false
  //     }
  //   }
  // };

  forecastChartColors: Color[] = [
    {
      borderColor: 'rgba(0,0,255,0.28)',
      // borderColor: 'black',
      // backgroundColor: 'rgba(255,255,0,0.28)',
      // backgroundColor: null,
    },
  ];

  constructor(
    private feedbackService: FeedbackService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const feedbackLabels = ['Ok', 'Cold', 'Warm', 'Humid', 'Dry', 'Air quality', 'Noisy'];
    const myFeedbacks = [0, 0, 0, 0, 0, 0, 0];
    const neighborhoodFeedbacks = [0, 0, 0, 0, 0, 0, 0];

    this.barChartLabels = feedbackLabels;
    this.barChartData = [{ data: myFeedbacks, label: 'Feedbacks' }];
    this.neighChartLabels = feedbackLabels;
    this.neighChartData = [{ data: neighborhoodFeedbacks, label: 'Feedbacks' }];

    this.location = 'Not implemented yet';
    this.lineChartLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    this.lineChartData = [
      { data: [0, 0, 0, 0, 0, 0], label: 'Outdoor Temperature [\u{2103}]' },
    ];
    this.forecastChartLabels = this.lineChartLabels;
    this.forecastChartData = [
      { data: [0, 0, 0, 0, 0, 0], label: 'Outdoor Temperature [\u{2103}]' },
    ];
  }

  private calculateMaxY(data: number[]) {
    let maxVal = Math.max(...data);
    maxVal = 2 * Math.ceil(maxVal / 2 + 0.001);

    return maxVal;
  }

  ngOnDestroy() {
    if (this.subFeed1) {
      this.subFeed1.unsubscribe();
    }
    if (this.subFeed2) {
      this.subFeed2.unsubscribe();
    }
    if (this.subWeath1) {
      this.subWeath1.unsubscribe();
    }
    if (this.subWeath2) {
      this.subWeath2.unsubscribe();
    }
    if (this.subWeath3) {
      this.subWeath3.unsubscribe();
    }
  }
}
