import { Component, OnInit, ViewChild } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { ColourRange } from '../palette-model/colour-range';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';
import { PaletteIoService } from '../palette-io.service';
import { PalcollectionOperationService } from '../palcollection-operation.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-main-editor-view',
  templateUrl: './main-editor-view.component.html',
  styleUrls: ['./main-editor-view.component.css']
})
export class MainEditorViewComponent implements OnInit {

  public palette: Palette;
  public readonly palFileName = 'palette.pal';
  public palDataURI: SafeUrl;
  public readonly cmapFileName = 'colormap.lmp';
  public cmapDataURI: SafeUrl;
  public selectionRange: ColourRange;
  public collection: Palcollection;

  public helpVisible = false;
  public loadVisible = false;

  private readonly assetUrl = 'assets';

  constructor(private httpClient: HttpClient,
    private paletteIo: PaletteIoService,
    private colOp: PalcollectionOperationService,
    private sanitizer: DomSanitizer,
    private msg: MessageService) {}

  readPaletteFile(file: File) {
    this.loadVisible = true;
    this.paletteIo.getPaletteFile(file)
        .subscribe((playpal: Uint8ClampedArray) => {
      this.loadVisible = false;
      this.colOp.createFromData(playpal);
      this.collection = this.colOp.collection;
      this.setPalIndex(0);
    }, (error: Error) => {
      this.loadVisible = false;
      this.msg.error(error.message);
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
      this.collection = this.colOp.collection;
      this.setPalIndex(0);
    });
    this.cmapDataURI = this.sanitizer.bypassSecurityTrustUrl('data:,Not implemented yet.');
  }

  showHelp() {
    this.helpVisible = true;
  }

}
