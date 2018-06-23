import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { KeyboardService } from './keyboard.service';
import { PaletteIoService } from './palette-io.service';
import { PaletteOperationService } from './palette-operation.service';
import { PalcollectionOperationService } from './palcollection-operation.service';
import { SettingsService } from './settings.service';

import { AppComponent } from './app.component';
import { MainEditorViewComponent } from './main-editor-view/main-editor-view.component';
import { PaletteViewComponent } from './palette-view/palette-view.component';
import { GradientEditorComponent } from './gradient-editor/gradient-editor.component';
import { PaletteNavigatorComponent } from './palette-navigator/palette-navigator.component';
import { PaletteLoaderComponent } from './palette-loader/palette-loader.component';
import { PaletteOperationsComponent } from './palette-operations/palette-operations.component';

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
    KeyboardService,
    PaletteIoService,
    SettingsService,
    PaletteOperationService,
    PalcollectionOperationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
