import { Component, OnInit, Input } from '@angular/core';
import { Palcolour } from '../palette-model/palcolour';
import { ColourRange } from '../palette-model/colour-range';
import { Rgbcolour } from '../palette-model/rgb';
import { KeyboardService } from '../keyboard.service';
import { SettingsService } from '../settings.service';
import { PaletteOperationService, IPaletteUpdate } from '../palette-operation.service';
import { PaletteSelectionService } from '../palette-selection.service';

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.css']
})
export class PaletteViewComponent implements OnInit {

  private readonly assetUrl = '/assets';

  private keyState: {[key: string]: boolean};
  @Input() multiple: boolean;
  public palColours: Palcolour[];
  private selectionRange: ColourRange;

  public lockSelection: boolean;
  public showNumbers: boolean;
  public showConflicts: boolean;

  constructor(
    private keyboard: KeyboardService,
    private settings: SettingsService,
    private palOp: PaletteOperationService,
    private palSel: PaletteSelectionService) {
    }

  selectPalColour(colourIndex: number) {
    if (!this.multiple) {
      this.keyState = {};
    }
    this.selectionRange = this.palSel.select(colourIndex, this.keyState);
    this.updatePalColours();
  }

  selectAll() {
    this.selectionRange = this.palSel.selectAll();
    this.updatePalColours();
  }

  getStyles(colour: Palcolour) {
    const styles = Rgbcolour.getStyles(colour.rgb);
    return styles;
  }

  private updatePalColours() {
    const palLen = this.palOp.getLength();
    if (this.palColours.length !== palLen) {
      this.palColours = new Array(palLen);
    }
    for (let i = 0; i < palLen; i++) {
      this.palColours[i] = this.getPalColour(i);
    }
  }

  private getPalColour(index: number): Palcolour {
    const rgb = this.palOp.colourAt(index);
    const selected = this.selectionRange != null ? this.selectionRange.contains(index) !== -1 : false;
    const conflicts = this.palOp.getDuplicates(index);
    return {index, rgb, selected, conflicts};
  }

  ngOnInit() {
    this.keyState = {};
    this.lockSelection = false;
    this.showNumbers = true;
    this.palColours = [];
    this.keyboard.observeKeyboard(['Shift', 'Control']).subscribe((press) => {
      this.keyState[press.key] = press.state;
    });
    this.palOp.palChangeObv.subscribe((ud: IPaletteUpdate) => {
      if (ud.new && !this.lockSelection) {
        this.palSel.selectionRange = null;
        this.selectionRange = null;
      }
      this.updatePalColours();
    });
    document.addEventListener('visibilitychange', () => { // Fired when user switches tabs
      // Clear keyState
      this.keyState = {};
    });
  }
}
