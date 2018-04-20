import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteLoaderComponent } from './palette-loader.component';

describe('PaletteLoaderComponent', () => {
  let component: PaletteLoaderComponent;
  let fixture: ComponentFixture<PaletteLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
