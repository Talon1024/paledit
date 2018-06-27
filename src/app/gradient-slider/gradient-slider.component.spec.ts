import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientSliderComponent } from './gradient-slider.component';

describe('GradientSliderComponent', () => {
  let component: GradientSliderComponent;
  let fixture: ComponentFixture<GradientSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradientSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradientSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
