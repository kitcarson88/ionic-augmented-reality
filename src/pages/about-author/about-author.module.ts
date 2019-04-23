import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AboutAuthorPage } from './about-author.page';

import { MenuOverlayModule } from '../../components/menu-overlay/menu-overlay.module';

const routes: Routes = [
  {
    path: '',
    component: AboutAuthorPage
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
  declarations: [AboutAuthorPage]
})
export class AboutAuthorPageModule {}
