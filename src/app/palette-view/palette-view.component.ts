import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Palette } from '../palette-model/palette';
import { Palcolour } from '../palette-model/palcolour';
import { ColourRange } from '../palette-model/colour-range';
import { Rgbcolour } from '../palette-model/rgb';
import { KeyboardService } from '../keyboard.service';
import { SettingsService } from '../settings.service';
import { PaletteOperationService } from '../palette-operation.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.css']
})
export class PaletteViewComponent implements OnInit, OnChanges {

  private readonly assetUrl = '/assets';

  private keyState: {[key: string]: boolean};
  @Input() palette: Palette;
  private palColours: Palcolour[];
  private selectionRange: ColourRange;
  private lockSelection = false;
  @Output() selected = new EventEmitter<ColourRange>();

  constructor(
    private keyboard: KeyboardService,
    private settings: SettingsService,
    private palOp: PaletteOperationService,
    private sanitizer: DomSanitizer) {
      this.keyState = {};
    }

  selectPalColour(colourIndex: number) {
    this.selectionRange = this.palOp.selectPalColour(colourIndex, this.keyState);
    this.selected.emit(this.selectionRange);
  }

  onSetPalette() {
    this.palOp.setPalette(this.palette);
    this.palColours = this.palOp.palColours;
    if (this.selectionRange && this.lockSelection) { this.palOp.rangeToSelection(this.selectionRange); }
  }

  getStyles(colour: Palcolour) {
    const styles = Rgbcolour.getStyles(colour.rgb);
    return styles;
  }

  ngOnInit(): void {
    this.keyboard.observeKeyboard(['Shift', 'Control']).subscribe((press) => {
      this.keyState[press.key] = press.state;
    });
    document.addEventListener('visibilitychange', () => { // Fired when user switches tabs
      // Clear keyState
      this.keyState = {};
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('palette')) {
      if (changes['palette'].currentValue) { this.onSetPalette(); }
    }
  }
}
