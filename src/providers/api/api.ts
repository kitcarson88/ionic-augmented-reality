import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';
import { Http, RequestOptions} from '@angular/http';   //Only for mocked calls (useful on "ionic serve" browser run)

import { constants } from '../../util/constants';

@Injectable({
  providedIn: 'root'
})
export class Api
{
  constructor(private http: HTTP, private debugHttp: Http) {
    this.http.setRequestTimeout(constants.SERVICE_TIMEOUT);
  }

  debugGet(endpoint: string, options?: RequestOptions)
  {
    try {
      return this.debugHttp.get(endpoint + "?" + new Date().getTime(), options);
    } catch (err) {
      return err;
    }
  }

  get(endpoint: string, params?: any, header?: any)
  {
    return this.http.get(endpoint, params, header);
  }

  post(endpoint: string, body: any, header?: any) {
    return this.http.post(endpoint, body, header);
  }

  /*put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(endpoint, body, reqOpts);
  }*/
}
