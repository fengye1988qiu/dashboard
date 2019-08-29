import { Component, ViewChild, EventEmitter } from '@angular/core';
import { AppService } from './app.service';
import { HttpResponse, HttpParams } from '@angular/common/http';
import { parse } from 'querystring';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  securities: any[];
  columns: any[];
  query: any;
  sort: any;
  total: number;
  loading: boolean;
  timer: NodeJS.Timer;
  updatedAt: Date = new Date();

  constructor(private appServer: AppService) {
    this.buildTableConfig()
    this.getSecurities();
  }
  
  getSecurities() {
    clearTimeout(this.timer);
    this.loading = true;
    let param = new HttpParams();
    Object.keys(this.query).forEach(key => {
      param = param.set(key, this.query[key]);
    });
    this.appServer.getSecurities(param).toPromise().then((response: HttpResponse<any[]>) => {
      this.securities = response.body;
      this.total = Number.parseInt(response.headers.get('X-Total-Count'));
      this.loading = false;
      this.updatedAt = new Date();
      this.timer = setTimeout(() => this.getSecurities(), 5000);
    })
    .catch(error => {
      console.log('error:', error);
      this.loading = false;
      this.timer = setTimeout(() => this.getSecurities(), 5000);
    });
  }

  buildTableConfig() {
    this.columns = [
      { prop: 'account_executive', name: 'Account Executives' },
      { prop: 'accumulated_turnover', name: 'Accumulated Turn-over' },
      { prop: 'daily_turnover', name: 'Daily turn-over' }
    ];
    this.query = {
      _limit: 10,
      _page: 0,
      _order: 'asc',
      _sort: 'account_executive'
    }
  }

  paginateChange(event: any, type: string){
    if (type === 'page') {
      this.query._page = event.offset
    } else {
      const [{dir, prop}] = event.sorts;
      this.query._order = dir;
      this.query._sort = prop;
    }
    this.getSecurities();
  }
}
