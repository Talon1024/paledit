import { Component, OnInit } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';
import { Palcollection } from '../palette-model/palcollection';
import { HttpClient } from '@angular/common/http';
import { PaletteIoService } from '../palette-io.service';
import { KeyboardService, KeyState } from '../keyboard.service';

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

  private keyState:Object = {}

  private readonly assetUrl = "/assets";

  constructor(private httpClient:HttpClient,
      private paletteIo:PaletteIoService,
      private keyboard:KeyboardService) {
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

  selectPalColour(colourIndex:number) {
    /*
    If nothing is selected:
    select the colour

    If a colour is selected:
      If shift is being held down:
        If all colours from the last index from the new index are selected:
          deselect all of the colours from the last index to the given index.
        otherwise:
          select from the last index to the given index.
      If ctrl is being held down:
        if the colour is selected:
          deselect the colour
        otherwise:
          select the colour.
    otherwise:
      deselect the previous selected colour.
      select the colour
    */

    // closures to help selection
    function deselectAll() {
      for (let colour of this.palColours) colour.selected = false;
    }

    function selectRange(rStart:number, rEnd:number) {
      let increment = rEnd - rStart;
      if (increment >= 1) {
        increment = 1;
      } else {
        increment = -1;
      }
      while (rStart != rEnd) {
        this.palColours[rStart].selected = true;
        rStart += increment;
      }
    }

    if (this.lastSelectedIndex >= 0) {
      if (this.keyState["Shift"]) {
        selectRange(this.lastSelectedIndex, colourIndex);
      } else if (this.keyState["Control"]) {
        this.palColours[colourIndex].selected = !this.palColours[colourIndex].selected;
      } else if (this.keyState["Control"] && this.keyState["Shift"]) {
        // Unknown
      } else if (!this.keyState["Control"] && !this.keyState["Shift"]) {
        deselectAll();
        this.palColours[colourIndex].selected = true;
      }
    } else {
      this.palColours[colourIndex].selected = true;
    }
    this.lastSelectedIndex = colourIndex;
  }

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

  // Without PaletteIoService
  readPaletteFile(file) {
    this.fileReader.readAsArrayBuffer(file);
    new Promise((res, rej) => {
      this.fileReader.onload = () => res(this.fileReader.result);
      this.fileReader.onerror = () => rej(this.fileReader.error);
    }).then((data:ArrayBuffer) => {
      let collection = Palcollection.fromData(new Uint8ClampedArray(data));
      console.log(collection);
      this.collection = collection;
      this.setPalIndex(1);
    }).catch((error:any) => {
      console.error(error);
    });
  }

  // With PaletteIoService
  // I have no idea why, but I get "this is undefined" if I do it this way. Strangely enough, it doesn't happen if I set every property of PaletteIoService as static.
  /*
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
  */

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
  }

  ngOnInit() {
    this.keyboard.keyStateObservable.subscribe((k:KeyState) => {
      //console.log(k);
      this.keyState[k.key] = k.state;
    });
    this.httpClient.get(`${this.assetUrl}/bwpal.pal`, {
      responseType: 'arraybuffer'
    }).subscribe((resp:ArrayBuffer) => {
      let palette = Palette.fromData(new Uint8ClampedArray(resp));
      this.collection = Palcollection.withInitialPal(palette);
      this.setPalIndex(1);
    });
  }

  savePalette() {
    this.paletteIo.savePalCollection(this.collection).subscribe((data:string) => {
      location.replace(`data:application/octet-stream;base64,${data}`);
    }, (error:any) => {
      console.error(error);
    });
  }

  saveColourmap() {
    console.log("Saving colourmap...");
  }

}
