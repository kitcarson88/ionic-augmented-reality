import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map, catchError, delay, timeout } from 'rxjs/operators';

import { Api } from '../api/api';

import { environment } from '../../environments/environment';
import { constants } from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class PoisProvider
{
  constructor(private api: Api) { }

  getPoisList(latitude: number, longitude: number, radius: number)
  {
    //Only if mock flag true, retrieve data from json mock
    if (environment.mock)
      return from(this.api.debugGet('assets/mock-data/poi-list.json')).pipe(delay(2000), timeout(3000));

    let urlPoisList = environment.baseUrl + environment.baseVersion + constants.poiListEndpoint + 
        '?latitude=' + latitude +
        '&longitude=' + longitude +
        '&radius=' + radius;

    let header = {
      'Content-Type': 'application/json'
    };

    return from(this.api.get(urlPoisList, {}, header)).pipe(
      map(response =>
      {
        let data = response.data;
        if (!data.length)
          data = '{}';

        return JSON.parse(data);
      }),
      catchError(error =>
      {
        console.log('ERROR getPoisList: ', error);
        throw error;
      })
    );
  }
}