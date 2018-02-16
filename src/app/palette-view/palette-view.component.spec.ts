import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteViewComponent } from './palette-view.component';

describe('PaletteViewComponent', () => {
  let component: PaletteViewComponent;
  let fixture: ComponentFixture<PaletteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
