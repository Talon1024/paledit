import { Component, OnInit, Input } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.css']
})
export class PaletteViewComponent implements OnInit {

  @Input() palfile;
  private palette:Palette;
  private palColours:Palcolour[] = new Array();
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
      let collection = Palcollection.fromData(new Uint8ClampedArray(data));
      this.setPalette(collection.palettes[0]);
    }).catch((error) => {
      console.error(error);
    });
  }

  setPalette(pal:Palette) {
    this.palette = pal;
    for (let i = 0; i < this.palette.getLength(); i++) {
      this.palColours[i] = this.palette.colourAt(i);
    }
  }

  ngOnInit() {
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp:ArrayBuffer) => this.setPalette(Palette.fromData(new Uint8ClampedArray(resp))));
  }

}
