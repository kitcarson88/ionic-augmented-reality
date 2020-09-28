import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { StoreModule } from 'src/store/store.module';

import
{
  getAppVersion,
  IonicAngularUtilitiesModule
} from 'ionic-angular-utilities';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
imports:[
		StoreModule,
		BrowserModule,
		IonicModule.forRoot({
      mode: 'md'
    }),
    IonicAngularUtilitiesModule.forRoot({
      ionicMock: {
        appVersion: {
          appName: 'Ionic Augmented Reality',
          packageName: 'it.kitcarson88.locationAR',
          versionCode: '',
          versionNumber: ''
        }
      }
    }),
		AppRoutingModule
	],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: AppVersion, useClass: getAppVersion() },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
