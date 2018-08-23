// Core stuff and modules
import { NgModule } from '@angular/core';
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
import { WadReaderService } from './wad-reader.service';
import { MessageService } from './message.service';
import { GradientService } from './gradient.service';

// Components
import { AppComponent } from './app.component';
import { MainEditorViewComponent } from './main-editor-view/main-editor-view.component';
import { PaletteViewComponent } from './palette-view/palette-view.component';
import { GradientEditorComponent } from './gradient-editor/gradient-editor.component';
import { PaletteNavigatorComponent } from './palette-navigator/palette-navigator.component';
import { PaletteLoaderComponent } from './palette-loader/palette-loader.component';
import { PaletteOperationsComponent } from './palette-operations/palette-operations.component';
import { MessageLogComponent } from './message-log/message-log.component';
import { ModalComponent } from './modal/modal.component';
import { SelectedColourComponent } from './selected-colour/selected-colour.component';

import { PluralPipe } from './plural.pipe';
import { ReadableRealNumberPipe } from './readable-real-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainEditorViewComponent,
    PaletteViewComponent,
    GradientEditorComponent,
    PaletteNavigatorComponent,
    PaletteLoaderComponent,
    PaletteOperationsComponent,
    ModalComponent,
    MessageLogComponent,
    SelectedColourComponent,
    PluralPipe,
    ReadableRealNumberPipe
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
    PalcollectionOperationService,
    WadReaderService,
    MessageService,
    GradientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
