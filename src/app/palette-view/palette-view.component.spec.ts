import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteViewComponent } from './palette-view.component';
import { KeyboardService } from '../keyboard.service';
import { SettingsService } from '../settings.service';
import { PaletteOperationService } from '../palette-operation.service';

describe('PaletteViewComponent', () => {
  let component: PaletteViewComponent;
  let fixture: ComponentFixture<PaletteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteViewComponent ],
      providers: [ KeyboardService, SettingsService, PaletteOperationService ]
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
