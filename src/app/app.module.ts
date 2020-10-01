import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Globalization } from '@ionic-native/globalization/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

//App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Redux store
import { StoreModule } from '../store/store.module';

//Libraries
import { IonicAngularUtilitiesModule } from 'ionic-angular-utilities';

//Components
import { SplashModule } from '../components/splash/splash.module';
import { SpinnerModule } from 'ionic-angular-utilities';

//Ionic mock providers
import
{
  getAppVersion,
  getDiagnostic
} from 'ionic-angular-utilities';

export function createTranslateLoader(http: HttpClient)
{
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports:[
    BrowserModule,
    HttpClientModule,
		StoreModule,
    SplashModule,
    SpinnerModule,
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
        },
        diagnostic: {
          isCameraAuthorized: true,
          isCameraPresent: true,
          isLocationAuthorized: true,
          isLocationAvailable: true,
          isLocationEnabled: true,
          requestCameraAuthorization: 'mock granted',
          requestLocationAuthorization: 'mock granted'
        }
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [
          HttpClient
        ]
      }
    }),
		AppRoutingModule
	],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: AppVersion, useClass: getAppVersion() },
    { provide: Diagnostic, useClass: getDiagnostic() },
    Globalization,  //Globalization not mocked. Calls managed directly in app.component
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
