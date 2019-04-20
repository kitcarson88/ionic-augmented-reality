import { Injectable } from '@angular/core';
import { OfflineStatusChangeAction } from '@redux-offline/redux-offline/lib/types';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../store/store.model';

import { Network } from '@ionic-native/network/ngx';


@Injectable({
  providedIn: 'root'
})
export class NetworkService
{
  constructor(private network: Network, private ngRedux: NgRedux<AppState>) {}
 
  public initializeNetworkService()
  {
    this.updateNetworkStatus(this.network.type);

    this.network.onchange().subscribe(() => {
      this.updateNetworkStatus(this.network.type);
    });
  }
 
  private updateNetworkStatus(type: string)
  {
    let connected = type !== 'none';

    let action = {
      payload: {
        online: connected
      },
      type: 'Offline/STATUS_CHANGED'
    } as OfflineStatusChangeAction;
    this.ngRedux.dispatch(action);
  }
}
