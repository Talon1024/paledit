import { Component, OnInit, Input, SimpleChange } from '@angular/core';
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

  constructor(
    private keyboard:KeyboardService,
    private settings:SettingsService,
    private palOp:PaletteOperationService) {
      this.keyState = {};
    }

  selectPalColour(colourIndex:number) {
    this.palOp.selectPalColour(colourIndex, this.keyState);
  }

  selectionToRange() {
    this.palOp.selectionToRange();
  }

  onSetPalette() {
    this.palOp.setPalette(this.palette);
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
