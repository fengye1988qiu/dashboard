import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) {}

  sendRequest(url: string, method?: string, body?: any): Observable<HttpEvent<any>> {
    const httpOptions = this.getDefaultHttpOptions();
    if (method === 'GET' && body) {
      httpOptions.params = body;
      body = null;
    }
    const request = new HttpRequest(method || 'GET', environment.domain + url, body || {}, httpOptions);
    return this.http.request(request);
  }

  getDefaultHttpOptions(): any {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'X-Requested-With,content-type');
    headers = headers.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Paging-PageSize');
    return { headers, withCredentials: true }
  }

  getSecurities(param?: any) {
    const url = "/securities";
    return this.sendRequest(url, 'GET', param);
  }
}
