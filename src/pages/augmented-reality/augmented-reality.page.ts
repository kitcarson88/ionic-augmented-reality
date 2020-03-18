import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { select } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { first, takeUntil, filter } from "rxjs/operators";

import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { CameraPreview, CameraPreviewOptions } from "@ionic-native/camera-preview/ngx";

import { SpinnerActions, ARActions, GpsActions } from "../../store";

import { SensorsService } from "../../services/sensors.service";

import { constants } from '../../utils/constants';

import { FusionSensorsDTO } from "../../entities/dto/fusionSensorsDTO";
import { AlertService } from "../../services/alert.service";
import { TranslateService } from "@ngx-translate/core";

enum ARError {
  INTERNAL_AR_ERROR = "INTERNAL_AR_ERROR",
  SENSORS_ERROR = "SENSORS_ERROR",
  GPS_NOT_ENABLED = "GPS_NOT_ENABLED",
  LOCATION_PERMISSION_NOT_GRANTED = "LOCATION_PERMISSION_NOT_GRANTED",
  CAMERA_PERMISSION_NOT_GRANTED = "CAMERA_PERMISSION_NOT_GRANTED",
  CAMERA_SYSTEM_NOT_FOUND = "CAMERA_SYSTEM_NOT_FOUND",
  LOCATION_SERVICE_DISABLED = "LOCATION_SERVICE_DISABLED"
}

@Component({
  selector: 'app-augmented-reality',
  templateUrl: './augmented-reality.page.html',
  styleUrls: ['./augmented-reality.page.scss'],
})
export class AugmentedRealityPage implements OnInit, AfterViewInit, OnDestroy
{
  @select(["platformDevice", "infos", "os"])
  os$: Observable<'ios' | 'android' | 'other'>;
  os: 'ios' | 'android' | 'other';

  private cameraPresent: boolean;
  private cameraAuthorized: boolean;
  private locationEnabled: boolean;
  private locationAvailable: boolean;
  private locationAuthorized: boolean;
  private firstLocationAuthorization: boolean;
  private preloadAuthorizationError: boolean = false;
  private authFlagsRetrieve$: Subject<void>;

  @select(["accelerometer", "error"])
  private accelerometerCoordinatesError$: Observable<boolean>;
  @select(["gyroscope", "error"])
  private gyroscopeCoordinatesError$: Observable<boolean>;
  @select(["magnetometer", "error"])
  private magnetometerCoordinatesError$: Observable<boolean>;
  private sensorsErrorsUnsubscribe$: Subject<void>;
  private sensorsError: boolean;
  private sensorsUnsubscribe$: Subject<void>;

  @select(["ar", "spotArray"])
  spotArray$: Observable<any[]>;
  spotArray: any[] = [];

  infosTitle: string;
  infosDescription: string;
  private showInfos: boolean = false;

  constructor(
    private translate: TranslateService,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private diagnosticService: Diagnostic,
    private locationAccuracy: LocationAccuracy,
    private nativeStorage: NativeStorage,
    private cameraPreview: CameraPreview,
    private gpsService: GpsActions,
    private sensorsService: SensorsService,
    private arInfos: ARActions,
    private spinnerActions: SpinnerActions,
    private alertService: AlertService
  ) {
    this.authFlagsRetrieve$ = new Subject<void>();
    this.sensorsErrorsUnsubscribe$ = new Subject<void>();
    this.sensorsUnsubscribe$ = new Subject<void>();
    this.sensorsError = false;
  }

  async ngOnInit()
  {
    this.statusBar.hide();
    
    this.os$.pipe(first()).subscribe(os => {
      this.os = os;

      if (this.os === 'ios')
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY);
      else if (this.os === 'android')
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
    });

    this.spinnerActions.showLoader();

    try
    {
      this.cameraPresent = await this.diagnosticService.isCameraPresent();
      this.cameraAuthorized = await this.diagnosticService.isCameraAuthorized();
      this.locationAvailable = await this.diagnosticService.isLocationAvailable();
      this.locationEnabled = await this.diagnosticService.isLocationEnabled();
      this.locationAuthorized = await this.diagnosticService.isLocationAuthorized();
    }
    catch(error)
    {
      console.log("Error auth flags: ", error);
      this.preloadAuthorizationError = true;
    }

    try
    {
      let data = await this.nativeStorage.getItem(constants.FIRST_LOCATION_PERMISSION_REQUEST);
      
      console.log("first permission flag: ", data);
      if (!data)
        this.firstLocationAuthorization = true;
      else
        this.firstLocationAuthorization = false;
    }
    catch(error)
    {
      console.log("No error: simply app shortcut flag not in memory: ", error);
      this.firstLocationAuthorization = true;
    }

