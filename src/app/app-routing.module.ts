import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('../pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'augmented-reality',
    loadChildren: () => import('../pages/augmented-reality/augmented-reality.module').then( m => m.AugmentedRealityPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
