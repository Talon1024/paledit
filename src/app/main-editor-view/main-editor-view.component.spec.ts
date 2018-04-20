import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEditorViewComponent } from './main-editor-view.component';
import { PaletteViewComponent } from '../palette-view/palette-view.component';
import { PaletteNavigatorComponent } from '../palette-navigator/palette-navigator.component';
import { FormsModule } from '@angular/forms';
import { GradientEditorComponent } from '../gradient-editor/gradient-editor.component';
import { PaletteLoaderComponent } from '../palette-loader/palette-loader.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { PaletteIoService } from '../palette-io.service';
import { SettingsService } from '../settings.service';
import { KeyboardService } from '../keyboard.service';
import { PaletteOperationService } from '../palette-operation.service';

describe('MainEditorViewComponent', () => {
  let component: MainEditorViewComponent;
  let fixture: ComponentFixture<MainEditorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainEditorViewComponent,
        PaletteViewComponent,
        GradientEditorComponent,
        PaletteNavigatorComponent,
        PaletteLoaderComponent
      ],
      imports: [ FormsModule, HttpClientModule ],
      providers: [
        HttpClient,
        PaletteIoService,
        KeyboardService,
        SettingsService,
        PaletteOperationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEditorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
