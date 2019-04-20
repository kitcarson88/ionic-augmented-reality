import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AugmentedRealityPage } from './augmented-reality.page';

describe('AugmentedRealityPage', () => {
  let component: AugmentedRealityPage;
  let fixture: ComponentFixture<AugmentedRealityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AugmentedRealityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AugmentedRealityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
