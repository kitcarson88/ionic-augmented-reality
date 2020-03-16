import { Component } from '@angular/core';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent
{
  @select(["splash"])
  splashState$: Observable<'active' | 'fadeIn' | 'animation' | 'fadeOut' | 'inactive'>;
}
