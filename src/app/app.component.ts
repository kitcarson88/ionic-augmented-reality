import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const { Device } = Plugins;

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, defaultLanguage, sysOptions } from './i18n.constants';

import { Observable } from 'rxjs';
import { store, select } from '@redux-multipurpose/core';
import { AppPlatformDeviceActions } from '../store';
import { addEpic } from '../store/epics';
import { splashReducer } from '../store/splash/splash.slice';
import { doSplashAnimation } from '../store/splash/splash.epics';

import { Utils } from '../utils/utils';
import { constants } from '../utils/constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit
{
  @select([ "splash" ])
  splashState$: Observable<string>;

  @select(["spinner"])
  showSpinner$: Observable<boolean>;

  public appPages = [{
      title: 'Home',
      url: '/home',
      icon: 'assets/icon/home.svg',
      direction: 'root'
    }, {
      title: 'AR',
      url: '/augmented-reality',
      icon: 'assets/icon/ar.svg',
      direction: 'forward'
    }, {
      title: 'Map',
      url: '/map',
      icon: 'assets/icon/map.svg',
      direction: 'root'
  }];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private appVersion: AppVersion,
    private appPltDevInfos: AppPlatformDeviceActions,
    private globalization: Globalization,
    private translate: TranslateService
  ) {
  }

  ngOnInit()
  {
    this.initializeApp();
  }

  initializeApp()
  {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      store.addReducer('splash', splashReducer);
      store.replaceEpics(addEpic('doSplashAnimation', doSplashAnimation));
      
      //Initialize some device infos
      setTimeout(() =>
      {
        this.initDeviceInfos();
      }, 500);

      //Init language infos
      this.initLanguage();
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

  private initLanguage()
  {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(defaultLanguage);

    if ((<any> window).cordova)
    {
      this.globalization.getPreferredLanguage().then(result =>
      {
        var language = this.getSuitableLanguage(result.value);
        this.translate.use(language);
        sysOptions.systemLanguage = language;
      });
    }
    else
    {
      let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
      var language = this.getSuitableLanguage(browserLanguage);
      this.translate.use(language);
      sysOptions.systemLanguage = language;
    }
  }

  private getSuitableLanguage(language)
  {
    //console.log("language: ", language);
    language = language.substring(0, 2).toLowerCase();
    return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }
}
