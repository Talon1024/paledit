import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MainEditorViewComponent } from './main-editor-view/main-editor-view.component';
import { PaletteViewComponent } from './palette-view/palette-view.component';
import { GradientEditorComponent } from './gradient-editor/gradient-editor.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PaletteIoService } from './palette-io.service';
import { PaletteOperationService } from './palette-operation.service';
import { KeyboardService } from './keyboard.service';
import { SettingsService } from './settings.service';
import { PaletteNavigatorComponent } from './palette-navigator/palette-navigator.component';
import { PaletteLoaderComponent } from './palette-loader/palette-loader.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
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
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Palette Editor'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Palette Editor');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Palette Editor!');
  }));
});
