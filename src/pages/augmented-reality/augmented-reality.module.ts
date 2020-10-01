import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AugmentedRealityPageRoutingModule } from './augmented-reality-routing.module';

import { AugmentedRealityPage } from './augmented-reality.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AugmentedRealityPageRoutingModule
  ],
  declarations: [AugmentedRealityPage]
})
export class AugmentedRealityPageModule {}
