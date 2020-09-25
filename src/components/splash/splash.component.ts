import { Component, AfterViewInit } from '@angular/core';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { SplashActions } from '../../store';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements AfterViewInit
{
  @select(["splash"])
  splashState$: Observable<'active' | 'fadeIn' | 'animation' | 'fadeOut' | 'inactive'>;

  constructor(private splashScreen: SplashScreen, private splashActions: SplashActions) {}

  ngAfterViewInit()
  {
    this.splashScreen.hide();
    this.splashActions.hide();
  }
}
