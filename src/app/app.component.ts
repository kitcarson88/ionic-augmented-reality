import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { select } from "@angular-redux/store";
import { Observable } from "rxjs";

import { Globalization } from '@ionic-native/globalization/ngx';
import { defaultLanguage, availableLanguages, sysOptions } from './i18n.constants';
import { TranslateService } from '@ngx-translate/core';

import { NetworkService } from '../services/network.service';

import { constants } from '../util/constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent
{
  showSplash: boolean = true;

  @select(["spinner", "visible"])
  showSpinner$: Observable<boolean>;

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'arhome',
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
      icon: 'arar',
      direction: 'forward'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globalization: Globalization,
    public translate: TranslateService,
    private networkService: NetworkService,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp()
  {
    this.platform.ready().then(() => {
      this.splashScreen.hide();

      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#057d96");

      this.networkService.initializeNetworkService();

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);

      // this language will be used as a fallback when a translation isn't found in the current language
      this.translate.setDefaultLang(defaultLanguage);

      if ((<any>window).cordova)
      {
        this.globalization.getPreferredLanguage().then(result => {
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

    setTimeout(() => {
      this.showSplash = false;
    }, constants.SPLASH_TIMEOUT);
  }

  private getSuitableLanguage(language)
  {
    console.log("language: ", language);
		language = language.substring(0, 2).toLowerCase();
		return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }
}
