import { Component, OnInit, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';
import { ColourRange } from '../palette-model/colour-range';
import { ColourSubRange } from '../palette-model/colour-sub-range';
import { KeyboardService, KeyState } from '../keyboard.service';
import { SettingsService } from '../settings.service';
import { PaletteOperationService } from '../palette-operation.service';

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.css']
})
export class PaletteViewComponent implements OnInit {

  private readonly assetUrl = "/assets";

  private keyState:{[key:string]:boolean};
  @Input() palette:Palette;
  private palColours:Palcolour[];
  private selectionRange:ColourRange;
  private lockSelection:boolean = false;
  @Output() onSelect = new EventEmitter<ColourRange>();

  constructor(
    private keyboard:KeyboardService,
    private settings:SettingsService,
    private palOp:PaletteOperationService) {
      this.keyState = {};
    }

  selectPalColour(colourIndex:number) {
    this.selectionRange = this.palOp.selectPalColour(colourIndex, this.keyState);
    this.onSelect.emit(this.selectionRange);
  }

  onSetPalette() {
    this.palOp.setPalette(this.palette);
    this.palColours = this.palOp.palColours;
    if (this.selectionRange && this.lockSelection) this.palOp.rangeToSelection(this.selectionRange);
  }

  ngOnInit():void {
    this.keyboard.observeKeyboard(["Shift", "Control"]).subscribe((press) => {
      this.keyState[press.key] = press.state;
    });
    document.addEventListener("visibilitychange", () => { // Fired when user switches tabs
      // Clear keyState
      this.keyState = {};
    });
  }

  ngOnChanges(changes:SimpleChange):void {
    if (changes.hasOwnProperty("palette")) {
      if (changes["palette"].currentValue) this.onSetPalette();
    }
  }
}
