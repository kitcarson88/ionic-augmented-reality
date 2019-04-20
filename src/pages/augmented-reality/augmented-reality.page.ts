import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { Utils } from '../../util/utils';
import { constants } from '../../util/constants';

enum ARError {
  INTERNAL_AR_ERROR,
  SENSORS_ERROR,
  GPS_NOT_ENABLED,
  LOCATION_PERMISSION_NOT_GRANTED,
  CAMERA_PERMISSION_NOT_GRANTED,
  CAMERA_SYSTEM_NOT_FOUND,
  LOCATION_SERVICE_DISABLED
}

@Component({
  selector: 'app-augmented-reality',
  templateUrl: './augmented-reality.page.html',
  styleUrls: ['./augmented-reality.page.scss'],
})
export class AugmentedRealityPage implements OnInit, AfterViewInit, OnDestroy
{
  private static readonly DEG2RAD = Math.PI / 180;
  private static readonly EARTH_RADIUS = 6371;  //Earth radius in km

  private cameraPresent: boolean;
  private cameraAuthorized: boolean;
  private locationEnabled: boolean;
  private locationAvailable: boolean;
  private locationAuthorized: boolean;
  private firstLocationAuthorization: boolean;

  private sensorMissing: boolean = false;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private events: Events,
    private screenOrientation: ScreenOrientation,
    private diagnosticService: Diagnostic,
    private nativeStorage: NativeStorage
  ) { }

  private leavePage = () => {
    //TODO go back
    console.log("GO BACK");
  };

  ngOnInit()
  {
    this.statusBar.hide();

    if (Utils.isIos(this.platform))
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY);
    else
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);

    this.diagnosticService.isCameraPresent()
      .then(cameraPresent => this.cameraPresent = cameraPresent)
      .catch(err => {
        console.log("Error isCameraPresent: ", err);
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isCameraAuthorized()
      .then(cameraAuthorized => this.cameraAuthorized = cameraAuthorized)
      .catch(err => {
        console.log("Error isCameraAuthorized: ", err);
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isLocationEnabled()
      .then(locationEnabled => this.locationEnabled = locationEnabled)
      .catch(err => {
        console.log("Error isLocationEnabled: ", err);
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isLocationAvailable()
      .then(locationAvailable => this.locationAvailable = locationAvailable)
      .catch(err => {
        console.log("Error isLocationAvailable: ", err);
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isLocationAuthorized()
      .then(locationAuthorized => this.locationAuthorized = locationAuthorized)
      .catch(err => {
        console.log("Error isLocationAuthorized: ", err);
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.nativeStorage.getItem(constants.FIRST_LOCATION_PERMISSION_REQUEST).then(data => {
      console.log("first permission flag: ", data);
      if (!data)
        this.firstLocationAuthorization = true;
      else
        this.firstLocationAuthorization = false;
    }).catch(err => {
      console.log("No error: simply app shortcut flag not in memory");
      this.firstLocationAuthorization = true;
    });
  }

  ngAfterViewInit()
  {
    //this.spinnerService.showLoader();
    this.sensorMissing = false;

    //Catch error visualization by alerts, and go back to previous page
    this.events.subscribe(constants.AR_SYSTEM_ERROR, this.leavePage);
  }

  private manageARSystemsErrors(errorType: ARError)
  {
    /*switch (errorType)
    {
      case ARError.INTERNAL_AR_ERROR:
        this.alertService.showSensorsError("Si è verificato un errore con il sistema di realtà aumentata");
        break;
      case ARError.SENSORS_ERROR:
        this.alertService.showSensorsError("Il dispositivo non supporta la funzionalità di realtà aumentata");
        break;
      case ARError.GPS_NOT_ENABLED:
        this.alertService.showSensorsError("Per il corretto funzionamento della funzionalità di realtà aumentata, si prega di abilitare il gps");
        break;
      case ARError.LOCATION_PERMISSION_NOT_GRANTED:
        this.alertService.showSensorsError("Per il corretto funzionamento della funzionalità di realtà aumentata, si prega di concedere i permessi richiesti");
        break;
      case ARError.CAMERA_PERMISSION_NOT_GRANTED:
        this.alertService.showSensorsError("Per il corretto funzionamento della funzionalità di realtà aumentata, si prega di concedere i permessi richiesti");
        break;
      case ARError.CAMERA_SYSTEM_NOT_FOUND:
        this.alertService.showSensorsError("Si è verificato un errore con la fotocamera del dispositivo. Impossibile avviare il modulo di realtà aumentata");
        break;
      case ARError.LOCATION_SERVICE_DISABLED:
        this.alertService.showSensorsError("Per il corretto funzionamento della funzionalità di realtà aumentata, si prega di attivare il gps");
        break;
    }*/
  }

  ngOnDestroy()
  {
    setTimeout(() => this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT), 500);

    this.events.unsubscribe(constants.AR_SYSTEM_ERROR, this.leavePage);
  }
}
