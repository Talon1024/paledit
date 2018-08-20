import { Component, OnInit } from '@angular/core';
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

  public readonly palFileName = 'palette.pal';
  public palDataURI: SafeUrl;
  public readonly cmapFileName = 'colormap.lmp';
  public cmapDataURI: SafeUrl;

  public helpVisible = false;
  public loadVisible = false;

  private readonly assetUrl = 'assets';

  constructor(private httpClient: HttpClient,
    private paletteIo: PaletteIoService,
    private colOp: PalcollectionOperationService,
    private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp: ArrayBuffer) => {
      const palette = new Uint8Array(resp);
      this.colOp.createFromPlaypal(palette);
    });
    this.cmapDataURI = this.sanitizer.bypassSecurityTrustUrl('data:,Not implemented yet.');
    this.paletteIo.loadStateObv.subscribe((loading) => {
      this.loadVisible = loading;
    });
  }

  savePalette() {
    const data = this.paletteIo.savePalCollection(this.colOp.collection);
    this.palDataURI = this.sanitizer.bypassSecurityTrustUrl(`data:application/octet-stream;base64,${data}`);
  }

  saveColourmap() {
    // console.log('Saving colourmap...');
  }
}
