import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteOperationsComponent } from './palette-operations.component';

describe('PaletteOperationsComponent', () => {
  let component: PaletteOperationsComponent;
  let fixture: ComponentFixture<PaletteOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
