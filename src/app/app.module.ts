import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PaletteViewComponent } from './palette-view/palette-view.component';

const assetUrl = "/assets/";

@NgModule({
  declarations: [
    AppComponent,
    PaletteViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
