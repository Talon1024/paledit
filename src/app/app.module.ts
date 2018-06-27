// Core stuff and modules
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

// Services
import { KeyboardService } from './keyboard.service';
import { PaletteIoService } from './palette-io.service';
import { PaletteOperationService } from './palette-operation.service';
import { PalcollectionOperationService } from './palcollection-operation.service';
import { SettingsService } from './settings.service';

// Components
import { AppComponent } from './app.component';
import { MainEditorViewComponent } from './main-editor-view/main-editor-view.component';
import { PaletteViewComponent } from './palette-view/palette-view.component';
import { GradientEditorComponent } from './gradient-editor/gradient-editor.component';
import { PaletteNavigatorComponent } from './palette-navigator/palette-navigator.component';
import { PaletteLoaderComponent } from './palette-loader/palette-loader.component';
import { PaletteOperationsComponent } from './palette-operations/palette-operations.component';

// Languages/locales
import localeEnCanada from '@angular/common/locales/en-CA';
import localeEnCanadaExtra from '@angular/common/locales/extra/en-CA';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';

const assetUrl = '/assets/';

@NgModule({
  declarations: [
    AppComponent,
    MainEditorViewComponent,
    PaletteViewComponent,
    GradientEditorComponent,
    PaletteNavigatorComponent,
    PaletteLoaderComponent,
    PaletteOperationsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ColorPickerModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-CA'},
    KeyboardService,
    PaletteIoService,
    SettingsService,
    PaletteOperationService,
    PalcollectionOperationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
