import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Platform, Events, NavController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CameraPreviewOptions, CameraPreview } from '@ionic-native/camera-preview/ngx';

import { select } from "@angular-redux/store";
import { Observable } from "rxjs";

import { GpsActions, ARActions, SpinnerActions } from '../../store';

import { SensorsService } from '../../services/sensors.service';
import { AlertService } from '../../services/alert.service';

import { Utils } from '../../util/utils';
import { constants } from '../../util/constants';

import { FusionSensorsDTO } from '../../entities/dto/fusionSensorsDTO';

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
  private cameraPresent: boolean;
  private cameraAuthorized: boolean;
  private locationEnabled: boolean;
  private locationAvailable: boolean;
  private locationAuthorized: boolean;
  private firstLocationAuthorization: boolean;

  private sensorsServiceSubscription = null;

  private sensorMissing: boolean = false;
  @select(["accelerometer", "error"])
  accelerometerCoordinatesError$: Observable<boolean>;
  private accelerometerCoordinatesErrorSubscription: any = null;
  @select(["gyroscope", "error"])
  gyroscopeCoordinatesError$: Observable<boolean>;
  private gyroscopeCoordinatesErrorSubscription: any = null;
  @select(["magnetometer", "error"])
  magnetometerCoordinatesError$: Observable<boolean>;
  private magnetometerCoordinatesErrorSubscription: any = null;

  @select(["ar", "spotArray"])
  spotArray$: Observable<any[]>;
  private spotArraySubscription: any = null;
  spotArray: any[] = [];

  private preloadAuthorizationError: boolean = false;

  infosTitle: string;
  infosDescription: string;
  private showInfos: boolean = false;

  //ONLY FOR DEBUG on device
  /*@select(["ar", "cameraFov"])
  cameraFov$: Observable<number>;
  @select(["ar", "fusionCoordinates"])
  fusionSensor$: Observable<boolean>;*/

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private statusBar: StatusBar,
    private events: Events,
    private screenOrientation: ScreenOrientation,
    private diagnosticService: Diagnostic,
    private locationAccuracy: LocationAccuracy,
    private nativeStorage: NativeStorage,
    private gpsService: GpsActions,
    private sensorsService: SensorsService,
    private arInfos: ARActions,
    private cameraPreview: CameraPreview,
    private alertService: AlertService,
    private spinnerService: SpinnerActions
  ) { }

  private leavePage = () => {
    this.navCtrl.navigateBack('/home');
  };

  ngOnInit()
  {
    this.statusBar.hide();

    if (Utils.isIos(this.platform))
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY);
    else
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);

    //Catch error visualization by alerts, and go back to previous page
    this.events.subscribe(constants.AR_SYSTEM_ERROR, this.leavePage);

    this.diagnosticService.isCameraPresent()
      .then(cameraPresent => this.cameraPresent = cameraPresent)
      .catch(err => {
        console.log("Error isCameraPresent: ", err);
        this.preloadAuthorizationError = true;
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isCameraAuthorized()
      .then(cameraAuthorized => this.cameraAuthorized = cameraAuthorized)
      .catch(err => {
        console.log("Error isCameraAuthorized: ", err);
        this.preloadAuthorizationError = true;
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isLocationEnabled()
      .then(locationEnabled => this.locationEnabled = locationEnabled)
      .catch(err => {
        console.log("Error isLocationEnabled: ", err);
        this.preloadAuthorizationError = true;
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isLocationAvailable()
      .then(locationAvailable => this.locationAvailable = locationAvailable)
      .catch(err => {
        console.log("Error isLocationAvailable: ", err);
        this.preloadAuthorizationError = true;
        this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);
      });

    this.diagnosticService.isLocationAuthorized()
      .then(locationAuthorized => this.locationAuthorized = locationAuthorized)
      .catch(err => {
        console.log("Error isLocationAuthorized: ", err);
        this.preloadAuthorizationError = true;
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

  private debugPrint()
  {
    console.log("cameraPresent: ", this.cameraPresent);
    console.log("cameraAuthorized: ", this.cameraAuthorized);
    console.log("locationEnabled: ", this.locationEnabled);
    console.log("locationAvailable: ", this.locationAvailable);
    console.log("locationAuthorized: ", this.locationAuthorized);
    console.log("firstLocationAuthorization: ", this.firstLocationAuthorization);
  }

  async ngAfterViewInit()
  {
    if (this.preloadAuthorizationError)
      return;

    await this.spinnerService.showLoader();
    this.sensorMissing = false;

    //Start fused orientation service (accelerometer, gyroscope, magnetometer)
    //The data is not subscribed yet. The app initially verifies if the device as accelerometer, gyroscope and magnetomer,
    // and it verifies permissions too
    this.sensorsService.startSensors();

    //Manage accelerometer, gyroscope, and magnetometer sensors errors
    this.accelerometerCoordinatesErrorSubscription = this.accelerometerCoordinatesError$.subscribe((flag: boolean) => {
      if (flag && !this.sensorMissing)
      {
        this.sensorMissing = true;
        this.manageARSystemsErrors(ARError.SENSORS_ERROR);
      }
    });

    this.gyroscopeCoordinatesErrorSubscription = this.gyroscopeCoordinatesError$.subscribe((flag: boolean) => {
      if (flag && !this.sensorMissing)
      {
        this.sensorMissing = true;
        this.manageARSystemsErrors(ARError.SENSORS_ERROR);
      }
    });

    this.magnetometerCoordinatesErrorSubscription = this.magnetometerCoordinatesError$.subscribe((flag: boolean) => {
      if (flag && !this.sensorMissing)
      {
        this.sensorMissing = true;
        this.manageARSystemsErrors(ARError.SENSORS_ERROR);
      }
    });

    //Wait some time, and if there are no errors with sensors, continue to initialize remaining ar systems.
    setTimeout(async () => {
      //If sensors in error, do nothing (errors are managed previously)
      if (this.sensorMissing)
        return;

      //DEBUG this.debugPrint();
      if (this.accelerometerCoordinatesErrorSubscription)
        this.accelerometerCoordinatesErrorSubscription.unsubscribe();
      if (this.gyroscopeCoordinatesErrorSubscription)
        this.gyroscopeCoordinatesErrorSubscription.unsubscribe();
      if (this.magnetometerCoordinatesErrorSubscription)
        this.magnetometerCoordinatesErrorSubscription.unsubscribe();

      if (!this.cameraPresent)
      {
        this.manageARSystemsErrors(ARError.CAMERA_SYSTEM_NOT_FOUND);
        return;
      }

      if (!this.cameraAuthorized)
      {
        //DEBUG console.log("BEFORE camera permission");
        let cameraAuth = await this.diagnosticService.requestCameraAuthorization();
        console.log("cameraAuth: ", cameraAuth);
        //DEBUG console.log("AFTER camera permission");

        if (cameraAuth.toLowerCase().indexOf("denied") >= 0)
        {
          this.manageARSystemsErrors(ARError.CAMERA_PERMISSION_NOT_GRANTED);
          return;
        }
      }

      //DEBUG this.debugPrint();

      //Here camera is present and is authorized. Continue with other permissions
      if (!this.locationEnabled)
      {
        this.manageARSystemsErrors(ARError.LOCATION_SERVICE_DISABLED);
          return;
      }

      if (!this.locationAvailable || !this.locationAuthorized)
      {
        if (Utils.isIos(this.platform))
        {
          if (this.firstLocationAuthorization)  //iOS doesn't return anything if the permission is requested many times
          {
            //DEBUGconsole.log("BEFORE location permission");
            let locAuth = await this.diagnosticService.requestLocationAuthorization();
            console.log("locAuth: ", locAuth);
            //DEBUGconsole.log("AFTER location permission");
  
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
          //DEBUG console.log("BEFORE location permission");
          let locAuth = await this.diagnosticService.requestLocationAuthorization();
          console.log("locAuth: ", locAuth);
          //DEBUG console.log("AFTER location permission");
  
          if (locAuth.toLowerCase().indexOf("denied") >= 0)
          {
            this.manageARSystemsErrors(ARError.LOCATION_PERMISSION_NOT_GRANTED);
            return;
          }
        }
      }

      //DEBUG this.debugPrint();

      //Start camera with a delay to let landscape mode and permission requests
      setTimeout(() => {
        this.initCamera();
      }, constants.CAMERA_INIT_DELAY);

      //Here all permissions are granted
      //Only on Android request max location precision
      if (Utils.isAndroid(this.platform))
      {
        //DEBUG console.log("BEFORE location can request max precision");
        let canRequest = await this.locationAccuracy.canRequest();
        console.log("canRequest: ", canRequest);
        //DEBUG console.log("AFTER location can request max precision");

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
      else if (Utils.isIos(this.platform))
      {
        this.startARSystems();
      }

    }, 1500);
  }

  private initCamera()
  {
    let isIos = Utils.isIos(this.platform);

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

    this.sensorsServiceSubscription = this.sensorsService.getSensorsData(sensorsFusionOptions).subscribe((fusionOrientation: FusionSensorsDTO) => {
      if (fusionOrientation && fusionOrientation.alfa && fusionOrientation.beta && fusionOrientation.gamma)
        this.arInfos.setFusionCoordinates(fusionOrientation);
    });

    //Hide spinner
    setTimeout(() => this.spinnerService.dismissLoader(), sensorsFusionOptions.delay);

    this.spotArraySubscription = this.spotArray$.subscribe((spotArray: any[]) => {
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
    this.spinnerService.dismissLoader();
    this.alertService.showSensorsError(errorType);
  }

  ngOnDestroy()
  {
    this.spinnerService.dismissLoader();
    this.statusBar.show();
    this.sensorsService.stopSensors();
    this.cameraPreview.stopCamera();
    this.gpsService.stopService();
    
    setTimeout(() => this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT), 500);

    this.events.unsubscribe(constants.AR_SYSTEM_ERROR, this.leavePage);

    if (this.spotArraySubscription)
      this.spotArraySubscription.unsubscribe();

    if (this.sensorsServiceSubscription)
      this.sensorsServiceSubscription.unsubscribe();

    if (this.accelerometerCoordinatesErrorSubscription)
      this.accelerometerCoordinatesErrorSubscription.unsubscribe();

    if (this.gyroscopeCoordinatesErrorSubscription)
      this.gyroscopeCoordinatesErrorSubscription.unsubscribe();

    if (this.magnetometerCoordinatesErrorSubscription)
      this.magnetometerCoordinatesErrorSubscription.unsubscribe();
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
