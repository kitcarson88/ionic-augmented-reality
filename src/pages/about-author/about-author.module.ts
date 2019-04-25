import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../../app/app.module';
import { HttpClient } from '@angular/common/http';

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
    TranslateModule.forChild({
      loader: {
           provide: TranslateLoader,
           useFactory: (createTranslateLoader),
           deps: [ HttpClient ]
         }
      }
    ),
    RouterModule.forChild(routes)
  ],
  declarations: [AboutAuthorPage]
})
export class AboutAuthorPageModule {}
