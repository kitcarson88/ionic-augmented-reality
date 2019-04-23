import { Component, OnInit } from '@angular/core';

import { constants } from '../../util/constants';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit
{
  startAnimation: boolean;

  constructor() {
    this.startAnimation = false;
  }

  ngOnInit() {
    setTimeout(() => {
      this.startAnimation = true;
    }, constants.SPLASH_ANIMATION_DELAY);
  }
}
