import { Component, OnInit } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';
import { PaletteIoService } from '../palette-io.service';
import { KeyboardService, KeyState } from '../keyboard.service';
import { SettingsService } from '../settings.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main-editor-view',
  templateUrl: './main-editor-view.component.html',
  styleUrls: ['./main-editor-view.component.css']
})
export class MainEditorViewComponent implements OnInit {

  private collection:Palcollection;
  private colPalIndex:number; // User input (actually index + 1)
  private palette:Palette;
  private palColours:Palcolour[];
  private fileReader:FileReader;
  private lastSelectedIndex:number = -1;

  private readonly assetUrl = "/assets";

  constructor(private httpClient:HttpClient,
      private paletteIo:PaletteIoService,
      private keyboard:KeyboardService,
      private settings:SettingsService,
      private sanitizer:DomSanitizer) {
    this.colPalIndex = 1;
    this.palColours = new Array<Palcolour>();
    this.fileReader = new FileReader();
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

  /*
  getPalSelectionIndices():number[] {
    let indices:number[] = [];
    for (let colour of this.palColours) {
      if (colour.selected) indices.push(colour.index);
    }
    return indices;
  }

  getPalSelection():Palcolour[] {
    let colours:Palcolour[] = [];
    for (let colour of this.palColours) {
      if (colour.selected) colours.push(colour);
    }
    return colours;
  }
  */

  readPaletteFile(file) {
    this.paletteIo.getPaletteFile(file)
        .subscribe((collection:Palcollection) => {
      console.log(collection);
      this.collection = collection;
      this.setPalIndex(1);
    }, (error:any) => {
      console.error(error);
    });
  }

  setPalIndex(palIndex:number) {
    this.colPalIndex = palIndex;
    let realIndex = palIndex - 1;
    this.palette = this.collection.palettes[realIndex];
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
    let data = this.paletteIo.savePalCollection(this.collection);
    location.replace(`data:application/octet-stream;base64,${data}`);
  }

  saveColourmap() {
    console.log("Saving colourmap...");
  }

}
