import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Palette } from '../palette-model/palette';
import { ColourRange } from '../palette-model/colour-range';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';
import { PaletteIoService } from '../palette-io.service';
import { PalcollectionOperationService } from '../palcollection-operation.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main-editor-view',
  templateUrl: './main-editor-view.component.html',
  styleUrls: ['./main-editor-view.component.css']
})
export class MainEditorViewComponent implements OnInit {

  private palette: Palette;
  private palFileName = 'palette.pal';
  private palDataURI: SafeUrl;
  private cmapFileName = 'colormap.lmp';
  private cmapDataURI: SafeUrl;
  private selectionRange: ColourRange;

  private helpVisible = false;

  private readonly assetUrl = 'assets';

  constructor(private httpClient: HttpClient,
    private paletteIo: PaletteIoService,
    private colOp: PalcollectionOperationService,
    private sanitizer: DomSanitizer) {}

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

  savePalette() {
    const data = this.paletteIo.savePalCollection(this.colOp.collection);
    this.palDataURI = this.sanitizer.bypassSecurityTrustUrl(`data:application/octet-stream;base64,${data}`);
  }

  saveColourmap() {
    // console.log('Saving colourmap...');
  }

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp: ArrayBuffer) => {
      const palette = Palette.fromData(new Uint8ClampedArray(resp));
      this.colOp.createWithInitialPalette(palette);
      this.setPalIndex(0);
    });
    this.cmapDataURI = this.sanitizer.bypassSecurityTrustUrl('data:,Not implemented yet.');
  }

  showHelp() {
    this.helpVisible = true;
  }

}
