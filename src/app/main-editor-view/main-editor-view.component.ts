import { Component, OnInit } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-editor-view',
  templateUrl: './main-editor-view.component.html',
  styleUrls: ['./main-editor-view.component.css']
})
export class MainEditorViewComponent implements OnInit {

  private collection:Palcollection;
  private colPalIndex:number; // User input (actually index + 1)
  private palette:Palette;
  private palColours:Palcolour[] = new Array();
  private palRows:Array<Palcolour>[];
  private fileReader:FileReader = new FileReader();

  private readonly assetUrl = "/assets";

  constructor(private httpClient:HttpClient) {
    this.colPalIndex = 1;
    this.palRows = new Array<Array<Palcolour>>();
  }

  private cancelEvent(e:Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragEnter(e:DragEvent) {
    this.cancelEvent(e);
  }

  handleDragOver(e:DragEvent) {
    this.cancelEvent(e);
  }

  dropPalette(event:DragEvent) {
    this.cancelEvent(event);

    if (event.dataTransfer) {
      let files = event.dataTransfer.files;
      this.readPaletteFile(files[0]);
    }
  }

  selectPalette(event:Event) {
    let targ = <HTMLInputElement>(event.target);
    if (targ.files && targ.files.length > 0) {
      this.readPaletteFile(targ.files[0]);
    }
  }

  readPaletteFile(file) {
    this.fileReader.readAsArrayBuffer(file);
    new Promise((res, rej) => {
      this.fileReader.onload = () => res(this.fileReader.result);
      this.fileReader.onerror = () => rej(this.fileReader.error);
    }).then((data:ArrayBuffer) => {
      this.collection = Palcollection.fromData(new Uint8ClampedArray(data));
      this.setPalIndex(1);
    }).catch((error) => {
      console.error(error);
    });
  }

  setPalIndex(palIndex:number) {
    this.colPalIndex = palIndex;
    let realIndex = palIndex - 1;
    this.setPalette(this.collection.palettes[realIndex]);
  }

  nextPal() {
    if (this.colPalIndex < this.collection.palettes.length) this.colPalIndex += 1;
    this.setPalIndex(this.colPalIndex);
  }

  prevPal() {
    if (this.colPalIndex > 1) this.colPalIndex -= 1;
    this.setPalIndex(this.colPalIndex);
  }

  firstPal() {
    this.colPalIndex = 1;
    this.setPalIndex(this.colPalIndex);
  }

  lastPal() {
    this.colPalIndex = this.collection.palettes.length;
    this.setPalIndex(this.colPalIndex);
  }

  setPalette(pal:Palette) {
    this.palette = pal;
    for (let i = 0; i < this.palette.getLength(); i++) {
      this.palColours[i] = this.palette.colourAt(i);
    }
    this.updateRows();
  }

  updateRows() {
    // Just in case I decide to load palettes where length != 256
    let palLength = this.palette.getLength();
    let rowLength = Math.floor(Math.sqrt(palLength));

    for (let idx = 0, row = -1, col = 0; idx < palLength; idx++) {
      if (idx % rowLength === 0) {
        row += 1;
        this.palRows[row] = new Array(rowLength);
        col = 0;
      }
      this.palRows[row][col] = this.palette.colourAt(idx);
      col += 1;
    }
  }

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp:ArrayBuffer) => {
      let palette = Palette.fromData(new Uint8ClampedArray(resp));
      this.collection = Palcollection.withInitialPal(palette);
      this.setPalIndex(1);
    });
  }

  savePalette() {
    console.log(this.palette.toBase64());
  }

}
