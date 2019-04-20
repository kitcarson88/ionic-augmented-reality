import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class StorageService
{
  constructor(public platform: Platform, private nativeStorage: NativeStorage) {}

  getItem(key: string): Promise<string>
  {
      return new Promise((resolve, reject) => {
          this.platform.ready().then(() => {
              resolve(this.nativeStorage.getItem(key));
          });
      });        
  }
  
  setItem(key: string, item: string): Promise<string>
  {
      return new Promise((resolve, reject) => {
          this.platform.ready().then(() => {
              resolve(this.nativeStorage.setItem(key, item));
          });
      });
  }
  
  removeItem(key: string): Promise<void>
  {
      return new Promise((resolve, reject) => {
          this.platform.ready().then(() => {
              resolve(this.nativeStorage.remove(key));
          });
      });
  }
}