    this.authFlagsRetrieve$.next();
    this.authFlagsRetrieve$.complete();
  }

  async ngAfterViewInit()
  {
    await this.authFlagsRetrieve$.toPromise();

    //Something went wrong on system authorizations retrieve. Show alert and abort all.
    if (this.preloadAuthorizationError)
    {
      this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      return;
    }

    //Start fused orientation service (accelerometer, gyroscope, magnetometer)
    //The data is not subscribed yet. The app initially verifies if the device as accelerometer, gyroscope and magnetomer,
    // and it verifies permissions too
    this.sensorsService.startSensors();

    this.accelerometerCoordinatesError$
      .pipe(
        takeUntil(this.sensorsErrorsUnsubscribe$),
        filter(data => data != null && data != undefined))
      .subscribe(flag => {
        if (flag)
        {
          this.sensorsError = true;
          this.manageARSystemsErrors(ARError.SENSORS_ERROR);
        }
      });

    this.gyroscopeCoordinatesError$
      .pipe(
        takeUntil(this.sensorsErrorsUnsubscribe$),
        filter(data => data != null && data != undefined))
      .subscribe(flag => {
        if (flag)
        {
          this.sensorsError = true;
          this.manageARSystemsErrors(ARError.SENSORS_ERROR);
        }
      });

    this.magnetometerCoordinatesError$
      .pipe(
        takeUntil(this.sensorsErrorsUnsubscribe$),
        filter(data => data != null && data != undefined))
      .subscribe(flag => {
        if (flag)
        {
          this.sensorsError = true;
          this.manageARSystemsErrors(ARError.SENSORS_ERROR);
        }
      });

    setTimeout(async () => {
      this.sensorsErrorsUnsubscribe$.next();
      this.sensorsErrorsUnsubscribe$.complete();

      if (this.sensorsError)
        return;

      if (!this.cameraPresent)
      {
        this.manageARSystemsErrors(ARError.CAMERA_SYSTEM_NOT_FOUND);
        return;
      }

      if (!this.cameraAuthorized)
      {
        let cameraAuth = await this.diagnosticService.requestCameraAuthorization();
        console.log("cameraAuth: ", cameraAuth);

        if (cameraAuth.toLowerCase().indexOf("denied") >= 0)
        {
          this.manageARSystemsErrors(ARError.CAMERA_PERMISSION_NOT_GRANTED);
          return;
        }
      }

      //Here camera is present and is authorized. Start it and continue to check/request other permissions
      //Start camera with a delay to let landscape mode and permission requests
      setTimeout(() =>
      {
        this.initCamera();
      }, constants.CAMERA_INIT_DELAY);

      if (!this.locationEnabled)
      {
        this.manageARSystemsErrors(ARError.LOCATION_SERVICE_DISABLED);
        return;
      }

      if (!this.locationAvailable || !this.locationAuthorized)
      {
        if (this.os === 'ios')
        {
          if (this.firstLocationAuthorization)  //iOS doesn't return anything if the permission is requested many times
          {
            let locAuth = await this.diagnosticService.requestLocationAuthorization();
            console.log("locAuth: ", locAuth);
  
            this.nativeStorage.setItem(constants.FIRST_LOCATION_PERMISSION_REQUEST, true);
    
            if (locAuth.toLowerCase().indexOf("denied") >= 0)
            {
              this.manageARSystemsErrors(ARError.LOCATION_PERMISSION_NOT_GRANTED);
              return;
            }
          }
          else
          {
            this.manageARSystemsErrors(ARError.LOCATION_PERMISSION_NOT_GRANTED);
            return;
          }
        }
        else    //Android has no issues on request the same permission many times
        {
          let locAuth = await this.diagnosticService.requestLocationAuthorization();
          console.log("locAuth: ", locAuth);
  
          if (locAuth.toLowerCase().indexOf("denied") >= 0)
          {
            this.manageARSystemsErrors(ARError.LOCATION_PERMISSION_NOT_GRANTED);
            return;
          }
        }
      }

      //Here all permissions are granted
      //Only on Android request max location precision
      if (this.os === 'android')
      {
        let canRequest = await this.locationAccuracy.canRequest();
        console.log("canRequest: ", canRequest);

        if (canRequest)
        {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              this.startARSystems();
            },
            error => {
              this.manageARSystemsErrors(ARError.GPS_NOT_ENABLED);
            }
          );
        }
      }
      else if (this.os === 'ios')
      {
        this.startARSystems();
      }
    }, 1500);
  }

  private initCamera()
  {
    let isIos = this.os === 'ios';
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: isIos? window.screen.height : window.screen.width,
      height: isIos? window.screen.width : window.screen.height,
      camera: 'rear',
      tapPhoto: false,
      previewDrag: false,
      toBack: true,
      alpha: 1
    };

    // start camera
    this.cameraPreview.startCamera(cameraPreviewOpts).then(res => {
      console.log(res);
  
      //Initializing camera FOV used on AR calculations
      this.cameraPreview.getHorizontalFOV().then((fov: number) => {
        console.log("FOV: ", fov);
        this.arInfos.setCameraFov(Math.abs(fov));
      });
    }, err => {
      console.log(err);
    });
  }

  private startARSystems()
  {
    this.gpsService.startService();

    //Retrieve sensors fusion coordinates and pass to redux ar infos (redux saga does the remaining calculations)
    let sensorsFusionOptions = {
      frequency: constants.FUSION_SENSOR_FREQUENCY,
      delay: constants.FUSION_SENSOR_INIT_DELAY
    };

    this.sensorsService.getSensorsData(sensorsFusionOptions).pipe(takeUntil(this.sensorsUnsubscribe$))
      .subscribe((fusionOrientation: FusionSensorsDTO) => {
        if (fusionOrientation && fusionOrientation.alfa && fusionOrientation.beta && fusionOrientation.gamma)
          this.arInfos.setFusionCoordinates(fusionOrientation);
      });

    //Hide spinner
    setTimeout(() => this.spinnerActions.dismissLoader(), sensorsFusionOptions.delay);

    this.spotArray$.pipe(takeUntil(this.sensorsUnsubscribe$)).subscribe((spotArray: any[]) => {
      if (spotArray)
      {
        //Here we have to update current spot array, and add new spots (if there are)
        //We cannot simply replace redux spots stored, because on iOS this produces a boring
        //flickering effect on markers
        for (let spot of spotArray)
        {
          let spotToEvaluate = null;
  
          //Search the spot in the page spot array
          for (let i = 0; i < this.spotArray.length; ++i)
            if (this.spotArray[i].id == spot.id)
              spotToEvaluate = this.spotArray[i];
  
          if (!spotToEvaluate) //The spot doesn't exist. Let's add it
          {
            let spotToAdd = spot;
            spotToAdd['onFire'] = true;   //Flag added to mark a new or modified spot
            this.spotArray.push(spotToAdd);
          }
          else  //The spot exist; let's update its displacement informations
          {
            spotToEvaluate.screenRelativePositionX = spot.screenRelativePositionX;
            spotToEvaluate.screenRelativePositionY = spot.screenRelativePositionY;
            spotToEvaluate['onFire'] = true;  //Flag added to mark a new or modified spot
          }
        }
  
        //Finally we remove old spots, and set new/modified spots as evaluated (onFire to false)
        for (let j = 0; j < this.spotArray.length; ++j)
        {
          if (this.spotArray[j]['onFire'])
            this.spotArray[j]['onFire'] = false;
          else
            this.spotArray.splice(j, 1);
        }
      }
    });
  }

  private manageARSystemsErrors(errorType: ARError)
  {
    this.spinnerActions.dismissLoader();
    this.translate.get(errorType.toString()).toPromise()
      .then(text => this.alertService.presentArAlert(null, text, null, [{
        text: 'Ok',
        actions: [{ type: '@angular-redux/router::UPDATE_LOCATION', payload: '/home' }]
      }]));
  }

  ngOnDestroy()
  {
    this.spinnerActions.dismissLoader();
    this.statusBar.show();
    this.sensorsService.stopSensors();
    this.cameraPreview.stopCamera();
    this.gpsService.stopService();
    
    setTimeout(() => this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT), 500);

    this.sensorsUnsubscribe$.next();
    this.sensorsUnsubscribe$.complete();
  }

  showDetails()
  {
    return this.showInfos;
  }

  openPoiDetails(poi, event)
  {
    event.stopPropagation();
    this.infosTitle = poi['title'];
    this.infosDescription = poi['description'];
    this.showInfos = true;
  }

  //ONLY DEBUG on ionic serve
  /*openPoiDetailsDebug(event)
  {
    event.stopPropagation();
    this.infosTitle = "Mock title";
    this.infosDescription = "Mock description";
    this.showInfos = true;
  }*/

  closePoiDetails()
  {
    this.showInfos = false;
  }
}
