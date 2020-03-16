import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { select, NgRedux } from "@angular-redux/store";
import { Observable } from "rxjs";

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Device } from "@ionic-native/device/ngx";

import { Globalization } from '@ionic-native/globalization/ngx';
import { defaultLanguage, availableLanguages, sysOptions } from './i18n.constants';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../store/store.model';

import { PlatformDeviceActions } from "../store";

import { Utils } from '../utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent
{
  @select(["splash"])
  splashState$: Observable<string>;

  @select(["spinner"])
  showSpinner$: Observable<boolean>;

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'assets/icon/home.svg',
      direction: 'root'
    },
    /*{
      title: 'Map',
      url: '/map',
      icon: 'armap',
      direction: 'root'
    },*/
    {
      title: 'AR',
      url: '/augmented-reality',
      icon: 'assets/icon/ar.svg',
      direction: 'forward'
    }
  ];

  constructor(
    private platform: Platform,
    private device: Device,
    private pltDevInfos: PlatformDeviceActions,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalization: Globalization,
    private translate: TranslateService,
    private ngRedux: NgRedux<AppState>
  )
  {
    this.initializeApp();
  }

  initializeApp()
  {
    this.platform.ready().then(() => 
    {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.ngRedux.dispatch({ type: 'HIDE_SPLASH' });

      //Initialize some device infos
      this.initDeviceInfos();

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
    });
  }

  private initDeviceInfos()
  {
    let os: 'android' | 'ios' | 'other' =
      Utils.isAndroid(this.platform) ? 'android' : (Utils.isIos(this.platform) ? 'ios' : 'other');

    let model = this.device.model;
    if (Utils.isiPhoneX(this.platform, this.device))
      model = 'iPhoneX';
    if (Utils.isiPhoneXMax(this.platform, this.device))
      model = 'iPhoneXMax';

    let integration: 'cordova' | 'electron' | 'none' =
      this.platform.is('cordova') ? 'cordova' : (this.platform.is('electron') ? 'electron' : 'none');

    this.pltDevInfos.initializeInfos(
      this.device.manufacturer,
      model,
      this.device.uuid,
      this.device.serial,
      os,
      this.device.version,
      this.device.platform,
      integration,
      this.platform.width(),
      this.platform.height()
    );
  }

  private getSuitableLanguage(language)
  {
    //console.log("language: ", language);
    language = language.substring(0, 2).toLowerCase();
    return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }
}
