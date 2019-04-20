import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AugmentedRealityPage } from './augmented-reality.page';

const routes: Routes = [
  {
    path: '',
    component: AugmentedRealityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AugmentedRealityPage]
})
export class AugmentedRealityPageModule {}
