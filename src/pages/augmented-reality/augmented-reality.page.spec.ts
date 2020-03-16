import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AugmentedRealityPage } from './augmented-reality.page';

describe('AugmentedRealityPage', () => {
  let component: AugmentedRealityPage;
  let fixture: ComponentFixture<AugmentedRealityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AugmentedRealityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AugmentedRealityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
