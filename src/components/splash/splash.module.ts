import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SplashComponent } from './splash.component';

@NgModule({
	declarations: [
		SplashComponent
	],
	imports: [
		CommonModule,
		IonicModule,
	],
	exports: [
		SplashComponent
	]
})
export class SplashModule {}
