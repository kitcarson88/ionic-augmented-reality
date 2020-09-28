import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { Plugins } from '@capacitor/core';
const { Device } = Plugins;

import { AppPlatformDeviceActions } from '../store';

import { Utils } from '../utils/utils';
import { constants } from '../utils/constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appVersion: AppVersion,
    private appPltDevInfos: AppPlatformDeviceActions
  ) {
    this.initializeApp();
  }

  initializeApp()
  {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      //Initialize some device infos
      setTimeout(() =>
      {
        this.initDeviceInfos();
      }, 500);
    });
  }

  private async initDeviceInfos()
  {
    let os: 'android' | 'ios' | 'other' =
      Utils.isAndroid(this.platform) ? 'android' : (Utils.isIos(this.platform) ? 'ios' : 'other');

    let device = await Device.getInfo();

    let model = device.model;
    if (Utils.isiPhoneX(this.platform, device))
      model = 'iPhoneX';
    if (Utils.isiPhoneXMax(this.platform, device))
      model = 'iPhoneXMax';

    let integration: 'cordova' | 'electron' | 'none' =
      this.platform.is('cordova') ? 'cordova' : (this.platform.is('electron') ? 'electron' : 'none');

    this.appPltDevInfos.initializeInfos({
      appName: await this.appVersion.getAppName(),
      appPackageName: await this.appVersion.getPackageName(),
      appVersion: integration === 'none' ? constants.WEB_VERSION : device.appVersion,
      appBuild: integration === 'none' ? constants.WEB_BUILD.toString() : device.appBuild,
      manufacturer: device.manufacturer,
      model,
      uuid: device.uuid,
      os,
      version: device.osVersion,
      platform: device.platform,
      integration,
      virtual: device.isVirtual,
      width: this.platform.width(),
      height: this.platform.height(),
      freeDiskSpace: device.diskFree,
      totalDiskSpace: device.diskTotal,
      memoryUsage: device.memUsed
    });
  }
}
