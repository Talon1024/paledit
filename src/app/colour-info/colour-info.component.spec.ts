import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourInfoComponent } from './colour-info.component';

describe('ColourInfoComponent', () => {
  let component: ColourInfoComponent;
  let fixture: ComponentFixture<ColourInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColourInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
