import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SplashComponent } from './splash.component';

import { CentralizerModule } from 'ionic-angular-utilities';

@NgModule({
	declarations: [
		SplashComponent
	],
	imports: [
		CommonModule,
		IonicModule,
		CentralizerModule
	],
	exports: [
		SplashComponent
	]
})
export class SplashModule {}
