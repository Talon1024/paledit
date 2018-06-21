import { Component, OnInit } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { ColourRange } from '../palette-model/colour-range';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';
import { PaletteIoService } from '../palette-io.service';

@Component({
  selector: 'app-main-editor-view',
  templateUrl: './main-editor-view.component.html',
  styleUrls: ['./main-editor-view.component.css']
})
export class MainEditorViewComponent implements OnInit {

  private collection: Palcollection;
  private palette: Palette;
  private selectionRange: ColourRange;

  private readonly assetUrl = '/assets';

  constructor(private httpClient: HttpClient,
    private paletteIo: PaletteIoService) {}

  readPaletteFile(file) {
    this.paletteIo.getPaletteFile(file)
        .subscribe((collection: Palcollection) => {
      this.collection = collection;
      this.setPalIndex(0);
    }, (error: any) => {
      console.error(error);
    });
  }

  setPalIndex(palIndex: number) {
    this.palette = this.collection.palettes[palIndex];
  }

  setSelectionRange(range: ColourRange) {
    this.selectionRange = range;
  }

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp: ArrayBuffer) => {
      const palette = Palette.fromData(new Uint8ClampedArray(resp));
      this.collection = Palcollection.withInitialPal(palette);
      this.setPalIndex(0);
    });
  }

  savePalette() {
    const data = this.paletteIo.savePalCollection(this.collection);
    location.replace(`data:application/octet-stream;base64,${data}`);
  }

  saveColourmap() {
    console.log('Saving colourmap...');
  }

}
