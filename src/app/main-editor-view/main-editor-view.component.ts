import { Component, OnInit } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';
import { PaletteIoService } from '../palette-io.service';
import { KeyboardService, KeyState } from '../keyboard.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-main-editor-view',
  templateUrl: './main-editor-view.component.html',
  styleUrls: ['./main-editor-view.component.css']
})
export class MainEditorViewComponent implements OnInit {

  private collection:Palcollection;
  private palette:Palette;

  private readonly assetUrl = "/assets";

  constructor(private httpClient:HttpClient,
    private paletteIo:PaletteIoService,
    private keyboard:KeyboardService,
    private settings:SettingsService) {}

  readPaletteFile(file) {
    this.paletteIo.getPaletteFile(file)
        .subscribe((collection:Palcollection) => {
      this.collection = collection;
      this.setPalIndex(0);
    }, (error:any) => {
      console.error(error);
    });
  }

  setPalIndex(palIndex:number) {
    this.palette = this.collection.palettes[palIndex];
  }

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp:ArrayBuffer) => {
      let palette = Palette.fromData(new Uint8ClampedArray(resp));
      this.collection = Palcollection.withInitialPal(palette);
      this.setPalIndex(0);
    });
  }

  savePalette() {
    let data = this.paletteIo.savePalCollection(this.collection);
    location.replace(`data:application/octet-stream;base64,${data}`);
  }

  saveColourmap() {
    console.log("Saving colourmap...");
  }

}
