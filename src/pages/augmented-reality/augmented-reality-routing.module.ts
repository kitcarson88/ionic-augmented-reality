import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AugmentedRealityPage } from './augmented-reality.page';

const routes: Routes = [
  {
    path: '',
    component: AugmentedRealityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AugmentedRealityPageRoutingModule {}
