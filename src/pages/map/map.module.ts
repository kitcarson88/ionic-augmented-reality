import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapPage } from './map.page';

import { MenuOverlayModule } from '../../components/menu-overlay/menu-overlay.module';

const routes: Routes = [
  {
    path: '',
    component: MapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuOverlayModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
