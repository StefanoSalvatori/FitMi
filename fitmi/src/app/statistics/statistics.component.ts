import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { AuthService } from '../auth/auth.service';
import { Session } from 'src/model/session';
import * as d3 from 'd3';
import { LineChartService } from '../data-visualization/line-chart/line-chart.service';
import { SessionType } from 'src/model/session-type';

@Component({
  selector: 'app-home',
  templateUrl: './statistics.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./statistics.component.scss']
})



export class StatisticsComponent implements OnInit {

  public lastSession: Session;
  public allSessions: Session[];
  public last = true;
  private dataPath = 'assets/mock-sessions.json';  // '/users/' + this.auth.getUser()._id + '/sessions'
  heartRateLineChart: any;

  // return the more freq elem in an array of string
  private mode(arr: string[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }

  private sessionDuration(s: Session): number {
    return Math.abs((new Date(s.end).getTime() - new Date(s.start).getTime()) / 1000);
  }
  private sumOnAllSessions(mapFunction: (Session) => number): number {
    return this.allSessions.map(mapFunction).reduce((total, amount) => total + amount);
  }

  //#region "Binded Html"
  public lastSessionDuration() {
    return new Date(this.sessionDuration(this.lastSession) * 1000).toISOString().substr(11, 8);
  }
  public minMaxHeartRate(): [number, number] {
    const hfValues = this.lastSession.heart_frequency.map(hf => hf.value);
    return [Math.min(...hfValues), Math.max(...hfValues)];
  }

  public favoriteSessionType(): string {
    return this.mode(this.allSessions.map(s => s.type.toString()));
  }

  public allSteps(): number {
    return this.sumOnAllSessions(s => s.steps);
  }

  public allCalories(): number {
    return this.sumOnAllSessions(s => s.calories);
  }

  public allDistance(): number {
    return this.sumOnAllSessions(s => s.distance);
  }

  public wholeTimeSpentOnSession(): string {
    const totSeconds = this.sumOnAllSessions(s => this.sessionDuration(s));
    return new Date(totSeconds * 1000).toISOString().substr(11, 8);
  }

  //#endregion


  constructor(private http: HttpClientService,
              private auth: AuthService) {

    // init lastSession
    this.lastSession = {
      start: new Date('01-01-1970 00:00:00'),
      end: new Date('01-01-1970 00:00:00'),
      type: SessionType.RUN,
      steps: 0,
      calories: 0,
      distance: 0,
      heart_frequency: []
    };

    this.allSessions = [];

    // get sessions data
    this.http.getMock<Session[]>(this.dataPath)
      .toPromise()
      .then(sessions => {

        this.allSessions = sessions;
        // sort by date
        sessions.sort((s1, s2) => {
          const a = new Date(s1.start);
          const b = new Date(s2.start);
          return a > b ? -1 : a < b ? 1 : 0;
        });

        this.lastSession = sessions[sessions.length - 1];
      })
      .catch(err => {
        console.log('Error occured while retriving sessions');
        console.log(err);
      });
  }


  public initHeartRateLineChart() {
    // generates ordered date to simulate heartrates timestamp
    const dates = this.createOrderedRandomDates(this.lastSession.heart_frequency.length);
    const array: Array<[Date, number]> = [];
    let j = 0;
    this.lastSession.heart_frequency.forEach(hf => {
      array.push([dates[j++], +hf.value]);
    });

    this.heartRateLineChart = new LineChartService().setDataWindowSize(50);
    this.heartRateLineChart.setup('#heartRateLineChart');
    this.heartRateLineChart.populate(array);
  }

  private createOrderedRandomDates(n: number): Date[] {
    const dates = [];
    dates[0] = new Date();
    for (let i = 1; i < this.lastSession.heart_frequency.length; i++) {
      dates.push(this.nextDate(dates[i - 1]));
    }
    return dates.sort((d1, d2) => d2 - d1);
  }
  private nextDate(date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  }

  ngOnInit() {
  }

  segmentChanged(event) {
    this.last = event.detail.value === 'last';
  }

}
