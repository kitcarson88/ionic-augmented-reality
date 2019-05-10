import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: '../pages/home/home.module#HomePageModule' },
  //{ path: 'map', loadChildren: '../pages/map/map.module#MapPageModule' },
  { path: 'augmented-reality', loadChildren: '../pages/augmented-reality/augmented-reality.module#AugmentedRealityPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
