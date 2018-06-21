import { Component, OnInit } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { ColourRange } from '../palette-model/colour-range';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';
import { PaletteIoService } from '../palette-io.service';
import { PalcollectionOperationService } from '../palcollection-operation.service';

@Component({
  selector: 'app-main-editor-view',
  templateUrl: './main-editor-view.component.html',
  styleUrls: ['./main-editor-view.component.css']
})
export class MainEditorViewComponent implements OnInit {

  private palette: Palette;
  private selectionRange: ColourRange;

  private readonly assetUrl = '/assets';

  constructor(private httpClient: HttpClient,
    private paletteIo: PaletteIoService,
    private colOp: PalcollectionOperationService) {}

  readPaletteFile(file) {
    this.paletteIo.getPaletteFile(file)
        .subscribe((collection: Palcollection) => {
      this.colOp.collection = collection;
      this.setPalIndex(0);
    }, (error: any) => {
      console.error(error);
    });
  }

  setPalIndex(palIndex: number) {
    this.palette = this.colOp.getPal(palIndex);
  }

  setSelectionRange(range: ColourRange) {
    this.selectionRange = range;
  }

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp: ArrayBuffer) => {
      const palette = Palette.fromData(new Uint8ClampedArray(resp));
      this.colOp.collection = Palcollection.withInitialPal(palette);
      this.setPalIndex(0);
    });
  }

  savePalette() {
    const data = this.paletteIo.savePalCollection(this.colOp.collection);
    location.replace(`data:application/octet-stream;base64,${data}`);
  }

  saveColourmap() {
    console.log('Saving colourmap...');
  }

}
