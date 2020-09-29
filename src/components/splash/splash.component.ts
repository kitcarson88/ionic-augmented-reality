import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { Observable } from 'rxjs';
import { store, select, ReducerDeallocator } from '@redux-multipurpose/core';
import { hide } from '../../store/splash/splash.slice';
import { addEpic, removeEpic } from '../../store/epics';
import { doSplashAnimation } from '../../store/splash/splash.epics';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
@ReducerDeallocator(['splash'])
export class SplashComponent implements AfterViewInit, OnDestroy
{

  @select(["splash"])
  splashState$: Observable<'active' | 'fadeIn' | 'animation' | 'fadeOut' | 'inactive'>;

  constructor() {}

  ngOnInit()
  {
    store.replaceEpics(addEpic('doSplashAnimation', doSplashAnimation));
  }

  ngAfterViewInit()
  {
    SplashScreen.hide();
    store.dispatch(hide());
  }

  ngOnDestroy()
  {
    store.replaceEpics(removeEpic('doSplashAnimation'));
  }
}
