import { Component, OnInit } from '@angular/core';

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
  map: Map;
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

  constructor() { }

  ngOnInit()
  {
  }

  onMapReady(map: Map)
  {
    this.map = map;

    setTimeout(() => {
      this.map.invalidateSize();

      this.map.on("click", (event) =>
      {
        
      });
    }, 500);
  }

  onClusterReady(cluster: MarkerClusterGroup)
  {
    this.poisCluster = cluster;
  }
}
