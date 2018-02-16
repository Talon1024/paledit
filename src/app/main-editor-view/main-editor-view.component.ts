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
  private colPalIndex:number;
  private palette:Palette;
  private palColours:Palcolour[] = new Array();
  private palRows:Array<Palcolour>[];
  private fileReader:FileReader = new FileReader();

  private readonly assetUrl = "/assets";

  constructor(private httpClient:HttpClient) {}

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
      this.setPalIndex(0);
    }).catch((error) => {
      console.error(error);
    });
  }

  setPalIndex(palIndex:number) {
    this.colPalIndex = palIndex;
    this.setPalette(this.collection.palettes[palIndex]);
  }

  setPalette(pal:Palette) {
    this.palette = pal;
    for (let i = 0; i < this.palette.getLength(); i++) {
      this.palColours[i] = this.palette.colourAt(i);
    }
  }

  updateRows() {
    // Just in case I decide to load palettes where length != 256
    let palLength = this.palette.getLength();
    let rowLength = Math.floor(Math.sqrt(palLength));
    for (let idx = 0, row = 0, col = 0; idx < palLength; idx++) {
      if (idx % rowLength == 0) {
        this.palRows[row] = new Array(rowLength);
        row += 1;
        col = 0;
      }
      this.palRows[row][col] = this.collection.palettes[this.colPalIndex].colourAt(idx);
      col += 1;
    }
  }

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp:ArrayBuffer) => {
      this.setPalette(Palette.fromData(new Uint8ClampedArray(resp)))
    });
  }

}
