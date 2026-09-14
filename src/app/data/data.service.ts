import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
  private weatherApiUrl = environment.weatherEndPointAPI;
  private termsApiUrl = environment.termsEndPointAPI;

  public weatherDataChanged: Subject<any>;

  public serverError = false;

  private dataSample;

  private userCity = 'stockholm';
  private lat = '59.349181';
  private lon = '18.07121301';
  private weather: any = {};
  private weatherType: string = '';

  constructor(private http: HttpClient) { }

  getCurrentWeather() {
    return this.http
      .get<any>(this.weatherApiUrl + '/current')
      .pipe(
        tap((data) => {
          // console.log('Current weather:');
          // console.log(data);
          // this.weatherDataChanged.next(data);
        })
      );
  }

  // TODO: restructure all the calls to go to update procedure
  // https://stackoverflow.com/questions/50452947/rxjs-conditional-switchmap-based-on-a-condition
  // 1. Get weather from database
  // 2. If not stale => end
  // 3. If stale => download directly from OWM
  // 4. Upload new weather data to the datadase

  // myObservable1.pipe(
  //   switchMap((result1: MyObservable1) => {
  //     if (condition) {
  //       return myObservable2;
  //     } else {
  //       return of(result1);
  //     }
  //   })
  // subscribe(result => console.log(result));

  getLastDayWeatherDirect() {
    // return this.http.post<any>(this.weatherApiUrl + '/last-day', {"city": "stockholm"}).pipe(
    const url = `${this.weatherApiUrl}/last-day-direct`;

    const body = {
      'city': this.userCity,
      'lat': this.lat,
      'lon': this.lon
    };
    console.log("request body:", body);
    return this.http.post<any>(url, body).pipe(
      tap((data) => {
        console.log('Last day weather (direct):');
        console.log(data);
        if (data.errorMessage) {
          this.serverError = true;
          console.log("ERROR: data.service.ts ~ line 35 ~ DataService ~ tap ~ data", data)
        }
      }),
      map((retData) => {
        // let ret = [];
        if (this.serverError) {
          return;
        }

        const weather = retData['weather'];
        const locationRaw = retData['location'];
        const location = locationRaw.charAt(0).toUpperCase() + locationRaw.slice(1);
        // const location = this.userCity;
        let hours = [];
        let hoursC = [];
        // let hoursDiff = [];
        let temp = [];

        let hourly = weather['hourly'];

        // const nowUnix = new Date().getTime() / 1000;
        // const nowH = new Date().getHours();
        this.weather = weather;
        this.weatherType = 'historical'
        // this.updateWeather();

        // Parse weather data
        hourly.forEach((item, index, arr) => {
          const h = arr[index];
          const dt = h['dt'];
          const dtJs = new Date(dt * 1000);
          const tempK = h['temp'];

          temp.push(Math.round((tempK - 273.16) * 10) / 10);

          hours.push(dt);
          hoursC.push(new Date(dtJs).getHours() + ':00');
          // hoursDiff.push(Math.ceil((nowUnix - dt) / 3600));
        });

        // let minT = Math.floor(Math.min(...temp));
        // let maxT = Math.ceil(Math.max(...temp));
        let minT = Math.min(...temp);
        let maxT = Math.max(...temp);

        let minTr =
          Math.abs(minT) < 5 && minT > 0 ? 0 : Math.floor(minT / 5) * 5;
        let maxTr =
          Math.abs(maxT) > 5 && maxT < 0 ? 0 : Math.ceil(maxT / 5) * 5;

        // console.log('Hours:');
        // console.log(hours);
        // console.log('Hours clock:');
        // console.log(hoursC);
        // console.log('Hours diff [h]:');
        // console.log(hoursDiff);
        // console.log('Now:');
        // console.log(nowUnix);
        // console.log('NowH:');
        // console.log(nowH);
        // console.log('Temp:');
        // console.log(temp);
        // console.log('Temp: min and max');
        // console.log(minT + ' ' + maxT);
        // console.log('Temp: min and max rounded');
        // console.log(minTr + ' ' + maxTr);

        // return retData;
        return {
          labels: hoursC,
          temp: temp,
          minT: minTr,
          maxT: maxTr,
          location: location,
          // original: data
        };
      })
    );
  }

  getLastDayWeather(refresh: boolean = false) {
    // return this.http.post<any>(this.weatherApiUrl + '/last-day', {"city": "stockholm"}).pipe(
    let direct = refresh ? '-direct': '';

    const url = `${this.weatherApiUrl}/last-day${direct}`;
    if (refresh){
      console.log('Direct call to OWM', direct);
      console.log('Direct call to OWM', url);
    }
    return this.http.get<any>(url).pipe(
      tap((data) => {
        console.log('Last day weather:');
        console.log(data);
        if (data.errorMessage) {
          this.serverError = true;
          console.log("ERROR: data.service.ts ~ line 35 ~ DataService ~ tap ~ data", data)
        }
      }),
      map((retData) => {
        // let ret = [];
        if (this.serverError) {
          return;
        }

        const weather = retData['weather'];
        // Check if server asks for data refresh
        if (weather.refresh) {
          this.userCity = weather.user_city;
          this.lat = weather.lat;
          this.lon = weather.lon;
          console.log('Data refresh required!!!', this.userCity, this.lat, this.lon);
          this.getLastDayWeatherDirect();
          // return this.getLastDayWeather(refresh=true);
          return {
            labels: [],
            temp: [],
            minT: 0,
            maxT: 0,
            // location: '',
            // original: data
          };
        }

        const locationRaw = retData['location'];
        const location =
          locationRaw.charAt(0).toUpperCase() + locationRaw.slice(1);

        let hours = [];
        let hoursC = [];
        // let hoursDiff = [];

        let temp = [];

        let hourly = weather['hourly'];

        // const nowUnix = new Date().getTime() / 1000;
        // const nowH = new Date().getHours();

        hourly.forEach((item, index, arr) => {
          const h = arr[index];
          const dt = h['dt'];
          const dtJs = new Date(dt * 1000);
          const tempK = h['temp'];

          temp.push(Math.round((tempK - 273.16) * 10) / 10);

          hours.push(dt);
          hoursC.push(new Date(dtJs).getHours() + ':00');
          // hoursDiff.push(Math.ceil((nowUnix - dt) / 3600));
        });

        // let minT = Math.floor(Math.min(...temp));
        // let maxT = Math.ceil(Math.max(...temp));
        let minT = Math.min(...temp);
        let maxT = Math.max(...temp);

        let minTr =
          Math.abs(minT) < 5 && minT > 0 ? 0 : Math.floor(minT / 5) * 5;
        let maxTr =
          Math.abs(maxT) > 5 && maxT < 0 ? 0 : Math.ceil(maxT / 5) * 5;

        // console.log('Hours:');
        // console.log(hours);
        // console.log('Hours clock:');
        // console.log(hoursC);
        // console.log('Hours diff [h]:');
        // console.log(hoursDiff);
        // console.log('Now:');
        // console.log(nowUnix);
        // console.log('NowH:');
        // console.log(nowH);
        // console.log('Temp:');
        // console.log(temp);
        // console.log('Temp: min and max');
        // console.log(minT + ' ' + maxT);
        // console.log('Temp: min and max rounded');
        // console.log(minTr + ' ' + maxTr);

        // return retData;
        return {
          labels: hoursC,
          temp: temp,
          minT: minTr,
          maxT: maxTr,
          location: location,
          // original: data
        };
      })
    );
  }

  getForecastWeatherDirect() {
    // return this.http.post<any>(this.weatherApiUrl + '/last-day', {"city": "stockholm"}).pipe(
    const url = `${this.weatherApiUrl}/forecast-direct`;
    const body = {
      'city': this.userCity,
      'lat': this.lat,
      'lon': this.lon
    };
    return this.http.post<any>(url, body).pipe(
      tap((data) => {
        console.log('Forecast weather:');
        console.log(data);
      }),
      map((retData) => {
        // let ret = [];

        const weather = retData['weather'];
        const locationRaw = retData['location'];
        const location = locationRaw.charAt(0).toUpperCase() + locationRaw.slice(1);

        let hours = [];
        let hoursH = [];
        let hoursC = [];
        let iconsH = [];
        // let hoursDiff = [];

        let temp = [];

        let hourly = weather['hourly'];

        // const nowUnix = new Date().getTime() / 1000;
        const nowH = new Date().getHours();
        const evenH = nowH % 2 > 0 ? 1 : 0;
        const hourHmin = this.toH24(nowH + 2 + evenH);
        const hourHmax = this.toH24(nowH + 2 + 24 + evenH);
        // console.log('Min H: ' + hourHmin);
        // console.log('Max H: ' + hourHmax);

        let counter = 0;
        hourly.forEach((item, index, arr) => {
          const h = arr[index];
          const dt = h['dt'];
          const dtJs = new Date(dt * 1000);
          const tempK = h['temp'];
          const hourH = new Date(dtJs).getHours();
          const iconH = h['weather'][0]['icon'];
          // Filter and push
          // Select next 12h starting from the first even hour after 2h from now.
          // Take only even hours
          // console.log('Get hour: ' + hourH);
          if (
            (hourH >= hourHmin || hourH < hourHmax) &&
            hourH % 2 == 0 &&
            counter < 12
          ) {
            // && hourH < (nowH + 2 + 12))
            temp.push(Math.round((tempK - 273.16) * 10) / 10);

            // console.log('Get unix: ' + dtJs);
            // console.log('Get hour: ' + new Date(dtJs).getHours());
            // console.log('   take this: ' + hourH);

            hours.push(dt);
            hoursH.push(hourH);
            hoursC.push(hourH + ':00');
            // Icon
            iconsH.push('http://openweathermap.org/img/wn/' + iconH + '.png');

            // Update counter
            counter++;
          }
        });

        // let minT = Math.floor(Math.min(...temp));
        // let maxT = Math.ceil(Math.max(...temp));
        let minT = Math.min(...temp);
        let maxT = Math.max(...temp);

        let minTr =
          Math.abs(minT) < 5 && minT > 0 ? 0 : Math.floor(minT / 5) * 5;
        let maxTr =
          Math.abs(maxT) > 5 && maxT < 0 ? 0 : Math.ceil(maxT / 5) * 5;

        // console.log('Hours:');
        // console.log(hours);
        // console.log('Hours number:');
        // console.log(hoursH);
        // console.log('Hour now:');
        // console.log(nowH);
        // console.log('Hours clock:');
        // console.log(hoursC);
        // console.log('Hours icon:');
        // console.log(iconsH);
        // console.log('Hours diff [h]:');
        // console.log(hoursDiff);
        // console.log('Now:');
        // console.log(nowUnix);
        // console.log('NowH:');
        // console.log(nowH);
        // console.log('Temp:');
        // console.log(temp);
        // console.log('Temp: min and max');
        // console.log(minT + ' ' + maxT);
        // console.log('Temp: min and max rounded');
        // console.log(minTr + ' ' + maxTr);

        // return retData;
        return {
          labels: hoursC,
          temp: temp,
          minT: minTr,
          maxT: maxTr,
          icons: iconsH,
          location: location,
          // original: data
        };
      })
    );
  }

  getForecastWeather() {
    // return this.http.post<any>(this.weatherApiUrl + '/last-day', {"city": "stockholm"}).pipe(
    return this.http.get<any>(this.weatherApiUrl + '/forecast').pipe(
      tap((data) => {
        console.log('Forecast weather:');
        console.log(data);
      }),
      map((retData) => {
        // let ret = [];

        const weather = retData['weather'];
        // Check if server asks for data refresh
        if (weather.refresh) {
          console.log('Data refresh required!!!');
          return {
            labels: [],
            temp: [],
            minT: 0,
            maxT: 0,
            // location: '',
            // original: data
          };
        }

        const locationRaw = retData['location'];
        const location =
          locationRaw.charAt(0).toUpperCase() + locationRaw.slice(1);

        let hours = [];
        let hoursH = [];
        let hoursC = [];
        let iconsH = [];
        // let hoursDiff = [];

        let temp = [];

        let hourly = weather['hourly'];

        // const nowUnix = new Date().getTime() / 1000;
        const nowH = new Date().getHours();
        const evenH = nowH % 2 > 0 ? 1 : 0;
        const hourHmin = this.toH24(nowH + 2 + evenH);
        const hourHmax = this.toH24(nowH + 2 + 24 + evenH);
        // console.log('Min H: ' + hourHmin);
        // console.log('Max H: ' + hourHmax);

        let counter = 0;
        hourly.forEach((item, index, arr) => {
          const h = arr[index];
          const dt = h['dt'];
          const dtJs = new Date(dt * 1000);
          const tempK = h['temp'];
          const hourH = new Date(dtJs).getHours();
          const iconH = h['weather'][0]['icon'];
          // Filter and push
          // Select next 12h starting from the first even hour after 2h from now.
          // Take only even hours
          // console.log('Get hour: ' + hourH);
          if (
            (hourH >= hourHmin || hourH < hourHmax) &&
            hourH % 2 == 0 &&
            counter < 12
          ) {
            // && hourH < (nowH + 2 + 12))
            temp.push(Math.round((tempK - 273.16) * 10) / 10);

            // console.log('Get unix: ' + dtJs);
            // console.log('Get hour: ' + new Date(dtJs).getHours());
            // console.log('   take this: ' + hourH);

            hours.push(dt);
            hoursH.push(hourH);
            hoursC.push(hourH + ':00');
            // Icon
            iconsH.push('http://openweathermap.org/img/wn/' + iconH + '.png');

            // Update counter
            counter++;
          }
        });

        // let minT = Math.floor(Math.min(...temp));
        // let maxT = Math.ceil(Math.max(...temp));
        let minT = Math.min(...temp);
        let maxT = Math.max(...temp);

        let minTr =
          Math.abs(minT) < 5 && minT > 0 ? 0 : Math.floor(minT / 5) * 5;
        let maxTr =
          Math.abs(maxT) > 5 && maxT < 0 ? 0 : Math.ceil(maxT / 5) * 5;

        // console.log('Hours:');
        // console.log(hours);
        // console.log('Hours number:');
        // console.log(hoursH);
        // console.log('Hour now:');
        // console.log(nowH);
        // console.log('Hours clock:');
        // console.log(hoursC);
        // console.log('Hours icon:');
        // console.log(iconsH);
        // console.log('Hours diff [h]:');
        // console.log(hoursDiff);
        // console.log('Now:');
        // console.log(nowUnix);
        // console.log('NowH:');
        // console.log(nowH);
        // console.log('Temp:');
        // console.log(temp);
        // console.log('Temp: min and max');
        // console.log(minT + ' ' + maxT);
        // console.log('Temp: min and max rounded');
        // console.log(minTr + ' ' + maxTr);

        // return retData;
        return {
          labels: hoursC,
          temp: temp,
          minT: minTr,
          maxT: maxTr,
          icons: iconsH,
          location: location,
          // original: data
        };
      })
    );
  }

  // Update weather stored into database for later use
  updateWeather(){
    console.log('UPDATE weather');
    const body = {
      'city': this.userCity,
      'lat': this.lat,
      'lon': this.lon,
      'weatherType': this.weatherType,
      // 'weather': JSON.stringify(this.weather)
      'weather': this.weather
      // 'weather': {}
    }
    console.log(body);
    return;

    const url = `${this.weatherApiUrl}/update`;
    return this.http.post<any>(url, body).pipe(
      tap((data) => {
        console.log('Response after weather update:');
        console.log(data);
      })
    ).subscribe((data) => {
      // console.log(data);
    });
  }

  // Helper function to turn any positive integer into h24 format (0-23)
  toH24(h: number) {
    return h - 24 * Math.floor(h / 24);
  }

  /**
   * Get terms and conditions html from server
   */
  getTermsAndConditions() {
    return this.http
      .get<any>(this.termsApiUrl, { responseType: 'text' as 'json' })
      .pipe(
        tap((resHtml) => {
          // console.log('Terms and Condition (Tap)');
          // console.log(resHtml);
        })
      );
  }
}
