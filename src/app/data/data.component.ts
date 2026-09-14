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
    this.subFeed1 = this.feedbackService
      .getFeedbackChartData()
      .subscribe((data) => {
        // Calculate max-y
        this.yAxisMax1 = this.calculateMaxY(data.feedbacks);

        // console.log('Feedback my data (at Component level)');
        // console.log(data);

        // User Feedbacks
        this.barChartLabels = data.labels;
        this.barChartData = [{ data: data.feedbacks, label: 'Feedbacks' }];
      });

    this.subFeed2 = this.feedbackService
      .getFeedbackNeighChartData()
      .subscribe((data) => {
        // Calculate max-y
        this.yAxisMax1 = this.calculateMaxY(data.feedbacks);

        // console.log('Feedback neighbourhood data (at Component level)');
        // console.log(data);

        // neighborhood Feedbacks
        this.neighChartLabels = data.labels;
        this.neighChartData = [{ data: data.feedbacks, label: 'Feedbacks' }];
      });

    // Weather data: Current Weather
    // this.subWeath1 = this.dataService.getCurrentWeather().subscribe((data) => {
    //   // console.log(data);
    // });
    // Weather data: Last Day Weather
    // this.subWeath2 = this.dataService.getLastDayWeather().subscribe((data) => {
    this.subWeath2 = this.dataService.getLastDayWeatherDirect().subscribe((data) => {
      if (!data.location){
        return;
      }
      // console.log('Component data:');
      // console.log(data);
      this.location = data.location;

      // Weather data
      this.yWeathMin = data.minT;
      this.yWeathMax = data.maxT;

      this.lineChartLabels = data.labels;
      this.lineChartData = [
        { data: data.temp, label: 'Outdoor Temperature [\u{2103}]' },
      ];

      this.lineChartOptions = {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: this.yWeathMin,
                max: this.yWeathMax,
                beginAtZero: false,
                callback: function (value, index, values) {
                  return +value % 2 == 0 ? value : '';
                },
              },
            },
          ],
        },
        elements: {
          line: {
            fill: false,
          },
        },
      };
    });

    // Weather forecast
    this.subWeath3 = this.dataService.getForecastWeatherDirect().subscribe((data) => {

      if (!data.location){
        return;
      }
      // console.log('Component weather forecast...');
      // console.log(data);
      this.location = data.location;

      // Weather forecast data
      this.yWeathForeMin = data.minT;
      this.yWeathForeMax = data.maxT;

      // Icons
      const icons = data.icons;
      let iconsImg = [];
      for ( let j = 0; j < data.icons.length; j++)
      {
        let iconTmp = new Image();
        iconTmp.src = data.icons[j];
        iconsImg.push(iconTmp);
      }
      // console.log(iconsImg);

      var icon0 = new Image();
      icon0.src = icons[0];

      this.forecastChartLabels = data.labels;
      this.forecastChartData = [
        {
          data: data.temp,
          label: 'Outdoor Temperature [\u{2103}]',
          pointStyle: 'triangle',
        },
      ];

      this.forecastChartOptions = {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                min: this.yWeathForeMin,
                max: this.yWeathForeMax,
                beginAtZero: false,
                callback: function (value, index, values) {
                  return +value % 2 == 0 ? value : '';
                },
              },
            },
          ],
        },
        elements: {
          line: {
            fill: false,
          },
        },
      };

      this.forecastChartPlugins = [{
        afterUpdate: function(chart) {
          // console.log(chart);
          const chart_id = chart.id;
          const dataMeta = chart.config.data.datasets[0]._meta[chart_id];
          // console.log(chart.config.data.datasets[0]._meta);
          // console.log(chart.config.data.datasets[0]._meta);
          // console.log('Data meta length:')
          // console.log(dataMeta.data.length);
          // chart.config.data.datasets[0]._meta[chart_id].data[2]._model.pointStyle = 'star';

          for (let i = 0; i < dataMeta.data.length; i++)
          {
            // console.log('Step: ' + i);
            dataMeta.data[i]._model.pointStyle = iconsImg[i];
            // if ( i % 2 == 0)
            // {
            //   dataMeta.data[i]._model.pointStyle = 'triangle';
            // } else {
            //   dataMeta.data[i]._model.pointStyle = 'cross';
            // }
          }
          // chart.config.data.datasets[1]._meta[0].data[2]._model.pointStyle = icon0;
        }
      }];
    });
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
