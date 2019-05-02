import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SpinnerComponent } from './spinner.component';

@NgModule({
	declarations: [
		SpinnerComponent
	],
	imports: [
		CommonModule,
		IonicModule,
	],
	exports: [
		SpinnerComponent
	]
})
export class SpinnerModule {}
