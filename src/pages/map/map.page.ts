import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { select } from '@redux-multipurpose/core';

import { Plugins, GeolocationPosition } from '@capacitor/core';
const { Storage } = Plugins;

import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { TranslateService } from '@ngx-translate/core';

import { GpsActions } from '../../store';

import { Utils } from '../../utils/utils';
import { constants } from '../../utils/constants';

import
{
  Map,
  TileLayer,
  LatLng,
  GeoJSON,
  Icon,
  Marker,
  LatLngBounds,
  MarkerClusterGroupOptions,
  MarkerCluster,
  MarkerClusterGroup,
  DivIcon,
  geoJSON
} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit
{
  private static DEFAULT_POSITION = {
    lat: 41.898998,
    lng: 12.495939
  };

  private static readonly EXAMPLE_POI_TITLE = 'Example map poi in ';
  private static readonly EXAMPLE_POI_DESCRIPTION = 'A simple description for map example poi located in ';

  @select(["appPlatformDevice", "infos", "os"])
  os$: Observable<'ios' | 'android' | 'other'>;
  os: 'ios' | 'android' | 'other';


  private isLocationEnabled: boolean = true;
  private isLocationAvailable: boolean = true;
  private isLocationAuthorized: boolean = true;


  map: Map;
  userMarker: Marker;
  poisCluster: MarkerClusterGroup;

  mapOptions = {
    layers: [
      new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // tslint:disable-next-line
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
        <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery© \
        <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18
      })
    ],
    zoom: 5,
    zoomControl: false,
    center: new LatLng(41.898998, 12.495939)
  };

  clusterOptions: MarkerClusterGroupOptions = {
    zoomToBoundsOnClick: true,
    iconCreateFunction: (cluster: MarkerCluster) =>
    {
      let markersNumber = cluster.getChildCount();

      let style = 'color: #fff; font-size: 14px; position: relative; ';

      if (markersNumber < 20)
      {
        style += 'background-color: #0069d4; width: 30px; height: 30px; line-height: 30px; border-radius: 15px; right: 9px; bottom: 9px;';
      }
      else if (markersNumber >= 20 && markersNumber < 40)
      {
        style += 'background-color: #004388; width: 40px; height: 40px; line-height: 40px; border-radius: 20px; right: 14px; bottom: 14px;';
      }
      else
      {
        style += 'background-color: #00274e; width: 50px; height: 50px; line-height: 50px; border-radius: 25px; right: 19px; bottom: 19px;';
      }

      let spanStyle = 'text-align: center; display: inline-block; width: 100%; position: absolute; top: 50%; left: 0; transform: translateY(-50%)';

      let html = '<div style="' + style + '"><span style="' + spanStyle + '">' + markersNumber + '</span></div>';
      return new DivIcon({
        html
      });
    }
  };
  clusterData = [];

  constructor(
    private diagnostic: Diagnostic,
    private gps: GpsActions,
    private translate: TranslateService
  ) {}

  ngOnInit()
  {
    //Test geolocation activation and permissions.
    //If all is ok, launch position retrieve
    this.os$.pipe(first(), delay(1000)).subscribe(os => {
      this.os = os;
      this.permissionsTestAndUserPosition();
    });
  }

  onMapReady(map: Map)
  {
    this.map = map;

    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 300);

    /*this.map.once("moveend", () =>
      {
        this.map.on("click", (event) =>
        {
          let coordinates: LatLng = event['latlng'];

          if (this.poisCluster)
          {
            //Add a new marker
            let title = MapPage.EXAMPLE_POI_TITLE + '[' + coordinates.lat + ', ' + coordinates.lng + ']';
            let description = MapPage.EXAMPLE_POI_DESCRIPTION + '[' + coordinates.lat + ', ' + coordinates.lng + ']';
            let m = new Marker(
              [coordinates.lat, coordinates.lng],
              {
                icon: new Icon({
                  iconUrl: "assets/images/marker_blue.png",
                  iconSize: [32, 32]
                })
              }
            );

            //m['title'] = title;
            //m['description'] = description;

            //m.addTo(this.poisCluster).on('click', this.removeMarker);

            //Store a new marker in redux storage
            this.storage.addPoi({
              title,
              description,
              latitude: coordinates.lat,
              longitude: coordinates.lng,
              icon: 'assets/images/marker_blue.png'
            });
          }
        });
      });*/
  }

  onClusterReady(cluster: MarkerClusterGroup)
  {
    this.poisCluster = cluster;

    /*this.pois$.pipe(first()).subscribe(pois => {
      for (let poi of pois)
      {
        let m = new Marker(
          [poi.latitude, poi.longitude],
          {
            icon: new Icon({
              iconUrl: "assets/images/marker_blue.png",
              iconSize: [32, 32]
            })
          }
        );

        //m['title'] = poi.title;
        //m['description'] = poi.description;

        m.addTo(this.poisCluster).on('click', this.removeMarker);
      }
    });*/
  }

  private async permissionsTestAndUserPosition()
  {
    //firstLocationAuthorization is a flag to verify if the location service
    //is requesting for the first time. On iOS permission dialog is shown only at
    //the first time
    /*let firstLocationAuthorization: boolean;
    try
    {
      let data = await Storage.get({ key: constants.FIRST_LOCATION_PERMISSION_REQUEST });
      console.log("firstLocationAuthorization: ", firstLocationAuthorization);

      if (!data)
        firstLocationAuthorization = true;
      else
        firstLocationAuthorization = false;
    }
    catch (err)
    {
      console.log("No error: simply app shortcut flag not in memory");
      firstLocationAuthorization = true;
    }

    try
    {
      this.isLocationEnabled = await this.diagnostic.isLocationEnabled();
      this.isLocationAvailable = await this.diagnostic.isLocationAvailable();
      this.isLocationAuthorized = await this.diagnostic.isLocationAuthorized();

      console.log("isLocationEnabled: ", await this.diagnostic.isLocationEnabled());
      console.log("isLocationAvailable: ", await this.diagnostic.isLocationAvailable());
      console.log("isLocationAuthorized: ", await this.diagnostic.isLocationAuthorized());
    }
    catch (error)
    {
      console.log("Internal error: ", error);
    }

    if (!this.isLocationAvailable || !this.isLocationAuthorized)
    {
      if (this.os === 'ios')
      {
        if (firstLocationAuthorization)
        {
          let locAuth = await this.diagnostic.requestLocationAuthorization();
          console.log("locAuth: ", locAuth);

          Storage.set({ key: constants.FIRST_LOCATION_PERMISSION_REQUEST, value: "true" });

          if (locAuth.toLowerCase().indexOf("denied") >= 0)
          {
            console.log("Location permission not accepted");
            let label = await this.translate.get('LOCATION_NOT_PERMITTED').toPromise();
            //this.toastService.showErrorToast(label);
          }
        }
        else
        {
          console.log("Location permission not accepted");
          let label = await this.translate.get('LOCATION_NOT_PERMITTED').toPromise();
          //this.toastService.showErrorToast(label);
        }
      }
      else if (this.os === 'android')
      {
        let locAuth = await this.diagnostic.requestLocationAuthorization();
        console.log("locAuth: ", locAuth);

        if (locAuth.toLowerCase().indexOf("denied") >= 0)
        {
          console.log("Location permission not accepted");
          let label = await this.translate.get('LOCATION_NOT_PERMITTED').toPromise();
          //this.toastService.showErrorToast(label);
        }
      }
    }

    if (!this.isLocationEnabled)
    {
      console.log("Location not enabled");
      //this.toastService.showInfoToast(await this.translate.get('LOCATION_NOT_ENABLED').toPromise());
    }*/

    this.gps.getPosition()
      .then(this.onPositionRetrieve)
      .catch(this.onPositionRetrieve);
  }

  private onPositionRetrieve = (gpsResponse: any) =>
  {
    if (!Utils.isGpsInError(gpsResponse))
    {
      let geoposition = gpsResponse as GeolocationPosition;

      //Set the new marker
      let icon = new Icon({
        iconUrl: 'assets/images/user-marker-small.png',
        iconSize: [32, 32],
        //iconAnchor: [16, 0],
        //popupAnchor: [-3, -76],
        //shadowUrl: 'my-icon-shadow.png',
        //shadowSize: [68, 95],
        //shadowAnchor: [22, 94]
      });

      let coords = new LatLng(geoposition.coords.latitude, geoposition.coords.longitude);

      this.userMarker = new Marker(
        coords,
        { icon }
      ).addTo(this.map);

      this.map.flyTo(coords, 13, {
        animate: true,
        duration: 1,
      });
    }
    else
    {
      let coords = new LatLng(MapPage.DEFAULT_POSITION.lat, MapPage.DEFAULT_POSITION.lng);

      this.map.flyTo(coords, 5, {
        animate: true,
        duration: 1
      });
    }
  };

  findMe()
  {
    if (this.userMarker)
    {
      this.map.removeLayer(this.userMarker);
      this.userMarker = null;
    }

    this.gps.resetCoordinates();
    this.gps.getPosition()
      .then(this.onPositionRetrieve)
      .catch(this.onPositionRetrieve);
  }
}
