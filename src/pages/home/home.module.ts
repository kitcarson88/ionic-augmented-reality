import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../../app/app.module';
import { HttpClient } from '@angular/common/http';

import { HomePage } from './home.page';
import { MenuOverlayModule } from 'src/components/menu-overlay/menu-overlay.module';

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
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
