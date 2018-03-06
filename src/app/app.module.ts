import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { KeyboardService } from './keyboard.service';
import { PaletteIoService } from './palette-io.service';

import { AppComponent } from './app.component';
import { MainEditorViewComponent } from './main-editor-view/main-editor-view.component';
import { PaletteViewComponent } from './palette-view/palette-view.component';

const assetUrl = "/assets/";

@NgModule({
  declarations: [
    AppComponent,
    MainEditorViewComponent,
    PaletteViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ColorPickerModule
  ],
  providers: [
    KeyboardService
    //PaletteIoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
