import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AugmentedRealityPage } from './augmented-reality.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AugmentedRealityPage
      }
    ])
  ],
  declarations: [AugmentedRealityPage]
})
export class AugmentedRealityPageModule { }