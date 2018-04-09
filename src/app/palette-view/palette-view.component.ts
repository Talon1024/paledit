import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';
import { ColourRange } from '../palette-model/colour-range';
import { ColourSubRange } from '../palette-model/colour-sub-range';
import { KeyboardService, KeyState } from '../keyboard.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.css']
})
export class PaletteViewComponent implements OnInit {

  private readonly assetUrl = "/assets";

  private keyState:{[key:string]:boolean};
  private lastSelectedIndex: number;
  @Input() palette:Palette;
  private palColours:Palcolour[];
  private range:ColourRange;

  constructor(
    private keyboard:KeyboardService,
    private settings:SettingsService) {
      this.keyState = {};
      this.lastSelectedIndex = -1;
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
    var deselectAll = () => {
      for (let colour of this.palColours) colour.selected = false;
    }

    var selectRange = (rStart:number, rEnd:number) => {
      if (rStart === rEnd) return;

      let rCur = rStart;
      let increment = rEnd - rCur;
      if (increment >= 1) {
        increment = 1;
      } else {
        increment = -1;
      }
      rCur += increment;

      // Are all these colours selected or not?
      let allSelected:boolean = this.palColours[rCur].selected;
      while (rCur !== rEnd) {
        rCur += increment;
        if (!(this.palColours[rCur].selected)) allSelected = false;
      }

      // Select (or deselect) all the colours
      let select = !allSelected;
      rCur = rStart;

      this.palColours[rCur].selected = select;
      while (rCur !== rEnd) {
        rCur += increment;
        this.palColours[rCur].selected = select;
      }
    }

    // Selection logic, partly derived from above pseudocode
    if (this.lastSelectedIndex >= 0) {
      if (this.keyState["Shift"] && !this.keyState["Control"]) {
        selectRange(this.lastSelectedIndex, colourIndex);
      } else if (this.keyState["Control"] && !this.keyState["Shift"]) {
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

  selectionToRange() {
    let subRanges:ColourSubRange[] = [];
    let subRangeStart = 0, subRangeEnd = 0, inSubRange = false;
    for (let colour of this.palColours) {
      if (!inSubRange && colour.selected) {
        subRangeStart = colour.index;
        inSubRange = true;
      } else if (inSubRange && !colour.selected) {
        subRangeEnd = colour.index - 1;
        inSubRange = false;
        subRanges.push(new ColourSubRange(subRangeStart, subRangeEnd));
      }
    }
    return new ColourRange(subRanges);
  }

  onSetPalette() {
    if (!this.palColours) this.palColours = new Array(this.palette.getLength());
    for (let i = 0; i < this.palette.getLength(); i++) {
      this.palColours[i] = this.palette.colourAt(i);
    }
  }

  ngOnInit():void {
    this.keyboard.observeKeyboard(["Shift", "Control"]).subscribe((press) => {
      this.keyState[press.key] = press.state;
    });
  }

  ngOnChanges(changes:SimpleChange):void {
    if (changes.hasOwnProperty("palette")) {
      if (changes["palette"].currentValue) this.onSetPalette();
    }
  }
}
